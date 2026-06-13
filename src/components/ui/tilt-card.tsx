import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees at the corners. */
  max?: number;
  onClick?: () => void;
  selected?: boolean;
  as?: "div" | "button";
  ariaPressed?: boolean;
  ariaLabel?: string;
}

/**
 * Pointer-driven 3D tilt using CSS perspective only — no Three.js/WebGL.
 * - Hover devices: rotateX/Y follow the pointer, spring back on leave.
 * - Touch devices: plays the tilt once on mount, then settles.
 * - prefers-reduced-motion: fully static, no transforms.
 */
export default function TiltCard({
  children,
  className,
  max = 8,
  onClick,
  selected,
  as = "div",
  ariaPressed,
  ariaLabel,
}: TiltCardProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [canHover, setCanHover] = useState(true);

  const rotateX = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const scale = useSpring(useMotionValue(1), { stiffness: 220, damping: 20 });
  const transform = useMotionTemplate`perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;

  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover)").matches);
  }, []);

  // Touch: play the tilt once on mount.
  useEffect(() => {
    if (reduced || canHover) return;
    rotateY.set(-max);
    const settle = setTimeout(() => {
      rotateY.set(0);
    }, 700);
    return () => clearTimeout(settle);
  }, [reduced, canHover, max, rotateY]);

  const handleMove = (e: React.PointerEvent) => {
    if (reduced || !canHover || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * max * 2);
    rotateX.set(-py * max * 2);
  };

  const handleEnter = () => {
    if (reduced || !canHover) return;
    scale.set(1.04);
  };

  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  const Tag = as === "button" ? motion.button : motion.div;

  return (
    <Tag
      ref={ref as never}
      onPointerMove={handleMove}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      onClick={onClick}
      aria-pressed={ariaPressed}
      aria-label={ariaLabel}
      style={{ transform, transformStyle: "preserve-3d" }}
      className={cn(
        "rounded-2xl border bg-white text-left transition-shadow",
        selected
          ? "border-accent/40 shadow-[0_20px_44px_-20px_rgba(83,74,183,0.4)]"
          : "border-line shadow-[0_10px_30px_-18px_rgba(16,27,45,0.25)] hover:shadow-[0_22px_48px_-22px_rgba(16,27,45,0.35)]",
        className
      )}
    >
      {children}
    </Tag>
  );
}
