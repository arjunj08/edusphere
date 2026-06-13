import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Play, Volume2, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAccessibility } from "@/context/AccessibilityContext";
import { evaluateCode, pointsForScore, type EvalResult } from "@/services/evaluate";
import { speak } from "@/lib/speech";

export interface SolveTarget {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  prompt: string;
  hints: string[];
  starter: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

function barColor(pct: number) {
  return pct >= 75 ? "#1D9E75" : pct >= 50 ? "#EF9F27" : "#E24B4A";
}

/**
 * Solution editor + instant evaluation. Used by Problem Bank and Daily
 * Challenge. Writes code, runs the heuristic judge, shows a scored breakdown,
 * and reports the result up so the parent can award points.
 */
export default function SolvePanel({
  target,
  onClose,
  onSubmit,
  alreadySolved,
}: {
  target: SolveTarget;
  onClose: () => void;
  /** Called when the student submits a scored solution. Returns points granted. */
  onSubmit: (result: EvalResult) => number;
  alreadySolved?: boolean;
}) {
  const { isAudioFirst } = useAccessibility();
  const [code, setCode] = useState(target.starter);
  const [result, setResult] = useState<EvalResult | null>(null);
  const [granted, setGranted] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const run = () => setResult(evaluateCode(code, target.hints));

  const submit = () => {
    const r = result ?? evaluateCode(code, target.hints);
    setResult(r);
    setGranted(onSubmit(r));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 12 }}
        transition={{ duration: 0.25, ease: EASE }}
        role="dialog"
        aria-modal="true"
        aria-label={`Solve: ${target.title}`}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-line bg-white"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-line p-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-lg font-medium">{target.title}</h2>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 font-mono text-[11px] font-medium",
                  target.difficulty === "Easy"
                    ? "bg-track-soft text-track"
                    : target.difficulty === "Hard"
                      ? "bg-risk-soft text-risk"
                      : "bg-watch-soft text-watch"
                )}
              >
                {target.difficulty}
              </span>
              {alreadySolved && (
                <span className="flex items-center gap-1 font-mono text-[11px] text-track">
                  <CheckCircle2 size={12} /> solved
                </span>
              )}
            </div>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
              {target.prompt}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isAudioFirst && (
              <button
                onClick={() => speak(`${target.title}. ${target.prompt}`)}
                aria-label="Read problem aloud"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft hover:text-ink"
              >
                <Volume2 size={15} />
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft hover:text-ink"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          <label htmlFor="solution" className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
              Your solution
            </span>
            <span className="font-mono text-[11px] text-ink-soft">
              {code.trim().split(/\s+/).filter(Boolean).length} tokens · Python-style
            </span>
          </label>
          <textarea
            id="solution"
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            rows={10}
            className="w-full resize-y rounded-xl border border-line bg-[#1110210a] p-4 font-mono text-[13px] leading-relaxed text-ink focus:border-accent/40"
            style={{ tabSize: 4 }}
          />

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={run}
              className="flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper"
            >
              <Play size={14} /> Run &amp; evaluate
            </button>
            <button
              onClick={submit}
              className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium hover:bg-paper"
            >
              Submit for points
            </button>
            <details className="ml-auto">
              <summary className="cursor-pointer list-none rounded-full border border-line px-4 py-2 text-sm text-ink-soft hover:text-ink">
                Hint
              </summary>
            </details>
          </div>

          {/* Result */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="mt-5 rounded-xl border border-line bg-paper p-4"
                aria-live="polite"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {result.passed === result.total ? (
                      <CheckCircle2 size={18} className="text-track" />
                    ) : result.passed === 0 ? (
                      <XCircle size={18} className="text-risk" />
                    ) : (
                      <CheckCircle2 size={18} className="text-watch" />
                    )}
                    <span className="font-mono text-sm">
                      {result.passed}/{result.total} test cases passed
                    </span>
                  </div>
                  <span
                    className="rounded-full px-3 py-1.5 font-mono text-xs font-medium"
                    style={{ backgroundColor: `${barColor(result.score)}22`, color: barColor(result.score) }}
                  >
                    Score {result.score}/100
                  </span>
                </div>

                <div className="mt-4 space-y-2.5">
                  {result.dimensions.map((dim) => (
                    <div key={dim.label} className="flex items-center gap-3">
                      <span className="w-28 shrink-0 text-xs text-ink-soft">{dim.label}</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#F1EFE8]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${dim.pct}%` }}
                          transition={{ duration: 0.6, ease: EASE }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: barColor(dim.pct) }}
                        />
                      </div>
                      <span className="w-9 text-right font-mono text-[11px] text-ink-soft">{dim.pct}</span>
                    </div>
                  ))}
                </div>

                <ul className="mt-4 space-y-1.5 border-t border-line pt-3">
                  {result.feedback.map((line, i) => (
                    <li key={i} className="font-mono text-[12px] leading-relaxed text-ink-soft">
                      → {line}
                    </li>
                  ))}
                </ul>

                {granted !== null && (
                  <p className="mt-3 rounded-lg bg-track-soft px-3 py-2 font-mono text-xs font-medium text-track">
                    {granted > 0
                      ? `✓ +${granted} points added to your total and the leaderboard.`
                      : "✓ Already solved — best score kept, no double points."}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
