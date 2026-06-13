import companiesRaw from "@/data/companies.json";
import type { SkillVector } from "@/services/twin";

/**
 * Reverse Job Matching. For a target company/role, shows the exact gap between
 * the student and that company's typical hire, then generates a dated plan to
 * close it. Company profiles are aggregated/illustrative until real data lands.
 */

export interface Company {
  id: string;
  name: string;
  role: string;
  blurb: string;
  typicalHire: SkillVector;
}

export const COMPANIES = companiesRaw as Company[];

export interface SkillDelta {
  label: string;
  key: keyof SkillVector;
  you: number;
  hire: number;
  delta: number; // you - hire (negative = behind)
}

export interface PlanWeek {
  week: number;
  focus: string;
  action: string;
  link: { to: string; label: string };
}

const LABELS: { key: keyof SkillVector; label: string }[] = [
  { key: "dsa", label: "DSA" },
  { key: "mock", label: "Mock interviews" },
  { key: "resume", label: "Resume" },
  { key: "projects", label: "Projects" },
  { key: "systemDesign", label: "System design" },
];

const ACTION_FOR: Record<keyof SkillVector, PlanWeek["link"] & { focus: string; action: string }> = {
  systemDesign: { to: "/app/interview", label: "System-design mock", focus: "System design", action: "2 system-design mocks + read 1 design breakdown" },
  dsa: { to: "/app/problems", label: "Problem Bank", focus: "DSA", action: "15 targeted problems on weak patterns" },
  mock: { to: "/app/interview", label: "Mock interview", focus: "Interview reps", action: "3 mocks, focus on thinking aloud" },
  projects: { to: "/app/roadmap", label: "Roadmap", focus: "Projects", action: "Ship one scoped feature to a portfolio project" },
  resume: { to: "/resume/recruiter-view", label: "Recruiter view", focus: "Resume", action: "Rewrite bullets with metrics; clear ATS flags" },
};

export function computeGap(you: SkillVector, company: Company): SkillDelta[] {
  return LABELS.map(({ key, label }) => ({
    label,
    key,
    you: you[key],
    hire: company.typicalHire[key],
    delta: you[key] - company.typicalHire[key],
  }));
}

export function fitScore(deltas: SkillDelta[]): number {
  // Average shortfall converted to a 0–100 fit, where meeting the bar = 100.
  const shortfall = deltas.reduce((s, d) => s + Math.max(0, -d.delta), 0) / deltas.length;
  return Math.max(0, Math.round(100 - shortfall * 1.4));
}

/** A 4-week plan targeting the biggest gaps first. */
export function closingPlan(deltas: SkillDelta[]): PlanWeek[] {
  const gaps = [...deltas].filter((d) => d.delta < 0).sort((a, b) => a.delta - b.delta);
  const targets = (gaps.length ? gaps : deltas).slice(0, 4);
  // Pad to 4 weeks if fewer gaps, reusing the largest.
  while (targets.length < 4 && targets.length > 0) targets.push(targets[targets.length % gaps.length || 0]);

  return targets.slice(0, 4).map((d, i) => {
    const a = ACTION_FOR[d.key];
    return {
      week: i + 1,
      focus: a.focus,
      action: a.action,
      link: { to: a.to, label: a.label },
    };
  });
}
