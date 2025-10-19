"use client";

import { useState } from "react";
import { Calendar } from "@/shared/ui";

const CalendarExample = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    console.log("Selected date:", date);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Calendar Component Example</h2>
      
      <Calendar
        value={selectedDate || undefined}
        onValueChange={handleDateChange}
        className="w-fit"
      >
        <Calendar.Header>
          <Calendar.Navigation
            onPreviousMonth={() => console.log("Previous month")}
            onNextMonth={() => console.log("Next month")}
          />
          <Calendar.Title />
        </Calendar.Header>
        
        <Calendar.Weekdays />
        
        <Calendar.Body>
          <Calendar.Grid />
        </Calendar.Body>
      </Calendar>
      
      {selectedDate && (
        <div className="mt-4 p-2 bg-gray-100 rounded">
          <p>Selected Date: {selectedDate.toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
};

export default CalendarExample;
