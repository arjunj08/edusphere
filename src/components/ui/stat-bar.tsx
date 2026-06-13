import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ZONE_STYLES, type Zone } from "@/services/mockData";

const EASE = [0.22, 1, 0.36, 1] as const;

interface StatBarProps {
  label: string;
  pct: number;
  zone: Zone;
  note?: string;
  delay?: number;
  className?: string;
}

/** Labeled horizontal bar that fills on scroll into view. */
export default function StatBar({ label, pct, zone, note, delay = 0, className }: StatBarProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="w-32 shrink-0 text-sm md:w-36">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#F1EFE8]">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: EASE, delay }}
          className="h-full rounded-full"
          style={{ backgroundColor: ZONE_STYLES[zone].color }}
        />
      </div>
      <span className="w-10 shrink-0 text-right font-mono text-xs text-ink-soft">
        {pct}%
      </span>
      {note && (
        <span className="hidden shrink-0 font-mono text-[10px] text-risk lg:inline">
          {note}
        </span>
      )}
    </div>
  );
}
