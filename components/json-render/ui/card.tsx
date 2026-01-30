"use client";

import { type ComponentRenderProps } from "@json-render/react";
import { cn } from "@/lib/utils";

export function Card({ element, children }: ComponentRenderProps) {
  const { title, description, padding } = element.props as {
    title?: string | null;
    description?: string | null;
    padding?: string | null;
  };

  const paddingClasses: Record<string, string> = {
    none: "p-0",
    sm: "p-3",
    lg: "p-6",
    default: "p-4",
  };

  return (
    <div
      className={cn(
        "rounded-[var(--radius)] border border-border bg-card text-card-foreground shadow-sm"
      )}
    >
      {(title || description) && (
        <div className="flex flex-col space-y-1.5 border-b border-border p-5">
          {title && (
            <h3 className="font-semibold leading-none tracking-tight">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}
      <div className={cn(paddingClasses[padding || "default"] || "p-4")}>
        {children}
      </div>
    </div>
  );
}
