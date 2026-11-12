
"use client";

import { Check, ChevronsUpDown, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export interface SelectOption {
  id: string;
  label: string;
  description?: string;
}

interface Props {
  label: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  options: SelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
}

export function ResearchMultiSelect({
  label,
  placeholder = "Select items...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  options,
  value,
  onChange,
  disabled = false,
  loading = false,
  error,
}: Props) {
  const selectedOptions = options.filter((option) =>
    value.includes(option.id),
  );

  const toggleOption = (id: string) => {
    const isSelected = value.includes(id);

    if (isSelected) {
      onChange(value.filter((item) => item !== id));
    } else {
      onChange([...value, id]);
    }
  };

  const removeOption = (id: string) => {
    onChange(value.filter((item) => item !== id));
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {label}
      </label>

      <Popover>
        <PopoverTrigger
          disabled={disabled || loading}
          className="flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="truncate text-muted-foreground">
            {loading
              ? "Loading..."
              : value.length > 0
                ? `${value.length} selected`
                : placeholder}
          </span>

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </PopoverTrigger>

        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder={searchPlaceholder} />

            <CommandList>
              <CommandEmpty>
                {emptyMessage}
              </CommandEmpty>

              <CommandGroup>
                {options.map((option) => {
                  const selected = value.includes(option.id);

                  return (
                    <CommandItem
                      key={option.id}
                      value={`${option.label} ${option.description ?? ""}`}
                      onSelect={() => toggleOption(option.id)}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          selected
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />

                      <div className="flex flex-col">
                        <span>{option.label}</span>

                        {option.description && (
                          <span className="text-xs text-muted-foreground">
                            {option.description}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedOptions.map((option) => (
            <Badge
              key={option.id}
              variant="secondary"
              className="gap-1 py-1"
            >
              {option.label}

              <button
                type="button"
                onClick={() => removeOption(option.id)}
                disabled={disabled}
                className="ml-1 rounded-full outline-none hover:text-destructive"
                aria-label={`Remove ${option.label}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
