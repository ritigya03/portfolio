import { motion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const ITEMS = [
  {
    org: "Deloitte",
    role: "Intern",
    year: "2026",
    body: "Working alongside a technology consulting team — supporting delivery, exploring emerging tech, and translating messy problems into clear, workable solutions.",
  },
  {
    org: "Casper Cred IQ",
    role: "Builder & Founding Engineer",
    year: "2025",
    body: "Designed and shipped a decentralized credential platform combining blockchain verification with AI-assisted validation.",
  },
  {
    org: "Hackathons",
    role: "Team Lead & Builder",
    year: "2024 — 2025",
    body: "Several 36-hour builds across AI, security and web3 — usually the person sketching the idea and wiring the demo together at 4am.",
  },
  {
    org: "Technical Communities",
    role: "Core Member",
    year: "2023 — 2025",
    body: "Organising workshops, mentoring juniors and keeping a campus community curious about security and machine learning.",
  },
];

export function Experience() {
  return (
    <section id="journey" className="relative px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-3xl">
        <SectionHeading title="where i've been ☁️" />

        <div className="relative mt-16 pl-10 sm:pl-14">
          <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-ballet via-lavender to-transparent sm:left-[19px]" />

          {ITEMS.map((item, i) => (
            <motion.div
              key={item.org}
              initial={{ opacity: 0, y: 26, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-90px" }}
              transition={{
                duration: 1,
                delay: i * 0.06,
                ease: [0.19, 1, 0.22, 1],
              }}
              className="relative pb-14 last:pb-0"
            >
              <span className="absolute -left-10 top-1 grid size-8 place-items-center rounded-full border border-white/70 bg-pearl/70 shadow-[var(--shadow-dreamy)] backdrop-blur-sm sm:-left-14">
                <span className="size-2 rounded-full bg-accent-pink" />
                <span className="absolute -right-1 -top-1 text-[10px] text-dream">
                  ✦
                </span>
              </span>

              <span className="text-[10px] font-medium uppercase tracking-[0.26em] text-accent-pink">
                {item.year}
              </span>
              <h3 className="mt-1 font-display text-3xl text-plum-deep">
                {item.org}
              </h3>
              <p className="mt-0.5 text-xs uppercase tracking-[0.2em] text-plum-muted/70">
                {item.role}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-plum-muted">
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
