import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { RotateCcw } from "lucide-react";

const STEP_MS = 1500;
const EASE = [0.22, 1, 0.36, 1] as const;

type ZoneKey = "green" | "amber" | "red";

const ZONES: Record<ZoneKey, { color: string; bg: string; label: string }> = {
  green: { color: "#1D9E75", bg: "#E1F5EE", label: "On track" },
  amber: { color: "#EF9F27", bg: "#FAEEDA", label: "Watch" },
  red: { color: "#E24B4A", bg: "#FCEBEB", label: "At risk" },
};

interface TimelineNode {
  week: string;
  score: number;
  zone: ZoneKey;
  flag?: string;
  caption: string;
}

const NODES: TimelineNode[] = [
  {
    week: "W1",
    score: 88,
    zone: "green",
    caption:
      "Semester begins. Attendance high, submissions on time, engagement strong.",
  },
  {
    week: "W3",
    score: 72,
    zone: "amber",
    caption:
      "Quiz scores dip and submission latency creeps up — invisible in any gradebook.",
  },
  {
    week: "W5",
    score: 54,
    zone: "red",
    flag: "⚠ Risk detected",
    caption:
      "Failure risk crosses threshold. No human has noticed yet — midterms are 4 weeks away.",
  },
  {
    week: "W6",
    score: 58,
    zone: "amber",
    flag: "✦ Intervention sent",
    caption:
      "Agentic engine acts: study plan generated, mock interview booked, mentor paired, faculty notified.",
  },
  {
    week: "W8",
    score: 76,
    zone: "amber",
    caption:
      "Two weeks in: attendance recovering, submissions back on time, scores climbing.",
  },
  {
    week: "W10",
    score: 90,
    zone: "green",
    flag: "✓ Back on track",
    caption: "A dropout that never happened.",
  },
];

export default function RiskTimeline() {
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, amount: 0.35 });
  const reduced = useReducedMotion();
  const [step, setStep] = useState(-1);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    if (reduced) {
      setStep(NODES.length - 1);
      return undefined;
    }
    setStep(0);
    const id = setInterval(() => {
      setStep((s) => {
        if (s >= NODES.length - 1) {
          clearInterval(id);
          return s;
        }
        return s + 1;
      });
    }, STEP_MS);
    return () => clearInterval(id);
  }, [inView, reduced, run]);

  const current = step >= 0 ? NODES[step] : NODES[0];
  const zone = ZONES[step >= 0 ? current.zone : "green"];
  const done = step >= NODES.length - 1;
  const progress = step <= 0 ? 0 : (step / (NODES.length - 1)) * 100;

  const replay = () => {
    setStep(-1);
    setRun((r) => r + 1);
  };

  return (
    <section className="px-5 pb-20 md:pb-24">
      <div
        ref={cardRef}
        className="mx-auto max-w-5xl rounded-2xl border border-line bg-white p-6 md:p-10"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">
              One student · one semester
            </p>
            <h2 className="mt-2 font-display text-xl font-medium tracking-tight md:text-2xl">
              How EduSphere sees — and changes — a failing trajectory
            </h2>
          </div>
          <motion.span
            layout
            animate={{ backgroundColor: zone.bg, color: zone.color }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-xs font-medium"
            style={{ backgroundColor: zone.bg, color: zone.color }}
          >
            <motion.span
              layout
              className="block h-1.5 w-1.5 rounded-full"
              animate={{ backgroundColor: zone.color }}
            />
            {zone.label}
          </motion.span>
        </div>

        {/* Timeline */}
        <div className="relative mt-12 md:mt-14">
          {/* Track + progress line that draws between dots as each activates.
              Dot centers sit 72px from the top of each column (32px flag row +
              32px score row + half of the 16px dot); column centers span from
              1/12 to 11/12 of the row. */}
          <div className="absolute inset-x-[8.333%] top-[71px] h-[2px]">
            <div className="absolute inset-x-0 top-px h-px bg-line" />
            <motion.div
              className="absolute left-0 top-0 h-[2px] rounded-full"
              animate={{ width: `${progress}%`, backgroundColor: zone.color }}
              transition={{ duration: 1.2, ease: EASE }}
            />
          </div>

          <div className="relative grid grid-cols-6">
            {NODES.map((node, i) => {
              const nodeZone = ZONES[node.zone];
              const active = i <= step;
              return (
                <div key={node.week} className="flex flex-col items-center">
                  <div className="relative h-8 w-full">
                    {node.flag && (
                      <motion.span
                        initial={{ opacity: 0, y: 10, x: "-50%" }}
                        animate={
                          active
                            ? { opacity: 1, y: 0, x: "-50%" }
                            : { opacity: 0, y: 10, x: "-50%" }
                        }
                        transition={{ duration: 0.45, ease: EASE, delay: 0.25 }}
                        className="absolute left-1/2 top-0 z-10 whitespace-nowrap rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium md:text-[11px]"
                        style={{
                          backgroundColor: nodeZone.bg,
                          color: nodeZone.color,
                          borderColor: `${nodeZone.color}33`,
                        }}
                      >
                        {node.flag}
                      </motion.span>
                    )}
                  </div>

                  <div className="flex h-8 items-end pb-1.5">
                    <motion.span
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={
                        active
                          ? { opacity: 1, scale: 1 }
                          : { opacity: 0, scale: 0.6 }
                      }
                      transition={{
                        type: "spring" as const,
                        stiffness: 260,
                        damping: 20,
                        delay: 0.1,
                      }}
                      className="font-mono text-xs font-medium md:text-sm"
                      style={{ color: nodeZone.color }}
                    >
                      {node.score}
                    </motion.span>
                  </div>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={active ? { scale: 1 } : { scale: 0 }}
                    transition={{ type: "spring" as const, stiffness: 300, damping: 17 }}
                    className="relative z-10 h-4 w-4 rounded-full"
                    style={{
                      backgroundColor: nodeZone.color,
                      boxShadow: `0 0 0 4px ${nodeZone.bg}`,
                    }}
                  />

                  <span className="mt-3 font-mono text-[10px] text-ink-soft md:text-xs">
                    {node.week}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Caption + replay */}
        <div className="mt-8 flex min-h-[3.5rem] items-start justify-between gap-4 border-t border-line pt-5 md:min-h-[3rem]">
          <AnimatePresence mode="wait">
            <motion.p
              key={step}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="font-mono text-xs leading-relaxed text-ink-soft md:text-[13px]"
              aria-live="polite"
            >
              {step >= 0 ? (
                <>
                  <span className="font-medium" style={{ color: zone.color }}>
                    {current.week}:
                  </span>{" "}
                  {current.caption}
                </>
              ) : (
                "Tracking one student across ten weeks…"
              )}
            </motion.p>
          </AnimatePresence>

          <AnimatePresence>
            {done && (
              <motion.button
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={replay}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line px-3 py-1.5 font-mono text-xs text-ink-soft transition-colors hover:border-ink/30 hover:text-ink"
              >
                <RotateCcw size={12} />
                Replay
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
