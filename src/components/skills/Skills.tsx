import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const SKILLS = [
  { label: "Python", note: "my thinking language" },
  { label: "C++", note: "when speed matters" },
  { label: "JavaScript", note: "the glue" },
  { label: "TypeScript", note: "safer dreams" },
  { label: "React", note: "interfaces with feelings" },
  { label: "Next.js", note: "ship it" },
  { label: "SQL", note: "asking data questions" },
  { label: "AI / ML", note: "endlessly curious" },
  { label: "Cybersecurity", note: "break to understand" },
  { label: "Blockchain", note: "trust, engineered" },
  { label: "System Design", note: "the big picture" },
  { label: "Distributed Systems", note: "many minds, one state" },
];

export function Skills() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="skills" className="relative px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-5xl">
        <SectionHeading title="things i like building with ✦" />

        {/* constellation — desktop */}
        <div className="relative mx-auto mt-20 hidden aspect-square w-full max-w-2xl md:block">
          <div className="glass-strong absolute left-1/2 top-1/2 grid size-36 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full">
            <span className="font-display text-3xl italic text-holo">
              curiosity
            </span>
          </div>

          {SKILLS.map((s, i) => {
            const angle = (i / SKILLS.length) * Math.PI * 2 - Math.PI / 2;
            const radius = i % 2 === 0 ? 43 : 33;
            const left = 50 + Math.cos(angle) * radius;
            const top = 50 + Math.sin(angle) * radius;
            const isActive = active === i;

            return (
              <motion.button
                key={s.label}
                type="button"
                data-cursor="button"
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${left}%`, top: `${top}%` }}
                animate={
                  reduced
                    ? { y: 0 }
                    : { y: [0, i % 3 === 0 ? -9 : -5, 0] }
                }
                transition={{
                  duration: 6 + (i % 5),
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <span
                  className={`glass block whitespace-nowrap rounded-full px-4 py-2 text-xs tracking-wide transition-all duration-500 ${
                    isActive
                      ? "scale-110 bg-ballet/40 text-plum-deep shadow-[var(--shadow-float)]"
                      : active === null
                        ? "text-plum-muted"
                        : "text-plum-muted/50 opacity-70"
                  }`}
                >
                  {s.label}
                </span>
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap font-hand text-base text-accent-pink"
                  >
                    {s.note}
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* simple flow — mobile */}
        <div className="mt-12 flex flex-wrap justify-center gap-3 md:hidden">
          <span className="glass-strong rounded-full px-5 py-2 font-display text-lg italic text-accent-pink">
            curiosity
          </span>
          {SKILLS.map((s) => (
            <span
              key={s.label}
              className="glass rounded-full px-4 py-2 text-xs text-plum-muted"
            >
              {s.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
