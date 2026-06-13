/**
 * PRIVACY RULE (enforced by design):
 * The faculty view shows RISK SIGNALS ONLY — attendance, submissions, quiz
 * trends. It never reads AccessibilityContext and never renders a student's
 * accessibilityProfile. Learning preferences are private to the student (and
 * their counselor in the real build) and never appear in leaderboards or any
 * shared surface. Keep it that way when wiring the real API.
 */
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import useCounter from "@/hooks/useCounter";
import { HeartHandshake } from "lucide-react";
import {
  FACULTY_ROWS,
  LEARNING_SUPPORT_SIGNALS,
  ZONE_STYLES,
  approveIntervention,
  getApprovedInterventions,
} from "@/services/mockData";
import AppHeader from "@/components/app/AppHeader";
import InterventionModal from "@/components/app/InterventionModal";
import PageTransition from "@/components/app/PageTransition";

const EASE = [0.22, 1, 0.36, 1] as const;

const TILES = [
  { label: "Cohort health", value: 81, suffix: "/100", color: "text-track" },
  { label: "Students in red zone", value: 12, suffix: "", color: "text-risk" },
  { label: "Interventions active", value: 27, suffix: "", color: "text-accent" },
  { label: "Projected placement rate", value: 71, suffix: "%", color: "text-watch" },
];

function MetricTile({ label, value, suffix, color }: (typeof TILES)[number]) {
  const counter = useCounter(value);
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <p ref={counter.ref} className={`font-display text-3xl font-medium md:text-4xl ${color}`}>
        {counter.value}
        <span className="text-lg text-ink-soft">{suffix}</span>
      </p>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-ink-soft">
        {label}
      </p>
    </div>
  );
}

