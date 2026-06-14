import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AudioLines, Captions, FileText, Network, Pause, Play, RotateCcw, Subtitles, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { speak, stopSpeaking } from "@/lib/speech";

/**
 * FEATURE 1 — Adaptive Content Transformer.
 * One source lesson, several parallel forms generated on demand (mocked here):
 * audio narration, plain-language rewrite with inline definitions, structured
 * concept cards, and captioned video with auto-notes. "One lesson, every
 * learner." Demoed live on a Problem Bank entry.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

type FormId = "audio" | "plain" | "concept" | "captioned";

const FORMS: { id: FormId; icon: typeof FileText; label: string }[] = [
  { id: "audio", icon: AudioLines, label: "Audio" },
  { id: "plain", icon: FileText, label: "Plain language" },
  { id: "concept", icon: Network, label: "Concept cards" },
  { id: "captioned", icon: Subtitles, label: "Captioned video" },
];

const NARRATION =
  "Binary search on a sorted array. Look at the middle element. If it matches, you are done. If your target is smaller, search the left half. If larger, search the right half. Each step removes half the remaining items, so the work is logarithmic.";

// Caption track for the captioned-video mode: each line shows for `secs`.
const CAPTION_TRACK: { text: string; secs: number; note?: string }[] = [
  { text: "Binary search works on a sorted array.", secs: 3, note: "Input must be sorted" },
  { text: "Look at the middle element first.", secs: 3 },
  { text: "If it matches your target, you're done.", secs: 3, note: "Match → return index" },
  { text: "If the target is smaller, search the left half.", secs: 3.2 },
  { text: "If it's larger, search the right half.", secs: 3.2, note: "Smaller → left · larger → right" },
  { text: "Each comparison removes half the remaining items.", secs: 3.4, note: "Half eliminated each step → O(log n)" },
];

/** A working captioned "video": play/pause, synced rolling captions + optional
 *  narration, a progress bar, a CC toggle, and auto-notes after it finishes. */
