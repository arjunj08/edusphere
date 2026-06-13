import { motion } from "framer-motion";
import Book from "@/components/ui/book";
import ReadinessRing from "@/components/ui/readiness-ring";
import StatBar from "@/components/ui/stat-bar";
import { STUDENT } from "@/services/mockData";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function StudentView() {
  return (
    <section className="px-5 py-20 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">
            The student side
          </p>
          <h2 className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight md:text-[40px]">
            Students don't get a vague "keep practicing." They get a number —
            and exactly what moves it.
          </h2>
          <p className="mt-5 leading-relaxed text-ink-soft">
            Every student sets a career target. EduSphere compares their
            current skills against what that role requires, scores the gap, and
            converts it into a week-by-week plan.
          </p>
          <p className="mt-5 border-l-2 border-accent/30 pl-4 font-mono text-[13px] leading-relaxed text-ink-soft">
            Career matching is disability-aware — recommendations account for
            each student's accessibility profile, never limited by it.
          </p>
        </motion.div>

        {/* Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          className="rounded-2xl border border-line bg-white p-6 md:p-8"
        >
          <div className="flex flex-col items-center">
            <span className="self-start rounded-full bg-accent-soft px-3 py-1.5 font-mono text-xs font-medium text-accent">
              🎯 Target: {STUDENT.target}
            </span>
            <ReadinessRing
              score={STUDENT.readiness}
              label={STUDENT.readinessLabel}
              className="mt-4"
            />
          </div>

          <div className="mt-8 space-y-4">
            {STUDENT.skills.map((skill, i) => (
              <StatBar
                key={skill.label}
                label={skill.label}
                pct={skill.pct}
                zone={skill.zone}
                note={skill.note}
                delay={0.15 + i * 0.12}
              />
            ))}
          </div>

          {/* This week's plan — beside a small decorative workbook. The plan
              text itself is the accessible content; the book is aria-hidden. */}
          <div className="mt-8 flex items-center gap-5">
            <Book color="#534AB7" width={110} className="hidden sm:block">
              <p className="font-display text-sm font-medium leading-snug text-paper">
                Week 24 plan
              </p>
              <p className="font-mono text-[9px] text-paper/70">
                EduSphere · workbook
              </p>
            </Book>
            <div className="flex-1 rounded-xl border border-accent/20 bg-accent-soft p-4">
              <p className="font-mono text-[11px] uppercase tracking-wider text-accent">
                ✦ This week's plan
              </p>
              <ul className="mt-2 space-y-1.5 font-mono text-xs leading-relaxed text-ink-soft">
                <li>Mon–Wed · 3 system design problems (graded)</li>
                <li>Thu · 1 mock interview — system design round</li>
                <li>Sun · auto re-score → projected 84/100</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
