"use client";

import { forwardRef } from "react";

import { cn } from "@/shared/utils";

import { CalendarHeaderProps } from "./types";

const CalendarHeader = forwardRef<HTMLDivElement, CalendarHeaderProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "absolute contents left-[22px] top-[16px]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CalendarHeader.displayName = "CalendarHeader";

export default CalendarHeader;
