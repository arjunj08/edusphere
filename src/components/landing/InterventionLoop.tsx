import { motion } from "framer-motion";
import {
  MousePointerClick,
  Radar,
  RefreshCw,
  Sparkles,
  Zap,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const STEPS = [
  {
    label: "Detect",
    desc: "Risk score crosses threshold",
    icon: Radar,
    color: "#E24B4A",
    bg: "#FCEBEB",
  },
  {
    label: "Prescribe",
    desc: "AI drafts plan: problems, mock, mentor",
    icon: Sparkles,
    color: "#534AB7",
    bg: "#EEEDFE",
  },
  {
    label: "Approve",
    desc: "Faculty one-click approves",
    icon: MousePointerClick,
    color: "#101B2D",
    bg: "#E9EBEF",
  },
  {
    label: "Act",
    desc: "Interventions auto-scheduled & delivered",
    icon: Zap,
    color: "#EF9F27",
    bg: "#FAEEDA",
  },
  {
    label: "Verify",
    desc: "Re-score in 2 weeks; loop repeats if needed",
    icon: RefreshCw,
    color: "#1D9E75",
    bg: "#E1F5EE",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.3 } },
};

const node = {
  hidden: { opacity: 0, scale: 0.6, y: 14 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 200, damping: 17 },
  },
};

export default function InterventionLoop() {
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
            The loop
          </p>
          <h2 className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight md:text-[40px]">
            Detect → prescribe → act → verify → repeat. No human bottleneck.
          </h2>
        </motion.div>

        <div className="relative mt-14">
          {/* Connecting line draws across as the nodes pop in (desktop) */}
          <svg
            className="absolute inset-x-[10%] top-7 hidden md:block"
            width="100%"
            height="2"
            viewBox="0 0 100 2"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <line x1="0" y1="1" x2="100" y2="1" stroke="#E4E2DA" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <motion.line
              x1="0"
              y1="1"
              x2="100"
              y2="1"
              stroke="#3A4558"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
            />
          </svg>

          <motion.ol
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="relative grid gap-10 md:grid-cols-5 md:gap-4"
          >
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <motion.li
                  key={step.label}
                  variants={node}
                  className="flex items-start gap-4 md:flex-col md:items-center md:text-center"
                >
                  <span
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full ring-8 ring-paper"
                    style={{ backgroundColor: step.bg }}
                  >
                    <Icon size={22} style={{ color: step.color }} />
                  </span>
                  <div className="md:mt-4">
                    <p className="font-display text-lg font-medium">{step.label}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                      {step.desc}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </motion.ol>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
          className="mx-auto mt-14 max-w-2xl text-center leading-relaxed text-ink-soft"
        >
          If the score doesn't improve, the system escalates — it never
          silently gives up on a student.
        </motion.p>
      </div>
    </section>
  );
}
