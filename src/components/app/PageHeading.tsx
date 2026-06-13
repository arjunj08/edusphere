import type { ReactNode } from "react";
import { Volume2 } from "lucide-react";
import { useAccessibility } from "@/context/AccessibilityContext";
import { speak } from "@/lib/speech";

/**
 * Standard page header used by every feature page. When audio_first is on it
 * adds a read-aloud button for the page's spoken summary, and when
 * simplified_reading is on it surfaces the plain-language summary first.
 */
export default function PageHeading({
  eyebrow,
  title,
  summary,
  narration,
  children,
}: {
  eyebrow: string;
  title: string;
  summary: string;
  narration?: string;
  children?: ReactNode;
}) {
  const { isAudioFirst, isSimplified } = useAccessibility();

  return (
    <div className="mb-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">
            {eyebrow}
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium tracking-tight">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {children}
          {isAudioFirst && (
            <button
              onClick={() => speak(narration ?? summary)}
              className="flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-paper"
            >
              <Volume2 size={16} />
              Read aloud
            </button>
          )}
        </div>
      </div>

      {isSimplified ? (
        <div className="mt-4 rounded-xl border border-accent/20 bg-accent-soft p-4">
          <p className="font-mono text-[11px] uppercase tracking-wider text-accent">
            In short
          </p>
          <p className="mt-1.5 text-[15px] leading-relaxed">{summary}</p>
        </div>
      ) : (
        <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">{summary}</p>
      )}
    </div>
  );
}
