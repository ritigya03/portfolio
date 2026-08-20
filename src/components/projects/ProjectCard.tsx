import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type Project = {
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  image?: string;
  featured?: boolean;
};

export function ProjectCard({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [spot, setSpot] = useState({ x: 50, y: 50 });

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
      className="glass glare group relative h-full overflow-hidden rounded-4xl"
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
          "relative grid",
          project.featured ? "lg:grid-cols-2" : "grid-cols-1",
        )}
      >
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
                className="rounded-full border border-ballet/40 bg-pearl/40 px-3.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-plum-muted"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-6 text-xs font-medium uppercase tracking-[0.18em]">
            <a
              href="#contact"
              data-cursor="button"
              className="flex items-center gap-2 text-accent-pink transition-all hover:gap-3"
            >
              view project →
            </a>
            <a
              href="#contact"
              data-cursor="button"
              className="text-plum-muted/70 transition-colors hover:text-plum-deep"
            >
              github ↗
            </a>
          </div>
        </div>

        {project.image && (
          <div className="overflow-hidden bg-gradient-to-br from-periwinkle/20 to-lavender/20 p-6 sm:p-8">
            <img
              src={project.image}
              alt={`${project.title} preview`}
              loading="lazy"
              width={1200}
              height={800}
              className="h-full w-full rounded-3xl border border-white/60 object-cover shadow-[var(--shadow-dreamy)] transition-transform duration-[1200ms] ease-[var(--ease-dream)] group-hover:scale-[1.04]"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
