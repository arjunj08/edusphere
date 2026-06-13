import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, Sparkles, Users, X } from "lucide-react";
import { INTERVENTION_DRAFT } from "@/services/mockData";

const ICONS = [Sparkles, CalendarCheck, Users];

interface InterventionModalProps {
  open: boolean;
  studentName: string;
  onClose: () => void;
  onApprove: () => void;
}

export default function InterventionModal({
  open,
  studentName,
  onClose,
  onApprove,
}: InterventionModalProps) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-5"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            role="dialog"
            aria-modal="true"
            aria-label={`AI-drafted intervention for ${studentName}`}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-line bg-white p-6 md:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                  ✦ AI-drafted intervention
                </p>
                <h3 className="mt-2 font-display text-2xl font-medium tracking-tight">
                  {studentName}
                </h3>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink-soft hover:text-ink"
              >
                <X size={16} />
              </button>
            </div>

            <ul className="mt-5 space-y-3">
              {INTERVENTION_DRAFT.plan.map((item, i) => {
                const Icon = ICONS[i % ICONS.length];
                return (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-xl border border-line bg-paper p-3.5 text-sm leading-relaxed"
                  >
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft">
                      <Icon size={14} className="text-accent" />
                    </span>
                    {item}
                  </li>
                );
              })}
            </ul>

            <p className="mt-4 font-mono text-[11px] leading-relaxed text-ink-soft">
              {INTERVENTION_DRAFT.note}
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink-soft hover:text-ink"
              >
                Not now
              </button>
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                autoFocus
                onClick={onApprove}
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white"
              >
                Approve &amp; send
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
