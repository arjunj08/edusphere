import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Clock } from "lucide-react";
import { useProgress } from "@/context/ProgressContext";
import { STUDENT } from "@/services/mockData";

/**
 * FEATURE 5 — Placement Readiness Countdown. A persistent live indicator in the
 * app header: "You're 71% ready · ~N weeks to [target] at your current pace."
 * Pace is derived from recent activity; tapping opens the factor breakdown.
 */
export default function ReadinessCountdown() {
  const { points, solvedIds, streak } = useProgress();
  const [open, setOpen] = useState(false);

  // Readiness nudges up with real activity; pace shortens the ETA.
  const readiness = Math.min(96, STUDENT.readiness + Math.min(12, solvedIds.length));
  const gap = Math.max(0, 90 - readiness);
  // More recent activity → faster pace → fewer weeks.
  const pace = 1 + Math.min(2.5, points / 200 + streak / 14);
  const weeks = Math.max(1, Math.round(gap / Math.max(1.2, pace)));

  const factors = [
    { label: "Skill readiness", value: `${readiness}/100`, hint: "Weakest: system design" },
    { label: "Recent pace", value: `${pace.toFixed(1)}×`, hint: `${points} pts · ${streak}-day streak` },
    { label: "Problems solved", value: `${solvedIds.length}`, hint: "Each solve nudges readiness" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-xs transition-colors hover:border-ink/20"
      >
        <Clock size={13} className="text-track" />
        <span className="hidden font-mono sm:inline">
          {readiness}% ready · ~{weeks} wks to {STUDENT.target}
        </span>
        <span className="font-mono sm:hidden">{readiness}% · {weeks}w</span>
        <ChevronDown size={12} className={`text-ink-soft transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute right-0 z-50 mt-2 w-72 rounded-2xl border border-line bg-white p-4 shadow-[0_24px_60px_-24px_rgba(16,27,45,0.35)]"
          >
            <p className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">What moves this</p>
            <ul className="mt-3 space-y-2.5">
              {factors.map((f) => (
                <li key={f.label} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{f.label}</p>
                    <p className="font-mono text-[11px] text-ink-soft">{f.hint}</p>
                  </div>
                  <span className="font-mono text-sm text-accent">{f.value}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 border-t border-line pt-3 font-mono text-[11px] leading-relaxed text-ink-soft">
              Projection at your current pace — solve more and the estimate shortens.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
