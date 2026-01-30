"use client";

import { type ComponentRenderProps } from "@json-render/react";
import { cn } from "@/lib/utils";

export function Button({ element, onAction, loading }: ComponentRenderProps) {
  const { label, variant, action, disabled } = element.props as {
    label: string;
    variant?: string | null;
    action: {
      name: string;
      confirm?: {
        title: string;
        message: string;
      };
    };
    disabled?: boolean | null;
  };

  const variantClasses: Record<string, string> = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
    danger:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm",
  };

  // Map 'secondary' from original inline style (transparent + border) to 'outline' if it matches better,
  // or keep semantic 'secondary' if global theme defines it well.
  // Original 'secondary' was: background: "transparent", color: foreground, border: 1px solid border.
  // This matches Tailwind's 'outline' variant usually.
  // However, I'll stick to semantic mapping. If variant is "secondary", I use secondary classes.
  // If original code had "secondary" behaving like "outline", I might want to map it to outline classes.
  // Let's assume standard theme intent.

  return (
    <button
      onClick={() => {
        console.log("disabled", disabled, "loading", loading, action);
        !disabled && !loading && onAction?.(action);
      }}
      disabled={!!disabled || loading}
      className={cn(
        "inline-flex items-center justify-center rounded-[var(--radius)] text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        "h-9 px-4 py-2", // Default size (matches 8px 16px padding)
        variantClasses[variant || "primary"] || variantClasses.primary,
      )}
    >
      {loading ? "Loading..." : label}
    </button>
  );
}
