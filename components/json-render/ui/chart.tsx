"use client";

import { type ComponentRenderProps } from "@json-render/react";
import { useData } from "@json-render/react";
import { getByPath } from "@json-render/core";
import { cn } from "@/lib/utils";

export function Chart({ element }: ComponentRenderProps) {
  const { title, dataPath } = element.props as {
    title?: string | null;
    dataPath: string;
  };
  const { data } = useData();
  const chartData = getByPath(data, dataPath) as
    | Array<{ label: string; value: number }>
    | undefined;

  if (!chartData || !Array.isArray(chartData)) {
    return <div className="p-5 text-muted-foreground">No data</div>;
  }

  const maxValue = Math.max(...chartData.map((d) => d.value));

  return (
    <div>
      {title && (
        <h4 className="mb-4 text-sm font-semibold leading-none tracking-tight">
          {title}
        </h4>
      )}
      <div className="flex h-[120px] items-end gap-2">
        {chartData.map((d, i) => (
          <div
            key={i}
            className="flex flex-1 flex-col items-center gap-1"
          >
            <div
              style={{
                height: `${(d.value / maxValue) * 100}%`,
              }}
              className="min-h-[4px] w-full rounded-t bg-foreground"
            />
            <span className="text-xs text-muted-foreground">
              {d.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
