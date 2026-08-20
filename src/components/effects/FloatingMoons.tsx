/**
 * FloatingMoons — tiny crescent moon phase icons that gently orbit
 * around a section when it scrolls into view. Purely decorative.
 */
import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

const MOON_PHASES = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"];

interface MoonConfig {
  phase: string;
  orbitRadius: number;    // px from center
  startAngle: number;     // degrees
  duration: number;       // seconds per revolution
  direction: 1 | -1;     // clockwise vs counter
  size: number;           // font-size in px
  delay: number;          // animation delay
}

function generateMoons(count: number): MoonConfig[] {
  return Array.from({ length: count }, (_, i) => ({
    phase: MOON_PHASES[i % MOON_PHASES.length]!,
    orbitRadius: 50 + Math.random() * 80,
    startAngle: (360 / count) * i + Math.random() * 30,
    duration: 12 + Math.random() * 16,
    direction: (Math.random() > 0.5 ? 1 : -1) as 1 | -1,
    size: 10 + Math.random() * 8,
    delay: i * 0.15,
  }));
}

export function FloatingMoons({
  count = 5,
  className,
}: {
  count?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  const reduced = useReducedMotion();

  const moons = useRef(generateMoons(count)).current;

  if (reduced) return null;

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute inset-0 overflow-visible ${className ?? ""}`}
      aria-hidden
    >
      {moons.map((moon, i) => {
        // Use CSS keyframes via motion for the orbit
        const angleRad = (moon.startAngle * Math.PI) / 180;
        const endAngle = angleRad + Math.PI * 2 * moon.direction;

        return (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2"
            style={{
              fontSize: moon.size,
              filter: "drop-shadow(0 0 6px rgba(255, 220, 245, 0.6))",
              willChange: "transform",
            }}
            initial={{
              opacity: 0,
              x:
                Math.cos(angleRad) * moon.orbitRadius - moon.size / 2,
              y:
                Math.sin(angleRad) * moon.orbitRadius - moon.size / 2,
            }}
            animate={
              isInView
                ? {
                    opacity: [0, 0.75, 0.75, 0.75, 0.75],
                    x: [0, 1, 2, 3, 4].map(
                      (step) =>
                        Math.cos(
                          angleRad +
                            ((Math.PI * 2 * moon.direction) / 4) * step
                        ) *
                          moon.orbitRadius -
                        moon.size / 2
                    ),
                    y: [0, 1, 2, 3, 4].map(
                      (step) =>
                        Math.sin(
                          angleRad +
                            ((Math.PI * 2 * moon.direction) / 4) * step
                        ) *
                          moon.orbitRadius -
                        moon.size / 2
                    ),
                  }
                : { opacity: 0 }
            }
            transition={
              isInView
                ? {
                    duration: moon.duration,
                    repeat: Infinity,
                    ease: "linear",
                    delay: moon.delay,
                  }
                : { duration: 0.3 }
            }
          />
        );
      })}
    </div>
  );
}
