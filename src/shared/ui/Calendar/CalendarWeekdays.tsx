"use client";

import { forwardRef } from "react";

import { cn } from "@/shared/utils";

import { CalendarWeekdaysProps } from "./types";

const defaultWeekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const CalendarWeekdays = forwardRef<HTMLDivElement, CalendarWeekdaysProps>(
  ({ className, weekdays = defaultWeekdays, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid grid-cols-7 items-center font-bold not-italic text-[#6b778c] text-[11px] text-center",
          className
        )}
        role="row"
        aria-label="Weekdays"
        {...props}
      >
        {weekdays.map((weekday, index) => (
          <div
            key={`${weekday}-${index}`}
            className="flex flex-col justify-center"
            role="columnheader"
            aria-label={weekday}
          >
            <p className="leading-[16px]">{weekday}</p>
          </div>
        ))}
      </div>
    );
  }
);

CalendarWeekdays.displayName = "CalendarWeekdays";

export default CalendarWeekdays;
