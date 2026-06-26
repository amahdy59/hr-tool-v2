"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth } from "date-fns";
import { CaptionProps, DayPicker, useNavigation } from "react-day-picker";

import { cn } from "./utils";
import { buttonVariants } from "./button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const fromYear = 1900;
const toYear = new Date().getFullYear() + 10;

function CalendarCaption({ displayMonth }: CaptionProps) {
  const { goToMonth, nextMonth, previousMonth } = useNavigation();
  const currentYear = displayMonth.getFullYear();
  const currentMonth = displayMonth.getMonth();
  const isRtl = typeof document !== "undefined" && document.documentElement.dir === "rtl";
  const PreviousMonthIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextMonthIcon = isRtl ? ChevronLeft : ChevronRight;

  const years = Array.from({ length: toYear - fromYear + 1 }, (_, i) => fromYear + i);
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="flex items-center justify-between w-full gap-2 px-1 pt-1 pb-2">
      <button
        type="button"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-11 w-11 bg-transparent p-0 opacity-70 hover:opacity-100 shrink-0"
        )}
        onClick={() => previousMonth && goToMonth(previousMonth)}
        disabled={!previousMonth}
        aria-label="Previous month"
      >
        <PreviousMonthIcon className="calendar-nav-icon h-5 w-5" />
      </button>

      <div className="flex flex-1 gap-2 items-center justify-center">
        <div className="w-full max-w-[120px]">
          <Select
            value={currentMonth.toString()}
            onValueChange={(val) => goToMonth(new Date(currentYear, Number(val), 1))}
          >
            <SelectTrigger className="h-11 text-sm bg-input-background font-[var(--font-weight-medium)] border-border focus:ring-2 focus:ring-ring focus:ring-offset-0">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((m, i) => (
                <SelectItem key={m} value={i.toString()}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full max-w-[90px]">
          <Select
            value={currentYear.toString()}
            onValueChange={(val) => goToMonth(new Date(Number(val), currentMonth, 1))}
          >
            <SelectTrigger className="h-11 text-sm bg-input-background font-[var(--font-weight-medium)] border-border focus:ring-2 focus:ring-ring focus:ring-offset-0">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <button
        type="button"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-11 w-11 bg-transparent p-0 opacity-70 hover:opacity-100 shrink-0"
        )}
        onClick={() => nextMonth && goToMonth(nextMonth)}
        disabled={!nextMonth}
        aria-label="Next month"
      >
        <NextMonthIcon className="calendar-nav-icon h-5 w-5" />
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
        head_row: "flex w-full mb-1",
        head_cell:
          "text-muted-foreground rounded-[var(--radius)] w-9 h-9 font-[var(--font-weight-normal)] text-[var(--text-sm)] flex items-center justify-start ps-[12px] text-start",
        row: "flex w-full mt-1",
        cell: "h-9 w-9 text-center p-0 relative [&:has([aria-selected].day-range-end)]:rounded-e-[var(--radius)] [&:has([aria-selected].day-outside)]:bg-muted/50 [&:has([aria-selected])]:bg-muted first:[&:has([aria-selected])]:rounded-s-[var(--radius)] last:[&:has([aria-selected])]:rounded-e-[var(--radius)] focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-[var(--font-weight-normal)] text-[var(--text-sm)] aria-selected:opacity-100"
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
        IconLeft: () => <ChevronLeft className="calendar-nav-icon h-4 w-4" />,
        IconRight: () => <ChevronRight className="calendar-nav-icon h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
