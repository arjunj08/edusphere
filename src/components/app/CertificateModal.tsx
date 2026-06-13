import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Award, CheckCircle2, Circle, Download, Linkedin, Lock, ShieldCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import type { Certification } from "@/services/mockData";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Opens a certification: a shareable credential when earned, a module
 *  checklist when in progress, an unlock requirement when locked. */
export default function CertificateModal({
  cert,
  onClose,
}: {
  cert: Certification;
  onClose: () => void;
}) {
  const { profile } = useAuth();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const done = cert.modules.filter((m) => m.done).length;
  const pct = Math.round((done / cert.modules.length) * 100);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.25, ease: EASE }}
          role="dialog"
          aria-modal="true"
          aria-label={`Certificate: ${cert.name}`}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-line bg-white"
        >
          {/* Credential header */}
          <div
            className={cn(
              "relative p-6",
              cert.status === "earned" ? "bg-track-soft" : cert.status === "in_progress" ? "bg-watch-soft" : "bg-[#F1EFE8]"
            )}
          >
            <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-ink-soft hover:text-ink">
              <X size={15} />
            </button>
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white">
              {cert.status === "earned" ? <Award size={24} className="text-track" /> : cert.status === "locked" ? <Lock size={22} className="text-ink-soft" /> : <Award size={24} className="text-watch" />}
            </span>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-ink-soft">{cert.issuer}</p>
            <h2 className="mt-1 font-display text-2xl font-medium tracking-tight">{cert.name}</h2>
            <p className="mt-1 text-sm text-ink-soft">
              {cert.status === "earned" ? `Issued ${cert.date}` : cert.status === "in_progress" ? `${pct}% complete` : cert.date} · {cert.hours} hours
            </p>
          </div>

          <div className="p-6">
            {/* Earned — credential details */}
            {cert.status === "earned" && (
              <>
                <div className="rounded-xl border border-line bg-paper p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">Credential holder</span>
                    <ShieldCheck size={14} className="text-track" />
                  </div>
                  <p className="mt-1 font-display text-lg font-medium">{profile?.name ?? "Student"}</p>
                  <p className="mt-2 font-mono text-[11px] text-ink-soft">
                    Credential ID · <span className="text-ink">{cert.credentialId}</span>
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper">
                    <Download size={14} /> Download PDF
                  </button>
                  <button className="flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium hover:bg-paper">
                    <Linkedin size={14} /> Add to LinkedIn
                  </button>
                </div>
              </>
            )}

            {/* In progress / locked — module checklist */}
            {cert.status !== "earned" && (
              <>
                {cert.status === "locked" && cert.unlockNote && (
                  <p className="mb-4 flex items-start gap-2 rounded-xl border border-line bg-paper p-3.5 text-sm text-ink-soft">
                    <Lock size={15} className="mt-0.5 shrink-0" /> {cert.unlockNote}
                  </p>
                )}
                {cert.status === "in_progress" && (
                  <div className="mb-4">
                    <div className="h-2 overflow-hidden rounded-full bg-[#F1EFE8]">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7, ease: EASE }} className="h-full rounded-full bg-watch" />
                    </div>
                  </div>
                )}
                <p className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">Modules</p>
                <ul className="mt-2 space-y-1.5">
                  {cert.modules.map((m) => (
                    <li key={m.name} className="flex items-center gap-2.5 text-sm">
                      {m.done ? <CheckCircle2 size={16} className="text-track" /> : <Circle size={16} className="text-line" />}
                      <span className={cn(m.done && "text-ink-soft line-through")}>{m.name}</span>
                    </li>
                  ))}
                </ul>
                {cert.status === "in_progress" && (
                  <button className="mt-5 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper">Continue course</button>
                )}
              </>
            )}

            {/* Skills covered — for all states */}
            <div className="mt-5 border-t border-line pt-4">
              <p className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">Skills covered</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {cert.skills.map((s) => (
                  <span key={s} className="rounded-full border border-line bg-paper px-2.5 py-1 font-mono text-[11px] text-ink-soft">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
