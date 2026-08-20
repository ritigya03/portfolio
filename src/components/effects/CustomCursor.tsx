import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";

type Mode = "default" | "button" | "card";

export function CustomCursor() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>("default");
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>(
    [],
  );

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 320, damping: 30, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 320, damping: 30, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
    document.documentElement.classList.add("no-cursor");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = (e.target as HTMLElement)?.closest?.("[data-cursor]");
      const next = el?.getAttribute("data-cursor");
      setMode(next === "card" ? "card" : next === "button" ? "button" : "default");
    };

    const click = (e: MouseEvent) => {
      const id = Date.now() + Math.random();
      setRipples((r) => [...r, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setRipples((r) => r.filter((i) => i.id !== id)), 700);
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("click", click);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("click", click);
      document.documentElement.classList.remove("no-cursor");
    };
  }, [reduced, x, y]);

  if (!enabled) return null;

  const size = mode === "card" ? 78 : mode === "button" ? 46 : 26;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      <motion.div
        className="absolute rounded-full"
        style={{
          x: sx,
          y: sy,
          translateX: "-50%",
          translateY: "-50%",
          backdropFilter: "blur(2px) saturate(180%)",
        }}
        animate={{
          width: size,
          height: size,
          backgroundColor:
            mode === "default"
              ? "color-mix(in oklab, var(--dream) 32%, transparent)"
              : "color-mix(in oklab, var(--pearl) 25%, transparent)",
          borderWidth: mode === "card" ? 2 : 1,
          boxShadow:
            mode === "default"
              ? "0 0 18px color-mix(in oklab, var(--dream) 50%, transparent)"
              : "0 0 30px color-mix(in oklab, var(--lavender) 70%, transparent)",
        }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
        <div className="h-full w-full rounded-full border border-white/70" />
      </motion.div>

      {ripples.map((r) => (
        <motion.div
          key={r.id}
          className="absolute rounded-full border border-dream"
          style={{ left: r.x, top: r.y, translateX: "-50%", translateY: "-50%" }}
          initial={{ width: 8, height: 8, opacity: 0.9 }}
          animate={{ width: 90, height: 90, opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
