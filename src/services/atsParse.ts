/**
 * Mock ATS / recruiter parse. Returns the auto-reject flags a typical applicant
 * tracking system would raise, each with a one-tap fix. Illustrative — a real
 * parser (resume upload + keyword model) swaps in behind this signature later.
 */

export type FlagSeverity = "reject" | "warn" | "ok";

export interface AtsFlag {
  id: string;
  severity: FlagSeverity;
  label: string;
  detail: string;
  fix: string;
}

export interface AtsReport {
  /** 0–100 pass-likelihood as the parser sees it. */
  score: number;
  flags: AtsFlag[];
}

const BASE_FLAGS: AtsFlag[] = [
  {
    id: "kw-cloud",
    severity: "reject",
    label: "Missing required keyword: “Docker / Kubernetes”",
    detail: "The target role lists containerization; the parser found neither term.",
    fix: "Add a line about containerizing a project with Docker.",
  },
  {
    id: "metrics",
    severity: "warn",
    label: "Bullets lack measurable impact",
    detail: "4 of 6 bullets describe tasks, not outcomes — recruiters skim for numbers.",
    fix: "Rewrite two bullets with a metric (latency, users, %).",
  },
  {
    id: "gap",
    severity: "warn",
    label: "Unexplained 4-month gap",
    detail: "A gap with no entry reads as a flag; a one-line note neutralizes it.",
    fix: "Add an upskilling / project line for the gap window.",
  },
  {
    id: "length",
    severity: "ok",
    label: "Length and formatting parse cleanly",
    detail: "Single column, standard headings, one page — ATS-safe.",
    fix: "No change needed.",
  },
  {
    id: "contact",
    severity: "ok",
    label: "Contact + links detected",
    detail: "Email, GitHub, and LinkedIn parsed correctly.",
    fix: "No change needed.",
  },
];

export function parseResume(): AtsReport {
  return { score: 61, flags: BASE_FLAGS };
}

/** Recompute the parser score after some flags are resolved. */
export function scoreAfterFixes(resolved: Set<string>): number {
  const remaining = BASE_FLAGS.filter(
    (f) => f.severity !== "ok" && !resolved.has(f.id)
  );
  const penalty = remaining.reduce((s, f) => s + (f.severity === "reject" ? 22 : 9), 0);
  return Math.min(98, 100 - penalty);
}
