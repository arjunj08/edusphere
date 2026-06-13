import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, Volume2 } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const MODES = [
  { id: "standard", icon: "📝", label: "Standard" },
  { id: "audio", icon: "🔊", label: "Audio-first" },
  { id: "captions", icon: "💬", label: "Caption + visual" },
  { id: "focus", icon: "🧩", label: "Focus mode" },
] as const;

type ModeId = (typeof MODES)[number]["id"];

function StandardMode() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="text-sm leading-relaxed text-ink-soft">
        <p>
          A binary search tree keeps every node's left subtree smaller and
          right subtree larger. That single rule means each comparison
          eliminates half the remaining nodes — search, insert, and delete all
          run in O(log n) on a balanced tree.
        </p>
        <p className="mt-3">
          Walk the tree from the root: go left if your key is smaller, right if
          larger. The path you trace is the search.
        </p>
      </div>
      <div className="flex items-center justify-center rounded-xl border border-dashed border-line bg-paper p-4">
        <svg viewBox="0 0 200 110" className="h-28 w-full max-w-[220px]" aria-label="Binary search tree diagram">
          <line x1="100" y1="20" x2="55" y2="60" stroke="#E4E2DA" strokeWidth="2" />
          <line x1="100" y1="20" x2="145" y2="60" stroke="#E4E2DA" strokeWidth="2" />
          <line x1="55" y1="60" x2="30" y2="95" stroke="#E4E2DA" strokeWidth="2" />
          <line x1="55" y1="60" x2="80" y2="95" stroke="#E4E2DA" strokeWidth="2" />
          <circle cx="100" cy="20" r="13" fill="#E1F5EE" stroke="#1D9E75" strokeWidth="2" />
          <circle cx="55" cy="60" r="13" fill="#FFFFFF" stroke="#3A4558" strokeWidth="1.5" />
          <circle cx="145" cy="60" r="13" fill="#FFFFFF" stroke="#3A4558" strokeWidth="1.5" />
          <circle cx="30" cy="95" r="11" fill="#FFFFFF" stroke="#E4E2DA" strokeWidth="1.5" />
          <circle cx="80" cy="95" r="11" fill="#FFFFFF" stroke="#E4E2DA" strokeWidth="1.5" />
          <text x="100" y="24" textAnchor="middle" fontSize="11" fill="#101B2D" fontFamily="monospace">8</text>
          <text x="55" y="64" textAnchor="middle" fontSize="11" fill="#101B2D" fontFamily="monospace">4</text>
          <text x="145" y="64" textAnchor="middle" fontSize="11" fill="#101B2D" fontFamily="monospace">12</text>
          <text x="30" y="99" textAnchor="middle" fontSize="10" fill="#3A4558" fontFamily="monospace">2</text>
          <text x="80" y="99" textAnchor="middle" fontSize="10" fill="#3A4558" fontFamily="monospace">6</text>
        </svg>
      </div>
    </div>
  );
}

function AudioMode() {
  return (
    <div className="flex flex-col items-center gap-5 py-2">
      <div className="flex items-end gap-1" aria-hidden="true">
        {[10, 22, 16, 30, 24, 36, 20, 32, 14, 26, 18, 30, 12, 24, 16].map((h, i) => (
          <div
            key={i}
            className="w-1.5 rounded-full bg-track/60"
            style={{ height: h }}
          />
        ))}
      </div>
      <button className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper">
        <Play size={14} /> Play lesson narration
      </button>
      <p className="font-mono text-xs text-ink-soft">
        AI narration with voice navigation · screen-reader optimized
      </p>
    </div>
  );
}

function CaptionsMode() {
  return (
    <div className="mx-auto max-w-md">
      <div className="overflow-hidden rounded-xl border border-line">
        <div className="flex h-36 items-center justify-center bg-[#EDEBE3]">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-white">
            <Play size={18} className="ml-0.5 text-ink" />
          </span>
        </div>
        <div className="bg-ink px-4 py-2.5 text-center font-mono text-xs text-paper">
          ...so each comparison eliminates half the remaining nodes...
        </div>
      </div>
      <p className="mt-3 text-center font-mono text-xs text-ink-soft">
        AI-generated notes after every lecture · sign-language avatar on
        roadmap
      </p>
    </div>
  );
}

