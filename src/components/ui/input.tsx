"use client";

import * as React from "react";
import { cn } from "@/lib/utils/tailwind-merge";
import { Search } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  search?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, search, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {search && (
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
          />
        )}

        <input
          ref={ref}
          type={type}
          className={cn(
            "flex h-12 w-full rounded-lg border bg-transparent px-3 py-1 text-base shadow-sm transition-colors outline-none",
            "text-zinc-800 placeholder:text-zinc-400",
            "hover:border-zinc-400 focus:border-maroon-600",
            "dark:bg-zinc-700 dark:text-zinc-50 dark:placeholder:text-zinc-400 dark:border-zinc-600 dark:hover:border-zinc-700 dark:focus:border-softPink-300",
            "disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:border-none",
            search && "pl-10",
            error &&
              "border-red-600 hover:border-red-600 focus:border-red-600 dark:border-red-500",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
