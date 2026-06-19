"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "./utils";
import { buttonVariants } from "./button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

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
      captionLayout="dropdown-buttons"
      fromYear={1900}
      toYear={new Date().getFullYear() + 10}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "hidden", // Hide the default caption label when using dropdowns
        caption_dropdowns: "flex justify-center gap-1", // Container for the dropdowns
        dropdown: "appearance-none bg-transparent border-none text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring rounded-md px-2 py-1 hover:bg-muted cursor-pointer",
        dropdown_month: "flex items-center",
        dropdown_year: "flex items-center",
        dropdown_icon: "hidden", // Hide default dropdown icon if any
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
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };