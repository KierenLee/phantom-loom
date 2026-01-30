"use client";

import { type ComponentRenderProps } from "@json-render/react";
import { useData, useFieldValidation } from "@json-render/react";
import { getByPath } from "@json-render/core";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

/**
 * RadioGroup component
 * Selection from a list of options using radio buttons
 */
export function RadioGroup({ element }: ComponentRenderProps) {
  const { label, valuePath, options, checks, validateOn } = element.props as {
    label: string;
    valuePath: string;
    options: Array<{ value: string; label: string }>;
    checks?: Array<{ fn: string; message: string }> | null;
    validateOn?: string | null;
  };

  const { data, set } = useData();
  const value = getByPath(data, valuePath) as string | undefined;

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
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium leading-none">{label}</label>
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-2 text-sm font-normal cursor-pointer"
          >
            <input
              type="radio"
              name={valuePath}
              value={opt.value}
              checked={value === opt.value}
              onChange={(e) => {
                set(valuePath, e.target.value);
                if (validateOn === "change" || !validateOn) validate();
              }}
              onBlur={() => {
                touch();
                if (validateOn === "blur") validate();
              }}
              className="h-4 w-4 border-primary text-primary focus:ring-1 focus:ring-ring accent-primary cursor-pointer"
            />
            {opt.label}
          </label>
        ))}
      </div>
      {errors.map((error, i) => (
        <span key={i} className="text-[0.8rem] font-medium text-destructive">
          {error}
        </span>
      ))}
    </div>
  );
}
