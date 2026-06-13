import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Menu, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useAccessibility } from "@/context/AccessibilityContext";
import { useProgress } from "@/context/ProgressContext";
import { EDGE_FEATURES, FEATURES } from "@/services/features";
import MentorDock from "@/components/app/MentorDock";
import ReadinessCountdown from "@/components/universal/ReadinessCountdown";
import AdaptSheet from "@/components/universal/AdaptSheet";
import { BreakPrompt, CognitiveCamToggle } from "@/components/universal/CognitiveCam";
import ReadingSupport from "@/components/accessibility/ReadingSupport";
import FocusSession from "@/components/accessibility/FocusSession";
import VoiceNav from "@/components/accessibility/VoiceNav";

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  const link = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
      isActive ? "bg-accent-soft font-medium text-accent" : "text-ink-soft hover:bg-paper hover:text-ink"
    );

  return (
    <nav className="space-y-0.5">
      {FEATURES.map((feature) => {
        const Icon = feature.icon;
        return (
          <NavLink key={feature.to} to={feature.to} onClick={onNavigate} className={link}>
            <Icon size={17} />
            {feature.label}
          </NavLink>
        );
      })}

      <p className="px-3 pb-1 pt-4 font-mono text-[10px] uppercase tracking-wider text-ink-soft">
        Placement edge
      </p>
      {EDGE_FEATURES.map((feature) => {
        const Icon = feature.icon;
        return (
          <NavLink key={feature.to} to={feature.to} onClick={onNavigate} className={link}>
            <Icon size={17} />
            {feature.label}
          </NavLink>
        );
      })}
    </nav>
  );
}

export default function AppShell() {
  const { profile, signOut } = useAuth();
  const { assistiveNav, isAccessibility, isSimplified, isMicro, isAudioFirst } = useAccessibility();
  const { points } = useProgress();
  const navigate = useNavigate();
  const [drawer, setDrawer] = useState(false);

  return (
    <div className={cn("min-h-screen bg-paper", assistiveNav && "assistive-nav")}>
      {assistiveNav && (
        <a
          href="#main"
          className="sr-only z-[60] rounded-full bg-ink px-4 py-2 text-sm text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
      )}

      {/* Top bar */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-paper/85 px-4 backdrop-blur-md md:px-6">
        <div className="flex items-center gap-3">
          <button
            className="rounded-lg p-1.5 text-ink-soft hover:text-ink lg:hidden"
            onClick={() => setDrawer(true)}
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
          <Link to="/" className="font-display text-lg font-semibold tracking-tight">
            EduSphere<span className="text-track">.</span>AI
          </Link>
          {isAccessibility && (
            <span className="hidden rounded-full bg-accent-soft px-2.5 py-1 font-mono text-[10px] font-medium text-accent sm:inline">
              Accessibility track
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <CognitiveCamToggle />
          <div className="hidden md:block">
            <ReadinessCountdown />
          </div>
          <motion.span
            key={points}
            initial={{ scale: 1.18 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" as const, stiffness: 360, damping: 18 }}
            className="flex items-center gap-1.5 rounded-full bg-watch-soft px-3 py-1.5 font-mono text-xs font-medium text-watch"
            title="Points earned"
          >
            <Zap size={13} />
            {points} pts
          </motion.span>
          <button
            onClick={async () => {
              await signOut();
              navigate("/auth");
            }}
            className="flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        {/* Desktop sidebar */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 overflow-y-auto border-r border-line px-3 py-5 lg:block">
          <NavItems />
          <p className="mt-6 px-3 font-mono text-[10px] leading-relaxed text-ink-soft">
            {profile?.name} · all 14 features available on every track.
          </p>
        </aside>

        {/* Mobile drawer */}
        <AnimatePresence>
          {drawer && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-ink/30 lg:hidden"
                onClick={() => setDrawer(false)}
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring" as const, stiffness: 300, damping: 32 }}
                className="fixed inset-y-0 left-0 z-50 w-64 overflow-y-auto bg-paper px-3 py-5 lg:hidden"
              >
                <div className="mb-4 flex items-center justify-between px-3">
                  <span className="font-display font-semibold">Menu</span>
                  <button onClick={() => setDrawer(false)} aria-label="Close navigation">
                    <X size={18} />
                  </button>
                </div>
                <NavItems onNavigate={() => setDrawer(false)} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Page content */}
        <main id="main" className="min-w-0 flex-1 px-5 py-7 md:px-8 md:py-9">
          <Outlet />
        </main>
      </div>

      <MentorDock />

      {/* Ring 2 — available to every user, no preference needed */}
      <AdaptSheet />
      <BreakPrompt />

      {/* Ring 3 — mount only when the matching onboarding flag is set; they stack */}
      {isSimplified && <ReadingSupport />}
      {isMicro && <FocusSession />}
      {(isAudioFirst || assistiveNav) && <VoiceNav />}
    </div>
  );
}
