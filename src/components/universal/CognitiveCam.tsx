import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, CameraOff, Coffee, Lock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSensing } from "@/context/SensingContext";

/**
 * Cognitive Cam — a prominent, app-wide toggle (every student) that turns on
 * the on-device cognitive load sensor and surfaces a "take a break" prompt when
 * load runs high.
 *
 * PRIVACY: when on, the camera is analysed entirely in-browser (with a
 * simulated fallback where no camera/API exists). Nothing is recorded, stored,
 * or uploaded, and the stream stops the instant it's turned off.
 */

const LOAD_STYLE = {
  calm: { label: "Calm", color: "#1D9E75" },
  focused: { label: "Focused", color: "#534AB7" },
  strained: { label: "High load", color: "#EF9F27" },
} as const;

/** Header pill: "📹 Cognitive Cam: On/Off" with a live state dot. */
export function CognitiveCamToggle() {
  const { sensorEnabled, setSensorEnabled, load, source } = useSensing();
  const style = LOAD_STYLE[load];

  return (
    <button
      onClick={() => setSensorEnabled(!sensorEnabled)}
      aria-pressed={sensorEnabled}
      title={
        sensorEnabled
          ? `On-device${source === "simulated" ? " (simulated)" : ""} · nothing is recorded or uploaded`
          : "Turn on on-device focus sensing"
      }
      className={cn(
        "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        sensorEnabled ? "border-accent/40 bg-accent-soft text-accent" : "border-line bg-white text-ink-soft hover:text-ink"
      )}
    >
      {sensorEnabled ? <Camera size={13} /> : <CameraOff size={13} />}
      <span className="hidden font-mono sm:inline">📹 Cognitive Cam: {sensorEnabled ? "On" : "Off"}</span>
      <span className="font-mono sm:hidden">📹 {sensorEnabled ? "On" : "Off"}</span>
      {sensorEnabled && (
        <span className="flex items-center gap-1">
          <span className="block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: style.color }} />
          <span className="hidden font-mono lg:inline" style={{ color: style.color }}>{style.label}</span>
        </span>
      )}
    </button>
  );
}

/** Overlay that prompts a break when the sensor reports sustained high load. */
export function BreakPrompt() {
  const { sensorEnabled, load } = useSensing();
  const [dismissedAt, setDismissedAt] = useState(0);
  const [breakLeft, setBreakLeft] = useState<number | null>(null);
  const breakTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Show when strained and not within the 90s dismiss cooldown.
  const show = sensorEnabled && load === "strained" && Date.now() - dismissedAt > 90000 && breakLeft === null;

  const startBreak = () => {
    setBreakLeft(120);
    breakTimer.current = setInterval(() => {
      setBreakLeft((s) => {
        if (s === null) return null;
        if (s <= 1) {
          if (breakTimer.current) clearInterval(breakTimer.current);
          setDismissedAt(Date.now());
          return null;
        }
        return s - 1;
      });
    }, 1000);
  };

  useEffect(() => () => { if (breakTimer.current) clearInterval(breakTimer.current); }, []);

  const endBreak = () => {
    if (breakTimer.current) clearInterval(breakTimer.current);
    setBreakLeft(null);
    setDismissedAt(Date.now());
  };

  return (
    <AnimatePresence>
      {/* Break-in-progress overlay */}
      {breakLeft !== null && (
        <motion.div
          key="break"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/55 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            className="w-full max-w-sm rounded-2xl border border-line bg-white p-8 text-center"
          >
            <Coffee size={28} className="mx-auto text-accent" />
            <h3 className="mt-3 font-display text-2xl font-medium">Take a breath</h3>
            <p className="mt-1 text-sm text-ink-soft">Look away from the screen. We'll pick back up in a moment.</p>
            <p className="mt-5 font-display text-5xl font-medium tabular-nums">
              {Math.floor(breakLeft / 60)}:{(breakLeft % 60).toString().padStart(2, "0")}
            </p>
            <button onClick={endBreak} className="mt-6 rounded-full border border-line px-5 py-2.5 text-sm font-medium hover:bg-paper">
              I'm ready — resume
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* High-load nudge */}
      {show && (
        <motion.div
          key="nudge"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ type: "spring" as const, stiffness: 260, damping: 24 }}
          role="alert"
          className="fixed bottom-5 left-1/2 z-[55] w-[min(26rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border border-watch/30 bg-white p-4 shadow-[0_24px_60px_-24px_rgba(16,27,45,0.4)]"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-watch-soft">
              <Coffee size={18} className="text-watch" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium">Your cognitive load looks high.</p>
              <p className="mt-0.5 text-sm text-ink-soft">
                You've been focused a while — a short break now helps you retain more.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={startBreak} className="rounded-full bg-ink px-4 py-2 text-xs font-medium text-paper">
                  Take a 2-min break
                </button>
                <button onClick={() => setDismissedAt(Date.now())} className="rounded-full border border-line px-4 py-2 text-xs font-medium hover:bg-paper">
                  I'm fine
                </button>
              </div>
            </div>
            <button onClick={() => setDismissedAt(Date.now())} aria-label="Dismiss" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-soft hover:text-ink">
              <X size={14} />
            </button>
          </div>
          <p className="mt-3 flex items-center gap-1.5 border-t border-line pt-2.5 font-mono text-[10px] text-ink-soft">
            <Lock size={11} className="text-track" /> Sensed on your device. Nothing is recorded or uploaded.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
