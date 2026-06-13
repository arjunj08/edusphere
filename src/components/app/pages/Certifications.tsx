import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Award, CheckCircle2, Clock, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { CERTIFICATIONS, type Certification } from "@/services/mockData";
import PageHeading from "@/components/app/PageHeading";
import CertificateModal from "@/components/app/CertificateModal";

export default function Certifications() {
  const [active, setActive] = useState<Certification | null>(null);

  const stats = useMemo(() => {
    const earned = CERTIFICATIONS.filter((c) => c.status === "earned");
    const inProgress = CERTIFICATIONS.filter((c) => c.status === "in_progress");
    const hours = earned.reduce((s, c) => s + c.hours, 0);
    const skills = new Set(earned.flatMap((c) => c.skills));
    return { earned: earned.length, inProgress: inProgress.length, hours, skills: skills.size };
  }, []);

  return (
    <div>
      <PageHeading
        eyebrow="Proof of work"
        title="Certifications"
        summary="Earn verifiable certificates as you complete tracks. Open one to view the credential, modules, and skills."
        narration="Certifications. Open a certificate to view the credential, its modules, and the skills it covers."
      />

      {/* Stats strip */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Earned", value: stats.earned, color: "text-track" },
          { label: "In progress", value: stats.inProgress, color: "text-watch" },
          { label: "Hours certified", value: stats.hours, color: "text-ink" },
          { label: "Skills covered", value: stats.skills, color: "text-accent" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-white p-4">
            <p className={cn("font-display text-3xl font-medium", s.color)}>{s.value}</p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-ink-soft">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {CERTIFICATIONS.map((cert) => {
          const done = cert.modules.filter((m) => m.done).length;
          const pct = Math.round((done / cert.modules.length) * 100);
          return (
            <button
              key={cert.id}
              onClick={() => setActive(cert)}
              className="flex flex-col rounded-2xl border border-line bg-white p-5 text-left transition-shadow hover:shadow-[0_12px_32px_-16px_rgba(16,27,45,0.18)]"
            >
              <div className="flex items-start justify-between">
                <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl", cert.status === "earned" ? "bg-track-soft" : cert.status === "in_progress" ? "bg-watch-soft" : "bg-[#F1EFE8]")}>
                  {cert.status === "earned" ? <CheckCircle2 size={20} className="text-track" /> : cert.status === "locked" ? <Lock size={18} className="text-ink-soft" /> : <Award size={20} className="text-watch" />}
                </span>
                <span className={cn("rounded-full px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider", cert.status === "earned" ? "bg-track-soft text-track" : cert.status === "in_progress" ? "bg-watch-soft text-watch" : "bg-[#F1EFE8] text-ink-soft")}>
                  {cert.status === "in_progress" ? "In progress" : cert.status}
                </span>
              </div>
              <h2 className="mt-4 font-display text-lg font-medium">{cert.name}</h2>
              <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[11px] text-ink-soft">
                <Clock size={11} /> {cert.hours} hrs · {cert.status === "earned" ? `Issued ${cert.date}` : cert.date}
              </p>

              {cert.status === "in_progress" && (
                <div className="mt-3">
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#F1EFE8]">
                    <div className="h-full rounded-full bg-watch" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-1 font-mono text-[10px] text-ink-soft">{done}/{cert.modules.length} modules</p>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-1.5">
                {cert.skills.slice(0, 3).map((s) => (
                  <span key={s} className="rounded-full border border-line bg-paper px-2 py-0.5 font-mono text-[10px] text-ink-soft">{s}</span>
                ))}
                {cert.skills.length > 3 && <span className="font-mono text-[10px] text-ink-soft">+{cert.skills.length - 3}</span>}
              </div>

              <span className="mt-4 font-mono text-[11px] font-medium text-accent">
                {cert.status === "earned" ? "View credential →" : cert.status === "in_progress" ? "Continue →" : "View requirement →"}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {active && <CertificateModal cert={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </div>
  );
}
