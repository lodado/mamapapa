"use client";

import { forwardRef, createContext, useContext } from "react";
import { cn } from "@/shared/utils";
import { CalendarContextValue, CalendarProps } from "./types";
import { useCalendar, UseCalendarOptions } from "./hooks/useCalendar";

const CalendarContext = createContext<CalendarContextValue | null>(null);

export const useCalendarContext = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("Calendar components must be used within a Calendar");
  }
  return context;
};

const Calendar = forwardRef<HTMLDivElement, CalendarProps & UseCalendarOptions>(
  ({ children, className, value, onValueChange, initialDate, onDateChange, ...props }, ref) => {
    const calendar = useCalendar({ 
      initialDate: value || initialDate, 
      onDateChange: onValueChange || onDateChange 
    });

    const contextValue: CalendarContextValue = {
      value: calendar.selectedDate || undefined,
      onValueChange: calendar.setSelectedDate,
      calendar,
    };

    return (
      <CalendarContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            "bg-white overflow-hidden relative rounded-[3px] shadow-[0px_3px_5px_0px_rgba(9,30,66,0.2),0px_0px_1px_0px_rgba(9,30,66,0.31)]",
            className
          )}
          role="application"
          aria-label="Calendar"
          aria-roledescription="calendar"
          {...props}
        >
          {children}
        </div>
      </CalendarContext.Provider>
    );
  }
);

Calendar.displayName = "Calendar";

export default Calendar;
