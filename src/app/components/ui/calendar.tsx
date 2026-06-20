"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth } from "date-fns";
import { CaptionProps, DayPicker, useNavigation } from "react-day-picker";

import { cn } from "./utils";
import { buttonVariants } from "./button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const fromYear = 1900;
const toYear = new Date().getFullYear() + 10;

function CalendarCaption({ displayMonth }: CaptionProps) {
  const { goToMonth, nextMonth, previousMonth } = useNavigation();
  const currentYear = displayMonth.getFullYear();
  const currentMonth = displayMonth.getMonth();

  const years = Array.from({ length: toYear - fromYear + 1 }, (_, i) => fromYear + i);
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="flex items-center justify-between w-full gap-1 px-1 pt-1 pb-2">
      <button
        type="button"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100 shrink-0"
        )}
        onClick={() => previousMonth && goToMonth(previousMonth)}
        disabled={!previousMonth}
        aria-label="Previous month"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="flex flex-1 gap-2 items-center justify-center">
        <div className="relative w-full max-w-[100px]">
          <select
            value={currentMonth}
            onChange={(e) => goToMonth(new Date(currentYear, Number(e.target.value), 1))}
            className="w-full h-8 appearance-none rounded-[var(--radius-input)] border border-border bg-input-background pl-2 pr-6 py-0 text-xs font-[var(--font-weight-medium)] text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
            aria-label="Select month"
          >
            {months.map((m, i) => (
              <option key={m} value={i}>{m}</option>
            ))}
          </select>
          <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 opacity-50 pointer-events-none rotate-90" />
        </div>
        
        <div className="relative w-full max-w-[80px]">
          <select
            value={currentYear}
            onChange={(e) => goToMonth(new Date(Number(e.target.value), currentMonth, 1))}
            className="w-full h-8 appearance-none rounded-[var(--radius-input)] border border-border bg-input-background pl-2 pr-6 py-0 text-xs font-[var(--font-weight-medium)] text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
            aria-label="Select year"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 opacity-50 pointer-events-none rotate-90" />
        </div>
      </div>

      <button
        type="button"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100 shrink-0"
        )}
        onClick={() => nextMonth && goToMonth(nextMonth)}
        disabled={!nextMonth}
        aria-label="Next month"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      fromYear={fromYear}
      toYear={toYear}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "block",
        caption_label: "hidden",
        caption_dropdowns: "hidden",
        dropdown: "hidden",
        dropdown_month: "hidden",
        dropdown_year: "hidden",
        dropdown_icon: "hidden",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 cursor-pointer"
        ),
        nav_button_previous: "absolute start-1",
        nav_button_next: "absolute end-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-[var(--radius)] w-9 font-[var(--font-weight-normal)] text-[var(--text-xs)]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center p-0 relative [&:has([aria-selected].day-range-end)]:rounded-e-[var(--radius)] [&:has([aria-selected].day-outside)]:bg-muted/50 [&:has([aria-selected])]:bg-muted first:[&:has([aria-selected])]:rounded-s-[var(--radius)] last:[&:has([aria-selected])]:rounded-e-[var(--radius)] focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-[var(--font-weight-normal)] aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-muted text-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-muted/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-muted aria-selected:text-foreground",
        day_hidden: "invisible",
        vhidden: "vhidden hidden", // Hide visually hidden elements
        ...classNames,
      }}
      components={{
        Caption: CalendarCaption,
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
