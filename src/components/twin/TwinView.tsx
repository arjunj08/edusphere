import { useMemo } from "react";
import { STUDENT, STUDENT_VECTOR } from "@/services/mockData";
import { decisiveMoves, findTwins, projectedPath } from "@/services/twin";
import PageHeading from "@/components/app/PageHeading";
import TwinCard from "@/components/twin/TwinCard";
import DecisiveMoves from "@/components/twin/DecisiveMoves";
import ProjectedPath from "@/components/twin/ProjectedPath";

/**
 * FEATURE 1 — Placement Twin. "Students like you, 6 months ago — here's who
 * placed, what they did differently, and the moves that mattered."
 */
export default function TwinView() {
  const target = STUDENT.target;

  const twins = useMemo(() => findTwins(STUDENT_VECTOR, target, 6), [target]);
  const { moves, sampleSize } = useMemo(() => decisiveMoves(STUDENT_VECTOR, target), [target]);
  const path = useMemo(() => projectedPath(STUDENT.readiness), []);

  return (
    <div>
      <PageHeading
        eyebrow="Placement Twin"
        title="Students like you, six months ago"
        summary="We matched your starting point to past students, then surfaced what the ones who placed did differently — and where your path likely leads."
        narration="Placement Twin. We matched your starting point to past students and surfaced the moves that helped them place."
      />

      {/* Your snapshot */}
      <div className="mb-6 rounded-2xl border border-line bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">Your snapshot</p>
            <div className="mt-2 flex items-center gap-3">
              <span className="font-display text-3xl font-medium">{STUDENT.readiness}<span className="text-lg text-ink-soft">/100</span></span>
              <span className="rounded-full bg-accent-soft px-3 py-1.5 font-mono text-xs font-medium text-accent">🎯 {target}</span>
              <span className="flex items-center gap-1.5 rounded-full bg-track-soft px-3 py-1.5 font-mono text-xs font-medium text-track">
                <span className="block h-1.5 w-1.5 rounded-full bg-track" /> On track
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {STUDENT.skills.map((s) => (
              <span key={s.label} className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-ink-soft">
                {s.label.replace(" progress", "").replace(" quality", "")} {s.pct}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Decisive moves */}
      <DecisiveMoves moves={moves} sampleSize={sampleSize} />

      {/* Projected path */}
      <div className="mt-6">
        <ProjectedPath points={path} />
      </div>

      {/* Your twins */}
      <div className="mt-8">
        <h2 className="font-display text-xl font-medium tracking-tight">Your twins</h2>
        <p className="mt-1.5 text-sm text-ink-soft">
          Six past profiles whose starting point most resembled yours.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {twins.map((twin, i) => (
            <TwinCard key={twin.id} twin={twin} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
