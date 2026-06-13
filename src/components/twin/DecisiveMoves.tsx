import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import type { DecisiveMove } from "@/services/twin";

const EASE = [0.22, 1, 0.36, 1] as const;

/** The AI-ranked moves that most separated placed twins from unplaced ones. */
export default function DecisiveMoves({
  moves,
  sampleSize,
}: {
  moves: DecisiveMove[];
  sampleSize: number;
}) {
  return (
    <section className="rounded-2xl border border-line bg-white p-6">
      <div className="flex items-center gap-2">
        <TrendingUp size={16} className="text-accent" />
        <h2 className="font-display text-xl font-medium tracking-tight">The 3 moves that mattered most</h2>
      </div>
      <p className="mt-1.5 text-sm text-ink-soft">
        Ranked from what actually separated your twins who placed from those who didn't.
      </p>

      <ol className="mt-5 space-y-3">
        {moves.map((move, i) => (
          <motion.li
            key={move.key}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: EASE, delay: i * 0.1 }}
            className="flex flex-wrap items-center gap-4 rounded-xl border border-line bg-paper p-4"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent font-display text-base font-medium text-white">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium">{move.label}</p>
              <p className="mt-0.5 font-mono text-[12px] text-track">
                Twins who did this placed {move.lift.toFixed(1)}× more often
                <span className="text-ink-soft">
                  {" "}· {Math.round(move.withRate * 100)}% vs {Math.round(move.withoutRate * 100)}%
                </span>
              </p>
            </div>
            <Link
              to={move.link.to}
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-xs font-medium text-paper"
            >
              {move.link.label} <ArrowUpRight size={13} />
            </Link>
          </motion.li>
        ))}
      </ol>

      <p className="mt-4 font-mono text-[11px] text-ink-soft">
        Illustrative · based on {sampleSize} similar profiles. Synthetic cohort until pilot data replaces it.
      </p>
    </section>
  );
}
