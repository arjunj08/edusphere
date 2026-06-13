import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";
import { MENTOR_EXCHANGES } from "@/services/mockData";

interface Exchange {
  q: string;
  a: string;
}

const DEMO_REPLY =
  "(Demo) In the full build I answer from your university's own syllabus via RAG — this preview ships with three example exchanges above.";

export default function MentorDock() {
  const [open, setOpen] = useState(false);
  const [exchanges, setExchanges] = useState<Exchange[]>(MENTOR_EXCHANGES);
  const [draft, setDraft] = useState("");

  const send = (e: FormEvent) => {
    e.preventDefault();
    const q = draft.trim();
    if (!q) return;
    setExchanges((prev) => [...prev, { q, a: DEMO_REPLY }]);
    setDraft("");
  };

  return (
    <>
      <motion.button
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close AI mentor" : "Open AI mentor"}
        className="fixed bottom-5 right-5 z-50 flex h-13 items-center gap-2 rounded-full bg-accent px-5 py-3.5 text-sm font-medium text-white shadow-[0_12px_28px_-10px_rgba(83,74,183,0.55)]"
      >
        {open ? <X size={18} /> : <MessageCircle size={18} />}
        <span className="hidden sm:inline">AI mentor</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 32 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-label="AI mentor chat"
            className="fixed bottom-20 right-5 z-50 flex max-h-[70vh] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_24px_60px_-24px_rgba(16,27,45,0.35)]"
          >
            <div className="border-b border-line bg-accent-soft px-4 py-3">
              <p className="font-medium">AI mentor</p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-accent">
                Grounded in your syllabus
              </p>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {exchanges.map((exchange, i) => (
                <div key={i} className="space-y-2">
                  <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-tr-sm bg-ink px-3.5 py-2 text-sm text-paper">
                    {exchange.q}
                  </div>
                  <div className="w-fit max-w-[92%] rounded-2xl rounded-tl-sm border border-line bg-paper px-3.5 py-2 text-sm leading-relaxed">
                    {exchange.a}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={send} className="flex gap-2 border-t border-line p-3">
              <label htmlFor="mentor-input" className="sr-only">
                Ask the AI mentor
              </label>
              <input
                id="mentor-input"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask a concept question…"
                className="min-w-0 flex-1 rounded-full border border-line bg-white px-4 py-2 text-sm placeholder:text-ink-soft/50"
              />
              <button
                type="submit"
                aria-label="Send question"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-white"
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
