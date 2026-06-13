import { motion } from "framer-motion";
import useCounter from "@/hooks/useCounter";

const EASE = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const cardClass =
  "rounded-2xl border border-line bg-white p-7 transition-shadow hover:shadow-[0_12px_32px_-16px_rgba(16,27,45,0.18)]";

export default function ProblemStats() {
  const pct = useCounter(40);
  const weeks = useCounter(6);

  return (
    <section className="px-5 py-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="max-w-3xl"
        >
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">
            The problem
          </p>
          <h2 className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight md:text-[40px]">
            Retention and placement are the two numbers every university is
            judged on. Both are managed reactively.
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-12 grid gap-5 md:grid-cols-3"
        >
          <motion.div variants={item} className={cardClass}>
            <p ref={pct.ref} className="font-display text-5xl font-medium text-risk">
              {pct.value}%
            </p>
            <p className="mt-4 leading-relaxed text-ink-soft">
              of Indian CS graduates never convert their degree into a
              placement.
            </p>
          </motion.div>

          <motion.div variants={item} className={cardClass}>
            <p ref={weeks.ref} className="font-display text-5xl font-medium text-watch">
              {weeks.value}&nbsp;wks
            </p>
            <p className="mt-4 leading-relaxed text-ink-soft">
              typical gap between a student starting to struggle and anyone
              noticing.
            </p>
          </motion.div>

          <motion.div variants={item} className={cardClass}>
            <p className="font-display text-5xl font-medium text-ink">Zero</p>
            <p className="mt-4 leading-relaxed text-ink-soft">
              systems that act on early signals. Dashboards report failure —
              none prevent it.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
