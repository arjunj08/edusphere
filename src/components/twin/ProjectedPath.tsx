import { motion, useReducedMotion } from "framer-motion";
import type { PathPoint } from "@/services/twin";

/**
 * Projected-path visualization: the student's likely trajectory vs the median
 * twin who took the recommended moves vs the one who didn't. Animates on view.
 * Clearly labeled as a projection.
 */

const W = 560;
const H = 200;
const PAD = { l: 36, r: 16, t: 16, b: 26 };

export default function ProjectedPath({ points }: { points: PathPoint[] }) {
  const reduced = useReducedMotion();
  const maxWeek = points[points.length - 1].week;
  const minY = 40;
  const maxY = 100;

  const x = (w: number) => PAD.l + (w / maxWeek) * (W - PAD.l - PAD.r);
  const y = (v: number) => PAD.t + (1 - (v - minY) / (maxY - minY)) * (H - PAD.t - PAD.b);

  const line = (pick: (p: PathPoint) => number) =>
    points.map((p, i) => `${i === 0 ? "M" : "L"} ${x(p.week).toFixed(1)} ${y(pick(p)).toFixed(1)}`).join(" ");

  const SERIES = [
    { key: "didMoves" as const, color: "#1D9E75", label: "Took the recommended moves" },
    { key: "you" as const, color: "#534AB7", label: "You today (baseline)" },
    { key: "didnt" as const, color: "#E24B4A", label: "Skipped them" },
  ];

  return (
    <section className="rounded-2xl border border-line bg-white p-6">
      <h2 className="font-display text-xl font-medium tracking-tight">Your projected path</h2>
      <p className="mt-1.5 text-sm text-ink-soft">
        Readiness over the next {maxWeek} weeks — a projection, not a guarantee.
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full" role="img" aria-label="Projected readiness trajectories over twelve weeks">
        {/* gridlines */}
        {[40, 60, 80, 100].map((v) => (
          <g key={v}>
            <line x1={PAD.l} y1={y(v)} x2={W - PAD.r} y2={y(v)} stroke="#E4E2DA" strokeWidth="1" />
            <text x={PAD.l - 8} y={y(v) + 3} textAnchor="end" fontSize="9" fill="#3A4558" fontFamily="monospace">{v}</text>
          </g>
        ))}
        <text x={x(0)} y={H - 8} fontSize="9" fill="#3A4558" fontFamily="monospace">wk 0</text>
        <text x={x(maxWeek)} y={H - 8} textAnchor="end" fontSize="9" fill="#3A4558" fontFamily="monospace">wk {maxWeek}</text>

        {SERIES.map((s) => (
          <motion.path
            key={s.key}
            d={line((p) => p[s.key])}
            fill="none"
            stroke={s.color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={s.key === "you" ? "5 5" : undefined}
            initial={reduced ? false : { pathLength: 0 }}
            whileInView={reduced ? undefined : { pathLength: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          />
        ))}
      </svg>

      <div className="mt-3 flex flex-wrap gap-4">
        {SERIES.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5 font-mono text-[11px] text-ink-soft">
            <span className="block h-2 w-4 rounded-full" style={{ backgroundColor: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
    </section>
  );
}
