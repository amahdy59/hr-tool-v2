import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';

export const CalendarGrid: React.FC = () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Mock data for August 2022
  const dates = [
    { day: 29, month: 'prev', events: [] },
    { day: 30, month: 'prev', events: [] },
    { day: 1, month: 'curr', events: [] },
    { day: 2, month: 'curr', events: [] },
    { day: 3, month: 'curr', events: [] },
    { day: 4, month: 'curr', events: [] },
    { day: 5, month: 'curr', events: [] },
    { day: 6, month: 'curr', events: [] },
    { day: 7, month: 'curr', events: [{ type: 'maternity', label: 'Maternity', color: 'bg-chart-3' }] },
    { day: 8, month: 'curr', events: [{ type: 'sick', label: 'Sick Leave', color: 'bg-chart-3' }] },
    { day: 8, month: 'curr', events: [{ type: 'vacation', label: 'Vacation', color: 'bg-chart-4' }] },
    { day: 8, month: 'curr', events: [{ type: 'sick', label: 'Sick Leave', color: 'bg-chart-3' }] },
    { day: 11, month: 'curr', events: [] },
    { day: 12, month: 'curr', events: [] },
    { day: 13, month: 'curr', events: [{ type: 'inoffice', label: 'In-Office', color: 'bg-chart-1' }] },
    { day: 14, month: 'curr', events: [{ type: 'wfh', label: 'Work From Home', color: 'bg-chart-3' }] },
    { day: 15, month: 'curr', events: [{ type: 'ips', label: 'IPS', color: 'bg-chart-3' }] },
    { day: 16, month: 'curr', events: [{ type: 'noshow', label: 'No Show', color: 'bg-chart-5' }], today: true },
    { day: 17, month: 'curr', events: [] },
    { day: 18, month: 'curr', events: [{ type: 'weekend', label: 'Weekend', color: 'bg-muted', textColor: 'text-muted-foreground' }] },
    { day: 19, month: 'curr', events: [] },
    { day: 20, month: 'curr', events: [] },
    { day: 21, month: 'curr', events: [] },
    { day: 23, month: 'curr', events: [] },
    { day: 24, month: 'curr', events: [] },
    { day: 25, month: 'curr', events: [] },
    { day: 26, month: 'curr', events: [] },
    { day: 27, month: 'curr', events: [] },
    { day: 28, month: 'curr', events: [] },
    { day: 20, month: 'curr', events: [] },
    { day: 30, month: 'curr', events: [] },
    { day: 31, month: 'curr', events: [] },
    { day: 1, month: 'next', events: [] },
    { day: 2, month: 'next', events: [] },
    { day: 3, month: 'next', events: [] },
  ];

  return (
    <div className="bg-card border border-border rounded-[var(--radius-card)] overflow-hidden shadow-[var(--elevation-sm)]">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <button className="p-1 hover:bg-muted rounded-[var(--radius-sm)] transition-colors cursor-pointer">
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground">August</span>
            <ChevronRight className="w-4 h-4 rotate-90 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground">2022</span>
            <ChevronRight className="w-4 h-4 rotate-90 text-muted-foreground" />
          </div>
        </div>
        <button className="p-1 hover:bg-muted rounded-[var(--radius-sm)] transition-colors cursor-pointer">
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 border-b border-border">
        {days.map((day) => (
          <div key={day} className="py-2 text-center text-[var(--text-sm)] font-[var(--font-weight-medium)] text-muted-foreground bg-muted/50 border-r border-border last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      {/* Dates Grid */}
      <div className="grid grid-cols-7 grid-rows-5 h-[500px]">
        {dates.map((item, idx) => (
          <div 
            key={idx} 
            className={cn(
              "border-r border-b border-border p-2 flex flex-col items-center justify-start gap-1 relative cursor-default",
              item.month !== 'curr' && "bg-muted/20 text-muted-foreground",
              idx % 7 === 6 && "border-r-0"
            )}
          >
            <div className={cn(
              "w-8 h-8 flex items-center justify-center rounded-full text-[var(--text-sm)]",
              item.today && "bg-chart-3 text-white font-[var(--font-weight-semibold)]"
            )}>
              {item.day}
            </div>
            
            <div className="w-full space-y-1 overflow-hidden">
              {item.events.map((event, eIdx) => (
                <div 
                  key={eIdx} 
                  className={cn(
                    "text-[10px] py-0.5 px-2 rounded-[var(--radius-sm)] truncate font-[var(--font-weight-medium)] w-full text-center",
                    event.color,
                    event.textColor || "text-white"
                  )}
                >
                  {event.label}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
