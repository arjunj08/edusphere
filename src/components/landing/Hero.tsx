import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 120, damping: 18 },
  },
};

export default function Hero() {
  return (
    <section id="top" className="px-5 pb-14 pt-32 md:pt-44">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-4xl text-center"
      >
        <motion.p
          variants={item}
          className="font-mono text-xs uppercase tracking-[0.18em] text-track"
        >
          2026 Cintana Alliance AI Challenge · Student Success Track
        </motion.p>

        <motion.h1
          variants={item}
          className="mt-6 font-display text-[40px] font-medium leading-[1.08] tracking-tight md:text-[64px]"
        >
          Universities find out a student is failing{" "}
          <em className="text-track">after</em> they fail. We find out three
          weeks before.
        </motion.h1>

        <motion.p
          variants={item}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft"
        >
          EduSphere AI reads the signals universities already collect — grades,
          attendance, LMS activity, submission patterns — predicts which
          students are heading toward failure, and intervenes automatically.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <motion.a
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            href="#how-it-works"
            className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper"
          >
            See how it works
          </motion.a>
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/auth"
              className="block rounded-full border border-line bg-white px-6 py-3 text-sm font-medium"
            >
              Try the live demo
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
