import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import ExplainItMyWay from "@/components/universal/ExplainItMyWay";
import MultimodalNotes from "@/components/universal/MultimodalNotes";
import CognitiveLoadSensor from "@/components/universal/CognitiveLoadSensor";

/**
 * App-wide "Adapt ✦" affordance. Universal — available to every user from any
 * page. Opens a sheet exposing the Ring 2 tools (Explain It My Way, Cognitive
 * Load Sensor, Multimodal Notes).
 */
export default function AdaptSheet() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-5 z-40 flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-medium text-white shadow-[0_12px_28px_-10px_rgba(83,74,183,0.55)]"
        aria-label="Open adaptive tools"
      >
        <Sparkles size={16} /> Adapt
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end bg-ink/40"
            onClick={() => setOpen(false)}
          >
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring" as const, stiffness: 300, damping: 32 }}
              role="dialog"
              aria-modal="true"
              aria-label="Adaptive tools"
              onClick={(e) => e.stopPropagation()}
              className="flex h-full w-full max-w-md flex-col overflow-y-auto bg-paper p-5"
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="flex items-center gap-2 font-display text-xl font-medium">
                    <Sparkles size={18} className="text-accent" /> Adapt
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-ink-soft">
                    Tools for everyone — no setup, no labels.
                  </p>
                </div>
                <button onClick={() => setOpen(false)} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink-soft hover:text-ink">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-line bg-white p-5">
                  <h3 className="font-display text-lg font-medium">Explain anything your way</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                    Plain language, an analogy, a concept map, a worked example, or audio.
                  </p>
                  <div className="mt-3">
                    <ExplainItMyWay itemId="p-bst" variant="inline" />
                  </div>
                </div>

                <CognitiveLoadSensor />

                <MultimodalNotes />
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
