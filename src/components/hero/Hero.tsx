import { motion, useReducedMotion, useMotionValue, useSpring } from "motion/react";
import { MagicalButton } from "@/components/ui/MagicalButton";
import { FloatingStickers } from "@/components/effects/FloatingStickers";
import portrait from "@/assets/portrait.jpg";

const KEYWORDS = ["AI", "technology", "security", "creativity", "curiosity"];

export function Hero({ onSecret }: { onSecret: () => void }) {
  const reduced = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 60, damping: 20 });
  const py = useSpring(my, { stiffness: 60, damping: 20 });
  const px2 = useSpring(mx, { stiffness: 34, damping: 18 });
  const py2 = useSpring(my, { stiffness: 34, damping: 18 });


  const onMove = (e: React.MouseEvent) => {
    if (reduced) return;
    const { innerWidth, innerHeight } = window;
    mx.set((e.clientX / innerWidth - 0.5) * 26);
    my.set((e.clientY / innerHeight - 0.5) * 20);
  };

  return (
    <header
      id="me"
      onMouseMove={onMove}
      className="relative flex min-h-screen items-center overflow-hidden px-6 pb-24 pt-32 sm:pt-36"
    >
      <FloatingStickers onSecret={onSecret} />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 md:grid-cols-[1.15fr_0.85fr]">
        <motion.div
          style={{ x: px, y: py }}
          className="relative z-10"
        >

          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
            className="mb-5 block font-hand text-2xl text-accent-pink"
          >
            ♊︎ hello, i&apos;m ritigya
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 22, filter: "blur(14px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.3, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
            className="font-display text-6xl leading-[0.92] text-plum-deep sm:text-7xl lg:text-8xl"
          >
            a little bit of
            <br />
            <span className="italic font-light text-holo">everything.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] uppercase tracking-[0.24em] text-plum-muted/80"
          >
            {KEYWORDS.map((k, i) => (
              <span key={k} className="flex items-center gap-3">
                {k}
                {i < KEYWORDS.length - 1 && (
                  <span className="text-dream">·</span>
                )}
              </span>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-7 max-w-md text-base leading-relaxed text-plum-muted"
          >
            I like learning things, building things, and following whatever
            makes me curious next.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.75 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <MagicalButton href="#work">enter my world →</MagicalButton>
            <MagicalButton href="#work" variant="ghost">
              view my work
            </MagicalButton>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ x: px2, y: py2 }}

          initial={{ opacity: 0, scale: 0.94, filter: "blur(16px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
          className="relative mx-auto w-full max-w-[300px] md:max-w-none"
        >
          <div className="absolute -left-8 -top-10 h-24 w-24 rounded-full bg-mint/40 blur-2xl" />
          <div className="glass glare relative rotate-3 rounded-4xl p-3 shadow-[var(--shadow-float)] transition-transform duration-700 hover:rotate-0">
            <img
              src={portrait}
              alt="Portrait of Ritigya in a soft pearlescent setting"
              width={1088}
              height={1440}
              className="aspect-[3/4] w-full rounded-3xl object-cover"
            />
            <div className="absolute -bottom-5 -right-4 -rotate-12 rounded-2xl border border-ballet/40 bg-pearl/85 px-4 py-1 font-hand text-2xl text-accent-pink shadow-[var(--shadow-dreamy)]">
              curiosity! ✦
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
