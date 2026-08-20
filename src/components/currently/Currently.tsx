import { motion, useReducedMotion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const CARDS = [
  { label: "LEARNING", text: "DSA + System Design", tilt: -2 },
  { label: "BUILDING", text: "my little digital universe", tilt: 1.5 },
  { label: "EXPLORING", text: "AI + security + distributed systems", tilt: -1 },
  { label: "DREAMING ABOUT", text: "fashion × technology", tilt: 2.5 },
  { label: "PROBABLY DOING", text: "too many things at once", tilt: -2.5 },
];

export function Currently() {
  const reduced = useReducedMotion();

  return (
    <section id="now" className="relative px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title="currently... ♡" />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{
                duration: 0.9,
                delay: i * 0.07,
                ease: [0.19, 1, 0.22, 1],
              }}
              className={i === 4 ? "sm:col-span-2 lg:col-span-1" : ""}
            >
              <motion.div
                animate={reduced ? { y: 0 } : { y: [0, -10, 0] }}
                transition={{
                  duration: 7 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ rotate: c.tilt }}
                className="glass h-full rounded-4xl p-8"
              >
                <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-accent-pink">
                  {c.label}
                </span>
                <p className="mt-3 font-display text-2xl leading-snug text-plum-deep">
                  {c.text}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
