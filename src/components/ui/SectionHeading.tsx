import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

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
        align === "center" ? "text-center" : "text-left",
        className,
      )}
    >
      <h2 className="font-display text-4xl leading-tight text-plum-deep sm:text-5xl md:text-6xl">
        {title}
      </h2>
      {note ? (
        <p className="mt-3 font-hand text-xl text-plum-muted sm:text-2xl">
          {note}
        </p>
      ) : null}
    </Reveal>
  );
}
