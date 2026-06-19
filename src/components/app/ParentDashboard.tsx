/**
 * Parent / Guardian dashboard — consent-based and reassuring, NOT surveillance.
 *
 * A guardian sees PROGRESS and WELLBEING at a glance, always framed supportively.
 * It is strictly read-only and reuses the student's existing shared data. The
 * student controls — in their own Settings — which of the three lanes (progress,
 * wellbeing, milestones) a guardian may see; this view honors those toggles and
 * shows a gentle "paused" card for anything turned off. It NEVER renders private
 * messages, exact per-test grades, accessibility preferences, or personal content.
 */
import { useMemo } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import AppHeader from "@/components/app/AppHeader";
import PageTransition from "@/components/app/PageTransition";
import { buildSnapshot } from "@/services/parent";
import { getShareSettings } from "@/services/parentShare";
import type { Zone } from "@/services/mockData";
import {
  HowToHelp,
  Milestones,
  PausedCard,
  PrivacyBar,
  ProgressGlance,
  StatusBanner,
  WeekSummary,
  WellbeingSignal,
} from "@/components/app/parent/cards";

const VALID_ZONES: Zone[] = ["green", "amber", "red"];

/** Gentle stagger for the cards as they fade up. */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export default function ParentDashboard() {
  const [params] = useSearchParams();

  // Optional ?zone=green|amber|red lets the demo show how the supportive language
  // tracks the risk signal. Defaults to the student's actual zone.
  const override = params.get("zone") as Zone | null;
  const zone = override && VALID_ZONES.includes(override) ? override : undefined;

  const snapshot = useMemo(() => buildSnapshot(zone), [zone]);
  const share = useMemo(() => getShareSettings(), []);

  return (
    <PageTransition className="min-h-screen bg-paper">
      <AppHeader />

      <main className="mx-auto max-w-5xl px-5 py-8 md:py-10">
        <div className="mb-6">
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
            Parent / Guardian view · illustrative demo data
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            A calm, supportive snapshot of {snapshot.childName}'s week.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-5"
        >
          {/* 1 — Overall status (always shared) */}
          <StatusBanner snapshot={snapshot} />

          {/* 2 — Progress at a glance (consent: progress) */}
          {share.progress ? (
            <ProgressGlance progress={snapshot.progress} />
          ) : (
            <PausedCard title="Progress at a glance" childName={snapshot.childName} />
          )}

          <div className="grid gap-5 lg:grid-cols-2">
            {/* 3 — This week (consent: progress) */}
            {share.progress ? (
              <WeekSummary lines={snapshot.weekSummary} />
            ) : (
              <PausedCard title="This week" childName={snapshot.childName} />
            )}

            {/* 4 — Wellbeing signal (consent: wellbeing) */}
            {share.wellbeing ? (
              <WellbeingSignal wellbeing={snapshot.wellbeing} />
            ) : (
              <PausedCard title="Wellbeing signal" childName={snapshot.childName} />
            )}
          </div>

          {/* 5 — Milestones & wins (consent: milestones) */}
          {share.milestones ? (
            <Milestones items={snapshot.milestones} />
          ) : (
            <PausedCard title="Milestones & wins" childName={snapshot.childName} />
          )}

          {/* 6 — How you can help (always shared) */}
          <HowToHelp items={snapshot.help} />

          {/* Privacy bar — always visible */}
          <PrivacyBar childName={snapshot.childName} />
        </motion.div>
      </main>
    </PageTransition>
  );
}
