"use client";

import { type ComponentRenderProps } from "@json-render/react";
import { useData } from "@json-render/react";
import { getByPath } from "@json-render/core";
import { cn } from "@/lib/utils";

function useResolvedValue<T>(
  value: T | { path: string } | null | undefined,
): T | undefined {
  const { data } = useData();
  if (value === null || value === undefined) return undefined;
  if (typeof value === "object" && "path" in value) {
    return getByPath(data, value.path) as T | undefined;
  }
  return value as T;
}

export function Alert({ element }: ComponentRenderProps) {
  const { message, variant } = element.props as {
    message: string | { path: string };
    variant?: string | null;
  };
  const resolvedMessage = useResolvedValue(message);

  const variantClasses: Record<string, string> = {
    default: "bg-background text-foreground",
    destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
    success: "border-green-500/50 text-green-600 dark:border-green-500 [&>svg]:text-green-600",
    warning: "border-yellow-500/50 text-yellow-600 dark:border-yellow-500 [&>svg]:text-yellow-600",
    info: "bg-muted text-muted-foreground",
  };

  return (
    <div
      className={cn(
        "relative w-full rounded-lg border p-4 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
        variantClasses[variant || "info"] || variantClasses.info
      )}
    >
      {resolvedMessage}
    </div>
  );
}
