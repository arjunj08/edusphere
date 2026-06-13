import cohortRaw from "@/data/cohort.json";

/**
 * Placement Twin matching. Finds past (synthetic) students whose STARTING point
 * resembles the current student, then ranks the moves that most separated the
 * twins who placed from those who didn't.
 *
 * ILLUSTRATIVE DATA: the cohort is synthetic until real pilot data exists. The
 * matching (k-nearest on a skill vector + role) and lift stats are structured
 * so a real cohort database swaps in behind this module unchanged.
 */

export interface SkillVector {
  dsa: number;
  mock: number;
  resume: number;
  projects: number;
  systemDesign: number;
}

export interface CohortProfile {
  id: string;
  role: string;
  startReadiness: number;
  endReadiness: number;
  startSkills: SkillVector;
  endSkills: SkillVector;
  placed: boolean;
  weeksToPlacement: number | null;
  moves: { key: string; label: string }[];
}

const COHORT = cohortRaw as CohortProfile[];

export interface Twin extends CohortProfile {
  distance: number;
}

export interface DecisiveMove {
  key: string;
  label: string;
  /** Placement rate among neighbors who made this move. */
  withRate: number;
  withoutRate: number;
  /** withRate / withoutRate, e.g. 2.4x. */
  lift: number;
  /** Existing feature this move maps to. */
  link: { to: string; label: string };
}

const MOVE_LINKS: Record<string, { to: string; label: string }> = {
  sysdesign_mock: { to: "/app/interview", label: "Start a system-design mock" },
  dsa_200: { to: "/app/problems", label: "Open the Problem Bank" },
  two_projects: { to: "/app/roadmap", label: "Plan projects in the Roadmap" },
  weekly_resume: { to: "/resume/recruiter-view", label: "Check your recruiter view" },
  mock_3wk: { to: "/app/interview", label: "Book a mock interview" },
  study_group: { to: "/app/groups", label: "Join a study group" },
  daily_streak: { to: "/app/daily", label: "Keep your daily streak" },
};

function dist(a: SkillVector, b: SkillVector): number {
  return Math.sqrt(
    (a.dsa - b.dsa) ** 2 +
      (a.mock - b.mock) ** 2 +
      (a.resume - b.resume) ** 2 +
      (a.projects - b.projects) ** 2 +
      (a.systemDesign - b.systemDesign) ** 2
  );
}

export function findTwins(
  student: SkillVector,
  targetRole: string,
  k = 6
): Twin[] {
  return COHORT.map((p) => {
    // Compare the student's CURRENT skills to each twin's STARTING point;
    // a role mismatch adds a soft penalty so same-role twins rank higher.
    const base = dist(student, p.startSkills);
    const penalty = p.role === targetRole ? 0 : 14;
    return { ...p, distance: base + penalty };
  })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, k);
}

export function decisiveMoves(
  student: SkillVector,
  targetRole: string,
  neighborCount = 16
): { moves: DecisiveMove[]; sampleSize: number } {
  const neighbors = findTwins(student, targetRole, neighborCount);
  const allKeys = Array.from(
    new Set(neighbors.flatMap((n) => n.moves.map((m) => m.key)))
  );

  const rate = (g: Twin[]) => (g.length ? g.filter((n) => n.placed).length / g.length : 0);

  const moves: DecisiveMove[] = allKeys
    .map((key) => {
      const label =
        neighbors.flatMap((n) => n.moves).find((m) => m.key === key)?.label ?? key;
      const withGroup = neighbors.filter((n) => n.moves.some((m) => m.key === key));
      const withoutGroup = neighbors.filter((n) => !n.moves.some((m) => m.key === key));
      const withRate = rate(withGroup);
      const withoutRate = rate(withoutGroup);
      const lift = withoutRate > 0 ? withRate / withoutRate : withRate > 0 ? 3 : 1;
      return {
        key,
        label,
        prevalence: withGroup.length,
        withRate,
        withoutRate,
        lift,
        link: MOVE_LINKS[key] ?? { to: "/app/dashboard", label: "Open dashboard" },
      };
    })
    // Keep moves with a meaningful sample and a positive effect.
    .filter((m) => m.prevalence >= 2 && m.lift >= 1)
    .sort((a, b) => b.lift * b.withRate - a.lift * a.withRate)
    .slice(0, 3)
    .map(({ prevalence: _p, ...m }) => m);

  return { moves, sampleSize: neighbors.length };
}

export interface PathPoint {
  week: number;
  you: number;
  didMoves: number;
  didnt: number;
}

/** Projected readiness trajectories over the next 12 weeks (illustrative). */
export function projectedPath(currentReadiness: number): PathPoint[] {
  const placedTwins = COHORT.filter((p) => p.placed);
  const unplaced = COHORT.filter((p) => !p.placed);
  const avg = (arr: CohortProfile[], pick: (p: CohortProfile) => number) =>
    arr.length ? arr.reduce((s, p) => s + pick(p), 0) / arr.length : 0;
  const placedGain = avg(placedTwins, (p) => p.endReadiness - p.startReadiness) || 16;
  const unplacedGain = avg(unplaced, (p) => p.endReadiness - p.startReadiness) || 5;

  const weeks = 12;
  const points: PathPoint[] = [];
  for (let w = 0; w <= weeks; w++) {
    const t = w / weeks;
    points.push({
      week: w,
      you: currentReadiness,
      didMoves: Math.min(99, Math.round(currentReadiness + placedGain * t)),
      didnt: Math.min(99, Math.round(currentReadiness + unplacedGain * t)),
    });
  }
  return points;
}
