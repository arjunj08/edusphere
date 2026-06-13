import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";
import negotiationRaw from "@/data/negotiation.json";
import PageHeading from "@/components/app/PageHeading";

/**
 * FEATURE 4 — Offer Negotiation Simulator. A reliable guided branching dialog
 * (not free-form) with an AI recruiter, scored on anchoring, not accepting the
 * first offer, justifying with value, and staying collaborative.
 */

interface Choice {
  label: string;
  next: string;
  tags: string[];
}
interface Node {
  recruiter?: string;
  choices?: Choice[];
  terminal?: boolean;
  title?: string;
  result?: "low" | "mid" | "high";
}
interface Script {
  intro: string;
  start: string;
  nodes: Record<string, Node>;
}

const SCRIPT = negotiationRaw as Script;

const SKILL_TAGS: Record<string, string> = {
  anchored: "Anchored high",
  justified: "Justified with value",
  collaborative: "Stayed collaborative",
  creative: "Found creative terms",
  secured_terms: "Secured terms in writing",
  accepted_first: "Accepted the first offer",
  rigid: "Was rigid",
  blunt: "Came in blunt",
  unjustified: "Didn't justify the ask",
  walked: "Walked away",
};

const RESULT_STYLE = {
  high: { label: "Strong outcome", cls: "bg-track-soft text-track" },
  mid: { label: "Workable outcome", cls: "bg-watch-soft text-watch" },
  low: { label: "Left value on the table", cls: "bg-risk-soft text-risk" },
} as const;

export default function NegotiationSim() {
  const [nodeId, setNodeId] = useState(SCRIPT.start);
  const [history, setHistory] = useState<{ recruiter: string; choice: string }[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const node = SCRIPT.nodes[nodeId];

  const choose = (c: Choice) => {
    setHistory((h) => [...h, { recruiter: node.recruiter ?? "", choice: c.label }]);
    setTags((t) => [...t, ...c.tags]);
    setNodeId(c.next);
  };

  const reset = () => {
    setNodeId(SCRIPT.start);
    setHistory([]);
    setTags([]);
  };

  const score = useMemo(() => {
    let s = 50;
    const pos: Record<string, number> = { anchored: 12, justified: 14, collaborative: 12, creative: 12, secured_terms: 10, recovered: 6 };
    const neg: Record<string, number> = { accepted_first: -30, unjustified: -18, rigid: -12, blunt: -8, walked: -10 };
    tags.forEach((t) => { s += pos[t] ?? 0; s += neg[t] ?? 0; });
    return Math.max(0, Math.min(100, s));
  }, [tags]);

  const goodTags = Array.from(new Set(tags.filter((t) => SKILL_TAGS[t] && ["anchored", "justified", "collaborative", "creative", "secured_terms"].includes(t))));
  const missTags = Array.from(new Set(tags.filter((t) => ["accepted_first", "unjustified", "rigid", "blunt", "walked"].includes(t))));

  return (
    <div>
      <PageHeading
        eyebrow="Offer negotiation simulator"
        title="Practice the part that happens after the offer"
        summary="A guided negotiation with an AI recruiter. Anchor well, justify with value, and stay collaborative — then get a debrief with better phrasings."
        narration="Offer negotiation simulator. Practice negotiating an offer with an AI recruiter, then get a scored debrief."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Dialog */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-line bg-white p-6">
            {history.length === 0 && (
              <p className="mb-4 rounded-xl bg-paper p-3 text-sm text-ink-soft">{SCRIPT.intro}</p>
            )}

            <div className="space-y-3">
              {history.map((h, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink-soft/10"><User size={14} className="text-ink-soft" /></span>
                    <p className="rounded-2xl rounded-tl-sm border border-line bg-paper px-3.5 py-2 text-sm">{h.recruiter}</p>
                  </div>
                  <p className="ml-9 w-fit rounded-2xl rounded-tr-sm bg-ink px-3.5 py-2 text-sm text-paper">{h.choice}</p>
                </div>
              ))}
            </div>

            {!node.terminal ? (
              <div className="mt-5">
                <div className="flex items-start gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft"><User size={14} className="text-accent" /></span>
                  <p className="rounded-2xl rounded-tl-sm border border-accent/20 bg-accent-soft px-3.5 py-2 text-sm">{node.recruiter}</p>
                </div>
                <div className="mt-4 space-y-2">
                  <AnimatePresence>
                    {node.choices?.map((c, i) => (
                      <motion.button
                        key={c.label}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => choose(c)}
                        className="block w-full rounded-xl border border-line bg-white p-3.5 text-left text-sm transition-colors hover:border-accent/40 hover:bg-accent-soft"
                      >
                        {c.label}
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-line bg-paper p-4 text-center">
                <p className="font-display text-lg font-medium">{node.title}</p>
                <span className={cn("mt-2 inline-block rounded-full px-3 py-1 font-mono text-xs font-medium", RESULT_STYLE[node.result ?? "mid"].cls)}>
                  {RESULT_STYLE[node.result ?? "mid"].label}
                </span>
                <button onClick={reset} className="mt-4 flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper mx-auto">
                  <RotateCcw size={14} /> Try again
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Live scorecard / debrief */}
        <aside>
          <div className="rounded-2xl border border-line bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-medium">Scorecard</h2>
              <span className="flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 font-mono text-xs font-medium text-accent">
                <Trophy size={12} /> {score}/100
              </span>
            </div>

            {node.terminal && (
              <div className="mt-4 space-y-3">
                {goodTags.length > 0 && (
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-track">What worked</p>
                    <ul className="mt-1 space-y-0.5">
                      {goodTags.map((t) => <li key={t} className="text-sm text-ink-soft">✓ {SKILL_TAGS[t]}</li>)}
                    </ul>
                  </div>
                )}
                {missTags.length > 0 && (
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-risk">Better next time</p>
                    <ul className="mt-1 space-y-0.5">
                      {missTags.map((t) => <li key={t} className="text-sm text-ink-soft">→ {SKILL_TAGS[t]}</li>)}
                    </ul>
                  </div>
                )}
                <p className="border-t border-line pt-3 font-mono text-[11px] leading-relaxed text-ink-soft">
                  Tip: never accept the first number. Anchor above target, justify with a competing offer or your strengths, and trade on bonus or an early review when base is capped.
                </p>
              </div>
            )}

            {!node.terminal && (
              <p className="mt-3 text-sm text-ink-soft">Your scorecard fills in as you make choices.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
