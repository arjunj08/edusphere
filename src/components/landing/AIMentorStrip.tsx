import { motion } from "framer-motion";
import Book from "@/components/ui/book";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function AIMentorStrip() {
  return (
    <section className="border-y border-line bg-[#F6F5F0] px-5 py-14 md:py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <h2 className="font-display text-2xl font-medium tracking-tight md:text-3xl">
            Always-on doubt resolution
          </h2>
          <p className="mt-4 leading-relaxed text-ink-soft">
            A curriculum-grounded AI mentor answers concept questions 24/7 —
            explanations, examples, instant quizzes — using RAG over the
            university's own syllabus and slides, so answers match what's
            actually taught.
          </p>
          <span className="mt-5 inline-block rounded-full bg-accent-soft px-3 py-1.5 font-mono text-[11px] font-medium text-accent">
            Grounded in YOUR syllabus — no generic answers
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          className="flex items-center gap-6"
        >
          {/* Decorative — duplicated by the accessible text in this section */}
          <Book color="#1D9E75" depth={8} width={170} className="hidden sm:block">
            <p className="font-display text-lg font-medium leading-snug text-paper">
              Your syllabus.
            </p>
            <p className="font-mono text-[10px] text-paper/75">
              DSA · Unit 3 · Binary Search
            </p>
          </Book>

          <div className="flex-1 space-y-3">
            <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm border border-line bg-white px-4 py-3 text-sm">
              Why is binary search O(log n)?
            </div>
            <div className="max-w-[92%] rounded-2xl rounded-tl-sm border border-accent/20 bg-accent-soft px-4 py-3 text-sm leading-relaxed">
              Each comparison halves the search space: 1000 → 500 → 250… Want a
              3-question quiz on this?
              <span className="mt-2 block font-mono text-[10px] uppercase tracking-wider text-accent">
                EduSphere mentor · grounded in Unit 3
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
