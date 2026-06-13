import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const FEATURES = [
  {
    number: "01",
    title: "Risk prediction engine",
    body: "An ML model on engagement, grades, attendance and submission latency produces a weekly per-student risk score — fully explainable with SHAP, so faculty see why a student was flagged, not just that they were.",
    pill: "Flags at-risk students by week 3",
    pillClass: "bg-track-soft text-track",
  },
  {
    number: "02",
    title: "Placement readiness score",
    body: "A single 0–100 score built from DSA progress, mock interview performance, resume quality and project depth. Students see exactly what's missing — and what to do next week.",
    pill: "Maps directly to university placement KPIs",
    pillClass: "bg-accent-soft text-accent",
  },
  {
    number: "03",
    title: "Agentic intervention engine",
    body: "When risk crosses the threshold, the system acts: drafts a personalized study plan, schedules a mock interview, pairs a mentor, and notifies faculty for one-click approval — then tracks whether it worked.",
    pill: "Proactive, not reactive — scales to thousands",
    pillClass: "bg-watch-soft text-watch",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export default function Features() {
  return (
    <section id="how-it-works" className="scroll-mt-20 px-5 py-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="max-w-3xl"
        >
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">
            How it works
          </p>
          <h2 className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight md:text-[40px]">
            Three engines. One loop around every student.
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-12 grid gap-5 md:grid-cols-3"
        >
          {FEATURES.map((feature) => (
            <motion.article
              key={feature.number}
              variants={item}
              whileHover={{ y: -4 }}
              className="flex flex-col rounded-2xl border border-line bg-white p-7 transition-shadow hover:shadow-[0_12px_32px_-16px_rgba(16,27,45,0.18)]"
            >
              <span className="font-mono text-xs text-ink-soft">
                {feature.number}
              </span>
              <h3 className="mt-4 font-display text-xl font-medium tracking-tight">
                {feature.title}
              </h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-soft">
                {feature.body}
              </p>
              <span
                className={`mt-6 self-start rounded-full px-3 py-1.5 font-mono text-[11px] font-medium ${feature.pillClass}`}
              >
                {feature.pill}
              </span>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
