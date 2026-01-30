"use client";

import { type ComponentRenderProps } from "@json-render/react";
import { useData, useFieldValidation } from "@json-render/react";
import { getByPath } from "@json-render/core";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

/**
 * TextArea component
 * Multi-line text input with validation support
 */
export function TextArea({ element }: ComponentRenderProps) {
  const { label, valuePath, placeholder, rows, checks, validateOn } =
    element.props as {
      label: string;
      valuePath: string;
      placeholder?: string | null;
      rows?: number | null;
      checks?: Array<{ fn: string; message: string }> | null;
      validateOn?: string | null;
    };

  const { data, set } = useData();
  const value = getByPath(data, valuePath) as string | undefined;

  const validationOptions = useMemo(
    () => ({
      checks: checks ?? undefined,
      validateOn: (validateOn as "change" | "blur" | "submit") ?? "blur",
    }),
    [checks, validateOn],
  );

  const { errors, validate, touch } = useFieldValidation(
    valuePath,
    validationOptions,
  );

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
      <textarea
        value={value ?? ""}
        onChange={(e) => {
          set(valuePath, e.target.value);
          if (validateOn === "change") validate();
        }}
        onBlur={() => {
          touch();
          if (validateOn === "blur" || !validateOn) validate();
        }}
        placeholder={placeholder ?? ""}
        rows={rows ?? 3}
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          errors.length > 0 ? "border-destructive focus-visible:ring-destructive" : ""
        )}
      />
      {errors.map((error, i) => (
        <span key={i} className="text-[0.8rem] font-medium text-destructive">
          {error}
        </span>
      ))}
    </div>
  );
}
