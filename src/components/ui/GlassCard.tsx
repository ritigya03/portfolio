import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function GlassCard({
  children,
  className,
  strong = false,
  glare = false,
}: {
  children: ReactNode;
  className?: string;
  strong?: boolean;
  glare?: boolean;
}) {
  return (
    <div
      className={cn(
        strong ? "glass-strong" : "glass",
        glare && "glare",
        "rounded-4xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
