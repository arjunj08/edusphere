import { motion } from "framer-motion";
import useCounter from "@/hooks/useCounter";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Impact() {
  const weeks = useCounter(5);
  const dropout = useCounter(30);
  const placement = useCounter(2);

  return (
    <section id="impact" className="scroll-mt-20 px-5 py-12 md:py-16">
      {/* The only dark surface in the whole app. */}
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mx-auto max-w-6xl rounded-3xl bg-ink px-6 py-14 text-paper md:px-16 md:py-20"
      >
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-mint">
          Projected impact
        </p>
        <h2 className="mt-4 max-w-2xl font-display text-3xl font-medium leading-tight tracking-tight md:text-[40px]">
          What early intervention changes at scale
        </h2>
        <p className="mt-5 max-w-xl font-mono text-[11px] leading-relaxed text-paper/55">
          Projections based on published retention research. Live pilot at
          Anurag University runs July–August 2026 — real numbers replace these
          at submission.
        </p>

        <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-6">
          <div>
            <p ref={weeks.ref} className="font-display text-5xl font-medium text-mint md:text-6xl">
              3–{weeks.value}&nbsp;wks
            </p>
            <p className="mt-3 leading-relaxed text-paper/70">
              earlier detection vs midterm-based discovery.
            </p>
          </div>
          <div>
            <p ref={dropout.ref} className="font-display text-5xl font-medium text-mint md:text-6xl">
              {dropout.value}%
            </p>
            <p className="mt-3 leading-relaxed text-paper/70">
              dropout reduction achievable with timely intervention (literature
              benchmark).
            </p>
          </div>
          <div>
            <p ref={placement.ref} className="font-display text-5xl font-medium text-mint md:text-6xl">
              {placement.value}x
            </p>
            <p className="mt-3 leading-relaxed text-paper/70">
              placement-rate improvement targeted for intervened at-risk
              students.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
