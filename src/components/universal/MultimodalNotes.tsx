import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Layers, Network, Play, Sparkles } from "lucide-react";
import { generateNotes, type GeneratedNotes } from "@/services/notes";
import { speak } from "@/lib/speech";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * R2-5 Multimodal Notes Generator — universal. One action produces four synced
 * outputs from the same source: summary, audio narration, mind-map, flashcards.
 */
export default function MultimodalNotes({ sourceId = "sample" }: { sourceId?: string }) {
  const [notes, setNotes] = useState<GeneratedNotes | null>(null);
  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const generate = async () => {
    setLoading(true);
    setNotes(await generateNotes(sourceId));
    setLoading(false);
  };

  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-accent">✦ Multimodal Notes</p>
          <h3 className="mt-1 font-display text-lg font-medium">Four formats, one click</h3>
        </div>
        {!notes && (
          <button onClick={generate} disabled={loading} className="flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper disabled:opacity-60">
            <Sparkles size={14} /> {loading ? "Generating…" : "Generate notes"}
          </button>
        )}
      </div>

      <AnimatePresence>
        {notes && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }} className="mt-5 grid gap-4 md:grid-cols-2">
            {/* Summary */}
            <div className="rounded-xl border border-line bg-paper p-4">
              <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                <FileText size={12} /> Summary
              </p>
              <p className="mt-2 text-sm leading-relaxed">{notes.summary}</p>
              <button onClick={() => speak(notes.narration)} className="mt-3 flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium">
                <Play size={12} /> Play audio narration
              </button>
            </div>

            {/* Mind-map */}
            <div className="rounded-xl border border-line bg-paper p-4">
              <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                <Network size={12} /> Mind-map
              </p>
              <div className="mt-2">
                <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-medium text-white">{notes.mindmap.root}</span>
                <div className="mt-2 space-y-1.5 border-l border-line pl-3">
                  {notes.mindmap.branches.map((b) => (
                    <div key={b.label}>
                      <p className="font-mono text-[11px] font-medium text-accent">{b.label}</p>
                      <p className="text-xs text-ink-soft">{b.leaves.join(" · ")}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Flashcards */}
            <div className="rounded-xl border border-line bg-paper p-4 md:col-span-2">
              <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                <Layers size={12} /> Flashcards
              </p>
              <button
                onClick={() => setFlipped((f) => !f)}
                className="mt-2 flex min-h-[72px] w-full flex-col items-start justify-center rounded-xl border border-line bg-white p-4 text-left"
              >
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">{flipped ? "Answer" : "Question"} · tap to flip</span>
                <span className="mt-1 text-sm">{flipped ? notes.flashcards[card].back : notes.flashcards[card].front}</span>
              </button>
              <div className="mt-3 flex items-center gap-2">
                {notes.flashcards.map((_, i) => (
                  <button key={i} onClick={() => { setCard(i); setFlipped(false); }} className={`h-2 w-2 rounded-full ${i === card ? "bg-accent" : "bg-line"}`} aria-label={`Card ${i + 1}`} />
                ))}
                <span className="ml-2 font-mono text-[11px] text-ink-soft">{card + 1} of {notes.flashcards.length}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
