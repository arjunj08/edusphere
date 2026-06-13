import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Coffee, Pause, Play, RotateCcw, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * R3-E Focus-Session Companion (micro_learning flag).
 * A body-doubling co-working timer: 25-minute focus blocks with breaks, a
 * gentle re-focus nudge after idle, and a small celebration when a block ends.
 */

const FOCUS_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function FocusSession() {
  const [open, setOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [remaining, setRemaining] = useState(FOCUS_SECONDS);
  const [blocks, setBlocks] = useState(0);
  const [nudge, setNudge] = useState(false);
  const lastActive = useRef(Date.now());

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          const finishingFocus = !onBreak;
          setOnBreak(finishingFocus);
          if (finishingFocus) setBlocks((b) => b + 1);
          return finishingFocus ? BREAK_SECONDS : FOCUS_SECONDS;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, onBreak]);

  // Re-focus nudge after 30s idle during a focus block.
  useEffect(() => {
    if (!running || onBreak) return undefined;
    const mark = () => {
      lastActive.current = Date.now();
      setNudge(false);
    };
    window.addEventListener("keydown", mark);
    window.addEventListener("mousemove", mark);
    const id = setInterval(() => {
      if (Date.now() - lastActive.current > 30000) setNudge(true);
    }, 5000);
    return () => {
      window.removeEventListener("keydown", mark);
      window.removeEventListener("mousemove", mark);
      clearInterval(id);
    };
  }, [running, onBreak]);

  const total = onBreak ? BREAK_SECONDS : FOCUS_SECONDS;
  const pct = ((total - remaining) / total) * 100;

  const reset = () => {
    setRunning(false);
    setOnBreak(false);
    setRemaining(FOCUS_SECONDS);
    setNudge(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 left-[12.5rem] z-40 flex items-center gap-2 rounded-full border border-line bg-white px-4 py-3 text-sm font-medium text-ink-soft shadow-sm hover:text-ink"
        aria-label="Focus session"
      >
        <Users size={16} /> Focus
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-label="Focus session companion"
            className="fixed bottom-20 left-5 z-50 w-[min(20rem,calc(100vw-2.5rem))] rounded-2xl border border-line bg-white p-5 text-center shadow-[0_24px_60px_-24px_rgba(16,27,45,0.35)]"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-medium">{onBreak ? "Break" : "Focus block"}</h3>
              <button onClick={() => setOpen(false)} aria-label="Close" className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-soft hover:text-ink">
                <X size={15} />
              </button>
            </div>

            <p className="mt-1 flex items-center justify-center gap-1.5 font-mono text-[11px] text-ink-soft">
              <Users size={12} /> {(247 + blocks).toLocaleString()} learners co-working now
            </p>

            <div className="relative mx-auto mt-4 h-32 w-32">
              <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#F1EFE8" strokeWidth="8" />
                <motion.circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke={onBreak ? "#1D9E75" : "#534AB7"}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 52}
                  strokeDashoffset={2 * Math.PI * 52 * (1 - pct / 100)}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {onBreak ? <Coffee size={16} className="text-track" /> : null}
                <span className="font-display text-2xl font-medium">{fmt(remaining)}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              <button onClick={() => setRunning((r) => !r)} className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper">
                {running ? <Pause size={14} /> : <Play size={14} />} {running ? "Pause" : "Start"}
              </button>
              <button onClick={reset} aria-label="Reset" className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft hover:text-ink">
                <RotateCcw size={15} />
              </button>
            </div>

            <p className="mt-3 font-mono text-[11px] text-ink-soft">
              {blocks > 0 ? `🎉 ${blocks} block${blocks > 1 ? "s" : ""} done — great pace.` : "25-min block, then a short break."}
            </p>

            <AnimatePresence>
              {nudge && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={cn("mt-3 rounded-lg bg-accent-soft px-3 py-2 text-xs text-accent")}
                >
                  Still here? Pick one small next step — I'll wait with you.
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
