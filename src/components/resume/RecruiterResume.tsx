import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Wand2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseResume, scoreAfterFixes, type FlagSeverity } from "@/services/atsParse";
import PageHeading from "@/components/app/PageHeading";

/**
 * FEATURE 6 — Recruiter-View Resume. Shows the profile as an ATS/recruiter
 * sees it, with auto-reject flags highlighted and one-tap fixes.
 */

const SEV: Record<FlagSeverity, { icon: typeof XCircle; cls: string; ring: string }> = {
  reject: { icon: XCircle, cls: "text-risk", ring: "border-risk/30 bg-risk-soft" },
  warn: { icon: AlertTriangle, cls: "text-watch", ring: "border-watch/30 bg-watch-soft" },
  ok: { icon: CheckCircle2, cls: "text-track", ring: "border-track/30 bg-track-soft" },
};

export default function RecruiterResume() {
  const report = useMemo(() => parseResume(), []);
  const [resolved, setResolved] = useState<Set<string>>(new Set());

  const score = useMemo(() => scoreAfterFixes(resolved), [resolved]);

  const fix = (id: string) => setResolved((prev) => new Set(prev).add(id));

  return (
    <div>
      <PageHeading
        eyebrow="Recruiter view"
        title="How an ATS reads your resume"
        summary="The same profile, parsed the way an applicant tracking system sees it — with the auto-reject flags and one-tap fixes."
        narration="Recruiter view. See how an applicant tracking system reads your resume, with flags and one-tap fixes."
      >
        <span className={cn("rounded-full px-3 py-1.5 font-mono text-xs font-medium", score >= 80 ? "bg-track-soft text-track" : score >= 60 ? "bg-watch-soft text-watch" : "bg-risk-soft text-risk")}>
          Pass likelihood {score}%
        </span>
      </PageHeading>

      <div className="space-y-3">
        {report.flags.map((flag, i) => {
          const sev = SEV[flag.severity];
          const Icon = sev.icon;
          const done = resolved.has(flag.id);
          const fixable = flag.severity !== "ok";
          return (
            <motion.div
              key={flag.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn("flex flex-wrap items-start justify-between gap-4 rounded-2xl border bg-white p-4", done ? "border-track/30 bg-track-soft/30" : "border-line")}
            >
              <div className="flex items-start gap-3">
                <span className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border", done ? "border-track/30 bg-track-soft" : sev.ring)}>
                  {done ? <CheckCircle2 size={16} className="text-track" /> : <Icon size={16} className={sev.cls} />}
                </span>
                <div>
                  <p className="font-medium">{done ? "Resolved" : flag.label}</p>
                  <p className="mt-0.5 text-sm text-ink-soft">{done ? flag.label : flag.detail}</p>
                  {!done && fixable && (
                    <p className="mt-1.5 font-mono text-[11px] text-accent">Fix: {flag.fix}</p>
                  )}
                </div>
              </div>
              {fixable && !done && (
                <button onClick={() => fix(flag.id)} className="flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-xs font-medium text-paper">
                  <Wand2 size={13} /> One-tap fix
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      <p className="mt-4 font-mono text-[11px] text-ink-soft">
        Illustrative ATS parse · a real resume upload + keyword model swaps in later.
      </p>
    </div>
  );
}
