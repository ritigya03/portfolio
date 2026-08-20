import { motion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { ScrollConstellation } from "@/components/effects/ScrollConstellation";

const TECH = [
  "AI / ML",
  "Cybersecurity",
  "Web Development",
  "Blockchain",
  "Systems",
  "Problem Solving",
];

const DREAM = [
  "Fashion",
  "Creativity",
  "Visual Ideas",
  "New Experiences",
  "Curiosity",
  "Exploration",
];

export function About({
  mood,
  onToggleMood,
}: {
  mood: "tech" | "dream";
  onToggleMood: () => void;
}) {
  return (
    <section id="about" className="relative px-6 py-28 sm:py-36">
      <ScrollConstellation side="right" />
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title={
            <>
              two sides, one girl.{" "}
              <button
                type="button"
                data-cursor="button"
                onClick={onToggleMood}
                aria-label="switch mood"
                title="switch mood"
                className="inline-block align-middle text-accent-pink transition-transform duration-700 hover:rotate-12"
              >
                ♊︎
              </button>
            </>
          }
          note="why choose one thing?"
        />

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <Reveal delay={0.05}>
            <motion.div
              animate={{ scale: mood === "tech" ? 1.015 : 1 }}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            >
              <GlassCard
                glare
                className="h-full p-9 sm:p-11"
              >
                <div className="mb-8 flex items-start justify-between gap-4">
                  <div>
                    <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-plum-muted/70">
                      side a — engineering
                    </span>
                    <h3 className="font-display text-3xl text-plum-deep sm:text-4xl">
                      THE TECH GIRL
                    </h3>
                  </div>
                  <div className="grid size-12 shrink-0 place-items-center rounded-full border border-mint bg-mint/25 text-accent-pink">
                    ⚙︎
                  </div>
                </div>
                <ul className="space-y-3.5">
                  {TECH.map((t) => (
                    <li
                      key={t}
                      className="flex items-center gap-3 text-base text-plum-muted"
                    >
                      <span className="size-1.5 rounded-full bg-mint" />
                      {t}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </motion.div>
          </Reveal>

          <Reveal delay={0.15}>
            <motion.div
              animate={{ scale: mood === "dream" ? 1.015 : 1 }}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            >
              <GlassCard className="relative h-full rotate-[0.6deg] bg-ballet/10 p-9 sm:p-11">
                <span className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-2 rounded-[2px] bg-pearl/70 shadow-sm" />
                <div className="mb-8 flex items-start justify-between gap-4">
                  <div>
                    <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-plum-muted/70">
                      side b — creative
                    </span>
                    <h3 className="font-display text-3xl text-plum-deep sm:text-4xl">
                      THE DREAMER
                    </h3>
                  </div>
                  <div className="grid size-12 shrink-0 place-items-center rounded-full border border-ballet bg-ballet/25 text-accent-pink">
                    ♡
                  </div>
                </div>
                <ul className="space-y-3.5">
                  {DREAM.map((t) => (
                    <li
                      key={t}
                      className="flex items-center gap-3 text-base text-plum-muted"
                    >
                      <span className="size-1.5 rounded-full bg-accent-pink/60" />
                      {t}
                    </li>
                  ))}
                </ul>
                <p className="mt-8 -rotate-2 font-hand text-xl text-accent-pink">
                  silk & circuit boards ✦
                </p>
              </GlassCard>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
