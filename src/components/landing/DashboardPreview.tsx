import { motion } from "framer-motion";
import useCounter from "@/hooks/useCounter";
import { FACULTY_ROWS, ZONE_STYLES } from "@/services/mockData";

const EASE = [0.22, 1, 0.36, 1] as const;

const TILES = [
  { label: "Cohort health", value: 81, suffix: "/100", color: "text-track" },
  { label: "Students in red zone", value: 12, suffix: "", color: "text-risk" },
  { label: "Interventions active", value: 27, suffix: "", color: "text-accent" },
  { label: "Projected placement rate", value: 71, suffix: "%", color: "text-watch" },
];

function MetricTile({
  label,
  value,
  suffix,
  color,
}: (typeof TILES)[number]) {
  const counter = useCounter(value);
  return (
    <div className="rounded-2xl border border-line bg-white p-5 transition-shadow hover:shadow-[0_12px_32px_-16px_rgba(16,27,45,0.18)]">
      <p ref={counter.ref} className={`font-display text-3xl font-medium md:text-4xl ${color}`}>
        {counter.value}
        <span className="text-lg text-ink-soft">{suffix}</span>
      </p>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-ink-soft">
        {label}
      </p>
    </div>
  );
}

export default function DashboardPreview() {
  return (
    <section id="dashboard" className="scroll-mt-20 px-5 py-20 md:py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="max-w-3xl"
        >
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">
            Faculty &amp; institution view
          </p>
          <h2 className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight md:text-[40px]">
            A Monday-morning triage list — not another analytics dashboard.
          </h2>
        </motion.div>

        {/* Leadership strip */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
          className="mt-10"
        >
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {TILES.map((tile) => (
              <MetricTile key={tile.label} {...tile} />
            ))}
          </div>
          <p className="mt-3 font-mono text-[11px] text-ink-soft">
            The institution view — deans see cohort trends, not spreadsheets.
          </p>
        </motion.div>

        {/* Browser-chrome framed triage table */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          className="mt-8 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_24px_60px_-32px_rgba(16,27,45,0.25)]"
        >
          <div className="flex items-center gap-3 border-b border-line bg-[#F6F5F0] px-4 py-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-risk/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-watch/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-track/70" />
            </div>
            <div className="mx-auto rounded-md border border-line bg-white px-4 py-1 font-mono text-[11px] text-ink-soft">
              edusphere.ai/faculty/cse-2nd-year
            </div>
            <div className="w-12" />
          </div>

          {/* Scrollable on mobile with right-edge fade hint */}
          <div className="relative">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                    <th className="px-5 py-3 font-medium">Student</th>
                    <th className="px-5 py-3 font-medium">Zone</th>
                    <th className="px-5 py-3 font-medium">Risk</th>
                    <th className="px-5 py-3 font-medium">Top signal</th>
                    <th className="px-5 py-3 font-medium">Suggested action</th>
                  </tr>
                </thead>
                <tbody>
                  {FACULTY_ROWS.map((row, i) => {
                    const zone = ZONE_STYLES[row.zone];
                    return (
                      <tr
                        key={row.id}
                        className="border-b border-line/60 transition-colors last:border-0 hover:bg-paper"
                      >
                        <td className="px-5 py-4 font-medium">{row.name}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 font-mono text-[11px] font-medium ${zone.pill}`}
                          >
                            {zone.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#F1EFE8] md:w-24">
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${row.risk}%` }}
                                viewport={{ once: true, amount: 0.6 }}
                                transition={{
                                  duration: 0.9,
                                  ease: EASE,
                                  delay: 0.2 + i * 0.12,
                                }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: zone.color }}
                              />
                            </div>
                            <span className="font-mono text-xs text-ink-soft">
                              {row.risk}%
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-ink-soft">{row.signal}</td>
                        <td className="px-5 py-4">
                          {row.muted ? (
                            <span className="font-mono text-xs text-ink-soft">
                              {row.action}
                            </span>
                          ) : (
                            <button
                              className={`rounded-full border border-line px-3 py-1.5 text-xs font-medium transition-colors ${
                                row.approve
                                  ? "hover:border-accent/30 hover:bg-accent-soft hover:text-accent"
                                  : "hover:border-ink/20 hover:bg-paper"
                              }`}
                            >
                              {row.action}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent md:hidden" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
