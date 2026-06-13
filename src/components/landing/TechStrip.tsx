import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const CHIPS = [
  "React",
  "FastAPI",
  "PostgreSQL + pgvector",
  "XGBoost",
  "Claude API",
  "AWS",
  "Explainable AI (SHAP)",
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const chip = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export default function TechStrip() {
  return (
    <section className="px-5 py-20 md:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="font-display text-2xl font-medium leading-tight tracking-tight md:text-3xl"
        >
          Cloud-native and modular — a new department spins up in days, not
          semesters.
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-2.5"
        >
          {CHIPS.map((label) => (
            <motion.span
              key={label}
              variants={chip}
              className="rounded-full border border-line bg-white px-4 py-2 font-mono text-xs text-ink-soft"
            >
              {label}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