function CaptionedVideo() {
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [cc, setCc] = useState(true);
  const [muted, setMuted] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = () => { if (timer.current) clearTimeout(timer.current); };

  // Advance captions while playing.
  useEffect(() => {
    if (!playing) return;
    if (!muted) speak(CAPTION_TRACK[index].text);
    timer.current = setTimeout(() => {
      if (index >= CAPTION_TRACK.length - 1) {
        setPlaying(false);
        setFinished(true);
      } else {
        setIndex((i) => i + 1);
      }
    }, CAPTION_TRACK[index].secs * 1000);
    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, index, muted]);

  useEffect(() => () => { clear(); stopSpeaking(); }, []);

  const toggle = () => {
    if (finished) { restart(); return; }
    if (playing) { setPlaying(false); stopSpeaking(); }
    else setPlaying(true);
  };

  const restart = () => {
    clear(); stopSpeaking();
    setIndex(0); setFinished(false); setPlaying(true);
  };

  const pct = finished ? 100 : ((index + (playing ? 1 : 0)) / CAPTION_TRACK.length) * 100;
  const notes = CAPTION_TRACK.filter((c) => c.note).map((c) => c.note as string);

  return (
    <div className="mx-auto max-w-md">
      <div className="overflow-hidden rounded-xl border border-line">
        {/* Video surface */}
        <div className="relative flex h-40 items-center justify-center bg-[#101B2D]">
          {/* simple animated "frames" so it reads as motion, not a still */}
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-end gap-1.5"
              aria-hidden="true"
            >
              {Array.from({ length: 7 }).map((_, i) => {
                const active = i < Math.ceil(((index + 1) / CAPTION_TRACK.length) * 7);
                return <span key={i} className={cn("w-4 rounded-sm", active ? "bg-mint" : "bg-paper/15")} style={{ height: 12 + ((i * 7 + index * 5) % 26) }} />;
              })}
            </motion.div>
          </AnimatePresence>

          <button
            onClick={toggle}
            aria-label={finished ? "Replay" : playing ? "Pause" : "Play"}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow">
              {finished ? <RotateCcw size={18} className="text-ink" /> : playing ? <Pause size={18} className="text-ink" /> : <Play size={18} className="ml-0.5 text-ink" />}
            </span>
          </button>

          <button
            onClick={() => setCc((v) => !v)}
            aria-pressed={cc}
            aria-label="Toggle captions"
            className={cn("absolute right-2 top-2 flex items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-[10px] font-medium", cc ? "bg-mint text-ink" : "bg-paper/20 text-paper")}
          >
            <Captions size={11} /> CC
          </button>
          <button
            onClick={() => { setMuted((m) => !m); stopSpeaking(); }}
            aria-label={muted ? "Unmute narration" : "Mute narration"}
            className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-md bg-paper/15 text-paper"
          >
            {muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
          </button>
        </div>

        {/* Progress */}
        <div className="h-1 bg-[#F1EFE8]">
          <motion.div className="h-full bg-track" animate={{ width: `${pct}%` }} transition={{ ease: "linear", duration: 0.3 }} />
        </div>

        {/* Caption bar */}
        <div className="min-h-[2.75rem] bg-ink px-4 py-2.5 text-center font-mono text-xs text-paper" aria-live="polite">
          {cc ? `"${CAPTION_TRACK[index].text}"` : <span className="text-paper/40">Captions off</span>}
        </div>
      </div>

      {/* Auto-notes after the clip */}
      <AnimatePresence>
        {finished && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 rounded-xl border border-line bg-paper p-4">
            <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-accent">
              <FileText size={12} /> Auto-notes from this clip
            </p>
            <ul className="mt-2 space-y-1">
              {notes.map((n, i) => (
                <li key={i} className="text-sm text-ink-soft">• {n}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {!finished && (
        <p className="mt-3 flex items-center justify-center gap-1.5 text-center font-mono text-[11px] text-ink-soft">
          <Volume2 size={12} /> Captions on by default · auto-notes generate when the clip ends.
        </p>
      )}
    </div>
  );
}

export default function ContentTransformer({
  defaultForm = "plain",
}: {
  defaultForm?: FormId;
}) {
  const [form, setForm] = useState<FormId>(defaultForm);

  return (
    <div className="rounded-2xl border border-line bg-white p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-accent">
            ✦ Adaptive Content Transformer
          </p>
          <h3 className="mt-1 font-display text-lg font-medium">
            Same lesson, delivered your way
          </h3>
        </div>
        <div
          role="tablist"
          aria-label="Content format"
          className="flex flex-wrap gap-1 rounded-full border border-line bg-paper p-1"
        >
          {FORMS.map((f) => {
            const Icon = f.icon;
            const active = form === f.id;
            return (
              <button
                key={f.id}
                role="tab"
                aria-selected={active}
                onClick={() => setForm(f.id)}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-xs transition-colors",
                  active ? "text-ink" : "text-ink-soft hover:text-ink"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="transformer-pill"
                    className="absolute inset-0 rounded-full border border-line bg-white shadow-sm"
                    transition={{ type: "spring" as const, stiffness: 300, damping: 28 }}
                  />
                )}
                <span className="relative flex items-center gap-1.5">
                  <Icon size={13} />
                  {f.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 min-h-[180px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={form}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            {form === "audio" && (
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="flex items-end gap-1" aria-hidden="true">
                  {[12, 24, 16, 30, 22, 34, 18, 28, 14, 26, 20, 32].map((h, i) => (
                    <span key={i} className="w-1.5 rounded-full bg-track/60" style={{ height: h }} />
                  ))}
                </div>
                <button
                  onClick={() => speak(NARRATION)}
                  className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper"
                >
                  <Play size={14} /> Play narration
                </button>
                <p className="text-center text-sm leading-relaxed text-ink-soft">
                  Clean narration with a logical reading order — headings,
                  then steps, then the takeaway. Screen-reader friendly.
                </p>
              </div>
            )}

            {form === "plain" && (
              <div className="text-[15px] leading-[1.9]">
                <p>
                  Binary search finds an item in a{" "}
                  <span className="rounded bg-accent-soft px-1 font-mono text-[13px] text-accent">
                    sorted list
                  </span>{" "}
                  (already in order). Check the middle. Too big? Look left. Too
                  small? Look right. Repeat.
                </p>
                <p className="mt-3">
                  Each check throws away half of what's left. That's why it's{" "}
                  <span className="rounded bg-accent-soft px-1 font-mono text-[13px] text-accent">
                    O(log n)
                  </span>{" "}
                  — the number of steps grows slowly even when the list grows
                  fast.
                </p>
              </div>
            )}

            {form === "concept" && (
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { t: "Rule", d: "List is sorted. Compare the middle." },
                  { t: "Move", d: "Smaller → left half. Larger → right half." },
                  { t: "Cost", d: "Half removed each step → O(log n)." },
                ].map((c, i) => (
                  <div key={i} className="rounded-xl border border-line bg-paper p-4">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-accent">
                      {i + 1} · {c.t}
                    </span>
                    <p className="mt-2 text-sm leading-relaxed">{c.d}</p>
                  </div>
                ))}
              </div>
            )}

            {form === "captioned" && <CaptionedVideo />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
