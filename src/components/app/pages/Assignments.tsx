import { useState } from "react";
import { BatteryCharging, Coffee, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAccessibility } from "@/context/AccessibilityContext";
import { ASSIGNMENTS } from "@/services/mockData";
import { speak } from "@/lib/speech";
import PageHeading from "@/components/app/PageHeading";

/**
 * FEATURE 6 — Focus & Energy-Aware Planner lives here for accessibility users:
 * micro_learning splits each assignment into sub-tasks with progress and
 * built-in breaks, and celebrates small wins instead of point-farming.
 */
export default function Assignments() {
  const { isMicro, isAudioFirst, isSimplified } = useAccessibility();
  const [done, setDone] = useState<Record<string, boolean>>({});

  const key = (a: string, i: number) => `${a}-${i}`;
  const toggle = (k: string) => setDone((d) => ({ ...d, [k]: !d[k] }));

  return (
    <div className={cn(isSimplified && "simplified")}>
      <PageHeading
        eyebrow="Due soon"
        title="Assignments"
        summary="Your assignments, broken into steps you can actually start. Spoken instructions and breaks when you want them."
        narration="Assignments. Each one is broken into small steps with spoken instructions and built-in breaks."
      />

      {isMicro && (
        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-accent/20 bg-accent-soft p-4 text-sm">
          <BatteryCharging size={16} className="text-accent" />
          <span className="text-ink-soft">
            <span className="font-medium text-accent">Focus &amp; energy-aware planner on.</span>{" "}
            Sub-tasks, short blocks, and a break after each. Small wins counted.
          </span>
        </div>
      )}

      <div className="space-y-4">
        {ASSIGNMENTS.map((assignment) => {
          const total = assignment.subtasks.length;
          const completed = assignment.subtasks.filter((_, i) => done[key(assignment.id, i)]).length;
          return (
            <article key={assignment.id} className="rounded-2xl border border-line bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-lg font-medium">{assignment.title}</h2>
                  {isAudioFirst && (
                    <button onClick={() => speak(`${assignment.title}. Steps: ${assignment.subtasks.join(". ")}`)} aria-label="Read instructions aloud" className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-soft hover:text-ink">
                      <Volume2 size={14} />
                    </button>
                  )}
                </div>
                <span className="rounded-full bg-watch-soft px-2.5 py-1 font-mono text-[11px] font-medium text-watch">Due {assignment.due}</span>
              </div>

              {/* micro_learning: explicit sub-tasks with progress. */}
              <div className="mt-4 space-y-2">
                {assignment.subtasks.map((task, i) => {
                  const k = key(assignment.id, i);
                  return (
                    <label key={k} className={cn("flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-paper p-3 transition-colors", done[k] && "border-track/30 bg-track-soft/50")}>
                      <input type="checkbox" checked={!!done[k]} onChange={() => toggle(k)} className="h-4 w-4 accent-[#1D9E75]" />
                      <span className={cn("text-sm", done[k] && "text-ink-soft line-through")}>{task}</span>
                      {isMicro && i < total - 1 && done[k] && (
                        <span className="ml-auto flex items-center gap-1 font-mono text-[10px] text-accent">
                          <Coffee size={11} /> break
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#F1EFE8]">
                  <div className="h-full rounded-full bg-track transition-all" style={{ width: `${(completed / total) * 100}%` }} />
                </div>
                <span className="ml-3 font-mono text-[11px] text-ink-soft">
                  {completed === total ? "🎉 Done — nice work" : `${completed}/${total}`}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
