import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Lightbulb, ListOrdered, Network, Sparkles, Volume2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAdaptation, type AdaptMode, type Adaptation } from "@/services/adaptContent";
import { speak } from "@/lib/speech";

const EASE = [0.22, 1, 0.36, 1] as const;

const MODES: { id: AdaptMode; icon: typeof BookOpen; label: string }[] = [
  { id: "plain", icon: BookOpen, label: "Plain language" },
  { id: "analogy", icon: Lightbulb, label: "Analogy" },
  { id: "map", icon: Network, label: "Concept map" },
  { id: "worked", icon: ListOrdered, label: "Worked example" },
  { id: "audio", icon: Volume2, label: "Audio" },
];

/**
 * R2-1 "Explain It My Way" — universal (every user). A chip on any content card
 * opens a panel that regenerates the SAME concept in five forms.
 */
export default function ExplainItMyWay({
  itemId,
  variant = "chip",
}: {
  itemId: string;
  variant?: "chip" | "inline";
}) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AdaptMode>("plain");
  const [data, setData] = useState<Adaptation | null>(null);

  useEffect(() => {
    if (open && !data) getAdaptation(itemId).then(setData);
  }, [open, data, itemId]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full font-mono text-[11px] font-medium transition-colors",
          variant === "chip"
            ? "bg-accent-soft px-2.5 py-1 text-accent hover:bg-accent/15"
            : "border border-line px-3 py-1.5 text-ink-soft hover:text-ink"
        )}
      >
        <Sparkles size={12} /> Explain it my way
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.25, ease: EASE }}
              role="dialog"
              aria-modal="true"
              aria-label="Explain it my way"
              onClick={(e) => e.stopPropagation()}
              className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-line bg-white sm:rounded-2xl"
            >
              <div className="flex items-center justify-between border-b border-line p-4">
                <p className="flex items-center gap-2 font-display text-lg font-medium">
                  <Sparkles size={16} className="text-accent" /> Explain it my way
                </p>
                <button onClick={() => setOpen(false)} aria-label="Close" className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-soft hover:text-ink">
                  <X size={15} />
                </button>
              </div>

              <div className="flex flex-wrap gap-1 border-b border-line p-3">
                {MODES.map((m) => {
                  const Icon = m.icon;
                  const active = mode === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id)}
                      aria-pressed={active}
                      className={cn(
                        "relative flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-xs transition-colors",
                        active ? "text-ink" : "text-ink-soft hover:text-ink"
                      )}
                    >
                      {active && (
                        <motion.span layoutId="explain-pill" className="absolute inset-0 rounded-full border border-line bg-paper" transition={{ type: "spring" as const, stiffness: 300, damping: 28 }} />
                      )}
                      <span className="relative flex items-center gap-1.5">
                        <Icon size={13} /> {m.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="min-h-[180px] overflow-y-auto p-5">
                {!data ? (
                  <p className="font-mono text-xs text-ink-soft">Regenerating…</p>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div key={mode} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25, ease: EASE }}>
                      {mode === "plain" && <p className="text-[15px] leading-[1.85]">{data.plain}</p>}
                      {mode === "analogy" && <p className="text-[15px] leading-[1.85]">{data.analogy}</p>}
                      {mode === "map" && (
                        <div>
                          <p className="font-display text-base font-medium">{data.map.root}</p>
                          <div className="mt-3 space-y-2">
                            {data.map.nodes.map((n) => (
                              <div key={n.label} className="rounded-xl border border-line bg-paper p-3">
                                <p className="font-mono text-[11px] uppercase tracking-wider text-accent">{n.label}</p>
                                <p className="mt-1 text-sm">{n.children?.join(" · ")}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {mode === "worked" && (
                        <ol className="space-y-2">
                          {data.worked.steps.map((s, i) => (
                            <li key={i} className="flex gap-3 text-sm leading-relaxed">
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft font-mono text-xs text-accent">{i + 1}</span>
                              {s}
                            </li>
                          ))}
                        </ol>
                      )}
                      {mode === "audio" && (
                        <div className="flex flex-col items-center gap-4 py-4">
                          <button onClick={() => speak(data.audioScript)} className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper">
                            <Volume2 size={15} /> Play narration
                          </button>
                          <p className="text-center text-sm leading-relaxed text-ink-soft">{data.audioScript}</p>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
