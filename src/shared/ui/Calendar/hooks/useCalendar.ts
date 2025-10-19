import { useCallback,useMemo, useState } from "react";

export interface UseCalendarOptions {
  initialDate?: Date;
  onDateChange?: (date: Date) => void;
}

export interface UseCalendarReturn {
  currentDate: Date;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  goToToday: () => void;
  getCalendarDays: () => Date[];
  isToday: (date: Date) => boolean;
  isSelected: (date: Date) => boolean;
  isCurrentMonth: (date: Date) => boolean;
  formatMonthYear: (date: Date) => string;
}

export const useCalendar = ({ 
  initialDate = new Date(), 
  onDateChange 
}: UseCalendarOptions = {}): UseCalendarReturn => {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const goToPreviousMonth = useCallback(() => {
    setCurrentDate(prev => {
      // Fix month overflow by using constructor to avoid day overflow
      return new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentDate(prev => {
      // Fix month overflow by using constructor to avoid day overflow
      return new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
    });
  }, []);

  const goToToday = useCallback(() => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
    onDateChange?.(today);
  }, [onDateChange]);

  const isToday = useCallback((date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }, []);

  const isSelected = useCallback((date: Date): boolean => {
    if (!selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  }, [selectedDate]);

  const isCurrentMonth = useCallback((date: Date): boolean => {
    return date.getMonth() === currentDate.getMonth() && 
           date.getFullYear() === currentDate.getFullYear();
  }, [currentDate]);

  const formatMonthYear = useCallback((date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  }, []);

  const getCalendarDays = useCallback((): Date[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get first day of the month and calculate starting date
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: Date[] = [];
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    
    return days;
  }, [currentDate]);

  const handleDateChange = useCallback((date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      onDateChange?.(date);
    }
  }, [onDateChange]);

  return {
    currentDate,
    selectedDate,
    setSelectedDate: handleDateChange,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    getCalendarDays,
    isToday,
    isSelected,
    isCurrentMonth,
    formatMonthYear,
  };
};
