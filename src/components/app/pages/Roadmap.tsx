import { useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAccessibility } from "@/context/AccessibilityContext";
import { ROADMAP_COMING, ROADMAP_STEPS } from "@/services/mockData";
import PageHeading from "@/components/app/PageHeading";
import SignPanel from "@/components/accessibility/SignPanel";

export default function Roadmap() {
  const { isMicro, isSimplified, signSupport } = useAccessibility();
  const [step, setStep] = useState(0);

  const steps = isMicro ? [ROADMAP_STEPS[step]] : ROADMAP_STEPS;

  return (
    <div className={cn(isSimplified && "simplified")}>
      <PageHeading
        eyebrow="Your path"
        title="Roadmap"
        summary="A week-by-week path to your target role. One milestone at a time."
        narration="Roadmap. A week-by-week path to your target role, one milestone at a time."
      />

      <div className="space-y-3">
        {steps.map((s) => (
          <article key={s.title} className="rounded-2xl border border-line bg-white p-5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-accent">{s.phase}</span>
            <h2 className="mt-1.5 font-display text-lg font-medium">{s.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{s.detail}</p>
          </article>
        ))}
      </div>

      {isMicro && (
        <div className="mt-4 flex items-center justify-between">
          <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} aria-label="Previous milestone" className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-soft disabled:opacity-40">
            <ChevronLeft size={18} />
          </button>
          <div className="flex items-center gap-2">
            {ROADMAP_STEPS.map((_, i) => (
              <span key={i} className={cn("h-2 w-2 rounded-full", i === step ? "bg-accent" : "bg-line")} />
            ))}
            <span className="ml-2 font-mono text-[11px] text-ink-soft">{step + 1} of {ROADMAP_STEPS.length}</span>
          </div>
          <button onClick={() => setStep((s) => Math.min(ROADMAP_STEPS.length - 1, s + 1))} disabled={step === ROADMAP_STEPS.length - 1} aria-label="Next milestone" className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-soft disabled:opacity-40">
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Sign-language support panel — surfaced for the sign_support preference */}
      {signSupport && (
        <div className="mt-9">
          <SignPanel />
        </div>
      )}

      {/* Roadmap features — clearly labeled "Coming", never faked as working. */}
      <div className="mt-9">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-watch" />
          <h2 className="font-display text-lg font-medium">On the roadmap</h2>
        </div>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {ROADMAP_COMING.map((item) => (
            <article key={item.title} className="rounded-2xl border border-dashed border-line bg-white p-5">
              <div className="flex items-center justify-between">
                <span className="text-xl" aria-hidden="true">🤟</span>
                <span className="rounded-full bg-watch-soft px-2.5 py-1 font-mono text-[10px] font-medium text-watch">Coming</span>
              </div>
              <h3 className="mt-3 font-display text-base font-medium">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{item.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
