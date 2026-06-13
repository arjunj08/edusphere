import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpenText, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * R3-D Smart Reading Ruler + Dyslexia Mode (simplified_reading flag).
 * A line-focus overlay that follows the cursor, plus toggles for dyslexia
 * spacing, syllable splitting, and bionic-reading bolding. Adds a
 * `.reading-support` class to <body> while active.
 */

const SAMPLE =
  "A binary search tree keeps smaller values on the left and larger values on the right, so each comparison removes half of the remaining nodes.";

// Naive syllable split — enough to demonstrate the toggle without a dictionary.
function syllabify(word: string) {
  return word.replace(/([aeiouy]+)([^aeiouy])/gi, "$1·$2");
}

function bionic(text: string) {
  return text.split(/(\s+)/).map((tok, i) => {
    if (/^\s+$/.test(tok) || tok.length === 0) return <span key={i}>{tok}</span>;
    const cut = Math.max(1, Math.ceil(tok.length * 0.45));
    return (
      <span key={i}>
        <b>{tok.slice(0, cut)}</b>
        {tok.slice(cut)}
      </span>
    );
  });
}

export default function ReadingSupport() {
  const [open, setOpen] = useState(false);
  const [ruler, setRuler] = useState(false);
  const [spacing, setSpacing] = useState(true);
  const [syllables, setSyllables] = useState(false);
  const [useBionic, setUseBionic] = useState(false);
  const [y, setY] = useState(0);

  useEffect(() => {
    document.body.classList.toggle("reading-support", spacing);
    return () => document.body.classList.remove("reading-support");
  }, [spacing]);

  useEffect(() => {
    if (!ruler) return undefined;
    const onMove = (e: MouseEvent) => setY(e.clientY);
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [ruler]);

  const previewText = syllables
    ? SAMPLE.split(" ").map(syllabify).join(" ")
    : SAMPLE;

  return (
    <>
      {/* Reading ruler overlay */}
      {ruler && (
        <div className="pointer-events-none fixed inset-x-0 z-[55]" style={{ top: y - 18, height: 36 }}>
          <div className="h-full w-full bg-accent/10 ring-1 ring-accent/20" />
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 left-[7.5rem] z-40 flex items-center gap-2 rounded-full border border-line bg-white px-4 py-3 text-sm font-medium text-ink-soft shadow-sm hover:text-ink"
        aria-label="Reading support"
      >
        <BookOpenText size={16} /> Reading
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-label="Reading support options"
            className="fixed bottom-20 left-5 z-50 w-[min(22rem,calc(100vw-2.5rem))] rounded-2xl border border-line bg-white p-5 shadow-[0_24px_60px_-24px_rgba(16,27,45,0.35)]"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-medium">Reading support</h3>
              <button onClick={() => setOpen(false)} aria-label="Close" className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-soft hover:text-ink">
                <X size={15} />
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {[
                { label: "Reading ruler", on: ruler, set: setRuler },
                { label: "Comfortable spacing", on: spacing, set: setSpacing },
                { label: "Syllable splitting", on: syllables, set: setSyllables },
                { label: "Bionic bolding", on: useBionic, set: setUseBionic },
              ].map((row) => (
                <button
                  key={row.label}
                  role="switch"
                  aria-checked={row.on}
                  onClick={() => row.set(!row.on)}
                  className="flex w-full items-center justify-between rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm"
                >
                  {row.label}
                  <span className={cn("relative h-6 w-11 rounded-full transition-colors", row.on ? "bg-accent" : "bg-line")}>
                    <span className={cn("absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all", row.on ? "left-6" : "left-1")} />
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-line bg-paper p-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">Preview</p>
              <p className={cn("mt-1.5 text-[15px] leading-[1.9]", useBionic && "bionic")}>
                {useBionic ? bionic(previewText) : previewText}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
