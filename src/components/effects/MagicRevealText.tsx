/**
 * MagicRevealText — each character shimmers into view with a tiny
 * sparkle burst as it appears, letter by letter, when scrolled
 * into the viewport. Works for both strings and React nodes.
 */
import { useRef, useState, useEffect, type ReactNode } from "react";
import { motion, useReducedMotion, useInView } from "motion/react";

// Sparkle burst data per letter
interface Sparkle {
  id: number;
  charIdx: number;
}

function SparkleEffect({ x, y }: { x: number; y: number }) {
  const particles = useRef(
    Array.from({ length: 5 }, () => ({
      angle: Math.random() * Math.PI * 2,
      dist: 8 + Math.random() * 16,
      size: 1.5 + Math.random() * 2,
    }))
  ).current;

  return (
    <motion.span
      className="pointer-events-none absolute"
      style={{ left: x, top: y }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            background:
              i % 2 === 0
                ? "rgba(255, 255, 255, 0.9)"
                : "rgba(255, 200, 230, 0.9)",
            boxShadow: "0 0 4px rgba(255, 220, 240, 0.8)",
          }}
          initial={{ x: 0, y: 0, scale: 1 }}
          animate={{
            x: Math.cos(p.angle) * p.dist,
            y: Math.sin(p.angle) * p.dist,
            scale: 0,
            opacity: 0,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      ))}
    </motion.span>
  );
}

export function MagicRevealText({
  children,
  className,
  staggerMs = 40,
}: {
  children: ReactNode;
  className?: string;
  staggerMs?: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  // Convert children to string for letter splitting
  const text = typeof children === "string" ? children : "";

  // If children isn't a string or reduced motion, just render directly
  if (reduced || !text) {
    return <span className={className}>{children}</span>;
  }

  const letters = text.split("");

  return (
    <span ref={ref} className={`relative inline ${className ?? ""}`}>
      {letters.map((char, i) => {
        const isSpace = char === " ";
        return (
          <motion.span
            key={i}
            className="relative inline-block"
            style={{ whiteSpace: isSpace ? "pre" : undefined }}
            initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
            animate={
              isInView
                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                : { opacity: 0, y: 8, filter: "blur(6px)" }
            }
            transition={{
              duration: 0.4,
              delay: i * (staggerMs / 1000),
              ease: [0.19, 1, 0.22, 1],
            }}
            onAnimationComplete={() => {
              if (!isSpace && isInView) {
                const id = Date.now() + Math.random();
                setSparkles((s) => [...s, { id, charIdx: i }]);
                setTimeout(
                  () => setSparkles((s) => s.filter((sp) => sp.id !== id)),
                  600
                );
              }
            }}
          >
            {char}
          </motion.span>
        );
      })}
      {/* Sparkle bursts */}
      {sparkles.map((sp) => {
        // Approximate char position
        const charEl = ref.current?.children[sp.charIdx] as HTMLElement | undefined;
        if (!charEl) return null;
        const rect = charEl.getBoundingClientRect();
        const parentRect = ref.current!.getBoundingClientRect();
        return (
          <SparkleEffect
            key={sp.id}
            x={rect.left - parentRect.left + rect.width / 2}
            y={rect.top - parentRect.top + rect.height / 2}
          />
        );
      })}
    </span>
  );
}
