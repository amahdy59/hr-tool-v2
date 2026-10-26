import React from 'react';
import {
  LogIn,
  Building2,
  Coffee,
  Laptop,
  LogOut,
  Clock,
  CheckCircle2,
  AlertCircle,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { HelpDisclosure } from './HelpDisclosure';
import { useTranslation } from 'react-i18next';

interface AttendanceTimelineDiagramProps {
  className?: string;
  defaultExpanded?: boolean;
  officePercentage?: number;
  goalPercentage?: number;
}

export const AttendanceTimelineDiagram: React.FC<AttendanceTimelineDiagramProps> = ({
  className,
  defaultExpanded = false,
  officePercentage = 53.4,
  goalPercentage = 40,
}) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === 'ar' || i18n.language.startsWith('ar');

  const shiftBlocks = [
    {
      time: '08:30 - 09:00',
      title: isArabic ? 'نافذة تسجيل الدخول المرن' : 'Flex Check-in Window',
      role: isArabic ? 'وصول الموظفين' : 'Arrival',
      icon: LogIn,
      badge: isArabic ? 'مرن' : 'Flexible',
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      description: isArabic
        ? 'تسجيل البصمة الذاتي مع فترة سماح ٣٠ دقيقة دون احتساب تأخير.'
        : 'Automated biometric or badge check-in with a 30-minute grace arrival period.',
    },
    {
      time: '09:00 - 13:00',
      title: isArabic ? 'فترة العمل الصباحية المركزة' : 'Morning Core Hours',
      role: isArabic ? 'عمل أساسي' : 'Core Focus',
      icon: Building2,
      badge: isArabic ? '٤ ساعات' : '4 Hours',
      badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      description: isArabic
        ? 'اجتماعات الفرق والتخطيط اليومي وساعات الحضور الإلزامية في المكتب.'
        : 'Synchronous team scrums, primary deliverables, and mandatory core desk presence.',
    },
    {
      time: '13:00 - 14:00',
      title: isArabic ? 'استراحة الغداء وتجديد النشاط' : 'Lunch & Flex Break',
      role: isArabic ? 'استراحة' : 'Rest Pause',
      icon: Coffee,
      badge: isArabic ? '٦٠ دقيقة' : '60 Mins',
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      description: isArabic
        ? 'استراحة مجدولة غير مخصومة، تتيح المرونة لتناول وجبة الغداء والراحة.'
        : 'Designated company flex pause for dining, wellness, and informal syncs.',
    },
    {
      time: '14:00 - 17:30',
      title: isArabic ? 'الفترة المسائية والتعاون الفني' : 'Afternoon Delivery Shift',
      role: isArabic ? 'تسليم المهام' : 'Delivery',
      icon: Laptop,
      badge: isArabic ? '٣.٥ ساعة' : '3.5 Hours',
      badgeColor: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
      description: isArabic
        ? 'متابعة تنفيذ المشروعات ومراجعة الأكواد وتسليم تقارير اليوم التشغيلي.'
        : 'Cross-functional project execution, peer reviews, and operational wrap-ups.',
    },
    {
      time: '17:30 - 18:00',
      title: isArabic ? 'الانصراف والمزامنة السحابية' : 'Check-out & Sync',
      role: isArabic ? 'نهاية الوردية' : 'Shift End',
      icon: LogOut,
      badge: isArabic ? 'مزامنة فورية' : 'Instant Sync',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      description: isArabic
        ? 'تسجيل الخروج واحتساب إجمالي ساعات العمل تلقائياً مع تحديث كشف الرواتب.'
        : 'Automated check-out, duration computation, and direct sync to monthly timesheet.',
    },
  ];

  const isGoalMet = officePercentage >= goalPercentage;

  return (
    <HelpDisclosure title={isArabic ? 'دليل ساعات العمل والحضور' : 'Working hours and attendance guidance'} defaultOpen={defaultExpanded} className={className}>
      <div className="p-4 sm:p-6 space-y-6 animate-in fade-in-50 duration-200">
          {/* Office Attendance Target Tracker Gauge Bar */}
          <div className="p-4 rounded-xl border border-border/80 bg-card space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">
                  {isArabic ? 'مؤشر نسبة الحضور المكتبي الشهري:' : 'Monthly In-Office Requirement Tracking:'}
                </span>
                <span className="text-muted-foreground">
                  {isArabic ? `الهدف: ${goalPercentage}٪ | المحقق: ${officePercentage}٪` : `Target: ${goalPercentage}% | Logged: ${officePercentage}%`}
                </span>
              </div>
              <span
                className={cn(
                  'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] border',
                  isGoalMet
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                )}
              >
                {isGoalMet ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                {isGoalMet
                  ? isArabic ? `تم تحقيق الهدف (+${(officePercentage - goalPercentage).toFixed(1)}٪)` : `Goal Met (+${(officePercentage - goalPercentage).toFixed(1)}%)`
                  : isArabic ? 'دون الحد المستهدف' : 'Below Target'}
              </span>
            </div>

            {/* Visual Progress Bar with Threshold Needle */}
            <div className="relative w-full h-3 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, officePercentage)}%` }}
              />
              {/* Target Threshold Needle */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-foreground z-10"
                style={{ left: `${goalPercentage}%` }}
                title={`Target Policy: ${goalPercentage}%`}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>0%</span>
              <span className="font-medium text-foreground">
                {isArabic ? `الحد الأدنى لسياسة الشركة (${goalPercentage}٪)` : `Company Policy Baseline (${goalPercentage}%)`}
              </span>
              <span>100%</span>
            </div>
          </div>

          {/* Daily Shift Timeline Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {shiftBlocks.map((b, idx) => {
              const BlockIcon = b.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col justify-between rounded-xl border border-border/80 bg-card p-3.5 shadow-2xs hover:shadow-xs hover:border-primary/40 transition-all duration-200"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-primary">
                        {b.time}
                      </span>
                      <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded border', b.badgeColor)}>
                        {b.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <BlockIcon className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-semibold text-foreground truncate">
                        {b.title}
                      </h4>
                    </div>

                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {b.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Operational Shift Tip */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground">
            <Info className="w-4 h-4 text-blue-500 shrink-0" />
            <span>
              {isArabic
                ? 'فترة السماح الصباحية تمتد حتى الساعة التاسعة والنصف صباحاً دون تسجيل تأخير أو خصم جزئي.'
                : 'Grace Window Note: Check-ins up to 09:30 AM are logged without tardiness penalty if 8.5 total working hours are met.'}
            </span>
          </div>
        </div>
    </HelpDisclosure>
  );
};
