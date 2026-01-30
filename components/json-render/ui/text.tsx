"use client";

import { type ComponentRenderProps } from "@json-render/react";
import { cn } from "@/lib/utils";

export function Text({ element }: ComponentRenderProps) {
  const { content, variant } = element.props as {
    content: string;
    variant?: string | null;
  };
  
  const variantClasses: Record<string, string> = {
    default: "text-foreground",
    muted: "text-muted-foreground",
    success: "text-green-600 dark:text-green-500",
    warning: "text-yellow-600 dark:text-yellow-500",
    error: "text-destructive",
  };

  return (
    <p className={cn("m-0", variantClasses[variant || "default"] || variantClasses.default)}>
      {content}
    </p>
  );
}
