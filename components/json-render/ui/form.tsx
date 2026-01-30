"use client";

import { type ComponentRenderProps } from "@json-render/react";
import { cn } from "@/lib/utils";

/**
 * Form component
 * Wraps children in a form tag and handles submission.
 */
export function Form({ element, children }: ComponentRenderProps) {
  const { layout } = element.props as {
    layout?: "vertical" | "horizontal" | null;
  };

  return (
    <form
      // 取消submit
      action=""
      onSubmit={(e) => e.preventDefault()}
      className={cn(
        "flex w-full gap-4",
        layout === "horizontal" ? "flex-row" : "flex-col",
      )}
    >
      {children}
    </form>
  );
}
