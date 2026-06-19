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

const monthOptions = Array.from({ length: (toYear - fromYear + 1) * 12 }, (_, index) => {
  const year = fromYear + Math.floor(index / 12);
  const month = index % 12;
  const date = new Date(year, month, 1);

  return {
    value: `${year}-${String(month + 1).padStart(2, "0")}`,
    label: format(date, "MMMM yyyy"),
    date,
  };
});

function CalendarCaption({ displayMonth, id }: CaptionProps) {
  const { goToMonth, nextMonth, previousMonth } = useNavigation();
  const value = format(displayMonth, "yyyy-MM");

  return (
    <div className="flex items-center gap-2 px-1 pt-1">
      <button
        type="button"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100"
        )}
        onClick={() => previousMonth && goToMonth(previousMonth)}
        disabled={!previousMonth}
        aria-label="Previous month"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <select
        id={id}
        value={value}
        onChange={(event) => {
          const [year, month] = event.target.value.split("-").map(Number);
          goToMonth(startOfMonth(new Date(year, month - 1, 1)));
        }}
        className="h-9 min-w-0 flex-1 rounded-[var(--radius-input)] border border-border bg-input-background px-3 text-center text-[var(--text-sm)] font-[var(--font-weight-medium)] text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Select month and year"
      >
        {monthOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100"
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
