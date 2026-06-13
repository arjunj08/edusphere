import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, Clock, Keyboard, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAccessibility } from "@/context/AccessibilityContext";
import { useProgress } from "@/context/ProgressContext";
import { useInterviewCoach } from "@/hooks/useInterviewCoach";
import { STUDENT } from "@/services/mockData";
import { pointsForScore } from "@/services/evaluate";
import { speak } from "@/lib/speech";
import PageHeading from "@/components/app/PageHeading";
import StatBar from "@/components/ui/stat-bar";

/**
 * FEATURE 2 — Accessible Mock Interview (flagship).
 * The interview adapts to how the student can participate, and scoring NEVER
 * docks points for using an accommodation (a typed answer is not penalized on
 * "communication"; audio mode is screen-reader clean; extended time is free).
 */

type Mode = "audio" | "captioned";

const QUESTION =
  "Design a function that returns the k most frequent elements in an array. Walk me through your approach before you code.";

export default function MockInterviewPage() {
  const { isAccessibility, isAudioFirst, needsCaptions, signSupport, isMicro } = useAccessibility();
  const { recordSolve } = useProgress();
  const [started, setStarted] = useState(false);
  const [answer, setAnswer] = useState("");
  const [extendedTime, setExtendedTime] = useState(isMicro);
  const [earned, setEarned] = useState<number | null>(null);
  const coach = useInterviewCoach(started);

  const startSession = () => {
    coach.reset();
    setStarted(true);
  };

  const endSession = () => {
    // Completing a mock awards points once per day.
    const id = `mock-${new Date().toISOString().slice(0, 10)}`;
    const granted = recordSolve({
      kind: "mock",
      problemId: id,
      title: "Mock interview · SDE-1",
      score: STUDENT.interview.score,
      points: pointsForScore(STUDENT.interview.score),
    });
    setEarned(granted);
    setStarted(false);
  };

  // Default mode follows the student's primary preference.
  const mode: Mode = isAudioFirst && !needsCaptions ? "audio" : "captioned";

  return (
    <div>
      <PageHeading
        eyebrow="Interview engine"
        title="Mock Interview"
        summary="Unlimited AI mock interviews under real time pressure, with a scored breakdown and a specific fix after each one."
        narration="Mock Interview. Unlimited AI interviews with scored feedback and one specific fix after each session."
      />

      {isAccessibility && (
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-accent/20 bg-accent-soft p-4">
          <span className="text-lg" aria-hidden="true">✦</span>
          <div>
            <p className="text-[15px] font-medium text-accent">This interview is adapted for you.</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">
              {mode === "audio"
                ? "Fully audio, screen-reader-clean flow."
                : "Captioned questions; answer by typing or sign input."}
              {signSupport && " Sign-language input is accepted and scored the same."} Using any
              accommodation never costs you points.
            </p>
          </div>
        </div>
      )}

      {earned !== null && !started && (
        <div className="mb-5 rounded-2xl border border-track/30 bg-track-soft px-5 py-4 font-mono text-sm font-medium text-track">
          {earned > 0
            ? `✓ Session scored — +${earned} points added to the leaderboard.`
            : "✓ Session scored. You've already earned today's mock points — come back tomorrow."}
        </div>
      )}

      {!started ? (
        <div className="rounded-2xl border border-line bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-medium">SDE-1 · technical round</h2>
              <p className="mt-1 text-sm text-ink-soft">~30 minutes · 1 problem + follow-ups</p>
            </div>
            <span className="rounded-full bg-watch-soft px-3 py-1.5 font-mono text-xs font-medium text-watch">
              Last score {STUDENT.interview.score}/100
            </span>
          </div>

          {isAccessibility && (
            <label className="mt-5 flex items-center gap-3 rounded-xl border border-line bg-paper p-3.5 text-sm">
              <input type="checkbox" checked={extendedTime} onChange={(e) => setExtendedTime(e.target.checked)} className="h-4 w-4 accent-[#534AB7]" />
              <span className="flex items-center gap-2">
                <Clock size={15} className="text-accent" />
                Extended thinking time — <span className="text-ink-soft">no penalty, never shown to anyone</span>
              </span>
            </label>
          )}

          <button onClick={startSession} className="mt-5 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper">
            Start interview
          </button>
          <p className="mt-3 flex items-center gap-1.5 font-mono text-[11px] text-ink-soft">
            <Activity size={12} className="text-accent" /> Live co-pilot gives real-time nudges as you answer.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="rounded-2xl border border-line bg-white p-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                Question 1 {extendedTime && "· extended time"}
              </span>
              <span className={cn("flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-medium", mode === "audio" ? "bg-accent-soft text-accent" : "bg-track-soft text-track")}>
                {mode === "audio" ? <Volume2 size={12} /> : <Keyboard size={12} />}
                {mode === "audio" ? "Audio mode" : "Captioned + typed"}
              </span>
            </div>

            {/* Caption bar (always present in captioned mode = deaf-accessible) */}
            <p className="mt-4 rounded-xl bg-ink px-4 py-3 font-mono text-[13px] leading-relaxed text-paper">
              {QUESTION}
            </p>
            {mode === "audio" && (
              <button onClick={() => speak(QUESTION)} className="mt-3 flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm">
                <Volume2 size={15} /> Replay question
              </button>
            )}

            {mode === "audio" ? (
              <div className="mt-5 flex flex-col items-center gap-3 py-4">
                <div className="flex items-end gap-1" aria-hidden="true">
                  {[14, 26, 18, 30, 22, 34, 20].map((h, i) => (
                    <span key={i} className="w-1.5 rounded-full bg-accent/60" style={{ height: h }} />
                  ))}
                </div>
                <p className="text-sm text-ink-soft">Speak your answer — transcription scores the same as typing.</p>
              </div>
            ) : (
              <div className="mt-4">
                <label htmlFor="answer" className="mb-1.5 block font-mono text-xs text-ink-soft">
                  Your answer {signSupport && "(type, or attach a sign-language clip)"}
                </label>
                <textarea
                  id="answer"
                  value={answer}
                  onChange={(e) => {
                    setAnswer(e.target.value);
                    coach.report(e.target.value);
                  }}
                  rows={4}
                  placeholder="Explain your approach before coding…"
                  className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm"
                />
              </div>
            )}
          </div>

          {/* FEATURE 3 — Live Interview Co-pilot: real-time nudges while you answer */}
          <div className="rounded-2xl border border-accent/20 bg-accent-soft/40 p-5">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-accent">
                <Activity size={12} /> Live co-pilot
              </p>
              <div className="flex gap-3 font-mono text-[11px] text-ink-soft">
                <span>{coach.stats.words} words</span>
                <span>{coach.stats.fillers} fillers</span>
                <span>{coach.stats.silentSeconds}s quiet</span>
              </div>
            </div>
            <div className="mt-3 min-h-[2.5rem] space-y-2">
              <AnimatePresence mode="popLayout">
                {coach.nudges.length === 0 ? (
                  <motion.p key="ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-ink-soft">
                    Looking good — keep narrating your thinking out loud.
                  </motion.p>
                ) : (
                  coach.nudges.map((n) => (
                    <motion.p
                      key={n.id}
                      layout
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className={cn(
                        "rounded-lg px-3 py-2 text-sm",
                        n.tone === "warn" ? "bg-watch-soft text-ink" : "bg-white text-ink-soft"
                      )}
                    >
                      {n.tone === "warn" ? "→ " : "✓ "}{n.text}
                    </motion.p>
                  ))
                )}
              </AnimatePresence>
            </div>
            <p className="mt-2 font-mono text-[10px] text-ink-soft">
              Coaching only — never scored. Typed and spoken answers are treated identically.
            </p>
          </div>

          {/* Scored report — explicit no-penalty note */}
          <div className="rounded-2xl border border-line bg-white p-6">
            <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
              <p className="font-mono text-xs text-ink-soft">Sample scored breakdown</p>
              <span className="rounded-full bg-watch-soft px-3 py-1.5 font-mono text-xs font-medium text-watch">72/100</span>
            </div>
            <div className="mt-5 space-y-4">
              {STUDENT.interview.dims.map((dim, i) => (
                <StatBar key={dim.label} label={dim.label} pct={dim.pct} zone={dim.zone} delay={0.1 + i * 0.1} />
              ))}
            </div>
            <blockquote className="mt-5 rounded-xl border border-line bg-paper p-4 font-mono text-[13px] leading-relaxed text-ink-soft">
              "{STUDENT.interview.feedback}"
            </blockquote>
            {isAccessibility && (
              <p className="mt-3 font-mono text-[11px] text-track">
                ✓ Scored on the content of your answer. Typed, signed, or audio responses are
                graded identically — communication is never docked for the format you chose.
              </p>
            )}
          </div>

          <button
            onClick={endSession}
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper"
          >
            End session &amp; score
          </button>
        </div>
      )}
    </div>
  );
}
