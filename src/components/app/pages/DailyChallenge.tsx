import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Pause, Play, Timer, Volume2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAccessibility } from "@/context/AccessibilityContext";
import { useProgress } from "@/context/ProgressContext";
import { DAILY_PROBLEM } from "@/services/mockData";
import { evaluateCode, pointsForScore, type EvalResult } from "@/services/evaluate";
import { speak } from "@/lib/speech";
import PageHeading from "@/components/app/PageHeading";
import ExplainItMyWay from "@/components/universal/ExplainItMyWay";

const EASE = [0.22, 1, 0.36, 1] as const;
const barColor = (p: number) => (p >= 75 ? "#1D9E75" : p >= 50 ? "#EF9F27" : "#E24B4A");

export default function DailyChallenge() {
  const { isMicro, needsCaptions, isAudioFirst } = useAccessibility();
  const { streak, recordDaily, lastDaily } = useProgress();
  const [showHint, setShowHint] = useState(false);
  const [code, setCode] = useState(DAILY_PROBLEM.starter);
  const [result, setResult] = useState<EvalResult | null>(null);
  const [granted, setGranted] = useState<number | null>(null);

  const doneToday = lastDaily === new Date().toISOString().slice(0, 10);

  const run = () => setResult(evaluateCode(code, DAILY_PROBLEM.hints));

  const submit = () => {
    const r = evaluateCode(code, DAILY_PROBLEM.hints);
    setResult(r);
    setGranted(
      recordDaily({
        problemId: DAILY_PROBLEM.id,
        title: DAILY_PROBLEM.title,
        score: r.score,
        points: pointsForScore(r.score, DAILY_PROBLEM.difficulty),
      })
    );
  };

  return (
    <div>
      <PageHeading
        eyebrow="Streak"
        title="Daily Challenge"
        summary="One fresh problem a day. Write your answer, get it scored, keep your streak alive."
        narration="Daily Challenge. One fresh problem each day. Write your answer to keep your streak going."
      />

      <div className="rounded-2xl border border-line bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Timer size={18} className="text-accent" />
            <span className="font-mono text-sm">{isMicro ? "Burst: 8 min, then a break" : "Suggested: 15 min"}</span>
          </div>
          <span className="rounded-full bg-track-soft px-3 py-1.5 font-mono text-xs font-medium text-track">
            🔥 {streak}-day streak{doneToday && " · done today"}
          </span>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <h2 className="font-display text-xl font-medium">{DAILY_PROBLEM.title}</h2>
          {isAudioFirst && (
            <button onClick={() => speak(`${DAILY_PROBLEM.title}. ${DAILY_PROBLEM.prompt}`)} aria-label="Read aloud" className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-soft hover:text-ink">
              <Volume2 size={14} />
            </button>
          )}
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{DAILY_PROBLEM.prompt}</p>
        <div className="mt-3">
          <ExplainItMyWay itemId={DAILY_PROBLEM.id} />
        </div>

        {isMicro && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-line bg-paper p-3 text-sm text-ink-soft">
            <Pause size={15} className="text-accent" />
            Short timed burst with a built-in break — no marathon timer.
          </div>
        )}

        <button onClick={() => setShowHint((v) => !v)} className="mt-4 rounded-full border border-line px-4 py-2 text-sm font-medium" aria-expanded={showHint}>
          {showHint ? "Hide hint" : "Show hint"}
        </button>
        {showHint && (
          <div className="mt-3 rounded-xl border border-accent/20 bg-accent-soft p-4">
            <p className="text-[15px] leading-relaxed">
              Count k nodes first. If you have k, reverse that block, then recurse on the rest.
            </p>
            {needsCaptions && <p className="mt-2 font-mono text-[11px] text-accent">Captioned hint · text equivalent always shown.</p>}
          </div>
        )}

        {/* Answer editor */}
        <div className="mt-6">
          <label htmlFor="daily-answer" className="mb-2 block font-mono text-[11px] uppercase tracking-wider text-ink-soft">
            Your answer
          </label>
          <textarea
            id="daily-answer"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            rows={8}
            className="w-full resize-y rounded-xl border border-line bg-[#1110210a] p-4 font-mono text-[13px] leading-relaxed focus:border-accent/40"
            style={{ tabSize: 4 }}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={run} className="flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper">
              <Play size={14} /> Run &amp; evaluate
            </button>
            <button onClick={submit} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium hover:bg-paper">
              Submit challenge
            </button>
          </div>
        </div>

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
                  <span className="font-mono text-sm">{result.passed}/{result.total} test cases passed</span>
                </div>
                <span className="rounded-full px-3 py-1.5 font-mono text-xs font-medium" style={{ backgroundColor: `${barColor(result.score)}22`, color: barColor(result.score) }}>
                  Score {result.score}/100
                </span>
              </div>
              <ul className="mt-4 space-y-1.5 border-t border-line pt-3">
                {result.feedback.map((line, i) => (
                  <li key={i} className="font-mono text-[12px] leading-relaxed text-ink-soft">→ {line}</li>
                ))}
              </ul>
              {granted !== null && (
                <p className="mt-3 rounded-lg bg-track-soft px-3 py-2 font-mono text-xs font-medium text-track">
                  {granted > 0 ? `✓ +${granted} points · streak now ${streak} days.` : "✓ Already completed today — come back tomorrow to extend your streak."}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
