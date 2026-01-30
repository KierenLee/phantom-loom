"use client";

import { type ComponentRenderProps } from "@json-render/react";
import { useData, useFieldValidation } from "@json-render/react";
import { getByPath } from "@json-render/core";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

export function Slider({ element }: ComponentRenderProps) {
  const { label, valuePath, min, max, step, checks, validateOn } =
    element.props as {
      label: string;
      valuePath: string;
      min?: number | null;
      max?: number | null;
      step?: number | null;
      checks?: Array<{ fn: string; message: string }> | null;
      validateOn?: string | null;
    };

  const { data, set } = useData();
  const value = getByPath(data, valuePath) as number | undefined;

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
      <div className="flex justify-between">
        <label className="text-sm font-medium leading-none">{label}</label>
        <span className="text-sm text-muted-foreground">
          {value ?? min ?? 0}
        </span>
      </div>
      <input
        type="range"
        min={min ?? 0}
        max={max ?? 100}
        step={step ?? 1}
        value={value ?? min ?? 0}
        onChange={(e) => {
          set(valuePath, Number(e.target.value));
          if (validateOn === "change" || !validateOn) validate();
        }}
        onBlur={() => {
          touch();
          if (validateOn === "blur") validate();
        }}
        className="w-full cursor-pointer accent-primary"
      />
      {errors.map((error, i) => (
        <span key={i} className="text-[0.8rem] font-medium text-destructive">
          {error}
        </span>
      ))}
    </div>
  );
}
