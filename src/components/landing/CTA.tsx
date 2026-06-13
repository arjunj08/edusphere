import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function CTA() {
  return (
    <section id="cta" className="scroll-mt-20 px-5 py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mx-auto max-w-3xl text-center"
      >
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-track">
          Cintana Alliance · 28+ countries
        </p>
        <h2 className="mt-5 font-display text-3xl font-medium leading-tight tracking-tight md:text-5xl">
          Universities don't need another LMS. They need to see failure coming.
        </h2>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/auth"
              className="block rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper"
            >
              Try the live demo
            </Link>
          </motion.div>
          <motion.a
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            href="mailto:pilot@edusphere.ai?subject=EduSphere%20AI%20pilot%20request"
            className="rounded-full border border-line bg-white px-6 py-3 text-sm font-medium"
          >
            Request a pilot
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}
