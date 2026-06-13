import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { AccessibilityFlag } from "@/services/auth";
import { ACCESSIBILITY_OPTIONS } from "@/services/accessibility";
import TiltCard from "@/components/ui/tilt-card";
import PageTransition from "@/components/app/PageTransition";

export default function Options() {
  const { updateProfile } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<AccessibilityFlag[]>([]);

  const toggle = (flag: AccessibilityFlag) =>
    setSelected((prev) =>
      prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag]
    );

  const finishStandard = async () => {
    await updateProfile({
      track: "standard",
      accessibilityProfile: [],
      onboarded: true,
    });
    navigate("/app/dashboard");
  };

  const finishAccessibility = async () => {
    await updateProfile({
      track: selected.length ? "accessibility" : "standard",
      accessibilityProfile: selected,
      onboarded: true,
    });
    navigate("/app/dashboard");
  };

  return (
    <PageTransition className="bg-paper">
      <main className="mx-auto max-w-3xl px-5 py-16">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
          Step 2 · learning preferences
        </p>
        <h1 className="mt-4 font-display text-3xl font-medium tracking-tight md:text-4xl">
          Pick what fits — combine as many as you like.
        </h1>
        <p className="mt-4 leading-relaxed text-ink-soft">
          These stack: choose captions and short bursts and EduSphere applies
          both everywhere. Private to you and your counselor — never shown to
          other students or in leaderboards.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {ACCESSIBILITY_OPTIONS.map((option) => {
            const active = selected.includes(option.flag);
            return (
              <TiltCard
                key={option.flag}
                as="button"
                max={6}
                selected={active}
                ariaPressed={active}
                ariaLabel={option.label}
                onClick={() => toggle(option.flag)}
                className="flex h-full flex-col p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-2xl" aria-hidden="true">
                    {option.icon}
                  </span>
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                      active
                        ? "border-accent bg-accent text-white"
                        : "border-line bg-white"
                    }`}
                    aria-hidden="true"
                  >
                    {active && <Check size={14} />}
                  </span>
                </div>
                <h2 className="mt-3 text-[15px] font-medium">{option.label}</h2>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-soft">
                  {option.effect}
                </p>
              </TiltCard>
            );
          })}
        </div>

        <div className="mt-9 flex items-center justify-between">
          <button
            onClick={finishStandard}
            className="text-sm text-ink-soft underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            Skip — use standard
          </button>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={finishAccessibility}
            className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper"
          >
            Continue to EduSphere
          </motion.button>
        </div>
      </main>
    </PageTransition>
  );
}
