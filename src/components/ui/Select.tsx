"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="input-label">
            {label}
          </label>
        )}
        <select
          id={id}
          className={cn(
            "input-field cursor-pointer",
            error && "border-red-400 focus:border-red-400 focus:ring-red-400",
            className
          )}
          ref={ref}
          {...props}
        >
          <option value="">Selecteer een optie</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="input-error">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
