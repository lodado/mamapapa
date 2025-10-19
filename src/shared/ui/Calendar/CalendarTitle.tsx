"use client";

import { forwardRef } from "react";
import { cn } from "@/shared/utils";
import { useCalendarContext } from "./Calendar";

interface CalendarTitleProps {
  className?: string;
}

const CalendarTitle = forwardRef<HTMLDivElement, CalendarTitleProps>(
  ({ className, ...props }, ref) => {
    const { calendar } = useCalendarContext();
    
    if (!calendar) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "absolute flex flex-col font-bold justify-center leading-0 left-1/2 not-italic text-[#172b4d] text-[14px] text-center text-nowrap top-1/2 translate-x-[-50%] translate-y-[-50%]",
          className
        )}
        {...props}
      >
        <p className="leading-[16px] whitespace-pre">
          {calendar.formatMonthYear(calendar.currentDate)}
        </p>
      </div>
    );
  }
);

CalendarTitle.displayName = "CalendarTitle";

export default CalendarTitle;
