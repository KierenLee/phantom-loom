"use client";

import { type ComponentRenderProps } from "@json-render/react";
import { useData } from "@json-render/react";
import { getByPath } from "@json-render/core";
import { cn } from "@/lib/utils";

export function List({ element, children }: ComponentRenderProps) {
  const { dataPath } = element.props as { dataPath: string };
  const { data } = useData();
  const listData = getByPath(data, dataPath) as Array<unknown> | undefined;

  if (!listData || !Array.isArray(listData)) {
    return <div className="text-sm text-muted-foreground py-2">No items</div>;
  }

  // Add entry animation for the list container
  return (
    <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {children}
    </div>
  );
}
