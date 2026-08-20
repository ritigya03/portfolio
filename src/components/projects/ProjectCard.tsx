import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type Project = {
  title: string;
  subtitle: string;
  description: string;
  longDescription?: string;
  tags: string[];
  image?: string;
  featured?: boolean;
  github?: string;
  devpost?: string;
};

export function ProjectCard({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [spot, setSpot] = useState({ x: 50, y: 50 });
  const [isFlipped, setIsFlipped] = useState(false);

  const onMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setSpot({ x: px * 100, y: py * 100 });
    setTilt({ rx: (0.5 - py) * 5, ry: (px - 0.5) * 5 });
  };

  const reset = () => {
    setTilt({ rx: 0, ry: 0 });
    setSpot({ x: 50, y: 50 });
  };

  return (
    <motion.div
      ref={ref}
      data-cursor="card"
      onMouseMove={onMove}
      onMouseLeave={reset}
      animate={{ rotateX: tilt.rx, rotateY: tilt.ry }}
      transition={{ type: "spring", stiffness: 130, damping: 18 }}
      style={{ transformPerspective: 1100 }}
      className="group relative h-full w-full"
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.7, type: "spring", stiffness: 200, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative h-full w-full"
      >
        {/* Front Face */}
        <div
          className="glass project-card glare relative flex h-full w-full flex-col overflow-hidden rounded-4xl"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            style={{
              background: `radial-gradient(420px circle at ${spot.x}% ${spot.y}%, color-mix(in oklab, var(--lavender) 45%, transparent), transparent 70%)`,
            }}
          />

          <div
            className={cn(
              "relative grid h-full flex-1",
              project.featured ? "lg:grid-cols-2" : "grid-cols-1 grid-rows-[auto_1fr]",
            )}
          >
            {/* Top Image for normal cards */}
            {project.image && !project.featured && (
              <div className="project-card-img-bg overflow-hidden bg-gradient-to-br from-periwinkle/20 to-lavender/20 p-6 pb-0 sm:p-8 sm:pb-0">
                <div className="aspect-[16/10] w-full overflow-hidden rounded-t-3xl border-x border-t border-border shadow-[var(--shadow-dreamy)]">
                  <img
                    src={project.image}
                    alt={`${project.title} preview`}
                    loading="lazy"
                    width={1200}
                    height={800}
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-dream)] group-hover:scale-[1.04]"
                  />
                </div>
              </div>
            )}

            <div
              className={cn(
                "flex flex-col justify-center",
                project.featured ? "p-9 sm:p-12" : "p-8",
              )}
            >
              <span className="mb-4 text-[10px] uppercase tracking-[0.26em] text-plum-muted/80">
                {project.subtitle}
              </span>
              <h3
                className={cn(
                  "font-display leading-tight text-plum-deep transition-colors duration-500 group-hover:text-accent-pink",
                  project.featured ? "text-4xl sm:text-5xl" : "text-3xl",
                )}
              >
                {project.title}
              </h3>
              <p className="mt-5 max-w-prose text-sm leading-relaxed text-plum-muted sm:text-base">
                {project.description}
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                {project.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-card/40 px-3.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-plum-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-6 text-xs font-medium uppercase tracking-[0.18em]">
                {project.devpost && (
                  <a
                    href={project.devpost}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="button"
                    className="flex items-center gap-2 text-accent-pink transition-all hover:gap-3"
                  >
                    devpost ↗
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="button"
                    className="text-plum-muted/70 transition-colors hover:text-plum-deep"
                  >
                    github ↗
                  </a>
                )}
                
                {project.longDescription && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFlipped(true);
                    }}
                    className="ml-auto flex items-center gap-2 rounded-full border border-accent-pink/30 bg-accent-pink/10 px-4 py-2 text-[10px] text-accent-pink transition-colors hover:bg-accent-pink/20"
                    aria-label="Read more about the project"
                  >
                    READ MORE
                    <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Side Image for featured cards */}
            {project.image && project.featured && (
              <div className="project-card-img-bg overflow-hidden bg-gradient-to-br from-periwinkle/20 to-lavender/20 p-6 sm:p-8">
                <img
                  src={project.image}
                  alt={`${project.title} preview`}
                  loading="lazy"
                  width={1200}
                  height={800}
                  className="h-full w-full rounded-3xl border border-border object-cover shadow-[var(--shadow-dreamy)] transition-transform duration-[1200ms] ease-[var(--ease-dream)] group-hover:scale-[1.04]"
                />
              </div>
            )}
          </div>
        </div>

        {/* Back Face */}
        <div
          className="glass project-card absolute inset-0 flex h-full w-full flex-col overflow-hidden rounded-4xl p-8 sm:p-12"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.26em] text-plum-muted/80">
                  Detailed Overview
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(false);
                  }}
                  className="rounded-full bg-border/50 p-2 text-plum-muted transition-colors hover:bg-border hover:text-plum-deep"
                  aria-label="Go back"
                >
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <h3 className="mt-4 font-display text-2xl text-plum-deep sm:text-3xl">
                {project.title}
              </h3>
              
              <div className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-plum-deep sm:text-base">
                {project.longDescription?.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

