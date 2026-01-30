"use client";

import { type ComponentRenderProps } from "@json-render/react";
import { useData, useFieldValidation } from "@json-render/react";
import { getByPath } from "@json-render/core";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

/**
 * Checkbox component
 * Boolean input with label
 */
export function Checkbox({ element }: ComponentRenderProps) {
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
      <label className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none">
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
          className="h-4 w-4 rounded border-primary text-primary shadow focus:ring-1 focus:ring-ring accent-primary cursor-pointer"
        />
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
