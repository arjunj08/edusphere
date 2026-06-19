// Derives the parent/guardian view from the student's existing shared data.
// Principle: supportive, plain-language, positive-first — progress + wellbeing,
// never surveillance, never a diagnosis. Everything here is read-only.

import { STUDENT, CERTIFICATIONS, type Zone } from "./mockData";

/** Demo child name (illustrative). A real build reads it from the linked student. */
export const CHILD_NAME = "Aarav";

export type WellbeingState = "healthy" | "dipping" | "low";

export interface ParentSnapshot {
  childName: string;
  zone: Zone;
  /** Calm, supportive headline e.g. "Aarav is on track". */
  headline: string;
  emoji: string;
  /** One reassuring sentence under the headline. */
  subline: string;
  progress: {
    attendancePct: number;
    assignmentsOnTime: number;
    assignmentsTotal: number;
    readiness: number;
  };
  /** Friendly, positive-first bullet lines auto-written from the data. */
  weekSummary: string[];
  wellbeing: {
    state: WellbeingState;
    line: string;
    /** A gentle "how to support" tip — only when engagement looks low. */
    tip?: string;
  };
  milestones: { icon: string; text: string }[];
  /** Practical, supportive, non-preachy ways a parent can help. */
  help: string[];
}

const HEADLINE: Record<Zone, { text: string; emoji: string }> = {
  green: { text: "is on track", emoji: "🟢" },
  amber: { text: "needs a little support", emoji: "🟡" },
  red: { text: "could use some attention", emoji: "🔴" },
};

const SUBLINE: Record<Zone, string> = {
  green: "Attendance and assignments are steady this week.",
  amber: "Mostly steady — a couple of things slipped, and a friendly check-in could help.",
  red: "Attendance and submissions have dipped lately — a warm, no-pressure chat soon could help.",
};

const WELLBEING: Record<WellbeingState, { line: string; tip?: string }> = {
  healthy: {
    line: "Engagement looks healthy — steady logins and consistent practice this week.",
  },
  dipping: {
    line: "Seems a bit less active this week — might be worth a gentle chat.",
    tip: "No need to quiz him on grades. Ask how he's feeling about the workload, and listen.",
  },
  low: {
    line: "Noticeably quieter than usual this week — a kind, unhurried conversation can help.",
    tip: "Lead with care, not pressure: \"How are things going?\" opens more doors than \"Why the dip?\"",
  },
};

const stateForZone: Record<Zone, WellbeingState> = {
  green: "healthy",
  amber: "dipping",
  red: "low",
};

function weekSummaryFor(zone: Zone): string[] {
  const { assignmentsOnTime, assignmentsTotal, streakDays, attendancePct } = STUDENT;
  const lines = [
    `Completed ${assignmentsOnTime} of ${assignmentsTotal} assignments on time`,
    attendancePct >= 90
      ? "Attended all classes this week"
      : `Attendance held at ${attendancePct}% this week`,
    "Improved in Data Structures — now one of his strongest areas",
    `Kept a ${streakDays}-day practice streak going`,
  ];
  if (zone === "red") {
    // Still positive-first, but acknowledge the area to support.
    lines[1] = `Attended most classes (${attendancePct}%) — a couple were missed`;
  }
  return lines;
}

function milestones(): { icon: string; text: string }[] {
  const earned = CERTIFICATIONS.filter((c) => c.status === "earned");
  const latest = earned[earned.length - 1];
  return [
    {
      icon: "🏅",
      text: `Earned ${earned.length} certifications${
        latest ? ` — latest: ${latest.name}` : ""
      }`,
    },
    { icon: "🔥", text: `${STUDENT.streakDays}-day practice streak — showing up daily` },
    {
      icon: "🎤",
      text: `Mock interview score climbing — last round ${STUDENT.interview.score}/100`,
    },
    { icon: "🎯", text: `Placement readiness at ${STUDENT.readiness}/100 and rising` },
  ];
}

function helpFor(zone: Zone): string[] {
  const target = STUDENT.target;
  const base = [
    `${CHILD_NAME} is preparing for placements as an ${target} — ask him about his recent mock interviews.`,
    `A quiet study space helps before his Daily Challenge — small things make a difference.`,
    `Celebrate the wins: his streak and new certification are real, hard-earned progress.`,
  ];
  if (zone === "amber") {
    base[2] =
      "A gentle \"how's the week going?\" goes further than checking on grades right now.";
  }
  if (zone === "red") {
    return [
      `Lead with warmth — ask how ${CHILD_NAME} is doing before anything about coursework.`,
      "Offer a quiet, screen-free study window together — presence helps more than pressure.",
      `He's still aiming for ${target} roles — remind him the dip is temporary, not a verdict.`,
    ];
  }
  return base;
}

export function buildSnapshot(zone: Zone = STUDENT.riskZone): ParentSnapshot {
  const head = HEADLINE[zone];
  const state = stateForZone[zone];
  return {
    childName: CHILD_NAME,
    zone,
    headline: `${CHILD_NAME} ${head.text}`,
    emoji: head.emoji,
    subline: SUBLINE[zone],
    progress: {
      attendancePct: STUDENT.attendancePct,
      assignmentsOnTime: STUDENT.assignmentsOnTime,
      assignmentsTotal: STUDENT.assignmentsTotal,
      readiness: STUDENT.readiness,
    },
    weekSummary: weekSummaryFor(zone),
    wellbeing: { state, ...WELLBEING[state] },
    milestones: milestones(),
    help: helpFor(zone),
  };
}
