import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

interface ReadinessRingProps {
  score: number; // 0–100
  label: string;
  className?: string;
}

/** Animated circular progress ring (SVG pathLength 0 → score/100). */
export default function ReadinessRing({ score, label, className }: ReadinessRingProps) {
  return (
    <div className={cn("relative h-44 w-44 md:h-52 md:w-52", className)}>
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <circle cx="100" cy="100" r="84" fill="none" stroke="#F1EFE8" strokeWidth="12" />
        <motion.circle
          cx="100"
          cy="100"
          r="84"
          fill="none"
          stroke="#1D9E75"
          strokeWidth="12"
          strokeLinecap="round"
          transform="rotate(-90 100 100)"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: score / 100 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="font-display text-4xl font-medium md:text-5xl">
          {score}
          <span className="text-lg text-ink-soft md:text-xl">/100</span>
        </p>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-track">
          {label}
        </p>
      </div>
    </div>
  );
}
