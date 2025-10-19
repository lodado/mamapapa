"use client";

import { forwardRef } from "react";
import { cn } from "@/shared/utils";
import { CalendarNavigationProps } from "./types";

const CalendarNavigation = forwardRef<HTMLDivElement, CalendarNavigationProps>(
  ({ onPreviousMonth, onNextMonth, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between w-full",
          className
        )}
        {...props}
      >
        <button
          type="button"
          onClick={onPreviousMonth}
          className="bg-transparent content-stretch flex gap-1 h-6 items-center rounded-[3px] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          aria-label="Go to previous month"
          title="Previous month"
        >
          <div className="bg-transparent overflow-hidden relative shrink-0 size-6">
            <div className="absolute inset-[25.44%_36.27%_27.98%_36.3%]">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={onNextMonth}
          className="bg-transparent content-stretch flex gap-1 h-6 items-center rounded-[3px] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          aria-label="Go to next month"
          title="Next month"
        >
          <div className="bg-transparent overflow-hidden relative shrink-0 size-6">
            <div className="absolute inset-[25.5%_36.3%_27.98%_36.33%]">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </button>
      </div>
    );
  }
);

CalendarNavigation.displayName = "CalendarNavigation";

export default CalendarNavigation;
