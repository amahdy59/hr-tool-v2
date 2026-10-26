import React, { useState } from 'react';
import {
  Compass,
  UserCheck,
  Coins,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info,
  Clock,
  Briefcase,
  MapPin,
  Laptop,
  FileCheck2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';

interface MissionWorkflowDiagramProps {
  className?: string;
  defaultExpanded?: boolean;
}

export const MissionWorkflowDiagram: React.FC<MissionWorkflowDiagramProps> = ({
  className,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const { i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === 'ar' || i18n.language.startsWith('ar');

  const steps = [
    {
      step: '01',
      title: isArabic ? 'تحديد وجهة ومهمة المأمورية' : 'Mission Itinerary & Purpose',
      role: isArabic ? 'الموظف / صاحب الطلب' : 'Employee',
      icon: Compass,
      badge: isArabic ? 'مبدئي' : 'Draft',
      description: isArabic
        ? 'تحديد جهة العميل أو المؤتمر، نوع المأمورية (ميداني/عن بُعد/تأشيرة)، والتواريخ المتوقعة.'
        : 'Specify destination, client site, travel mode (domestic/international/WFH), and expected timeline.',
    },
    {
      step: '02',
      title: isArabic ? 'موافقة رئيس القسم' : 'Lead Project Sign-off',
      role: isArabic ? 'مدير المشروع / القسم' : 'Project Manager',
      icon: UserCheck,
      badge: isArabic ? '< ٢٤ ساعة' : '< 24 Hours',
      description: isArabic
        ? 'التحقق من أهداف المأمورية، ارتباطها بتسليمات المشروع، واعتماد ميزانية الانتقال.'
        : 'Confirms deliverables alignment, on-site necessity, and billable project allocation.',
    },
    {
      step: '03',
      title: isArabic ? 'المخصصات اللوجستية وتأشيرات السفر' : 'Logistics & Per Diem Clearance',
      role: isArabic ? 'الشؤون الإدارية والمالية' : 'HR & Operations',
      icon: Coins,
      badge: isArabic ? '< ٤٨ ساعة' : '< 48 Hours',
      description: isArabic
        ? 'صرف بدل الانتقال والسفر، وتأمين وثائق السفر وتصاريح دخول منشآت العميل.'
        : 'Issues daily allowance, travel insurance, accommodation clearance, and visa approvals.',
    },
    {
      step: '04',
      title: isArabic ? 'الانطلاق واحتساب الحضور' : 'Deployment & Auto Timesheet Credit',
      role: isArabic ? 'سجل الحضور الذكي' : 'Timesheet Sync',
      icon: CheckCircle2,
      badge: isArabic ? '١٠٠٪ حضور' : '100% Credit',
      description: isArabic
        ? 'تثبيت حالة الموظف "في مأمورية عمل" مع احتساب ساعات العمل الرسمية بالكامل دون خصم.'
        : 'Logs status as active field mission with 100% attendance credit synced to monthly payroll.',
    },
  ];

  const missionPills = [
    { label: isArabic ? 'زيارة عميل ميدانية' : 'Client Visit', icon: Briefcase, color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10' },
    { label: isArabic ? 'العمل عن بُعد' : 'Work From Home', icon: Laptop, color: 'text-violet-600 dark:text-violet-400 bg-violet-500/10' },
    { label: isArabic ? 'استخراج تأشيرات' : 'Visa Issuing', icon: FileCheck2, color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10' },
    { label: isArabic ? 'مؤتمرات ومعارض' : 'Conferences', icon: MapPin, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' },
  ];

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/20 shadow-xs transition-all duration-300',
        className
      )}
    >
      {/* Header bar / Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[var(--text-sm)] sm:text-base font-semibold text-foreground tracking-tight">
                {isArabic ? 'مسار وإجراءات اعتماد المأموريات الخارجية' : 'Field Mission Lifecycle & Approval Flow'}
              </h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                {isArabic ? 'إجراءات السفر والميدان' : 'Field Operations'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isArabic
                ? 'مخطط زمني تفاعلي يوضح مراحل المأمورية من تقديم خطة السفر وحتى المزامنة مع الحضور'
                : 'Interactive lifecycle illustrating travel dispatch, manager approval, allowances, and attendance recognition'}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="gap-2 rounded-xl text-xs font-semibold cursor-pointer shrink-0 self-start sm:self-auto hover:bg-muted"
          aria-expanded={isExpanded}
          aria-controls="mission-lifecycle-content"
        >
          <span>{isExpanded ? (isArabic ? 'إخفاء المسار' : 'Hide Lifecycle') : (isArabic ? 'عرض مسار المأموريات' : 'View Lifecycle')}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>

      {/* Expanded Diagram Body */}
      {isExpanded && (
        <div id="mission-lifecycle-content" className="p-4 sm:p-6 space-y-6 animate-in fade-in-50 duration-200">
          {/* Mission Categories Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-muted-foreground me-1">
              {isArabic ? 'أنواع المأموريات المعتمدة:' : 'Supported Mission Scopes:'}
            </span>
            {missionPills.map((p) => {
              const PillIcon = p.icon;
              return (
                <span
                  key={p.label}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border border-border/60',
                    p.color
                  )}
                >
                  <PillIcon className="w-3.5 h-3.5" />
                  {p.label}
                </span>
              );
            })}
          </div>

          {/* Workflow Stepper Grid */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((st, idx) => {
              const StepIcon = st.icon;
              return (
                <div
                  key={st.step}
                  className="relative flex flex-col justify-between rounded-xl border border-border/80 bg-card p-4 shadow-2xs hover:shadow-xs hover:border-violet-500/40 transition-all duration-200 group"
                >
                  {/* Step Connector Line for Desktop */}
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:block absolute -end-2.5 top-8 w-5 h-0.5 bg-border/80 z-10">
                      <ArrowRight className="w-3 h-3 text-muted-foreground absolute -top-1.5 -end-1 rtl:rotate-180" />
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-muted-foreground">
                          {st.step}
                        </span>
                        <span className="text-[11px] font-semibold text-muted-foreground px-2 py-0.5 rounded-md bg-muted/60">
                          {st.role}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                        <Clock className="w-3 h-3" />
                        {st.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 group-hover:scale-105 transition-transform duration-200">
                        <StepIcon className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-semibold text-foreground">
                        {st.title}
                      </h4>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {st.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Operational Policy Guideline Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-muted/40 border border-border/60 text-xs">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-violet-500 shrink-0" />
              <span className="text-muted-foreground">
                {isArabic
                  ? 'يتم احتساب أيام المأمورية المعتمدة بنسبة حضور ١٠٠٪ في كشف الحضور الشهري ولا تخصم من رصيد الإجازات السنوية للموظف.'
                  : 'Policy Note: Approved mission days provide 100% full attendance credit on the monthly timesheet without deducting any personal leave entitlement.'}
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0 font-medium">
              <span className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                {isArabic ? 'بدل سفر معتمد' : 'Standard Per Diem'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
