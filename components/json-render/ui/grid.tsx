"use client";

import { type ComponentRenderProps } from "@json-render/react";
import { cn } from "@/lib/utils";

export function Grid({ element, children }: ComponentRenderProps) {
  const { columns, gap } = element.props as {
    columns?: number | null;
    gap?: string | null;
  };
  
  const gapClasses: Record<string, string> = {
    none: "gap-0",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  };

  return (
    <div
      className={cn("grid", gapClasses[gap || "md"] || gapClasses.md)}
      style={{
        gridTemplateColumns: `repeat(${columns || 2}, 1fr)`,
      }}
    >
      {children}
    </div>
  );
}
