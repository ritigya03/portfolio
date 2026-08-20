import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";

import { CustomCursor } from "@/components/effects/CustomCursor";
import { HolographicBackground } from "@/components/effects/HolographicBackground";
import { FloatingNav } from "@/components/navigation/FloatingNav";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { Projects } from "@/components/projects/Projects";
import { Experience } from "@/components/experience/Experience";
import { Skills } from "@/components/skills/Skills";
import { Currently } from "@/components/currently/Currently";
import { Scrapbook } from "@/components/scrapbook/Scrapbook";
import { Contact, Footer } from "@/components/contact/Contact";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ritigya — a little bit of everything" },
      {
        name: "description",
        content:
          "Portfolio of Ritigya, a final-year CS student exploring AI, security, blockchain and creative technology. Projects, experience and a little bit of magic.",
      },
      { property: "og:title", content: "Ritigya — a little bit of everything" },
      {
        property: "og:description",
        content:
          "AI · technology · security · creativity · curiosity. Projects, experience and a dreamy digital scrapbook.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [mood, setMood] = useState<"tech" | "dream">("tech");
  const [secret, setSecret] = useState(false);

  const onSecret = useCallback(() => setSecret(true), []);

  useEffect(() => {
    if (!secret) return;
    const t = setTimeout(() => setSecret(false), 2400);
    return () => clearTimeout(t);
  }, [secret]);

  return (
    <div
      data-mood={mood}
      className="relative min-h-screen font-body text-plum-deep"
    >
      <HolographicBackground />
      <CustomCursor />
      <FloatingNav />

      <motion.div
        animate={{
          filter: mood === "dream" ? "saturate(1.14) hue-rotate(-6deg)" : "none",
        }}
        transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
      >
        <main>
          <Hero onSecret={onSecret} />
          <About
            mood={mood}
            onToggleMood={() =>
              setMood((m) => (m === "tech" ? "dream" : "tech"))
            }
          />
          <Projects />
          <Experience />
          <Skills />
          <Currently />
          <Scrapbook />
          <Contact onSecret={onSecret} />
        </main>
        <Footer />
      </motion.div>

      <AnimatePresence>
        {secret && (
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className="glass-strong fixed bottom-8 left-1/2 z-[90] -translate-x-1/2 rounded-full px-6 py-3 text-sm text-plum-deep"
          >
            you found a little secret ✦
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
