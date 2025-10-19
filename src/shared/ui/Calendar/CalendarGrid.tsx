"use client";

import { forwardRef } from "react";
import { cn } from "@/shared/utils";
import { useCalendarContext } from "./Calendar";
import CalendarDay from "./CalendarDay";

interface CalendarGridProps {
  className?: string;
}

const CalendarGrid = forwardRef<HTMLDivElement, CalendarGridProps>(
  ({ className, ...props }, ref) => {
    const { calendar } = useCalendarContext();
    
    if (!calendar) {
      return null;
    }

    const calendarDays = calendar.getCalendarDays();

    return (
      <div
        ref={ref}
        className={cn(
          "grid grid-cols-7 gap-0",
          className
        )}
        role="grid"
        aria-label="Calendar days"
        aria-live="polite"
        {...props}
      >
        {calendarDays.map((date, index) => (
          <CalendarDay
            key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${index}`}
            date={date}
            isCurrentMonth={calendar.isCurrentMonth(date)}
            isToday={calendar.isToday(date)}
            isSelected={calendar.isSelected(date)}
            onClick={calendar.setSelectedDate}
            className="h-8 w-[41px]"
          />
        ))}
      </div>
    );
  }
);

CalendarGrid.displayName = "CalendarGrid";

export default CalendarGrid;
