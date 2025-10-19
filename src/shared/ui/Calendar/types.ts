import { ReactNode } from "react";

import { UseCalendarReturn } from "./hooks/useCalendar";

export interface CalendarContextValue {
  value?: Date;
  onValueChange?: (date: Date) => void;
  calendar?: UseCalendarReturn;
}

export interface CalendarProps {
  children: ReactNode;
  className?: string;
  value?: Date;
  onValueChange?: (date: Date) => void;
}

export interface CalendarHeaderProps {
  children: ReactNode;
  className?: string;
}

export interface CalendarNavigationProps {
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  className?: string;
}

export interface CalendarWeekdaysProps {
  className?: string;
  weekdays?: string[];
}

export interface CalendarTitleProps {
  className?: string;
}

export interface CalendarGridProps {
  className?: string;
}

export interface CalendarBodyProps {
  children: ReactNode;
  className?: string;
}

export interface CalendarDayProps {
  date: Date;
  isCurrentMonth?: boolean;
  isToday?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  className?: string;
  onClick?: (date: Date) => void;
}

export type CalendarDayState = "default" | "hover" | "active" | "selected" | "disabled";
export type CalendarDayType = "current-month" | "prev-next-month" | "today";
