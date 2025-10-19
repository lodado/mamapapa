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
          "absolute contents left-[16px] top-[85px]",
          className
        )}
        role="grid"
        aria-label="Calendar days"
        {...props}
      >
        {children}
      </div>
    );
  }
);

CalendarBody.displayName = "CalendarBody";

export default CalendarBody;
