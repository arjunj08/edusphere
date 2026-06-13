import { Link } from "react-router-dom";
import { ArrowUpRight, BadgeCheck, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAccessibility } from "@/context/AccessibilityContext";
import { READINESS_ROLES, STUDENT } from "@/services/mockData";
import PageHeading from "@/components/app/PageHeading";
import StatBar from "@/components/ui/stat-bar";

const CATEGORIES = [
  { label: "Technical skills", pct: 76, zone: "amber" as const },
  { label: "Interview performance", pct: 64, zone: "amber" as const },
  { label: "Portfolio & projects", pct: 71, zone: "amber" as const },
  { label: "Resume & profile", pct: 88, zone: "green" as const },
  { label: "Communication", pct: 58, zone: "red" as const },
];

const ACTIONS = [
  { text: "Do 2 system-design mocks this week — your weakest category.", to: "/app/interview", label: "Mock Interview" },
  { text: "Clear the ATS flags on your resume to lift recruiter pass-rate.", to: "/resume/recruiter-view", label: "Recruiter View" },
  { text: "Compare yourself to a target company and follow the closing plan.", to: "/jobs/gap", label: "Reverse Match" },
];

/**
 * FEATURE 4 — Accessibility-Aware Career Matching.
 * Recommendations account for the accessibility profile to surface roles where
 * strengths shine and accommodations are supported — WITHOUT capping ambition.
 */
export default function JobReadiness() {
  const { isAccessibility } = useAccessibility();

  return (
    <div>
      <PageHeading
        eyebrow="Where you're headed"
        title="Job Readiness"
        summary="Roles matched to your strengths, with what to close before applying."
        narration="Job Readiness. Roles matched to your strengths, with the gaps to close before you apply."
      />

      {isAccessibility && (
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-accent/20 bg-accent-soft p-4">
          <span className="text-lg" aria-hidden="true">✦</span>
          <p className="text-sm leading-relaxed text-ink-soft">
            <span className="font-medium text-accent">Recommendations account for your profile, never limited by it.</span>{" "}
            We surface roles where your strengths lead and accommodations are well supported — and flag
            employers with strong accessibility records.
          </p>
        </div>
      )}

      {/* Readiness by category + recommended actions */}
      <div className="grid gap-5 lg:grid-cols-3">
        <section className="rounded-2xl border border-line bg-white p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-medium">Readiness by category</h2>
            <span className="flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1.5 font-mono text-xs font-medium text-accent">
              <Target size={12} /> {STUDENT.target}
            </span>
          </div>
          <div className="mt-5 space-y-4">
            {CATEGORIES.map((c, i) => (
              <StatBar key={c.label} label={c.label} pct={c.pct} zone={c.zone} delay={0.1 + i * 0.08} />
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-display text-lg font-medium">Recommended actions</h2>
          <ul className="mt-4 space-y-3">
            {ACTIONS.map((a, i) => (
              <li key={i} className="rounded-xl border border-line bg-paper p-3.5">
                <p className="text-sm leading-relaxed">{a.text}</p>
                <Link to={a.to} className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] font-medium text-accent">
                  {a.label} <ArrowUpRight size={12} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Target-role matches */}
      <h2 className="mb-3 mt-8 font-display text-lg font-medium">Roles matched to you</h2>
      <div className="space-y-3">
        {READINESS_ROLES.map((role) => (
          <article key={role.role} className="rounded-2xl border border-line bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display text-lg font-medium">{role.role}</h3>
              <span className={cn("rounded-full px-3 py-1.5 font-mono text-xs font-medium", role.match >= 80 ? "bg-track-soft text-track" : "bg-watch-soft text-watch")}>
                {role.match}% match
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{role.note}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Link to="/jobs/gap" className="inline-flex items-center gap-1 font-mono text-[11px] font-medium text-accent">
                See the gap to a company hiring this <ArrowUpRight size={12} />
              </Link>
              {isAccessibility && role.inclusive && (
                <span className="flex items-center gap-1.5 font-mono text-[11px] text-track">
                  <BadgeCheck size={13} /> Strong accessibility records
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
