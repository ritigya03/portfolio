import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { MagicRevealText } from "@/components/effects/MagicRevealText";
import { FloatingMoons } from "@/components/effects/FloatingMoons";

export function SectionHeading({
  title,
  note,
  align = "center",
  className,
}: {
  title: ReactNode;
  note?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "relative",
        align === "center" ? "text-center" : "text-left",
        className,
      )}
    >
      {/* Orbiting moon phases */}
      <FloatingMoons count={4} />
      <h2 className="font-display text-4xl leading-tight text-plum-deep sm:text-5xl md:text-6xl">
        {typeof title === "string" ? (
          <MagicRevealText staggerMs={35}>{title}</MagicRevealText>
        ) : (
          title
        )}
      </h2>
      {note ? (
        <p className="mt-3 font-hand text-xl text-plum-muted sm:text-2xl">
          {note}
        </p>
      ) : null}
    </Reveal>
  );
}
