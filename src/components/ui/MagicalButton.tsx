import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  href?: string;
  variant?: "holo" | "ghost";
  className?: string;
  onClick?: () => void;
};

export function MagicalButton({
  children,
  href,
  variant = "holo",
  className,
  onClick,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  const handleMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * 0.18;
    const y = (e.clientY - (r.top + r.height / 2)) * 0.28;
    ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = "translate3d(0,0,0)";
  };

  const classes = cn(
    "inline-flex items-center justify-center rounded-full px-8 py-4 text-sm font-medium tracking-wide transition-[transform,box-shadow,background-color] duration-500",
    variant === "holo"
      ? "holo glare text-plum-deep shadow-[var(--shadow-dreamy)] border border-white/50"
      : "border border-plum-muted/25 text-plum-muted hover:bg-pearl/60",
    className,
  );

  const Comp = (href ? motion.a : motion.button) as typeof motion.a;

  return (
    <Comp
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      href={href}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      data-cursor="button"
      className={classes}
      style={{ willChange: "transform" }}
    >
      {children}
    </Comp>
  );
}
