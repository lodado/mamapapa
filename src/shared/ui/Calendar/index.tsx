import Calendar from "./Calendar";
import CalendarBody from "./CalendarBody";
import CalendarDay from "./CalendarDay";
import CalendarGrid from "./CalendarGrid";
import CalendarHeader from "./CalendarHeader";
import CalendarNavigation from "./CalendarNavigation";
import CalendarTitle from "./CalendarTitle";
import CalendarWeekdays from "./CalendarWeekdays";

// Compound Pattern 적용
Calendar.Header = CalendarHeader;
Calendar.Body = CalendarBody;
Calendar.Day = CalendarDay;
Calendar.Navigation = CalendarNavigation;
Calendar.Weekdays = CalendarWeekdays;
Calendar.Title = CalendarTitle;
Calendar.Grid = CalendarGrid;

export {
  Calendar,
  CalendarBody,
  CalendarDay,
  CalendarGrid,
  CalendarHeader,
  CalendarNavigation,
  CalendarTitle,
  CalendarWeekdays,
};
