import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';

interface CalendarGridProps {
  onViewRequest?: (request: { id: string; type: string; status: 'approved' | 'pending' | 'noshow'; range: string; duration: string }) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ onViewRequest }) => {
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
    { day: 7, month: 'curr', events: [{ id: '10', type: 'Vacation', label: 'Maternity', color: 'bg-chart-3', status: 'approved', range: 'Aug 7 - Aug 7', duration: '1 day' }] },
    { day: 8, month: 'curr', events: [
      { id: '1', type: 'Sick', label: 'Sick Leave', color: 'bg-chart-3', status: 'approved', range: 'Sep 10 - Sep 14', duration: '5 days' },
      { id: '3', type: 'Sick', label: 'Vacation (Pending)', color: 'bg-chart-4', status: 'pending', range: 'Nov 3 - Nov 6', duration: '4 days' },
      { id: '12', type: 'Sick', label: 'Sick Leave', color: 'bg-chart-3', status: 'approved', range: 'Aug 8 - Aug 8', duration: '1 day' }
    ] },
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
          <div key={day} className="py-3 text-center text-[var(--text-sm)] font-[var(--font-weight-medium)] text-muted-foreground bg-muted/50 border-e border-border last:border-e-0">
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
              "border-e border-b border-border p-2 flex flex-col items-center justify-start gap-1 relative cursor-default",
              item.month !== 'curr' && "bg-muted/20 text-muted-foreground",
              idx % 7 === 6 && "border-e-0"
            )}
          >
            <div className={cn(
              "w-8 h-8 flex items-center justify-center rounded-full text-[var(--text-sm)]",
              item.today && "bg-chart-3 text-white font-[var(--font-weight-semibold)]"
            )}>
              {item.day}
            </div>
            
            <div className="w-full space-y-1 overflow-hidden">
              {item.events.map((event, eIdx) => {
                const isInteractive = !!event.id;
                return (
                  <button
                    key={eIdx}
                    type="button"
                    tabIndex={isInteractive ? 0 : -1}
                    onClick={() => {
                      if (isInteractive && onViewRequest) {
                        onViewRequest({
                          id: event.id,
                          type: event.type || event.label,
                          status: event.status as 'approved' | 'pending' | 'noshow' || 'approved',
                          range: event.range || 'Aug 8 - Aug 8',
                          duration: event.duration || '1 day',
                        });
                      }
                    }}
                    className={cn(
                      "text-[10px] py-0.5 px-2 rounded-[var(--radius-sm)] truncate font-[var(--font-weight-medium)] w-full text-center block transition-all border-none outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      event.color,
                      event.textColor || "text-white",
                      isInteractive ? "cursor-pointer hover:brightness-95 active:scale-[0.98]" : "cursor-default"
                    )}
                  >
                    {event.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
