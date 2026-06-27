"use client";

import * as React from "react";
import { format, isValid } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "./utils";
import { fieldControlClassName } from "./form-control";
import { Button } from "./button";
import { Calendar } from "./calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";

interface DatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  disabledDays?: (date: Date) => boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  disabled = false,
  disabledDays,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Parse the value string (YYYY-MM-DD) to a Date object safely
  const selectedDate = React.useMemo(() => {
    if (!value) return undefined;
    try {
      const parsed = new Date(value + "T00:00:00");
      return isValid(parsed) ? parsed : undefined;
    } catch {
      return undefined;
    }
  }, [value]);

  const handleSelect = (date: Date | undefined) => {
    if (date && onChange) {
      const formatted = format(date, "yyyy-MM-dd");
      onChange(formatted);
    } else if (!date && onChange) {
      onChange("");
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          data-slot="date-picker-trigger"
          className={cn(
            fieldControlClassName,
            "w-full justify-start text-start min-h-[44px] h-[44px] px-3 font-normal text-[var(--text-sm)] hover:bg-input-background focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            !selectedDate && "text-muted-foreground",
            className
          )}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-weight-normal)",
          }}
        >
          <CalendarIcon className="me-2 h-4 w-4 shrink-0" />
          {selectedDate ? (
            <span className="text-foreground truncate">
              {format(selectedDate, "dd MMM yyyy")}
            </span>
          ) : (
            <span className="truncate">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          disabled={disabledDays}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
