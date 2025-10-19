"use client";

import { createContext, forwardRef, useContext, useMemo } from "react";

import { cn } from "@/shared/utils";

import CalendarBody from "./CalendarBody";
import CalendarDay from "./CalendarDay";
import CalendarGrid from "./CalendarGrid";
import CalendarHeader from "./CalendarHeader";
import CalendarNavigation from "./CalendarNavigation";
import CalendarTitle from "./CalendarTitle";
import CalendarWeekdays from "./CalendarWeekdays";
import { useCalendar, UseCalendarOptions } from "./hooks/useCalendar";
import { CalendarContextValue, CalendarProps } from "./types";

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

    const contextValue = useMemo<CalendarContextValue>(() => ({
      value: calendar.selectedDate ?? undefined,
      onValueChange: calendar.setSelectedDate,
      calendar,
    }), [calendar]);

    return (
      <CalendarContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            "bg-white overflow-hidden relative rounded-[3px] shadow-[0px_3px_5px_0px_rgba(9,30,66,0.2),0px_0px_1px_0px_rgba(9,30,66,0.31)]",
            className
          )}
          role="grid"
          aria-label="Calendar"
          {...props}
        >
          {children}
        </div>
      </CalendarContext.Provider>
    );
  }
);

Calendar.displayName = "Calendar";

// Compound Pattern을 위한 타입 확장
const CalendarWithSubComponents = Calendar as typeof Calendar & {
  Header: typeof CalendarHeader;
  Body: typeof CalendarBody;
  Day: typeof CalendarDay;
  Navigation: typeof CalendarNavigation;
  Weekdays: typeof CalendarWeekdays;
  Title: typeof CalendarTitle;
  Grid: typeof CalendarGrid;
};

export default CalendarWithSubComponents;
