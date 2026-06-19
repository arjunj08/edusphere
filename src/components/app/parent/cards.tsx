import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, ShieldCheck, HeartHandshake, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import useCounter from "@/hooks/useCounter";
import type { Zone } from "@/services/mockData";
import type { ParentSnapshot, WellbeingState } from "@/services/parent";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Shared fade-up; gentle stagger is driven by the parent container. */
export const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const ZONE: Record<
  Zone,
  { dot: string; soft: string; text: string; ring: string }
> = {
  green: { dot: "bg-track", soft: "bg-track-soft", text: "text-track", ring: "ring-track/20" },
  amber: { dot: "bg-watch", soft: "bg-watch-soft", text: "text-watch", ring: "ring-watch/20" },
  red: { dot: "bg-risk", soft: "bg-risk-soft", text: "text-risk", ring: "ring-risk/20" },
};

const WELL_TONE: Record<WellbeingState, { soft: string; text: string; dot: string }> = {
  healthy: { soft: "bg-track-soft", text: "text-track", dot: "bg-track" },
  dipping: { soft: "bg-watch-soft", text: "text-watch", dot: "bg-watch" },
  low: { soft: "bg-watch-soft", text: "text-watch", dot: "bg-watch" },
};

/** Card shell so every card shares the same motion + surface styling. */
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={cardVariants}
      className={cn("rounded-2xl border border-line bg-white p-6", className)}
    >
      {children}
    </motion.div>
  );
}

/** Shown in place of a card the student has chosen not to share. */
export function PausedCard({ title, childName }: { title: string; childName: string }) {
  return (
    <Card className="border-dashed bg-paper/60">
      <div className="flex items-center gap-2 text-ink-soft">
        <Lock size={15} />
        <h2 className="font-display text-base font-medium">{title}</h2>
      </div>
      <p className="mt-2 text-sm text-ink-soft">
        {childName} has paused sharing this for now. That's their choice to make — you'll
        see it again whenever they turn it back on.
      </p>
    </Card>
  );
}

/* 1 — Overall status banner -------------------------------------------------- */
export function StatusBanner({ snapshot }: { snapshot: ParentSnapshot }) {
  const z = ZONE[snapshot.zone];
  const reduced = useReducedMotion();
  return (
    <motion.div
      variants={cardVariants}
      className={cn("rounded-2xl p-7 ring-1", z.soft, z.ring)}
      aria-live="polite"
    >
      <div className="flex items-start gap-4">
        <span className="relative mt-1.5 flex h-3 w-3 shrink-0">
          {!reduced && (
            <motion.span
              className={cn("absolute inline-flex h-full w-full rounded-full", z.dot)}
              animate={{ opacity: [0.6, 0, 0.6], scale: [1, 2.2, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          <span className={cn("relative inline-flex h-3 w-3 rounded-full", z.dot)} />
        </span>
        <div>
          <h1 className="font-display text-2xl font-medium tracking-tight md:text-3xl">
            {snapshot.headline} {snapshot.emoji}
          </h1>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink-soft">
            {snapshot.subline}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* 2 — Progress at a glance ---------------------------------------------------- */
function ProgressTile({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const counter = useCounter(value);
  return (
    <div className="rounded-xl border border-line bg-paper p-4 text-center">
      <p ref={counter.ref} className="font-display text-3xl font-medium md:text-4xl">
        {counter.value}
        <span className="text-lg text-ink-soft">{suffix}</span>
      </p>
      <p className="mt-1.5 text-sm text-ink-soft">{label}</p>
    </div>
  );
}

export function ProgressGlance({ progress }: { progress: ParentSnapshot["progress"] }) {
  return (
    <Card>
      <h2 className="font-display text-lg font-medium">Progress at a glance</h2>
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <ProgressTile value={progress.attendancePct} suffix="%" label="Attendance" />
        <ProgressTile
          value={progress.assignmentsOnTime}
          suffix={`/${progress.assignmentsTotal}`}
          label="Assignments on time"
        />
        <ProgressTile value={progress.readiness} suffix="/100" label="Readiness score" />
      </div>
    </Card>
  );
}

/* 3 — This week summary ------------------------------------------------------- */
export function WeekSummary({ lines }: { lines: string[] }) {
  return (
    <Card>
      <h2 className="font-display text-lg font-medium">This week</h2>
      <ul className="mt-4 space-y-2.5">
        {lines.map((line) => (
          <li key={line} className="flex items-start gap-2.5 text-[15px] leading-relaxed">
            <span className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-track" />
            {line}
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* 4 — Wellbeing signal (gentle) ---------------------------------------------- */
export function WellbeingSignal({
  wellbeing,
}: {
  wellbeing: ParentSnapshot["wellbeing"];
}) {
  const tone = WELL_TONE[wellbeing.state];
  return (
    <Card>
      <h2 className="font-display text-lg font-medium">Wellbeing signal</h2>
      <div className={cn("mt-4 flex items-start gap-3 rounded-xl p-4", tone.soft)}>
        <span className={cn("mt-1.5 block h-2.5 w-2.5 shrink-0 rounded-full", tone.dot)} />
        <p className={cn("text-[15px] leading-relaxed font-medium", tone.text)}>
          {wellbeing.line}
        </p>
      </div>
      {wellbeing.tip && (
        <div className="mt-3 rounded-xl border border-line bg-paper p-3.5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
            How to support
          </p>
          <p className="mt-1.5 text-sm leading-relaxed">{wellbeing.tip}</p>
        </div>
      )}
      <p className="mt-3 font-mono text-[11px] leading-relaxed text-ink-soft">
        A gentle sense of engagement — not a measurement of mood, and never a diagnosis.
      </p>
    </Card>
  );
}

/* 5 — Milestones & wins ------------------------------------------------------- */
export function Milestones({ items }: { items: ParentSnapshot["milestones"] }) {
  return (
    <Card>
      <div className="flex items-center gap-2">
        <Sparkles size={18} className="text-accent" />
        <h2 className="font-display text-lg font-medium">Milestones & wins</h2>
      </div>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((m) => (
          <li
            key={m.text}
            className="flex items-start gap-3 rounded-xl border border-line bg-accent-soft/40 p-3.5"
          >
            <span className="text-xl" aria-hidden="true">
              {m.icon}
            </span>
            <span className="text-sm leading-relaxed">{m.text}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* 6 — How you can help -------------------------------------------------------- */
export function HowToHelp({ items }: { items: string[] }) {
  return (
    <Card>
      <div className="flex items-center gap-2">
        <HeartHandshake size={18} className="text-track" />
        <h2 className="font-display text-lg font-medium">How you can help</h2>
      </div>
      <ul className="mt-4 space-y-3">
        {items.map((tip) => (
          <li
            key={tip}
            className="rounded-xl border border-line bg-paper p-3.5 text-[15px] leading-relaxed"
          >
            {tip}
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* Privacy bar (always visible) ----------------------------------------------- */
export function PrivacyBar({ childName }: { childName: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white/70 p-4">
      <div className="flex items-start gap-2.5">
        <ShieldCheck size={16} className="mt-0.5 shrink-0 text-track" />
        <p className="text-sm leading-relaxed text-ink-soft">
          Shared with {childName}'s consent. You see <span className="text-ink">progress</span>{" "}
          and <span className="text-ink">wellbeing</span> — never private messages, exact
          grades on every test, or personal content.{" "}
          <span className="text-ink-soft">
            {childName} controls exactly what's shared in their settings.
          </span>
        </p>
      </div>
    </div>
  );
}
