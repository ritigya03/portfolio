import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { id: "me", label: "ME" },
  { id: "work", label: "WORK" },
  { id: "journey", label: "JOURNEY" },
  { id: "now", label: "NOW" },
  { id: "contact", label: "CONTACT" },
];

export function FloatingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("me");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    LINKS.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) obs.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      obs.disconnect();
    };
  }, []);

  return (
    <nav className="fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 sm:top-6">
      <div
        className={cn(
          "flex items-center justify-between gap-4 rounded-full px-5 py-2.5 transition-all duration-700 sm:px-7",
          scrolled ? "glass-strong" : "glass",
        )}
      >
        <a
          href="#me"
          data-cursor="button"
          className="group relative font-display text-lg font-semibold tracking-tight text-accent-pink sm:text-xl"
        >
          ♡ RITIGYA GUPTA
          <span className="pointer-events-none absolute -bottom-6 left-2 rotate-[-8deg] font-hand text-base text-plum-muted opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            hi :)
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              data-cursor="button"
              className="relative px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-plum-muted transition-colors hover:text-accent-pink"
            >
              {active === l.id && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-ballet/30"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative">{l.label}</span>
            </a>
          ))}
        </div>

        <button
          type="button"
          data-cursor="button"
          aria-label="menu"
          onClick={() => setOpen((o) => !o)}
          className="rounded-full p-2 text-plum-muted md:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(8px)" }}
            transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            className="glass-strong mt-3 grid gap-1 rounded-3xl p-4 md:hidden"
          >
            {LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-xs font-medium uppercase tracking-[0.22em] text-plum-muted"
              >
                {l.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
