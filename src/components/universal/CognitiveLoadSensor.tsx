import { AnimatePresence, motion } from "framer-motion";
import { Camera, Eye, Lock, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSensing } from "@/context/SensingContext";

/**
 * R2-2 Cognitive Load Sensor — universal, OFF by default, opt-in.
 *
 * PRIVACY: when on, the camera is analysed entirely on-device (FaceDetector);
 * nothing is recorded, stored, or uploaded, and the stream stops the instant
 * the toggle goes off. Falls back to a simulated signal where no camera/API is
 * available. The privacy line below is always visible while enabled.
 */
const LOAD_STYLE = {
  calm: { label: "Calm", color: "#1D9E75", bg: "#E1F5EE" },
  focused: { label: "Focused", color: "#534AB7", bg: "#EEEDFE" },
  strained: { label: "Looks dense", color: "#EF9F27", bg: "#FAEEDA" },
} as const;

export default function CognitiveLoadSensor({
  onWantSimpler,
}: {
  onWantSimpler?: () => void;
}) {
  const { sensorEnabled, setSensorEnabled, load, source } = useSensing();
  const style = LOAD_STYLE[load];

  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-accent">
            <Eye size={12} /> Cognitive Load Sensor
          </p>
          <h3 className="mt-1 font-display text-lg font-medium">Notice when it gets heavy</h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">
            Optional. Estimates focus on your device and offers help when things look dense.
          </p>
        </div>
        <button
          role="switch"
          aria-checked={sensorEnabled}
          aria-label="Enable cognitive load sensor"
          onClick={() => setSensorEnabled(!sensorEnabled)}
          className={cn("relative h-7 w-12 shrink-0 rounded-full transition-colors", sensorEnabled ? "bg-accent" : "bg-line")}
        >
          <motion.span layout transition={{ type: "spring" as const, stiffness: 500, damping: 32 }} className={cn("absolute top-1 h-5 w-5 rounded-full bg-white shadow", sensorEnabled ? "left-6" : "left-1")} />
        </button>
      </div>

      <AnimatePresence>
        {sensorEnabled && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="mt-4 flex items-center justify-between rounded-xl border border-line bg-paper p-3">
              <span className="flex items-center gap-2 font-mono text-xs text-ink-soft">
                <Camera size={13} />
                {source === "camera" ? "On-device camera" : "Simulated signal (no camera)"}
              </span>
              <span className="flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-medium" style={{ backgroundColor: style.bg, color: style.color }}>
                <span className="block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: style.color }} />
                {style.label}
              </span>
            </div>

            {/* Gentle, dismissible high-load prompt */}
            <AnimatePresence>
              {load === "strained" && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 rounded-xl border border-watch/30 bg-watch-soft p-3.5">
                  <p className="text-sm">This looks dense. Want it simpler, a hint, or a short break?</p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    <button onClick={onWantSimpler} className="rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-paper">Make it simpler</button>
                    <button className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium">Take a 2-min break</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="mt-3 flex items-start gap-1.5 font-mono text-[11px] leading-relaxed text-ink-soft">
              <Lock size={12} className="mt-0.5 shrink-0 text-track" />
              Processed on your device. Nothing is recorded or uploaded.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {!sensorEnabled && (
        <p className="mt-3 flex items-center gap-1.5 font-mono text-[11px] text-ink-soft">
          <ShieldCheck size={12} className="text-track" /> Off by default — you're in control.
        </p>
      )}
    </div>
  );
}
