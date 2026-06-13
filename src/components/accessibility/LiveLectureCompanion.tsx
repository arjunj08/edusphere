import { useEffect, useRef, useState } from "react";
import { Bookmark, Captions, Radio } from "lucide-react";

/**
 * R3-B Live Lecture Companion (captions flag).
 * Captions default ON: a live captioning area with running AI notes and an
 * "I'm lost" button that bookmarks the moment for later review. The live
 * stream is simulated here; real captioning plugs into the same surface.
 */

const TRANSCRIPT = [
  "Today we're looking at binary search trees.",
  "Every node keeps smaller values on its left.",
  "And larger values on its right.",
  "So each comparison eliminates half the tree.",
  "That's why lookups are logarithmic time.",
  "Next we'll see what happens when the tree is unbalanced.",
];

export default function LiveLectureCompanion() {
  const [line, setLine] = useState(0);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [seconds, setSeconds] = useState(0);
  const captionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setLine((l) => (l + 1) % TRANSCRIPT.length);
      setSeconds((s) => s + 4);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const notes = TRANSCRIPT.slice(0, line + 1).filter((_, i) => i % 2 === 0);

  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-accent">
          <Captions size={12} /> Live Lecture Companion
        </p>
        <span className="flex items-center gap-1.5 rounded-full bg-risk-soft px-2.5 py-1 font-mono text-[11px] font-medium text-risk">
          <Radio size={11} /> Live · captions on
        </span>
      </div>

      {/* Caption area */}
      <div ref={captionRef} className="mt-4 min-h-[64px] rounded-xl bg-ink px-4 py-3 font-mono text-sm leading-relaxed text-paper" aria-live="polite">
        {TRANSCRIPT[line]}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button
          onClick={() => setBookmarks((b) => [...b, seconds])}
          className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium hover:bg-paper"
        >
          <Bookmark size={13} /> I'm lost — bookmark this
        </button>
        {bookmarks.length > 0 && (
          <span className="font-mono text-[11px] text-ink-soft">{bookmarks.length} saved to review</span>
        )}
      </div>

      {/* Running AI notes */}
      <div className="mt-4 border-t border-line pt-3">
        <p className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">Auto-notes</p>
        <ul className="mt-2 space-y-1">
          {notes.map((n, i) => (
            <li key={i} className="text-sm text-ink-soft">• {n}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
