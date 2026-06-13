import { HandMetal } from "lucide-react";

/**
 * R3-C Sign-language support (sign_support flag).
 * Clearly labeled "Coming" — an AI sign-language avatar tied to lecture
 * content. We never fake a working avatar.
 */
export default function SignPanel() {
  return (
    <div className="rounded-2xl border border-dashed border-accent/30 bg-accent-soft/40 p-5">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-accent">
          <HandMetal size={12} /> Sign-language support
        </p>
        <span className="rounded-full bg-watch-soft px-2.5 py-1 font-mono text-[10px] font-medium text-watch">Coming</span>
      </div>
      <h3 className="mt-2 font-display text-lg font-medium">AI Sign Classroom</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
        A sign-language avatar that interprets recorded lectures, synced to the
        captions and auto-notes you already get today. In development — we'll
        switch this on when it's genuinely good, not before.
      </p>
    </div>
  );
}
