import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ChevronLeft, ChevronRight, Gauge, LifeBuoy, Volume2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAccessibility } from "@/context/AccessibilityContext";
import { useProgress } from "@/context/ProgressContext";
import { useSensing } from "@/context/SensingContext";
import { useStruggleSignal } from "@/hooks/useStruggleSignal";
import { PROBLEMS, type Problem } from "@/services/mockData";
import { pointsForScore } from "@/services/evaluate";
import { nextDifficulty } from "@/services/difficulty";
import { speak } from "@/lib/speech";
import PageHeading from "@/components/app/PageHeading";
import ContentTransformer from "@/components/accessibility/ContentTransformer";
import ExplainItMyWay from "@/components/universal/ExplainItMyWay";
import SolvePanel from "@/components/app/SolvePanel";

const DIFF_STYLE: Record<string, string> = {
  Easy: "bg-track-soft text-track",
  Medium: "bg-watch-soft text-watch",
  Hard: "bg-risk-soft text-risk",
};

export default function ProblemBank() {
  const { isAccessibility, isAudioFirst, isSimplified, isMicro } = useAccessibility();
  const { isSolved, recordSolve, submissions } = useProgress();
  const { load } = useSensing();
  const struggle = useStruggleSignal({ expectedSeconds: 90 });
  const [index, setIndex] = useState(0);
  const [active, setActive] = useState<Problem | null>(null);

  const list = isMicro ? [PROBLEMS[index]] : PROBLEMS;

  // R2-4 Real-Time Adaptive Difficulty — blend recent scores with live signals.
  const tuned = useMemo(() => {
    const recentScores = submissions
      .filter((s) => s.kind === "problem")
      .slice(0, 3)
      .map((s) => s.score)
      .reverse();
    return nextDifficulty("Medium", {
      recentScores,
      struggling: struggle.struggling,
      highLoad: load === "strained",
    });
  }, [submissions, struggle.struggling, load]);

  return (
    <div className={cn(isSimplified && "simplified")}>
      <PageHeading
        eyebrow="Practice"
        title="Problem Bank"
        summary="Curated problems by topic and difficulty. Open one, write a solution, get scored feedback and points."
        narration="Problem Bank. Open a problem to write a solution and get scored feedback and points."
      />

      {/* Adaptive-difficulty indicator — honest, never hidden */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 font-mono text-[11px] text-ink-soft">
          <Gauge size={12} className="text-accent" />
          Tuned to you · suggested next: <span className="font-medium text-ink">{tuned.level}</span>
        </span>
        <span className="font-mono text-[11px] text-ink-soft">{tuned.reason}</span>
      </div>

      {/* R2-3 Silent-Struggle Detector — behavioral, no camera, dismissible */}
      <AnimatePresence>
        {struggle.struggling && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-5 flex items-start justify-between gap-3 rounded-2xl border border-accent/30 bg-accent-soft p-4"
          >
            <div className="flex items-start gap-2">
              <LifeBuoy size={16} className="mt-0.5 text-accent" />
              <p className="text-sm leading-relaxed">{struggle.reason}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <ExplainItMyWay itemId={list[0]?.id ?? "p-2sum"} variant="inline" />
              <button onClick={struggle.dismiss} aria-label="Dismiss" className="flex h-7 w-7 items-center justify-center rounded-full text-ink-soft hover:text-ink">
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isAccessibility && (
        <div className="mb-6">
          <ContentTransformer defaultForm={isAudioFirst ? "audio" : isSimplified ? "plain" : "concept"} />
        </div>
      )}

      <div className="space-y-3">
        {list.map((problem) => {
          const solved = isSolved(problem.id);
          return (
            <article key={problem.id} className="rounded-2xl border border-line bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-lg font-medium">{problem.title}</h2>
                  <span className={cn("rounded-full px-2.5 py-1 font-mono text-[11px] font-medium", DIFF_STYLE[problem.difficulty])}>
                    {problem.difficulty}
                  </span>
                  <span className="font-mono text-[11px] text-ink-soft">{problem.tag}</span>
                  {solved && (
                    <span className="flex items-center gap-1 font-mono text-[11px] text-track">
                      <CheckCircle2 size={12} /> solved
                    </span>
                  )}
                </div>
                {isAudioFirst && (
                  <button
                    onClick={() => speak(`${problem.title}. ${problem.summary}`)}
                    aria-label={`Read aloud: ${problem.title}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft hover:text-ink"
                  >
                    <Volume2 size={15} />
                  </button>
                )}
              </div>

              {isSimplified && (
                <p className="mt-3 rounded-xl border border-accent/20 bg-accent-soft p-3 text-[15px] leading-relaxed">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-accent">In short · </span>
                  {problem.summary}
                </p>
              )}

              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{problem.prompt}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActive(problem)}
                  className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper"
                >
                  {solved ? "Open solution" : "Solve problem"}
                </button>
                <ExplainItMyWay itemId={problem.id} />
              </div>
            </article>
          );
        })}
      </div>

      {isMicro && (
        <div className="mt-5 flex items-center justify-between">
          <button onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0} aria-label="Previous problem" className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-soft disabled:opacity-40">
            <ChevronLeft size={18} />
          </button>
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {PROBLEMS.map((_, i) => (
                <motion.span key={i} layout className={cn("h-2 w-2 rounded-full", i === index ? "bg-accent" : "bg-line")} />
              ))}
            </AnimatePresence>
            <span className="ml-2 font-mono text-[11px] text-ink-soft">{index + 1} of {PROBLEMS.length}</span>
          </div>
          <button onClick={() => setIndex((i) => Math.min(PROBLEMS.length - 1, i + 1))} disabled={index === PROBLEMS.length - 1} aria-label="Next problem" className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-soft disabled:opacity-40">
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      <AnimatePresence>
        {active && (
          <SolvePanel
            target={active}
            alreadySolved={isSolved(active.id)}
            onClose={() => setActive(null)}
            onSubmit={(result) =>
              recordSolve({
                kind: "problem",
                problemId: active.id,
                title: active.title,
                score: result.score,
                points: pointsForScore(result.score, active.difficulty),
              })
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
}
