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
          "absolute content-stretch flex font-bold items-start leading-0 left-[16px] not-italic text-[#6b778c] text-[11px] text-center top-[61px]",
          className
        )}
        role="row"
        aria-label="Weekdays"
        {...props}
      >
        {weekdays.map((weekday, index) => (
          <div
            key={weekday}
            className="flex flex-col justify-center relative shrink-0 w-[41px]"
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
