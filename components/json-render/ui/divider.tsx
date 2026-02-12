"use client";

import { type ComponentRenderProps } from "@json-render/react";
import { cn } from "@/lib/utils";

export function Divider({ element }: ComponentRenderProps) {
  const { orientation } = (element.props || {}) as {
    orientation?: string | null;
  };

  if (orientation === "vertical") {
    return <div className={cn("h-full w-[1px] bg-border")} />;
  }

  return <div className={cn("my-4 h-[1px] w-full bg-border")} />;
}
