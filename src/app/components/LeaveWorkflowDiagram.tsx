import React from 'react';
import {
  CalendarPlus,
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  Info,
  Clock,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { HelpDisclosure } from './HelpDisclosure';
import { useTranslation } from 'react-i18next';

interface LeaveWorkflowDiagramProps {
  className?: string;
  defaultExpanded?: boolean;
}

export const LeaveWorkflowDiagram: React.FC<LeaveWorkflowDiagramProps> = ({
  className,
  defaultExpanded = false,
}) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === 'ar' || i18n.language.startsWith('ar');

  const steps = [
    {
      step: '01',
      title: isArabic ? 'تقديم الطلب' : 'Request Submission',
      role: isArabic ? 'الموظف' : 'Employee',
      icon: CalendarPlus,
      color: 'blue',
      badge: isArabic ? 'لحظي' : 'Instant',
      description: isArabic
        ? 'تحديد نوع الإجازة والتواريخ والبديل؛ مع التحقق الفوري من الرصيد المتوفر وسياسة الجسور.'
        : 'Select leave type, date range & notes. Real-time balance and statutory bridging validation.',
    },
    {
      step: '02',
      title: isArabic ? 'مراجعة المدير المباشر' : 'Manager Review',
      role: isArabic ? 'رئيس القسم' : 'Direct Supervisor',
      icon: UserCheck,
      color: 'amber',
      badge: isArabic ? '< ٢٤ ساعة' : '< 24 Hours',
      description: isArabic
        ? 'تقييم التغطية التشغيلية للمشروع وجدول تسليم المهام مع إشعار الفريق.'
        : 'Assesses department coverage, project milestones and team workload distribution.',
    },
    {
      step: '03',
      title: isArabic ? 'اعتماد الموارد البشرية' : 'HR Endorsement',
      role: isArabic ? 'أخصائي الموارد البشرية' : 'HR Specialist',
      icon: ShieldCheck,
      color: 'indigo',
      badge: isArabic ? '< ١٢ ساعة' : '< 12 Hours',
      description: isArabic
        ? 'التأكد من رصيد السنوات السابقة، العطلات الرسمية، وتوافق قانون العمل.'
        : 'Verifies carried-over balances, public holiday bridging, and labor law compliance.',
    },
    {
      step: '04',
      title: isArabic ? 'الموافقة والمزامنة' : 'Execution & Sync',
      role: isArabic ? 'النظام الآلي' : 'Automated System',
      icon: CheckCircle2,
      color: 'emerald',
      badge: isArabic ? 'مكتمل' : 'Finalized',
      description: isArabic
        ? 'خصم الرصيد تلقائياً وتحديث كشف الحضور والرواتب وإرسال إشعار رسمي.'
        : 'Deducts leave balance, automatically synchronizes monthly timesheet & sends confirmation.',
    },
  ];

  return (
    <HelpDisclosure title={isArabic ? 'كيف تتم الموافقة على الإجازات' : 'How leave approval works'} defaultOpen={defaultExpanded} className={className}>
      <div id="leave-lifecycle-content" className="p-4 sm:p-6 space-y-6 animate-in fade-in-50 duration-200">
          {/* Workflow Stepper Grid */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((st, idx) => {
              const StepIcon = st.icon;
              return (
                <div
                  key={st.step}
                  className="relative flex flex-col justify-between rounded-xl border border-border/80 bg-card p-4 shadow-2xs hover:shadow-xs hover:border-primary/40 transition-all duration-200 group"
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
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        <Clock className="w-3 h-3" />
                        {st.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform duration-200">
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

          {/* Policy & Rules Summary Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-muted/40 border border-border/60 text-xs">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-500 shrink-0" />
              <span className="text-muted-foreground">
                {isArabic
                  ? 'سياسة الجسور والعطلات: يتم احتساب العطلات الرسمية والجسور المعتمدة تلقائياً دون خصمها من رصيد الإجازات السنوية.'
                  : 'Bridging Rule: Official public holidays & scheduled bridge days are automated and never deducted from annual leave balance.'}
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0 font-medium">
              <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {isArabic ? 'سنوي: ٢١ يوماً' : 'Annual: 21 Days'}
              </span>
              <span className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                {isArabic ? 'مرضي: ١٤ يوماً' : 'Sick: 14 Days'}
              </span>
            </div>
          </div>
        </div>
    </HelpDisclosure>
  );
};
