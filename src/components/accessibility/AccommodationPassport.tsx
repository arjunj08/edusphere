import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import type { Accommodation } from "@/services/auth";

/**
 * FEATURE 5 — Accommodation Passport.
 * Student-OWNED list of accommodations. Nothing is shared by default; each
 * item must be explicitly opted in (consent). Once shared, it can
 * auto-configure deadlines, exam settings, and content format everywhere.
 *
 * PRIVACY: never surfaced in Leaderboard, Forum, Study Groups, or any
 * faculty/shared view except the specific items the student opts to share.
 */
export default function AccommodationPassport() {
  const { profile, updateProfile } = useAuth();
  const [items, setItems] = useState<Accommodation[]>(profile?.passport ?? []);

  useEffect(() => {
    if (profile?.passport) setItems(profile.passport);
  }, [profile?.passport]);

  const toggleShare = (id: string) => {
    const next = items.map((a) =>
      a.id === id ? { ...a, shared: !a.shared } : a
    );
    setItems(next);
    void updateProfile({ passport: next });
  };

  const sharedCount = items.filter((a) => a.shared).length;

  return (
    <div className="rounded-2xl border border-line bg-white p-5 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-accent">
            ✦ Accommodation Passport
          </p>
          <h3 className="mt-1 font-display text-lg font-medium">
            Yours to control
          </h3>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-paper px-3 py-1.5 font-mono text-[11px] text-ink-soft">
          <Lock size={12} />
          {sharedCount === 0 ? "Nothing shared" : `${sharedCount} shared`}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        Set your accommodations once. Share an item only when you choose — then
        EduSphere auto-configures deadlines, exam settings, and content format
        for it. Off by default.
      </p>

      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li
            key={item.id}
            className={cn(
              "flex items-center justify-between gap-4 rounded-xl border p-4 transition-colors",
              item.shared ? "border-track/30 bg-track-soft/40" : "border-line bg-paper"
            )}
          >
            <div>
              <p className="text-[15px] font-medium">{item.label}</p>
              <p className="mt-0.5 text-sm text-ink-soft">{item.detail}</p>
            </div>
            <button
              role="switch"
              aria-checked={item.shared}
              aria-label={`Share "${item.label}" to auto-configure the platform`}
              onClick={() => toggleShare(item.id)}
              className={cn(
                "relative h-7 w-12 shrink-0 rounded-full transition-colors",
                item.shared ? "bg-track" : "bg-line"
              )}
            >
              <motion.span
                layout
                transition={{ type: "spring" as const, stiffness: 500, damping: 32 }}
                className={cn(
                  "absolute top-1 h-5 w-5 rounded-full bg-white shadow",
                  item.shared ? "left-6" : "left-1"
                )}
              />
            </button>
          </li>
        ))}
      </ul>

      <p className="mt-4 flex items-start gap-2 border-t border-line pt-4 font-mono text-[11px] leading-relaxed text-ink-soft">
        <ShieldCheck size={14} className="mt-0.5 shrink-0 text-track" />
        Consent is per item and reversible. Faculty and other students never
        see this list — only the specific settings you choose to apply.
      </p>
    </div>
  );
}
