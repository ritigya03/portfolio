import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard, type Project } from "./ProjectCard";
import casper from "@/assets/project-casper.jpg";

const FEATURED: Project = {
  title: "CASPER CRED IQ",
  subtitle: "AI × Blockchain × Credentials",
  description:
    "A decentralized credential platform exploring how blockchain and AI can make credential issuance and verification more trustworthy.",
  tags: ["AI", "Blockchain", "Next.js", "TypeScript", "Rust"],
  image: casper,
  featured: true,
};

const OTHERS: Project[] = [
  {
    title: "Signal & Noise",
    subtitle: "AI / ML",
    description:
      "A small research project on model interpretability — turning messy model outputs into explanations a human can actually trust.",
    tags: ["Python", "PyTorch", "Notebooks"],
  },
  {
    title: "Quiet Perimeter",
    subtitle: "Security",
    description:
      "A lightweight threat-surface scanner built while learning offensive security: enumerate, score, and prioritise what actually matters.",
    tags: ["Cybersecurity", "Python", "Automation"],
  },
  {
    title: "Consulting Sandbox",
    subtitle: "Deloitte · internship work",
    description:
      "Internal tooling and analysis work exploring how enterprise teams adopt emerging technology responsibly.",
    tags: ["Data", "Enterprise", "Process"],
  },
  {
    title: "GridDB Supply Chain",
    subtitle: "Distributed Systems",
    description:
      "A time-series supply-chain dashboard on GridDB — ingesting sensor events and surfacing bottlenecks in near real time.",
    tags: ["GridDB", "Time Series", "React"],
  },
];

export function Projects() {
  return (
    <section id="work" className="relative px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          align="left"
          title="little things i've made ✦"
          note="a few technical and creative ventures"
        />

        <div className="mt-14 space-y-8">
          <Reveal>
            <ProjectCard project={FEATURED} />
          </Reveal>

          <div className="grid gap-8 md:grid-cols-2">
            {OTHERS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
