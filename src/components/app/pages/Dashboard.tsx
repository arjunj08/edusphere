import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAccessibility } from "@/context/AccessibilityContext";
import { useProgress } from "@/context/ProgressContext";
import { STUDENT, getPlanState, setPlanState } from "@/services/mockData";
import { speak } from "@/lib/speech";
import AdaptedForYou from "@/components/accessibility/AdaptedForYou";
import LiveLectureCompanion from "@/components/accessibility/LiveLectureCompanion";
import ReadinessRing from "@/components/ui/readiness-ring";
import StatBar from "@/components/ui/stat-bar";

const DAY_NARRATION = `Here is your day. You are on track at 78 out of 100. Weakest area: system design. Today: three system design problems and one mock interview. One assignment is due Friday.`;

export default function Dashboard() {
  const { profile } = useAuth();
  const { isAccessibility, isAudioFirst, isMicro, isSimplified, needsCaptions } = useAccessibility();
  const { points, solvedIds, streak, submissions } = useProgress();
  const [plan, setPlan] = useState<Record<string, boolean>>({});
  const [chunk, setChunk] = useState(0);

  useEffect(() => {
    if (profile) setPlan(getPlanState(profile.id));
  }, [profile]);

  if (!profile) return null;
  const firstName = profile.name.split(" ")[0] || "there";

  const togglePlan = (id: string) => {
    const next = { ...plan, [id]: !plan[id] };
    setPlan(next);
    setPlanState(profile.id, next);
  };

  const planItems = STUDENT.plan;
  const renderPlanRow = (item: (typeof planItems)[number]) => (
    <label
      key={item.id}
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-paper p-3.5 transition-colors",
        plan[item.id] && "border-track/30 bg-track-soft/50"
      )}
    >
      <input
        type="checkbox"
        checked={!!plan[item.id]}
        onChange={() => togglePlan(item.id)}
        className="mt-0.5 h-4 w-4 accent-[#1D9E75]"
      />
      <span className={cn("text-sm leading-relaxed", plan[item.id] && "text-ink-soft line-through")}>
        <span className="font-mono text-xs text-accent">{item.day}</span> · {item.text}
      </span>
    </label>
  );

  return (
    <div className={cn(isSimplified && "simplified")}>
      {/* Greeting */}
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium tracking-tight">
            Good to see you, {firstName}.
          </h1>
          <p className="mt-1 text-sm text-ink-soft">Week 24 · semester 4 · CSE</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-track-soft px-3 py-1.5 font-mono text-xs font-medium text-track">
            <span className="block h-1.5 w-1.5 rounded-full bg-track" />
            {STUDENT.riskLabel}
          </span>
          {isAudioFirst && (
            <button
              onClick={() => speak(DAY_NARRATION)}
              className="flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-paper"
            >
              <Volume2 size={16} /> Play my day
            </button>
          )}
        </div>
      </div>

      {isSimplified && (
        <div className="mb-6 rounded-xl border border-accent/20 bg-accent-soft p-4">
          <p className="font-mono text-[11px] uppercase tracking-wider text-accent">Today, in short</p>
          <p className="mt-1.5 text-[15px]">
            On track (78/100). Weakest: system design. Do 3 problems + 1 mock. One assignment due Friday.
          </p>
        </div>
      )}

      <AdaptedForYou />

      <div className="grid gap-5 lg:grid-cols-3">
        <section className="space-y-5 lg:col-span-2">
          <div className="rounded-2xl border border-line bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-lg font-medium">Placement readiness</h2>
              <span className="rounded-full bg-accent-soft px-3 py-1.5 font-mono text-xs font-medium text-accent">
                🎯 Target: {STUDENT.target}
              </span>
            </div>
            <div className="mt-5 flex flex-col items-center gap-7 md:flex-row" aria-live={isAudioFirst ? "polite" : undefined}>
              <ReadinessRing score={STUDENT.readiness} label={STUDENT.readinessLabel} className="shrink-0" />
              <div className="w-full space-y-4">
                {STUDENT.skills.map((skill, i) => (
                  <StatBar key={skill.label} label={skill.label} pct={skill.pct} zone={skill.zone} note={skill.note} delay={0.1 + i * 0.1} />
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-medium">This week's plan</h2>
              {isMicro && <span className="font-mono text-[11px] text-ink-soft">25-min blocks · break after each</span>}
            </div>
            {isMicro ? (
              <div className="mt-4">
                <AnimatePresence mode="wait">
                  <motion.div key={chunk} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}>
                    {renderPlanRow(planItems[chunk])}
                  </motion.div>
                </AnimatePresence>
                <div className="mt-4 flex items-center justify-between">
                  <button onClick={() => setChunk((c) => Math.max(0, c - 1))} disabled={chunk === 0} aria-label="Previous step" className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-soft disabled:opacity-40">
                    <ChevronLeft size={18} />
                  </button>
                  <div className="flex items-center gap-2">
                    {planItems.map((_, i) => (
                      <span key={i} className={cn("h-2 w-2 rounded-full", i === chunk ? "bg-accent" : "bg-line")} />
                    ))}
                    <span className="ml-2 font-mono text-[11px] text-ink-soft">{chunk + 1} of {planItems.length}</span>
                  </div>
                  <button onClick={() => setChunk((c) => Math.min(planItems.length - 1, c + 1))} disabled={chunk === planItems.length - 1} aria-label="Next step" className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-soft disabled:opacity-40">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-2.5">{planItems.map(renderPlanRow)}</div>
            )}
          </div>
        </section>

        <aside className="space-y-5">
          {/* R3-B Live Lecture Companion — only when captions preference is set */}
          {needsCaptions && <LiveLectureCompanion />}

          {/* Live progress from solving problems, dailies, and mocks */}
          <div className="rounded-2xl border border-line bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-medium">Your progress</h2>
              <span className="flex items-center gap-1.5 rounded-full bg-watch-soft px-2.5 py-1 font-mono text-xs font-medium text-watch">
                <Zap size={12} /> {points} pts
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-line bg-paper p-3">
                <p className="font-display text-2xl font-medium text-track">{solvedIds.length}</p>
                <p className="font-mono text-[11px] text-ink-soft">problems solved</p>
              </div>
              <div className="rounded-xl border border-line bg-paper p-3">
                <p className="font-display text-2xl font-medium text-watch">{streak}</p>
                <p className="font-mono text-[11px] text-ink-soft">day streak</p>
              </div>
            </div>
            {submissions.length > 0 && (
              <ul className="mt-4 space-y-1.5 border-t border-line pt-3">
                {submissions.slice(0, 3).map((s) => (
                  <li key={s.id} className="flex items-center justify-between font-mono text-[11px] text-ink-soft">
                    <span className="truncate pr-2">{s.title}</span>
                    <span className="shrink-0">{s.score}/100{s.points > 0 ? ` · +${s.points}` : ""}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-line bg-white p-6">
            <h2 className="font-display text-lg font-medium">Next step</h2>
            <p className="mt-3 rounded-xl border border-accent/20 bg-accent-soft p-3.5 font-mono text-xs leading-relaxed">
              ✦ Weakest link: system design. This week: 3 problems + 1 mock. Projected score after: 84.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-6">
            <h2 className="font-display text-lg font-medium">Mock interviews</h2>
            <p className="mt-2 text-sm text-ink-soft">Last: {STUDENT.interview.score}/100 · {STUDENT.interview.next}.</p>
          </div>
          {!isAccessibility && (
            <div className="rounded-2xl border border-line bg-white p-6">
              <h2 className="font-display text-lg font-medium">Learn your way</h2>
              <p className="mt-2 text-sm text-ink-soft">Prefer audio, captions, or shorter bursts? Turn on accessibility options anytime in Settings.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
