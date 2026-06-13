import type { AccessibilityFlag } from "@/services/auth";

export interface AccessibilityOption {
  flag: AccessibilityFlag;
  icon: string;
  label: string;
  /** What concretely changes when this is on — shown in settings/options. */
  effect: string;
}

export const ACCESSIBILITY_OPTIONS: AccessibilityOption[] = [
  {
    flag: "audio_first",
    icon: "🔊",
    label: "Listening over reading",
    effect: "Read-aloud and narration across lessons, plans, and reports.",
  },
  {
    flag: "captions",
    icon: "💬",
    label: "Captions / visible text",
    effect: "Captions on by default, auto-notes after every lecture.",
  },
  {
    flag: "simplified_reading",
    icon: "🧩",
    label: "Long text is hard to process",
    effect: "Plain-language summaries first, generous spacing, short blocks.",
  },
  {
    flag: "micro_learning",
    icon: "⚡",
    label: "I focus better in short bursts",
    effect: "One step per screen, timed bursts, built-in breaks.",
  },
  {
    flag: "sign_support",
    icon: "🤟",
    label: "I use sign language",
    effect: "Sign-friendly flows now; AI Sign Classroom on the roadmap.",
  },
  {
    flag: "assistive_nav",
    icon: "🖱️",
    label: "Keyboard / assistive navigation",
    effect: "Skip links, full keyboard nav, strong visible focus rings.",
  },
];