function FocusMode() {
  const cards = [
    "A BST sorts as it stores. Left child smaller. Right child larger.",
    "To search: start at the root. Smaller? Go left. Larger? Go right.",
    "Every step removes half the tree. That is why search is O(log n).",
  ];
  return (
    <div className="mx-auto max-w-md">
      <div className="space-y-3">
        {cards.map((text, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-xl border border-line bg-paper p-4"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft font-mono text-xs font-medium text-accent">
              {i + 1}
            </span>
            <p className="text-[15px] leading-[1.9] tracking-wide">{text}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-center gap-2">
        <span className="h-2 w-2 rounded-full bg-accent" />
        <span className="h-2 w-2 rounded-full bg-line" />
        <span className="h-2 w-2 rounded-full bg-line" />
        <span className="ml-2 font-mono text-[11px] text-ink-soft">1 of 3</span>
      </div>
    </div>
  );
}

const MODE_CONTENT: Record<ModeId, () => JSX.Element> = {
  standard: StandardMode,
  audio: AudioMode,
  captions: CaptionsMode,
  focus: FocusMode,
};

export default function InclusiveEngine() {
  const [mode, setMode] = useState<ModeId>("standard");
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);

  // Arrow-key switching per WAI-ARIA tabs pattern.
  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (index + dir + MODES.length) % MODES.length;
    setMode(MODES[next].id);
    tabsRef.current[next]?.focus();
  };

  const Content = MODE_CONTENT[mode];

  return (
    <section className="px-5 py-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="max-w-3xl"
        >
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">
            Inclusive by design · one path for every learner
          </p>
          <h2 className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight md:text-[40px]">
            The students most likely to slip through the cracks are the ones
            platforms were never built for.
          </h2>
          <p className="mt-5 leading-relaxed text-ink-soft">
            EduSphere's accessibility profile adapts every piece of content to
            the learner — automatically. One lesson, delivered the way each
            student actually learns. Across 28+ Cintana countries, that's not a
            feature. It's the baseline.
          </p>
        </motion.div>

        {/* Interactive lesson mockup */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          className="mt-10 rounded-2xl border border-line bg-white p-6 md:p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="font-mono text-xs text-ink-soft md:text-[13px]">
              <Volume2 size={14} className="mr-1.5 inline text-track" aria-hidden="true" />
              Lesson: Binary Search Trees
            </p>
            <div
              role="tablist"
              aria-label="Lesson delivery mode"
              className="flex flex-wrap gap-1 rounded-full border border-line bg-paper p-1"
            >
              {MODES.map((m, i) => (
                <button
                  key={m.id}
                  ref={(el) => (tabsRef.current[i] = el)}
                  role="tab"
                  id={`mode-tab-${m.id}`}
                  aria-selected={mode === m.id}
                  aria-controls={`mode-panel-${m.id}`}
                  tabIndex={mode === m.id ? 0 : -1}
                  onClick={() => setMode(m.id)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={`relative rounded-full px-3 py-1.5 font-mono text-xs transition-colors ${
                    mode === m.id ? "text-ink" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {mode === m.id && (
                    <motion.span
                      layoutId="mode-pill"
                      className="absolute inset-0 rounded-full border border-line bg-white shadow-sm"
                      transition={{ type: "spring" as const, stiffness: 300, damping: 28 }}
                    />
                  )}
                  <span className="relative">
                    {m.icon} {m.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7 min-h-[230px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                role="tabpanel"
                id={`mode-panel-${mode}`}
                aria-labelledby={`mode-tab-${mode}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <Content />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Responsible AI callout */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-6 rounded-2xl border border-accent/20 bg-accent-soft p-5 md:p-6"
        >
          <p className="text-[15px] leading-relaxed text-ink">
            The risk engine also notices learning-pattern signals — consistent
            letter reversals, reading-speed outliers, attention drop-offs. It{" "}
            <strong>never labels a student.</strong> It privately
            flags patterns to counselors for professional assessment, so
            support starts years earlier than it usually does.
          </p>
        </motion.div>

        <div className="mt-6 flex flex-wrap gap-2.5">
          <span className="rounded-full bg-track-soft px-3 py-1.5 font-mono text-[11px] font-medium text-track">
            WCAG 2.1 AA targeted
          </span>
          <span className="rounded-full bg-accent-soft px-3 py-1.5 font-mono text-[11px] font-medium text-accent">
            Disability-aware career matching
          </span>
          <span className="rounded-full bg-watch-soft px-3 py-1.5 font-mono text-[11px] font-medium text-watch">
            Flags, never labels
          </span>
        </div>
      </div>
    </section>
  );
}
