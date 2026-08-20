import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const GLYPHS = ["✦", "♡", "✧", "☁", "❀", "✿", "·", "✦"];

const SEEDS = [
  { left: "8%", top: "18%", size: 22, delay: 0 },
  { left: "22%", top: "70%", size: 16, delay: 1.2 },
  { left: "44%", top: "12%", size: 14, delay: 2.1 },
  { left: "62%", top: "78%", size: 20, delay: 0.6 },
  { left: "78%", top: "26%", size: 18, delay: 1.8 },
  { left: "90%", top: "62%", size: 15, delay: 2.6 },
  { left: "35%", top: "44%", size: 12, delay: 3.1 },
  { left: "70%", top: "50%", size: 13, delay: 1.4 },
];

export function FloatingStickers({
  onSecret,
  className = "",
}: {
  onSecret?: () => void;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [found, setFound] = useState<number[]>([]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 hidden overflow-hidden sm:block ${className}`}
    >
      {SEEDS.map((s, i) => (
        <motion.button
          key={i}
          type="button"
          aria-label="a tiny secret"
          data-cursor="button"
          onClick={() => {
            setFound((f) => [...f, i]);
            onSecret?.();
          }}
          className="pointer-events-auto absolute select-none text-dream/80 hover:text-accent-pink"
          style={{ left: s.left, top: s.top, fontSize: s.size }}
          animate={
            reduced
              ? { y: 0, opacity: 0.7 }
              : { y: [0, -14, 0], opacity: found.includes(i) ? [1, 0.4, 1] : [0.5, 0.95, 0.5] }
          }

          transition={{
            duration: 7 + i,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {GLYPHS[i % GLYPHS.length]}
        </motion.button>
      ))}
    </div>
  );
}
