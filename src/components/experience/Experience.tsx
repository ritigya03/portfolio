import { motion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const EXPERIENCE = [
  {
    org: "Deloitte",
    role: "TECHNOLOGY INTERN",
    year: "2026",
    body: "During my internship at Deloitte, I worked on an AI-powered application generation system using a multi-agent architecture, OpenCode SDK, and LLMs. Developed backend REST APIs with Node.js/Express and implemented planning, parallel execution, validation, observability, and automated application generation workflows.",
  },
  {
    org: "GridDB",
    role: "TECHNICAL BLOG CONTRIBUTOR",
    year: "2026",
    body: "Selected as a paid technical contributor to write about real-time data systems, data pipelines and practical applications of GridDB.",
  },
  {
    org: "Mentox",
    role: "WEB DEVELOPER INTERN",
    year: "2025",
    body: "Built production-ready ERP modules with React and TypeScript, translating Figma designs into responsive interfaces and integrating REST APIs.",
  },
  {
    org: "Women Engineers Program",
    role: "SCHOLAR · TALENTSPRINT × GOOGLE",
    year: "2024",
    body: "Selected for the Women Engineers program, joining a nationwide cohort of high-potential women in technology.",
  },
];

const ACHIEVEMENTS = [
  {
    icon: "♡",
    title: "3× Hackathon Winner",
    org: "Devpost",
    body: "Three hackathon wins across AI, Web3, security & technology.",
  },
  {
    icon: "♡",
    title: "Top 30 & Top 40 Finalist",
    org: "Casper Hackathon & Hack4Health",
    body: "Built CasperCredIQ at the Casper Hackathon and MedXact at Hack4Health.",
  },
  {
    icon: "♡",
    title: "Semi-Finalist",
    org: "Google Girl Hackathon 2025",
    body: "Advanced through multiple national-level rounds.",
  },
  {
    icon: "♡",
    title: "Selected Women Engineers Scholar",
    org: "TalentSprint, supported by Google",
    body: "Selected among top candidates nationwide.",
  },
  {
    icon: "♡",
    title: "Frontend Battle 2.0 – Top 10/5000+",
    org: "Tech Community",
    body: "Recognized for building a high-quality frontend application.",
  },
  {
    icon: "♡",
    title: "3rd place",
    org: "AWS ImpactX Challenge",
    body: "Awarded third place for innovative cloud architecture and impact.",
  },
];

export function Experience() {
  return (
    <section id="journey" className="relative px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-7xl">
        
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-12 xl:gap-20">
          
          {/* Left Column: Where I've Been */}
          <div>
            <SectionHeading title="where i've been" />
            
            <div className="relative mt-16 pl-10 sm:pl-14">
              {/* Timeline Line */}
              <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-ballet via-lavender to-transparent sm:left-[19px]" />

              {EXPERIENCE.map((item, i) => (
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
                  <h3 className="mt-1 font-display text-2xl text-plum-deep sm:text-3xl">
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

          {/* Right Column: Achievements */}
          <div>
            <SectionHeading title="achievements" />
            
            <div className="mt-12 flex flex-col gap-5">
              {ACHIEVEMENTS.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 30, filter: "blur(8px)" }}
                  whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.08,
                    ease: [0.19, 1, 0.22, 1],
                  }}
                  className="glass group relative flex items-start gap-4 rounded-3xl p-5 transition-transform duration-500 hover:-translate-y-1 hover:bg-white/40"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/50 bg-white/30 text-lg shadow-sm">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-plum-deep">
                      {item.title}
                    </h3>
                    <p className="mt-0.5 text-[11px] font-medium uppercase tracking-widest text-emerald-800">
                      {item.org}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-plum-muted">
                      {item.body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
