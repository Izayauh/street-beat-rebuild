
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format, isBefore, startOfToday, addDays } from 'date-fns';
import { Clock, Calendar as CalendarIcon } from 'lucide-react';

interface TimeSlotCalendarProps {
  selectedDate: Date | undefined;
  selectedTime: string;
  onDateSelect: (date: Date | undefined) => void;
  onTimeSelect: (time: string) => void;
}

const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', 
  '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
];

const TimeSlotCalendar = ({ selectedDate, selectedTime, onDateSelect, onTimeSelect }: TimeSlotCalendarProps) => {
  const today = startOfToday();
  const maxDate = addDays(today, 90); // Allow booking up to 3 months ahead

  const isDateDisabled = (date: Date) => {
    return isBefore(date, today) || date > maxDate;
  };

  return (
    <div className="space-y-6">
      {/* Calendar Selection */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-purple-400" />
            Select a Date
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
            disabled={isDateDisabled}
            className="rounded-md border border-gray-600 bg-gray-700/50 text-white [&_.rdp-day_selected]:bg-purple-600 [&_.rdp-day_selected]:text-white [&_.rdp-day]:text-white [&_.rdp-day:hover]:bg-purple-500/50"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center text-white",
              caption_label: "text-sm font-medium text-white",
              nav: "space-x-1 flex items-center",
              nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-white border border-gray-600 hover:bg-gray-600",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-gray-300 rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
              day: "h-9 w-9 p-0 font-normal text-white hover:bg-purple-500/50 rounded-md",
              day_range_end: "day-range-end",
              day_selected: "bg-purple-600 text-white hover:bg-purple-600 hover:text-white focus:bg-purple-600 focus:text-white",
              day_today: "bg-gray-600 text-white",
              day_outside: "text-gray-500 opacity-50",
              day_disabled: "text-gray-600 opacity-30",
              day_range_middle: "aria-selected:bg-purple-200 aria-selected:text-purple-900",
              day_hidden: "invisible",
            }}
          />
        </CardContent>
      </Card>

      {/* Time Slot Selection */}
      {selectedDate && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" />
              Available Times for {format(selectedDate, 'EEEE, MMMM d')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {TIME_SLOTS.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  className={`
                    ${selectedTime === time 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                      : 'border-gray-600 text-gray-300 hover:bg-purple-500/20 hover:border-purple-500'
                    }
                  `}
                  onClick={() => onTimeSelect(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
            {selectedTime && (
              <div className="mt-4 p-3 bg-purple-600/20 border border-purple-600/50 rounded-md">
                <p className="text-purple-200 text-sm">
                  Selected: {format(selectedDate, 'EEEE, MMMM d')} at {selectedTime}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TimeSlotCalendar;
