// Student-owned consent for the parent/guardian dashboard. The student decides,
// in their Settings, which of three lanes a guardian may see. Nothing here is
// ever a private message, an exact per-test grade, or personal content — only
// the supportive progress + wellbeing summary the student opts into.
//
// localStorage-backed for the demo (single shared student), shaped so a real
// per-student consent record can replace it behind these functions.

export interface ShareSettings {
  /** Attendance, assignments-on-time, readiness score + the weekly summary. */
  progress: boolean;
  /** The gentle engagement / wellbeing indicator. */
  wellbeing: boolean;
  /** Streaks, certifications, and other wins to celebrate. */
  milestones: boolean;
}

export const SHARE_DEFAULT: ShareSettings = {
  progress: true,
  wellbeing: true,
  milestones: true,
};

export const SHARE_OPTIONS: {
  key: keyof ShareSettings;
  label: string;
  detail: string;
}[] = [
  {
    key: "progress",
    label: "Progress at a glance",
    detail: "Attendance, assignments on time, readiness, and your weekly summary.",
  },
  {
    key: "wellbeing",
    label: "Wellbeing signal",
    detail: "A gentle sense of how engaged you've been — never grades or messages.",
  },
  {
    key: "milestones",
    label: "Milestones & wins",
    detail: "Streaks, certifications earned, and achievements worth celebrating.",
  },
];

const KEY = "edusphere.parentShare";

export function getShareSettings(): ShareSettings {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...SHARE_DEFAULT, ...JSON.parse(raw) } : { ...SHARE_DEFAULT };
  } catch {
    return { ...SHARE_DEFAULT };
  }
}

export function setShareSettings(next: ShareSettings) {
  localStorage.setItem(KEY, JSON.stringify(next));
}
