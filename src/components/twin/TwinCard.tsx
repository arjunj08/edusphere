import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Twin } from "@/services/twin";

/** A single matched twin: where they started, where they ended, what they did. */
export default function TwinCard({ twin, index }: { twin: Twin; index: number }) {
  return (
    <article className="rounded-2xl border border-line bg-white p-5 transition-shadow hover:shadow-[0_12px_32px_-16px_rgba(16,27,45,0.18)]">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
          Twin {index + 1} · {twin.role}
        </span>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 font-mono text-[11px] font-medium",
            twin.placed ? "bg-track-soft text-track" : "bg-watch-soft text-watch"
          )}
        >
          {twin.placed ? `Placed · ${twin.weeksToPlacement} wks` : "Not placed"}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="text-center">
          <p className="font-display text-2xl font-medium text-ink-soft">{twin.startReadiness}</p>
          <p className="font-mono text-[10px] text-ink-soft">start</p>
        </div>
        <ArrowRight size={16} className="text-ink-soft" />
        <div className="text-center">
          <p className={cn("font-display text-2xl font-medium", twin.placed ? "text-track" : "text-watch")}>
            {twin.endReadiness}
          </p>
          <p className="font-mono text-[10px] text-ink-soft">end</p>
        </div>
      </div>

      <div className="mt-4 border-t border-line pt-3">
        <p className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">What they did differently</p>
        <ul className="mt-1.5 space-y-1">
          {twin.moves.map((m) => (
            <li key={m.key} className="text-sm text-ink-soft">• {m.label}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
