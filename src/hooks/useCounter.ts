import { useEffect, useRef, useState } from "react";
import { animate, useInView, useMotionValue, useReducedMotion } from "framer-motion";

/**
 * Counts from 0 to `target` once the returned ref scrolls into view.
 * Renders instantly when the user prefers reduced motion.
 */
export default function useCounter(
  target: number,
  { duration = 1.6, delay = 0 }: { duration?: number; delay?: number } = {}
) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  const motionValue = useMotionValue(0);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    if (reduced) {
      setValue(target);
      return undefined;
    }
    const controls = animate(motionValue, target, {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, reduced, target, duration, delay, motionValue]);

  return { ref, value };
}
