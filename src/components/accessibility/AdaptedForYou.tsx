import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BatteryCharging,
  FileText,
  IdCard,
  Mic,
  Sparkles,
  Waypoints,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAccessibility } from "@/context/AccessibilityContext";
import type { AccessibilityFlag } from "@/services/auth";
import TiltCard from "@/components/ui/tilt-card";

interface AdaptedFeature {
  icon: LucideIcon;
  title: string;
  body: string;
  to: string;
  /** Show when ANY of these flags is active; empty = always (for the track). */
  when: AccessibilityFlag[];
  roadmap?: boolean;
}

const FEATURES: AdaptedFeature[] = [
  {
    icon: Sparkles,
    title: "Adaptive Content Transformer",
    body: "Turn any lesson into audio, plain language, concept cards, or captioned video — on demand.",
    to: "/app/problems",
    when: ["simplified_reading", "audio_first", "captions", "micro_learning"],
  },
  {
    icon: Mic,
    title: "Accessible Mock Interview",
    body: "Practice the most placement-critical skill — captioned, typed, or fully audio. Accommodations never cost you points.",
    to: "/app/interview",
    when: ["captions", "audio_first", "sign_support", "micro_learning"],
  },
  {
    icon: BatteryCharging,
    title: "Focus & Energy-Aware Planner",
    body: "Shorter blocks, built-in breaks, reschedules around low-energy times, and celebrates small wins.",
    to: "/app/assignments",
    when: ["micro_learning"],
  },
  {
    icon: IdCard,
    title: "Accommodation Passport",
    body: "One private list of accommodations. Share per item, with consent, to auto-configure everything.",
    to: "/app/profile",
    when: [],
  },
  {
    icon: FileText,
    title: "Career matching, your way",
    body: "Roles where your strengths shine and accommodations are supported — never a cap on ambition.",
    to: "/app/readiness",
    when: [],
  },
  {
    icon: Waypoints,
    title: "AI Sign Classroom",
    body: "Sign-language avatar for lectures and live speech→caption→notes.",
    to: "/app/roadmap",
    when: ["sign_support"],
    roadmap: true,
  },
];

export default function AdaptedForYou() {
  const { isAccessibility, flags } = useAccessibility();
  if (!isAccessibility) return null;

  const visible = FEATURES.filter(
    (f) => f.when.length === 0 || f.when.some((flag) => flags.includes(flag))
  );
  if (visible.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2">
        <Sparkles size={16} className="text-accent" />
        <h2 className="font-display text-xl font-medium tracking-tight">
          Adapted for you
        </h2>
      </div>
      <p className="mt-1.5 text-sm text-ink-soft">
        Tools that exist because of how you chose to learn. Every standard
        feature is still here too.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((feature) => {
          const Icon = feature.icon;
          return (
            <TiltCard key={feature.title} max={6} className="h-full">
              <Link to={feature.to} className="flex h-full flex-col p-5">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft">
                    <Icon size={18} className="text-accent" />
                  </span>
                  {feature.roadmap ? (
                    <span className="rounded-full bg-watch-soft px-2.5 py-1 font-mono text-[10px] font-medium text-watch">
                      Coming
                    </span>
                  ) : (
                    <ArrowUpRight size={16} className="text-ink-soft" />
                  )}
                </div>
                <h3 className="mt-4 font-display text-base font-medium">
                  {feature.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                  {feature.body}
                </p>
              </Link>
            </TiltCard>
          );
        })}
      </div>
    </section>
  );
}
