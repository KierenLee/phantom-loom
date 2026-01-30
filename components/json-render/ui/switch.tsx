"use client";

import { type ComponentRenderProps } from "@json-render/react";
import { useData, useFieldValidation } from "@json-render/react";
import { getByPath } from "@json-render/core";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

/**
 * Switch component
 * Toggle switch input
 */
export function Switch({ element }: ComponentRenderProps) {
  const { label, valuePath, checks, validateOn } = element.props as {
    label: string;
    valuePath: string;
    checks?: Array<{ fn: string; message: string }> | null;
    validateOn?: string | null;
  };

  const { data, set } = useData();
  const value = getByPath(data, valuePath) as boolean | undefined;

  const validationOptions = useMemo(
    () => ({
      checks: checks ?? undefined,
      validateOn: (validateOn as "change" | "blur" | "submit") ?? "change",
    }),
    [checks, validateOn],
  );

  const { errors, validate, touch } = useFieldValidation(
    valuePath,
    validationOptions,
  );

  return (
    <div className="flex flex-col gap-2">
      <label className="flex cursor-pointer items-center gap-2 text-sm leading-none font-medium select-none">
        <div
          className={cn(
            "peer relative inline-flex h-[20px] w-[36px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            value ? "bg-primary" : "bg-input",
          )}
        >
          <div
            className={cn(
              "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform",
              value ? "translate-x-4" : "translate-x-0",
            )}
          />
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => {
              set(valuePath, e.target.checked);
              if (validateOn === "change" || !validateOn) validate();
            }}
            onBlur={() => {
              touch();
              if (validateOn === "blur") validate();
            }}
            className="absolute h-full w-full cursor-pointer opacity-0"
          />
        </div>
        {label}
      </label>
      {errors.map((error, i) => (
        <span key={i} className="text-[0.8rem] font-medium text-destructive">
          {error}
        </span>
      ))}
    </div>
  );
}
