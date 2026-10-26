import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  FileCheck2,
  Users,
  Key,
  Check,
  Minus,
  Lock,
  Layers,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { HelpDisclosure } from './HelpDisclosure';
import { useTranslation } from 'react-i18next';

interface RoleHierarchyDiagramProps {
  className?: string;
  defaultExpanded?: boolean;
}

export const RoleHierarchyDiagram: React.FC<RoleHierarchyDiagramProps> = ({
  className,
  defaultExpanded = false,
}) => {
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'matrix'>('hierarchy');
  const { i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === 'ar' || i18n.language.startsWith('ar');

  const tiers = [
    {
      level: 'Tier 4',
      name: isArabic ? 'مدير النظام الفائق (Super Admin)' : 'Super Admin',
      scope: isArabic ? 'صلاحيات مطلقة وتكوين النظام والأمان' : 'System Root & Full Architectural Access',
      icon: ShieldAlert,
      color: 'border-violet-500/30 bg-violet-500/5 dark:bg-violet-950/20',
      badgeColor: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
      iconBg: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
      permissions: [
        isArabic ? 'إدارة الأدوار والمستخدمين' : 'Manage User Roles & Provisioning',
        isArabic ? 'سجلات التدقيق الأمني' : 'Security Audit & Compliance Logs',
        isArabic ? 'إعدادات النظام والنسخ الاحتياطي' : 'System Configuration & DB Migrations',
      ],
    },
    {
      level: 'Tier 3',
      name: isArabic ? 'مدير الموارد البشرية (Admin & HR Manager)' : 'Admin & HR Manager',
      scope: isArabic ? 'إدارة الموظفين والسياسات والاعتمادات العامة' : 'Staff Lifecycle & Operational Approvals',
      icon: ShieldCheck,
      color: 'border-blue-500/30 bg-blue-500/5 dark:bg-blue-950/20',
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      permissions: [
        isArabic ? 'اعتماد الإجازات والمأموريات' : 'Approve Leaves & Field Missions',
        isArabic ? 'إضافة وتعديل بيانات الموظفين' : 'Employee Onboarding & Profiles',
        isArabic ? 'جدولة العطلات والجسور الرسمية' : 'Manage Public Holidays & Bridges',
      ],
    },
    {
      level: 'Tier 2',
      name: isArabic ? 'المراجع المالي وأخصائي HR' : 'HR Specialist & Financial Reviewer',
      scope: isArabic ? 'مسيرات الرواتب والتحقق المالي وسجلات الحضور' : 'Payroll Generation & Attendance Auditing',
      icon: FileCheck2,
      color: 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      permissions: [
        isArabic ? 'إصدار وتدقيق مسيرات الرواتب' : 'Generate & Audit Monthly Payroll',
        isArabic ? 'تصدير التقارير الرسمية والـ PDF' : 'Export Official Reports & Statements',
        isArabic ? 'مراجعة نسب الحضور والتأخير' : 'Audit In-Office & Remote Ratios',
      ],
    },
    {
      level: 'Tier 1',
      name: isArabic ? 'قائد الفريق والموظف (Team Lead & Staff)' : 'Team Leader & Employee',
      scope: isArabic ? 'الخدمة الذاتية ومتابعة حضور الفريق وتقديم الطلبات' : 'Self-Service & Team Timesheet Review',
      icon: Users,
      color: 'border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20',
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      permissions: [
        isArabic ? 'تقديم طلبات الإجازات والمأموريات' : 'Submit Personal Requests',
        isArabic ? 'متابعة سجل الحضور الذاتي' : 'View Personal Timesheet & Balances',
        isArabic ? 'متابعة جدول حضور أعضاء الفريق' : 'Team Leader Attendance Monitoring',
      ],
    },
  ];

  const matrixColumns = [
    { id: 'view_directory', label: isArabic ? 'دليل الموظفين' : 'Staff Directory' },
    { id: 'manage_employees', label: isArabic ? 'تعديل الموظفين' : 'Manage Staff' },
    { id: 'approve_leaves', label: isArabic ? 'اعتماد الإجازات' : 'Approve Leaves' },
    { id: 'approve_missions', label: isArabic ? 'اعتماد المأموريات' : 'Approve Missions' },
    { id: 'payroll_access', label: isArabic ? 'مسير الرواتب' : 'Payroll Access' },
    { id: 'roles_config', label: isArabic ? 'إدارة الصلاحيات' : 'Roles & System' },
  ];

  const matrixRows = [
    { role: isArabic ? 'Super Admin' : 'Super Admin', perms: [true, true, true, true, true, true] },
    { role: isArabic ? 'HR Manager / Admin' : 'Admin / HR Manager', perms: [true, true, true, true, true, false] },
    { role: isArabic ? 'Financial Reviewer' : 'Financial Reviewer', perms: [true, false, false, false, true, false] },
    { role: isArabic ? 'HR Specialist' : 'HR Specialist', perms: [true, true, true, true, false, false] },
    { role: isArabic ? 'Team Leader' : 'Team Leader', perms: [true, false, false, false, false, false] },
  ];

  return (
    <HelpDisclosure title={isArabic ? 'دليل الأدوار والصلاحيات' : 'Understand roles and permissions'} defaultOpen={defaultExpanded} className={className}>
      <div className="p-4 sm:p-6 space-y-6 animate-in fade-in-50 duration-200">
          {/* Sub-Tabs: Visual Hierarchy vs Permissions Matrix */}
          <div className="flex items-center gap-2 border-b border-border/60 pb-3">
            <button
              onClick={() => setActiveTab('hierarchy')}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                activeTab === 'hierarchy'
                  ? 'bg-primary text-primary-foreground shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              )}
            >
              {isArabic ? 'الهيكل الهرمي للأدوار' : 'Role Hierarchy Tiers'}
            </button>
            <button
              onClick={() => setActiveTab('matrix')}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                activeTab === 'matrix'
                  ? 'bg-primary text-primary-foreground shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              )}
            >
              {isArabic ? 'مصفوفة الصلاحيات التفصيلية' : 'Permissions Matrix'}
            </button>
          </div>

          {activeTab === 'hierarchy' ? (
            /* Visual Tiers Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {tiers.map((t) => {
                const TierIcon = t.icon;
                return (
                  <div
                    key={t.level}
                    className={cn(
                      'relative flex flex-col justify-between rounded-xl border p-4 shadow-2xs hover:shadow-xs transition-all duration-200',
                      t.color
                    )}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-muted-foreground">
                          {t.level}
                        </span>
                        <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', t.badgeColor)}>
                          {isArabic ? 'مستوى ' + t.level.replace('Tier ', '') : t.level}
                        </span>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', t.iconBg)}>
                          <TierIcon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold text-foreground truncate">
                            {t.name}
                          </h4>
                          <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                            {t.scope}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border/40 space-y-1.5">
                        {t.permissions.map((p, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-xs text-foreground/80">
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span className="truncate">{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Permissions Matrix Table */
            <div className="overflow-x-auto rounded-xl border border-border/80 bg-card">
              <table className="w-full text-xs text-start">
                <caption className="sr-only">{isArabic ? 'مصفوفة الصلاحيات حسب الدور الوظيفي' : 'Permissions matrix by role'}</caption>
                <thead className="bg-muted/50 border-b border-border/80">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-start font-semibold text-muted-foreground uppercase tracking-wider">
                      {isArabic ? 'الدور الوظيفي' : 'Role'}
                    </th>
                    {matrixColumns.map((col) => (
                      <th scope="col" key={col.id} className="px-3 py-3 text-center font-semibold text-muted-foreground uppercase tracking-wider">
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {matrixRows.map((r, rIdx) => (
                    <tr key={rIdx} className="even:bg-muted/[0.15] hover:bg-primary/[0.04] dark:hover:bg-primary/[0.08] transition-colors">
                      <th scope="row" className="px-4 py-3 font-medium text-foreground whitespace-nowrap text-start font-normal">
                        {r.role}
                      </th>
                      {r.perms.map((p, pIdx) => (
                        <td key={pIdx} className="px-3 py-3 text-center">
                          {p ? (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                              <Check className="w-3.5 h-3.5" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-muted text-muted-foreground/40">
                              <Minus className="w-3 h-3" />
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Security & Role Principle Note */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground">
            <Info className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>
              {isArabic
                ? 'مبدأ الحد الأدنى من الصلاحيات (Least Privilege): يتم منح الموظف فقط الصلاحيات اللازمة لإنجاز مهامه الوظيفية المعتمدة.'
                : 'Least Privilege Security Principle: Access scopes are assigned strictly on operational requirements and verified through audit trails.'}
            </span>
          </div>
        </div>
    </HelpDisclosure>
  );
};
