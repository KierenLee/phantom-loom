"use client";

import { type ComponentRenderProps } from "@json-render/react";
import { useData, useFieldValidation } from "@json-render/react";
import { getByPath } from "@json-render/core";
import { useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";

export function TextField({ element }: ComponentRenderProps) {
  const { label, valuePath, placeholder, type, checks, validateOn } =
    element.props as {
      label: string;
      valuePath: string;
      placeholder?: string | null;
      type?: string | null;
      checks?: Array<{ fn: string; message: string }> | null;
      validateOn?: string | null;
    };

  const { data, set } = useData();
  const value = getByPath(data, valuePath) as string | undefined;

  const validationOptions = useMemo(
    () => ({
      checks: checks ?? undefined,
      validateOn: (validateOn as "change" | "blur" | "submit") ?? "submit",
    }),
    [checks, validateOn],
  );

  const { errors, validate, touch } = useFieldValidation(
    valuePath,
    validationOptions,
  );

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
      <input
        type={type || "text"}
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
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          errors.length > 0
            ? "border-destructive focus-visible:ring-destructive"
            : "",
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
