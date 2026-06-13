import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * Live Interview Co-pilot signals. Analyses the answer-in-progress (typed, or
 * speech transcript where available) to surface gentle real-time nudges —
 * pacing, filler words, whether the approach was stated before coding, and
 * long silences. NEVER penalizes accommodations: typed and spoken answers feed
 * the same analysis, and nudges are coaching, not scoring.
 */

const FILLERS = ["um", "uh", "like", "basically", "actually", "you know", "sort of"];
const CODE_HINT = /(def |function |for |while |return |class |\{|\}|=>|;)/;
const APPROACH_HINT = /(approach|first|plan|idea|i'?ll|i will|start by|then|because|so that)/i;

export interface CoachNudge {
  id: string;
  text: string;
  tone: "info" | "warn";
}

export interface CoachStats {
  words: number;
  fillers: number;
  statedApproachFirst: boolean;
  silentSeconds: number;
}

interface CoachEvent {
  t: number;
  label: string;
}

export function useInterviewCoach(active: boolean) {
  const [text, setText] = useState("");
  const [silentSeconds, setSilentSeconds] = useState(0);
  const lastChange = useRef(Date.now());
  const firstCodeAt = useRef<number | null>(null);
  const approachBeforeCode = useRef<boolean | null>(null);
  const events = useRef<CoachEvent[]>([]);

  // Track silence while a session is active.
  useEffect(() => {
    if (!active) return undefined;
    const id = setInterval(() => {
      setSilentSeconds(Math.round((Date.now() - lastChange.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [active]);

  const report = useCallback((value: string) => {
    setText(value);
    lastChange.current = Date.now();
    setSilentSeconds(0);
    // Did they articulate an approach before the first code appeared?
    if (firstCodeAt.current === null && CODE_HINT.test(value)) {
      firstCodeAt.current = Date.now();
      const priorText = value.replace(CODE_HINT, "");
      approachBeforeCode.current = APPROACH_HINT.test(priorText);
      events.current.push({
        t: Date.now(),
        label: approachBeforeCode.current
          ? "Stated approach before coding ✓"
          : "Jumped straight to code",
      });
    }
  }, []);

  const reset = useCallback(() => {
    setText("");
    setSilentSeconds(0);
    firstCodeAt.current = null;
    approachBeforeCode.current = null;
    events.current = [];
    lastChange.current = Date.now();
  }, []);

  const stats = useMemo<CoachStats>(() => {
    const lower = text.toLowerCase();
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const fillers = FILLERS.reduce(
      (s, f) => s + (lower.match(new RegExp(`\\b${f}\\b`, "g"))?.length ?? 0),
      0
    );
    return {
      words,
      fillers,
      statedApproachFirst: approachBeforeCode.current === true,
      silentSeconds,
    };
  }, [text, silentSeconds]);

  const nudges = useMemo<CoachNudge[]>(() => {
    const out: CoachNudge[] = [];
    if (firstCodeAt.current !== null && approachBeforeCode.current === false) {
      out.push({ id: "approach", tone: "warn", text: "Explain your approach before you start coding." });
    }
    if (firstCodeAt.current === null && stats.words > 12) {
      out.push({ id: "good-approach", tone: "info", text: "Good — you're framing the approach. Keep narrating as you code." });
    }
    if (stats.fillers >= 3) {
      out.push({ id: "fillers", tone: "warn", text: `Heads up: ${stats.fillers} filler words. Slow down and land each point.` });
    }
    if (active && stats.silentSeconds >= 25) {
      out.push({ id: "silence", tone: "warn", text: `You've gone quiet for ${stats.silentSeconds}s — narrate your thinking.` });
    }
    return out;
  }, [active, stats]);

  return { report, reset, stats, nudges, events: events.current };
}