export default function FacultyDashboard() {
  const { profile } = useAuth();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [modalFor, setModalFor] = useState<string | null>(null);
  const [approved, setApproved] = useState<string[]>(getApprovedInterventions);

  const approve = (studentId: string) => {
    approveIntervention(studentId);
    setApproved(getApprovedInterventions());
    setModalFor(null);
  };

  const modalRow = FACULTY_ROWS.find((r) => r.id === modalFor);

  return (
    <PageTransition className="bg-paper">
      <AppHeader />

      <main className="mx-auto max-w-6xl px-5 py-8 md:py-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-medium tracking-tight md:text-3xl">
              CSE · 2nd year cohort
            </h1>
            <p className="mt-1 text-sm text-ink-soft">
              Welcome, {profile?.name ?? "Professor"} · Monday triage
            </p>
          </div>
          <p className="font-mono text-[11px] text-ink-soft">
            Risk signals only — learning preferences are private to students.
          </p>
        </div>

        {/* Leadership strip */}
        <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {TILES.map((tile) => (
            <MetricTile key={tile.label} {...tile} />
          ))}
        </div>

        {/* Triage table */}
        <div className="mt-7 overflow-hidden rounded-2xl border border-line bg-white">
          <div className="relative">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                    <th className="px-5 py-3 font-medium">Student</th>
                    <th className="px-5 py-3 font-medium">Zone</th>
                    <th className="px-5 py-3 font-medium">Risk</th>
                    <th className="px-5 py-3 font-medium">Top signal</th>
                    <th className="px-5 py-3 font-medium">Suggested action</th>
                  </tr>
                </thead>
                <tbody>
                  {FACULTY_ROWS.map((row, i) => {
                    const zone = ZONE_STYLES[row.zone];
                    const isApproved = approved.includes(row.id);
                    const isExpanded = expanded === row.id;
                    return [
                      <tr
                        key={row.id}
                        onClick={() => setExpanded(isExpanded ? null : row.id)}
                        className="cursor-pointer border-b border-line/60 transition-colors hover:bg-paper"
                        aria-expanded={isExpanded}
                      >
                        <td className="px-5 py-4 font-medium">
                          <span className="flex items-center gap-2">
                            <ChevronDown
                              size={14}
                              className={cn(
                                "text-ink-soft transition-transform",
                                isExpanded && "rotate-180"
                              )}
                            />
                            {row.name}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`rounded-full px-2.5 py-1 font-mono text-[11px] font-medium ${zone.pill}`}>
                            {zone.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#F1EFE8] md:w-24">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${row.risk}%` }}
                                transition={{ duration: 0.9, ease: EASE, delay: 0.2 + i * 0.12 }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: zone.color }}
                              />
                            </div>
                            <span className="font-mono text-xs text-ink-soft">
                              {row.risk}%
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-ink-soft">{row.signal}</td>
                        <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                          {row.muted ? (
                            <span className="font-mono text-xs text-ink-soft">
                              {row.action}
                            </span>
                          ) : isApproved && row.approve ? (
                            <span className="flex items-center gap-1.5 font-mono text-xs font-medium text-track">
                              <CheckCircle2 size={14} />
                              Intervention active ✓
                            </span>
                          ) : (
                            <button
                              onClick={() =>
                                row.approve ? setModalFor(row.id) : undefined
                              }
                              className={cn(
                                "rounded-full border border-line px-3 py-1.5 text-xs font-medium transition-colors",
                                row.approve
                                  ? "hover:border-accent/30 hover:bg-accent-soft hover:text-accent"
                                  : "hover:border-ink/20 hover:bg-paper"
                              )}
                            >
                              {row.action}
                            </button>
                          )}
                        </td>
                      </tr>,
                      // Explainability: top 3 signals with model weights (SHAP)
                      <tr key={`${row.id}-detail`} className="border-b border-line/60 last:border-0">
                        <td colSpan={5} className="p-0">
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: EASE }}
                                className="overflow-hidden bg-paper"
                              >
                                <div className="px-5 py-4 md:px-12">
                                  <p className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                                    Why the model flagged this score (SHAP)
                                  </p>
                                  <ul className="mt-3 space-y-2">
                                    {row.signals.map((signal) => (
                                      <li key={signal.label} className="flex items-center gap-3">
                                        <div className="h-1.5 w-32 overflow-hidden rounded-full bg-[#EAE8E0]">
                                          <div
                                            className="h-full rounded-full"
                                            style={{
                                              width: `${signal.weight * 100}%`,
                                              backgroundColor: zone.color,
                                            }}
                                          />
                                        </div>
                                        <span className="font-mono text-xs text-ink-soft">
                                          {signal.label} · weight {signal.weight.toFixed(2)}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </td>
                      </tr>,
                    ];
                  })}
                </tbody>
              </table>
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent md:hidden" />
          </div>
        </div>

        <p className="mt-4 font-mono text-[11px] text-ink-soft">
          Click a row for the model's explanation. Approvals persist — the
          loop re-scores intervened students in 2 weeks.
        </p>

        {/* FEATURE 3 — counselor-only learning-support signals. Suggestions for
            a conversation, never labels or diagnoses, never shown to students. */}
        <section className="mt-10 rounded-2xl border border-accent/20 bg-accent-soft/40 p-6">
          <div className="flex items-center gap-2">
            <HeartHandshake size={18} className="text-accent" />
            <h2 className="font-display text-lg font-medium">
              Learning-support signals · counselor view
            </h2>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
            Private prompts for a supportive conversation — never a label,
            never a verdict, and never shown to the student. Always pair with a
            human, professional assessment.
          </p>
          <ul className="mt-4 space-y-3">
            {LEARNING_SUPPORT_SIGNALS.map((signal) => (
              <li key={signal.id} className="rounded-xl border border-line bg-white p-4">
                <p className="text-[15px] font-medium">{signal.student}</p>
                <p className="mt-1 text-sm text-ink-soft">{signal.observation}</p>
                <p className="mt-2 font-mono text-[12px] text-accent">
                  Suggestion: {signal.suggestion}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-line/60 pt-4 font-mono text-[11px] leading-relaxed text-ink-soft">
            Ethics: EduSphere surfaces patterns, people make decisions. These
            prompts open a door to support earlier — they never close one.
          </p>
        </section>
      </main>

      <InterventionModal
        open={modalFor !== null}
        studentName={modalRow?.name ?? ""}
        onClose={() => setModalFor(null)}
        onApprove={() => modalFor && approve(modalFor)}
      />
    </PageTransition>
  );
}
