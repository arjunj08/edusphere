import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import StatBar from "@/components/ui/stat-bar";
import { STUDENT } from "@/services/mockData";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function MockInterview() {
  const interview = STUDENT.interview;

  return (
    <section className="px-5 py-20 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        {/* Report mockup (left on desktop) */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          className="order-last rounded-2xl border border-line bg-white p-6 md:p-8 lg:order-first"
        >
          <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
            <p className="font-mono text-xs text-ink-soft md:text-[13px]">
              {interview.title}
            </p>
            <span className="shrink-0 rounded-full bg-watch-soft px-3 py-1.5 font-mono text-xs font-medium text-watch">
              {interview.score}/100
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {interview.dims.map((dim, i) => (
              <StatBar
                key={dim.label}
                label={dim.label}
                pct={dim.pct}
                zone={dim.zone}
                delay={0.15 + i * 0.12}
              />
            ))}
          </div>

          <blockquote className="mt-6 rounded-xl border border-line bg-paper p-4 font-mono text-[13px] leading-relaxed text-ink-soft">
            "{interview.feedback}"
          </blockquote>

          <div className="mt-5 flex items-center gap-2 font-mono text-xs text-ink-soft">
            <CalendarDays size={14} className="text-accent" />
            {interview.next}
          </div>
        </motion.div>

        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">
            Interview engine
          </p>
          <h2 className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight md:text-[40px]">
            Unlimited mock interviews. Every answer scored. Every weakness
            named.
          </h2>
          <p className="mt-5 leading-relaxed text-ink-soft">
            AI-generated technical and behavioral interviews under real time
            pressure. After each session, students get a scored breakdown and a
            specific fix — the feedback a placement cell with 800 students can
            never give individually.
          </p>
          <span className="mt-6 inline-block rounded-full bg-track-soft px-3 py-1.5 font-mono text-[11px] font-medium text-track">
            Directly tied to placement outcomes
          </span>
        </motion.div>
      </div>
    </section>
  );
}
