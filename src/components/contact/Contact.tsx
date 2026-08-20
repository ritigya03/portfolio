import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { FloatingStickers } from "@/components/effects/FloatingStickers";

const LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/ritigya03",
    icon: (
      <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ritigya-gupta/",
    icon: (
      <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:ritigya00003@gmail.com",
    icon: (
      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export function Contact({ onSecret }: { onSecret: () => void }) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    // We use Web3Forms API to send the email directly to you without a backend.
    // NOTE: You must replace the access_key below with your own from https://web3forms.com/
    const payload = {
      access_key: "1fea8a38-94e2-4d1a-a8d3-55019d193345",
      name: formData.name,
      email: formData.email,
      message: formData.message,
      subject: `New Portfolio Message from ${formData.name}`,
    };

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.status === 200) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        alert("Message sent successfully! ✨");
      } else {
        setStatus("error");
        alert(json.message || "Failed to send message.");
      }
    } catch (err) {
      setStatus("error");
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <section id="contact" className="relative px-4 py-10 sm:py-16">
      <FloatingStickers onSecret={onSecret} />

      <Reveal className="relative z-10 mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-stretch lg:gap-8">

          {/* Left Side: Copy & Links */}
          <div className="glass-strong flex flex-1 flex-col justify-between rounded-4xl p-10 sm:p-14 lg:p-16">
            <div>
              <h2 className="font-display text-5xl leading-[1.05] text-plum-deep sm:text-6xl">
                let&apos;s make something <br />
                <span className="italic text-holo">together.</span>
              </h2>
              <p className="mt-6 max-w-sm text-base text-plum-muted leading-relaxed">
                Have a project in mind, a collaboration idea, or an exciting opportunity? I'm always open to hearing from you. Please reach out!
              </p>
            </div>

            <div className="mt-14 flex flex-wrap gap-6">
              {LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-full border border-plum-muted/20 bg-white/40 px-5 py-2.5 text-sm font-medium text-plum-deep shadow-sm transition-all hover:-translate-y-1 hover:bg-white/60 hover:text-accent-pink hover:shadow-md"
                >
                  {l.icon}
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right Side: Cutesy Form */}
          <div className="glass flex-1 rounded-4xl bg-gradient-to-br from-white/40 to-ballet/10 p-10 sm:p-14 lg:p-16">
            <h3 className="mb-8 font-hand text-3xl text-accent-pink">send a message</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <input
                type="text"
                required
                placeholder="your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-2xl border border-plum-muted/20 bg-transparent px-5 py-4 text-sm text-plum-deep placeholder:text-plum-muted/60 focus:outline-none focus:ring-2 focus:ring-accent-pink/50"
              />
              <input
                type="email"
                required
                placeholder="your email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-2xl border border-plum-muted/20 bg-transparent px-5 py-4 text-sm text-plum-deep placeholder:text-plum-muted/60 focus:outline-none focus:ring-2 focus:ring-accent-pink/50"
              />
              <textarea
                required
                placeholder="tell me everything..."
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full resize-none rounded-2xl border border-plum-muted/20 bg-transparent px-5 py-4 text-sm text-plum-deep placeholder:text-plum-muted/60 focus:outline-none focus:ring-2 focus:ring-accent-pink/50"
              />
              <button
                type="submit"
                disabled={status === "submitting"}
                className="mt-2 w-full rounded-2xl bg-plum-deep px-6 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-xl transition-all hover:-translate-y-1 hover:bg-accent-pink hover:shadow-accent-pink/30 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {status === "submitting" ? "sending..." : "send message"}
              </button>
            </form>
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
          {LINKS.map(l => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="hover:text-accent-pink">
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
