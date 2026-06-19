import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAccessibility } from "@/context/AccessibilityContext";
import type { AccessibilityFlag } from "@/services/auth";
import { ACCESSIBILITY_OPTIONS } from "@/services/accessibility";
import {
  getShareSettings,
  setShareSettings,
  SHARE_OPTIONS,
  type ShareSettings,
} from "@/services/parentShare";
import PageHeading from "@/components/app/PageHeading";

/** Reusable pill switch matching the "Use standard experience" toggle. */
function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={cn(
        "relative h-7 w-12 shrink-0 rounded-full transition-colors",
        checked ? "bg-track" : "bg-line"
      )}
    >
      <motion.span
        layout
        transition={{ type: "spring" as const, stiffness: 500, damping: 32 }}
        className={cn(
          "absolute top-1 h-5 w-5 rounded-full bg-white shadow",
          checked ? "left-6" : "left-1"
        )}
      />
    </button>
  );
}

/**
 * Settings — edit preferences anytime. The "Use standard experience" toggle
 * disables adaptations WITHOUT deleting the saved profile. Everything applies
 * instantly through AccessibilityContext, with no reload.
 */
export default function Settings() {
  const { savedFlags, useStandard, track, setFlags, setTrack, setUseStandard } =
    useAccessibility();

  const [share, setShare] = useState<ShareSettings>(getShareSettings);

  const toggleShare = (key: keyof ShareSettings) => {
    const next = { ...share, [key]: !share[key] };
    setShare(next);
    setShareSettings(next);
  };

  const toggleFlag = (flag: AccessibilityFlag) => {
    const next = savedFlags.includes(flag)
      ? savedFlags.filter((f) => f !== flag)
      : [...savedFlags, flag];
    void setFlags(next);
    // Choosing any preference puts the student on the accessibility track;
    // clearing all preferences returns them to standard.
    void setTrack(next.length ? "accessibility" : "standard");
  };

  return (
    <div>
      <PageHeading
        eyebrow="Preferences"
        title="Settings"
        summary="Change how EduSphere is delivered. Updates apply instantly — no reload, nothing lost."
        narration="Settings. Change how EduSphere is delivered. Updates apply instantly."
      />

      <div className="max-w-2xl space-y-4">
        <div className="flex items-center justify-between rounded-2xl border border-line bg-white p-4">
          <div>
            <p className="font-medium">Use standard experience</p>
            <p className="mt-0.5 text-sm text-ink-soft">
              Pause adaptations without deleting your preferences.
            </p>
          </div>
          <button
            role="switch"
            aria-checked={useStandard}
            aria-label="Use standard experience"
            onClick={() => void setUseStandard(!useStandard)}
            className={cn("relative h-7 w-12 shrink-0 rounded-full transition-colors", useStandard ? "bg-ink" : "bg-line")}
          >
            <motion.span
              layout
              transition={{ type: "spring" as const, stiffness: 500, damping: 32 }}
              className={cn("absolute top-1 h-5 w-5 rounded-full bg-white shadow", useStandard ? "left-6" : "left-1")}
            />
          </button>
        </div>

        <div className={cn("grid gap-3 transition-opacity", useStandard && "pointer-events-none opacity-50")} role="group" aria-label="Learning preferences">
          {ACCESSIBILITY_OPTIONS.map((option) => {
            const active = savedFlags.includes(option.flag);
            return (
              <button
                key={option.flag}
                type="button"
                aria-pressed={active}
                disabled={useStandard}
                onClick={() => toggleFlag(option.flag)}
                className={cn("flex items-center gap-4 rounded-2xl border p-4 text-left transition-colors", active ? "border-accent/40 bg-accent-soft" : "border-line bg-white hover:border-ink/20")}
              >
                <span className="text-xl" aria-hidden="true">{option.icon}</span>
                <span className="flex-1">
                  <span className="block text-[15px] font-medium">{option.label}</span>
                  <span className="mt-0.5 block text-sm text-ink-soft">{option.effect}</span>
                </span>
                <span className={cn("flex h-6 w-6 items-center justify-center rounded-full border", active ? "border-accent bg-accent text-white" : "border-line bg-white")} aria-hidden="true">
                  {active && <Check size={14} />}
                </span>
              </button>
            );
          })}
        </div>

        <p className="font-mono text-[11px] leading-relaxed text-ink-soft">
          Current track: <span className="text-ink">{track}</span>. Adaptations stack — pick as many as fit.
        </p>

        {/* Consent — what a linked parent/guardian may see. You're always in control. */}
        <section className="mt-8 rounded-2xl border border-line bg-white p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-track" />
            <h2 className="font-display text-lg font-medium">Share with parent / guardian</h2>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            You choose what a parent or guardian can see. They only ever get a supportive
            summary — never your private messages, your exact grades on every test, or any
            personal content. Turn anything off anytime; it disappears from their view instantly.
          </p>

          <div className="mt-4 space-y-3" role="group" aria-label="What to share with a guardian">
            {SHARE_OPTIONS.map((option) => (
              <div
                key={option.key}
                className="flex items-center justify-between gap-4 rounded-xl border border-line bg-paper p-4"
              >
                <div>
                  <p className="text-[15px] font-medium">{option.label}</p>
                  <p className="mt-0.5 text-sm text-ink-soft">{option.detail}</p>
                </div>
                <Switch
                  checked={share[option.key]}
                  onChange={() => toggleShare(option.key)}
                  label={`Share ${option.label.toLowerCase()} with a guardian`}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
