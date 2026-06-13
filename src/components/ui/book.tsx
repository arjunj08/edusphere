import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useAnimationControls,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface BookProps {
  color?: string;
  depth?: number;
  width?: number;
  className?: string;
  children?: ReactNode;
}

/**
 * Decorative 3D book with a CSS-perspective tilt. The hover tilt is the ONLY
 * 3D effect on the site — no Three.js or parallax anywhere else.
 *
 * - Hover devices: tilts on hover.
 * - Touch devices: plays the tilt once on scroll-into-view, then settles.
 * - prefers-reduced-motion: renders static.
 *
 * Always wrap in an aria-hidden container — the content on the cover must be
 * duplicated in accessible text nearby.
 */
export default function Book({
  color = "#1D9E75",
  depth = 6,
  width = 160,
  className,
  children,
}: BookProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const controls = useAnimationControls();
  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover)").matches);
  }, []);

  useEffect(() => {
    if (reduced || canHover || !inView) return;
    controls.start(
      { rotateY: [-12, -30, -12] },
      { duration: 1.6, ease: "easeInOut", delay: 0.3 }
    );
  }, [reduced, canHover, inView, controls]);

  const height = Math.round(width * 1.32);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("shrink-0", className)}
      style={{ perspective: 900 }}
    >
      <motion.div
        initial={{ rotateY: reduced ? 0 : -12 }}
        animate={controls}
        whileHover={reduced || !canHover ? undefined : { rotateY: -28 }}
        transition={{ type: "spring" as const, stiffness: 120, damping: 16 }}
        className="relative"
        style={{ width, height, transformStyle: "preserve-3d" }}
      >
        {/* Page-edge block behind the cover's right side */}
        <div
          className="absolute rounded-r-sm bg-book-pages"
          style={{
            width: depth * 2,
            height: height - 10,
            top: 5,
            right: 0,
            transform: `translateX(${depth}px) rotateY(70deg)`,
            transformOrigin: "left center",
          }}
        />
        {/* Cover */}
        <div
          className="absolute inset-0 overflow-hidden rounded-l-[4px] rounded-r-md shadow-book"
          style={{ backgroundColor: color }}
        >
          <div className="absolute inset-0 bg-book-bind-bg" />
          <div className="relative flex h-full flex-col justify-between p-4">
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
