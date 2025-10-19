"use client";

import { forwardRef } from "react";

import { cn } from "@/shared/utils";

import { CalendarBodyProps } from "./types";

const CalendarBody = forwardRef<HTMLDivElement, CalendarBodyProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid grid-cols-7 gap-1",
          className
        )}
        {...props}
        role="grid"
        aria-label="Calendar days"
        aria-colcount={7}
      >
        {children}
      </div>
    );
  }
);

CalendarBody.displayName = "CalendarBody";

export default CalendarBody;
