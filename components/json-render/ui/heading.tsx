"use client";

import React from "react";
import { type ComponentRenderProps } from "@json-render/react";
import { cn } from "@/lib/utils";

export function Heading({ element }: ComponentRenderProps) {
  const { text, level } = element.props as {
    text: string;
    level?: string | null;
  };
  const Tag = (level || "h2") as keyof React.JSX.IntrinsicElements;
  
  const sizeClasses: Record<string, string> = {
    h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
    h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
    h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
    h4: "scroll-m-20 text-xl font-semibold tracking-tight",
  };

  return (
    <Tag
      className={cn(
        "mb-4",
        sizeClasses[level || "h2"]
      )}
    >
      {text}
    </Tag>
  );
}
