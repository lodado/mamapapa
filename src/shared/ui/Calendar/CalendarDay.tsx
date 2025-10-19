"use client";

import { forwardRef } from "react";

import { cn } from "@/shared/utils";

import { CalendarDayProps } from "./types";

const CalendarDay = forwardRef<HTMLButtonElement, CalendarDayProps>(
  ({ 
    date, 
    isCurrentMonth = true, 
    isToday = false, 
    isSelected = false, 
    isDisabled = false,
    className,
    onClick,
    ...props 
  }, ref) => {
    const dayNumber = date.getDate();
    
    const getTextColor = () => {
      if (isDisabled) return "text-gray-400";
      if (isToday) return "text-blue-600 font-bold";
      if (isSelected) return "text-blue-600 font-bold";
      if (!isCurrentMonth) return "text-[#6b778c]";
      return "text-[#172b4d]";
    };

    const getBackgroundColor = () => {
      if (isSelected) return "bg-blue-50";
      if (isToday) return "bg-blue-50";
      return "bg-white";
    };

    const handleClick = () => {
      if (!isDisabled && onClick) {
        onClick(date);
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleClick();
      }
      
      // Arrow key navigation
      if (event.key.startsWith("Arrow")) {
        event.preventDefault();
        const currentDate = new Date(date);
        
        switch (event.key) {
          case "ArrowLeft":
            currentDate.setDate(currentDate.getDate() - 1);
            break;
          case "ArrowRight":
            currentDate.setDate(currentDate.getDate() + 1);
            break;
          case "ArrowUp":
            currentDate.setDate(currentDate.getDate() - 7);
            break;
          case "ArrowDown":
            currentDate.setDate(currentDate.getDate() + 7);
            break;
        }
        
        // Focus the new date element
        const newElement = document.querySelector(`[data-date="${currentDate.toISOString().split('T')[0]}"]`);
        if (newElement instanceof HTMLElement) {
          newElement.focus();
        }
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "bg-white h-8 overflow-hidden w-[41px] relative",
          "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          getBackgroundColor(),
          className
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={isDisabled}
        aria-label={`${date.toLocaleDateString()}, ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`}
        aria-selected={isSelected}
        aria-current={isToday ? "date" : undefined}
        role="gridcell"
        tabIndex={isDisabled ? -1 : 0}
        data-date={date.toISOString().split('T')[0]}
        {...props}
      >
        <div className={cn(
          "absolute flex flex-col font-normal h-8 justify-center leading-0 left-1/2 not-italic text-[14px] text-center top-1/2 translate-x-[-50%] translate-y-[-50%] w-[41px]",
          getTextColor()
        )}>
          <p className="leading-[20px]">{dayNumber}</p>
        </div>
        
        {/* Today indicator dot */}
        {isToday && (
          <div className="absolute bottom-1 h-0 left-1/2 translate-x-[-50%] w-[33px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-2px]">
              <div className="w-full h-1 bg-blue-600 rounded-full" />
            </div>
          </div>
        )}
      </button>
    );
  }
);

CalendarDay.displayName = "CalendarDay";

export default CalendarDay;
