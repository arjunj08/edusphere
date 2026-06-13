import { cn } from "@/lib/utils";
import { useAccessibility } from "@/context/AccessibilityContext";
import { STUDENT } from "@/services/mockData";
import PageHeading from "@/components/app/PageHeading";
import StatBar from "@/components/ui/stat-bar";

export default function SkillReport() {
  const { isSimplified } = useAccessibility();

  // Charts ALWAYS carry a text-equivalent summary for screen readers.
  const textSummary =
    "Skill breakdown: DSA progress 82 percent, resume quality 88 percent, projects 71 percent, mock interviews 64 percent, system design 45 percent — the weakest area.";

  return (
    <div className={cn(isSimplified && "simplified")}>
      <PageHeading
        eyebrow="Where you stand"
        title="Skill Report"
        summary="A breakdown of every skill that feeds your readiness score, with the weakest link called out."
        narration={textSummary}
      />

      <div className="rounded-2xl border border-line bg-white p-6">
        {/* Visual cards over dense tables when simplified. */}
        {isSimplified ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {STUDENT.skills.map((skill) => (
              <div key={skill.label} className="rounded-xl border border-line bg-paper p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-medium">{skill.label}</span>
                  <span className="font-mono text-sm text-ink-soft">{skill.pct}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#F1EFE8]">
                  <div className="h-full rounded-full" style={{ width: `${skill.pct}%`, backgroundColor: skill.zone === "green" ? "#1D9E75" : skill.zone === "amber" ? "#EF9F27" : "#E24B4A" }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4" role="img" aria-label={textSummary}>
            {STUDENT.skills.map((skill, i) => (
              <StatBar key={skill.label} label={skill.label} pct={skill.pct} zone={skill.zone} note={skill.note} delay={0.1 + i * 0.1} />
            ))}
          </div>
        )}

        {/* Text-equivalent summary, always present for screen readers. */}
        <p className="mt-5 border-t border-line pt-4 font-mono text-[11px] leading-relaxed text-ink-soft">
          Text equivalent: {textSummary}
        </p>
      </div>
    </div>
  );
}
