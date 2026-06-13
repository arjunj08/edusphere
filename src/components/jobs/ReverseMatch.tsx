import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { STUDENT_VECTOR } from "@/services/mockData";
import { COMPANIES, closingPlan, computeGap, fitScore } from "@/services/companyMatch";
import PageHeading from "@/components/app/PageHeading";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * FEATURE 2 — Reverse Job Matching. Pick a target; see the exact gap between
 * you and that company's typical hire, plus a dated plan to close it.
 */
export default function ReverseMatch() {
  const [companyId, setCompanyId] = useState(COMPANIES[0].id);
  const company = COMPANIES.find((c) => c.id === companyId)!;

  const deltas = useMemo(() => computeGap(STUDENT_VECTOR, company), [company]);
  const fit = useMemo(() => fitScore(deltas), [deltas]);
  const plan = useMemo(() => closingPlan(deltas), [deltas]);

  return (
    <div>
      <PageHeading
        eyebrow="Reverse job matching"
        title="You vs. their typical hire"
        summary="Pick a target company and see exactly where you stand against the profile they usually hire — then get a dated plan to close the gap."
        narration="Reverse job matching. Pick a company to see the gap between you and their typical hire, with a plan to close it."
      />

      {/* Target picker */}
      <div className="mb-6 flex flex-wrap gap-2">
        {COMPANIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCompanyId(c.id)}
            className={cn(
              "rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
              c.id === companyId ? "border-accent/40 bg-accent-soft text-accent" : "border-line bg-white text-ink-soft hover:text-ink"
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Gap bars */}
        <section className="rounded-2xl border border-line bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-medium">{company.name}</h2>
              <p className="font-mono text-[11px] text-ink-soft">{company.role} · {company.blurb}</p>
            </div>
            <span className={cn("rounded-full px-3 py-1.5 font-mono text-xs font-medium", fit >= 80 ? "bg-track-soft text-track" : fit >= 55 ? "bg-watch-soft text-watch" : "bg-risk-soft text-risk")}>
              {fit}% fit
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {deltas.map((d, i) => (
              <div key={d.key}>
                <div className="flex items-center justify-between text-sm">
                  <span>{d.label}</span>
                  <span className={cn("font-mono text-xs", d.delta < 0 ? "text-risk" : "text-track")}>
                    {d.delta >= 0 ? `+${d.delta}` : d.delta}
                  </span>
                </div>
                <div className="relative mt-1.5 h-3 rounded-full bg-[#F1EFE8]">
                  {/* their bar (target marker) */}
                  <div className="absolute top-0 h-3 w-0.5 bg-ink" style={{ left: `${d.hire}%` }} title="Their typical hire" />
                  {/* your bar */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${d.you}%` }}
                    transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }}
                    className={cn("h-3 rounded-full", d.delta < 0 ? "bg-risk/70" : "bg-track/70")}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 font-mono text-[11px] text-ink-soft">
            ▎ marks their typical hire · bar is you. Aggregated patterns, illustrative.
          </p>
        </section>

        {/* 4-week plan */}
        <section className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-display text-lg font-medium">Your 4-week closing plan</h2>
          <p className="mt-1 text-sm text-ink-soft">Targets your biggest gaps first.</p>
          <ol className="mt-4 space-y-3">
            {plan.map((wk) => (
              <li key={wk.week} className="flex items-center gap-3 rounded-xl border border-line bg-paper p-3.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft font-mono text-xs font-medium text-accent">
                  W{wk.week}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{wk.focus}</p>
                  <p className="text-xs text-ink-soft">{wk.action}</p>
                </div>
                <Link to={wk.link.to} className="flex shrink-0 items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs font-medium hover:bg-white" title={wk.link.label}>
                  <ArrowUpRight size={13} />
                </Link>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
