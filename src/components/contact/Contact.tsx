import { Reveal } from "@/components/ui/Reveal";
import { MagicalButton } from "@/components/ui/MagicalButton";
import { FloatingStickers } from "@/components/effects/FloatingStickers";

const LINKS = [
  { label: "GitHub", href: "https://github.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Email", href: "mailto:hello@ritigya.dev" },
];

export function Contact({ onSecret }: { onSecret: () => void }) {
  return (
    <section id="contact" className="relative px-6 py-32 sm:py-40">
      <FloatingStickers onSecret={onSecret} />

      <Reveal className="relative z-10 mx-auto max-w-4xl">
        <div className="glass-strong rounded-4xl px-8 py-20 text-center sm:px-16">
          <h2 className="font-display text-5xl leading-[1.05] text-plum-deep sm:text-6xl md:text-7xl">
            let&apos;s make something{" "}
            <span className="italic text-holo">magical.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-base text-plum-muted">
            Have an idea? Want to collaborate? Or just want to say hi?
          </p>

          <div className="mt-12">
            <MagicalButton href="mailto:hello@ritigya.dev" className="px-12 py-5 text-base">
              say hello ♡
            </MagicalButton>
          </div>

          <div className="mt-14 flex flex-wrap justify-center gap-8">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                data-cursor="button"
                className="text-[11px] font-medium uppercase tracking-[0.26em] text-plum-muted transition-colors hover:text-accent-pink"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative px-6 pb-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 border-t border-ballet/30 pt-10 text-center">
        <p className="font-hand text-xl text-plum-muted">
          made with curiosity, caffeine &amp; a little bit of magic ✦
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] uppercase tracking-[0.3em] text-plum-muted/60">
          <span>© 2026 Ritigya</span>
          <a href="https://github.com" className="hover:text-accent-pink">
            GitHub
          </a>
          <a href="https://linkedin.com" className="hover:text-accent-pink">
            LinkedIn
          </a>
          <a href="mailto:hello@ritigya.dev" className="hover:text-accent-pink">
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
