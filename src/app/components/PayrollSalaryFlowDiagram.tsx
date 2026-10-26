import React from 'react';
import {
  Banknote,
  DollarSign,
  TrendingUp,
  Receipt,
  PiggyBank,
  ShieldCheck,
  Info,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { HelpDisclosure } from './HelpDisclosure';
import { useTranslation } from 'react-i18next';

interface PayrollSalaryFlowDiagramProps {
  className?: string;
  defaultExpanded?: boolean;
}

export const PayrollSalaryFlowDiagram: React.FC<PayrollSalaryFlowDiagramProps> = ({
  className,
  defaultExpanded = false,
}) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === 'ar' || i18n.language.startsWith('ar');

  // Representative sample payroll benchmark for Senior Engineering Specialist
  const benchmark = {
    gross: 85000,
    allowances: 2850,
    totalCompensation: 87850,
    tax: 12750,
    socialInsurance: 6375,
    pension: 4250,
    familyDeduction: 200,
    totalDeductions: 23575,
    netPay: 64275,
  };

  const netPayPercent = ((benchmark.netPay / benchmark.totalCompensation) * 100).toFixed(1);
  const taxPercent = ((benchmark.tax / benchmark.totalCompensation) * 100).toFixed(1);
  const socialPensionPercent = (((benchmark.socialInsurance + benchmark.pension) / benchmark.totalCompensation) * 100).toFixed(1);
  const familyPercent = ((benchmark.familyDeduction / benchmark.totalCompensation) * 100).toFixed(1);

  return (
    <HelpDisclosure title={isArabic ? 'كيف يُحسب راتبك' : 'How your pay is calculated'} defaultOpen={defaultExpanded} className={className}>
      <div className="p-4 sm:p-6 space-y-6 animate-in fade-in-50 duration-200">
          {/* Waterfall Stage Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* 1. Base Gross */}
            <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{isArabic ? 'الراتب الأساسي' : 'Base Gross Salary'}</span>
                <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-foreground">
                ${benchmark.gross.toLocaleString()}
              </div>
              <p className="text-[11px] text-muted-foreground">
                {isArabic ? 'الأجر التعاقدي الأساسي' : 'Contracted annual base rate'}
              </p>
            </div>

            {/* 2. Allowances */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{isArabic ? 'إجمالي البدلات' : 'Allowances & Bonus'}</span>
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                +${benchmark.allowances.toLocaleString()}
              </div>
              <p className="text-[11px] text-muted-foreground">
                {isArabic ? 'غلاء معيشة وبدل أداء شهري' : 'COLA ($2,000) + Bonus ($850)'}
              </p>
            </div>

            {/* 3. Deductions */}
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{isArabic ? 'الاستقطاعات الإلزامية' : 'Total Deductions'}</span>
                <Receipt className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              </div>
              <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                -${benchmark.totalDeductions.toLocaleString()}
              </div>
              <p className="text-[11px] text-muted-foreground">
                {isArabic ? 'ضرائب وتأمينات وصندوق تقاعد' : 'Taxes, social insurance & pension'}
              </p>
            </div>

            {/* 4. Net Take-Home */}
            <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{isArabic ? 'صافي الراتب المستلم' : 'Net Take-Home Pay'}</span>
                <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                ${benchmark.netPay.toLocaleString()}
              </div>
              <p className="text-[11px] text-muted-foreground">
                {isArabic ? `${netPayPercent}٪ من إجمالي الاستحقاق` : `${netPayPercent}% of total compensation`}
              </p>
            </div>
          </div>

          {/* Proportional Segmented Visual Bar */}
          <div className="p-4 rounded-xl border border-border/80 bg-card space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">
                {isArabic ? 'التوزيع النسبي لكل دولار من إجمالي التعويضات:' : 'Proportional Distribution of Total Compensation:'}
              </span>
              <span className="text-muted-foreground font-mono">
                ${benchmark.totalCompensation.toLocaleString()} (100%)
              </span>
            </div>

            {/* Segmented Stacked Bar */}
            <div className="flex w-full h-4 rounded-full overflow-hidden shadow-inner">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${netPayPercent}%` }}
                title={`Net Take-Home: ${netPayPercent}%`}
              />
              <div
                className="bg-rose-500 h-full transition-all duration-300"
                style={{ width: `${taxPercent}%` }}
                title={`Income Tax: ${taxPercent}%`}
              />
              <div
                className="bg-amber-500 h-full transition-all duration-300"
                style={{ width: `${socialPensionPercent}%` }}
                title={`Social Insurance & Pension: ${socialPensionPercent}%`}
              />
              <div
                className="bg-slate-400 h-full transition-all duration-300"
                style={{ width: `${familyPercent}%` }}
                title={`Family Deductions: ${familyPercent}%`}
              />
            </div>

            {/* Segment Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-500 shrink-0" />
                <span className="text-foreground font-medium">
                  {isArabic ? 'صافي الراتب المستلم' : 'Net Take-Home'} ({netPayPercent}%)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-rose-500 shrink-0" />
                <span className="text-foreground font-medium">
                  {isArabic ? 'ضريبة الدخل' : 'Income Tax'} ({taxPercent}%)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-amber-500 shrink-0" />
                <span className="text-foreground font-medium">
                  {isArabic ? 'التأمينات والمعاشات' : 'Social & Pension'} ({socialPensionPercent}%)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-slate-400 shrink-0" />
                <span className="text-foreground font-medium">
                  {isArabic ? 'صناديق رعاية' : 'Family Fund'} ({familyPercent}%)
                </span>
              </div>
            </div>
          </div>

          {/* Tax Compliance Tip */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground">
            <Info className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              {isArabic
                ? 'يتم احتساب الاستقطاعات الضريبية تلقائياً وفقاً للشرائح الضريبية الرسمية المعتمدة لعام ٢٠٢٦.'
                : 'Statutory Compliance Note: Tax deductions are dynamically calculated based on current 2026 progressive income tax brackets.'}
            </span>
          </div>
        </div>
    </HelpDisclosure>
  );
};
