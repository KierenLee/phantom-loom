"use client";

import { type ComponentRenderProps } from "@json-render/react";
import { cn } from "@/lib/utils";

export function Empty({ element }: ComponentRenderProps) {
  const { title, description } = element.props as {
    title: string;
    description?: string | null;
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 px-5 text-center">
      <h3 className="mb-2 text-base font-semibold">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
