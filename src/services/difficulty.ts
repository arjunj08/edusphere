/**
 * Real-Time Adaptive Difficulty. Blends recent performance with live
 * struggle/load signals to keep the learner in a flow zone — not too easy,
 * not overwhelming. Honest by design: the UI always shows that it adapted.
 */

export type Difficulty = "Easy" | "Medium" | "Hard";

const ORDER: Difficulty[] = ["Easy", "Medium", "Hard"];

export interface DifficultySignals {
  /** Recent scores (0–100), newest last. */
  recentScores: number[];
  /** Behavioral struggle currently detected. */
  struggling?: boolean;
  /** High cognitive load currently detected. */
  highLoad?: boolean;
}

export interface DifficultyDecision {
  level: Difficulty;
  reason: string;
}

export function nextDifficulty(
  current: Difficulty,
  signals: DifficultySignals
): DifficultyDecision {
  const idx = ORDER.indexOf(current);
  const scores = signals.recentScores.slice(-3);
  const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 60;

  // Struggle or high load always eases off, regardless of scores.
  if (signals.struggling || signals.highLoad) {
    const level = ORDER[Math.max(0, idx - 1)];
    return {
      level,
      reason: signals.highLoad
        ? "Eased down — your focus looked stretched."
        : "Eased down — you seemed stuck on the last one.",
    };
  }

  if (avg >= 82 && idx < ORDER.length - 1) {
    return { level: ORDER[idx + 1], reason: "Stepped up — you're clearing these comfortably." };
  }
  if (avg < 50 && idx > 0) {
    return { level: ORDER[idx - 1], reason: "Eased down — let's rebuild momentum." };
  }
  return { level: current, reason: "Held steady — this is your flow zone." };
}
