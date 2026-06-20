import { useEffect } from 'react';

const dictionary: Record<string, string> = {
  'HR Tool': 'أداة الموارد البشرية',
  Dashboard: 'لوحة التحكم',
  Attendance: 'الحضور والانصراف',
  Employees: 'الموظفون',
  'Leaves Management': 'إدارة الإجازات',
  'Missions Management': 'إدارة المأموريات',
  'Roles Management': 'إدارة الصلاحيات',
  Profile: 'الملف الشخصي',
  'My Profile': 'ملفي الشخصي',
  'Log out': 'تسجيل الخروج',
  Home: 'الرئيسية',
  Search: 'بحث',
  'Search...': 'بحث...',
  Accessibility: 'إمكانية الوصول',
  'Keyboard Shortcuts': 'اختصارات لوحة المفاتيح',
  'Toggle language': 'تغيير اللغة',
  'Open navigation menu': 'فتح قائمة التنقل',
  'Close navigation menu': 'إغلاق قائمة التنقل',
  Menu: 'القائمة',
  'Navigation menu': 'قائمة التنقل',
  'Go to my profile': 'الانتقال إلى ملفي الشخصي',
  Welcome: 'مرحباً',
  'Quick Actions': 'إجراءات سريعة',
  'Request Leave': 'طلب إجازة',
  'Request Mission': 'طلب مأمورية',
  'Upcoming Leaves': 'الإجازات القادمة',
  'Missions Pending Approval': 'مأموريات بانتظار الموافقة',
  'Summary View': 'عرض الملخص',
  Category: 'الفئة',
  Hours: 'الساعات',
  Percentage: 'النسبة',
  'Total Hours': 'إجمالي الساعات',
  'In-office': 'داخل المكتب',
  Missions: 'المأموريات',
  Leaves: 'الإجازات',
  'No Show': 'غياب',
  Unfilled: 'غير مكتمل',
  Employee: 'الموظف',
  'Select employee': 'اختر الموظف',
  'Attendance Period': 'فترة الحضور',
  'Select date': 'اختر التاريخ',
  'Annual and Sick Leaves': 'الإجازات السنوية والمرضية',
  'Leave Type': 'نوع الإجازة',
  'Total Balance': 'الرصيد الإجمالي',
  Bridge: 'الجسر',
  'From Last Year': 'من العام السابق',
  'Used Balance': 'الرصيد المستخدم',
  'Remaining Balance': 'الرصيد المتبقي',
  'Annual Leave': 'إجازة سنوية',
  'Sick Leave': 'إجازة مرضية',
  'Casual Leave': 'إجازة عارضة',
  Approved: 'تمت الموافقة',
  Pending: 'قيد الانتظار',
  Rejected: 'مرفوض',
  Cancelled: 'ملغى',
  'View Request': 'عرض الطلب',
  'Edit Request': 'تعديل الطلب',
  'Cancel request': 'إلغاء الطلب',
  Upload: 'رفع',
  Notes: 'ملاحظات',
  Requested: 'تم الطلب',
  Complete: 'مكتمل',
  'Employee Directory': 'دليل الموظفين',
  'Add Employee': 'إضافة موظف',
  Departments: 'الأقسام',
  'Job Titles': 'المسميات الوظيفية',
  'Access Cards': 'بطاقات الدخول',
  Department: 'القسم',
  'Job Title': 'المسمى الوظيفي',
  Email: 'البريد الإلكتروني',
  Phone: 'الهاتف',
  Gender: 'النوع',
  'Contract Type': 'نوع العقد',
  'Hire Date': 'تاريخ التعيين',
  Actions: 'الإجراءات',
  Active: 'نشط',
  Expired: 'منتهي',
  Suspended: 'موقوف',
  'Basic Information': 'المعلومات الأساسية',
  'Professional Profile': 'الملف المهني',
  'Download Center': 'مركز التنزيل',
  'Personal Information': 'المعلومات الشخصية',
  'Contact Information': 'معلومات التواصل',
  'Work Information': 'معلومات العمل',
  'About Me': 'نبذة عني',
  Certifications: 'الشهادات',
  Skills: 'المهارات',
  Projects: 'المشاريع',
  Employment: 'الخبرات العملية',
  Education: 'التعليم',
  'Download PDF Resume': 'تنزيل السيرة الذاتية PDF',
  'Show Credential': 'عرض الشهادة',
  'View Project': 'عرض المشروع',
  'Core UX & Design': 'تصميم وتجربة المستخدم',
  'Data Analysis & Visualization': 'تحليل البيانات والتصور المرئي',
  'Roles & Permissions': 'الأدوار والصلاحيات',
  Payrolls: 'الرواتب',
  'Under development': 'قيد التطوير',
  'Payrolls are coming soon': 'قسم الرواتب قريباً',
  Submit: 'إرسال',
  Cancel: 'إلغاء',
  Delete: 'حذف',
  Save: 'حفظ',
  Edit: 'تعديل',
  Add: 'إضافة',
  Filter: 'تصفية',
  Download: 'تنزيل',
  Export: 'تصدير',
  Name: 'الاسم',
  Status: 'الحالة',
  Date: 'التاريخ',
  Type: 'النوع',
  Duration: 'المدة',
  'November 2023': 'نوفمبر 2023',
};

const phraseDictionary: Array<[RegExp, string]> = [
  [/Showing attendance for/g, 'عرض الحضور للموظف'],
  [/Last updated:/g, 'آخر تحديث:'],
  [/Search or command palette/g, 'البحث أو لوحة الأوامر'],
  [/Shortcut Control K/g, 'الاختصار Control K'],
  [/Go to Dashboard/g, 'الانتقال إلى لوحة التحكم'],
];

const originalText = new WeakMap<Text, string>();
const originalAttributes = new WeakMap<Element, Map<string, string>>();
const attributes = ['placeholder', 'title', 'aria-label'];

const translateValue = (value: string) => {
  const trimmed = value.trim();
  let translated = dictionary[trimmed] ?? trimmed;

  for (const [pattern, replacement] of phraseDictionary) {
    translated = translated.replace(pattern, replacement);
  }

  if (translated === trimmed) return value;
  return value.replace(trimmed, translated);
};

const translateTextNode = (node: Text, enabled: boolean) => {
  if (!originalText.has(node)) {
    originalText.set(node, node.nodeValue ?? '');
  }

  const source = originalText.get(node) ?? '';
  if (!enabled && /[\u0600-\u06FF]/.test(source)) return;
  node.nodeValue = enabled ? translateValue(source) : source;
};

const translateElementAttributes = (element: Element, enabled: boolean) => {
  let originals = originalAttributes.get(element);
  if (!originals) {
    originals = new Map<string, string>();
    originalAttributes.set(element, originals);
  }

  attributes.forEach((attribute) => {
    const current = element.getAttribute(attribute);
    if (current == null) return;
    if (!originals.has(attribute)) originals.set(attribute, current);
    const source = originals.get(attribute) ?? current;
    if (!enabled && /[\u0600-\u06FF]/.test(source)) return;
    const nextValue = enabled ? translateValue(source) : source;
    if (current !== nextValue) {
      element.setAttribute(attribute, nextValue);
    }
  });
};

const walkAndTranslate = (root: ParentNode, enabled: boolean) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      const parent = node.nodeType === Node.TEXT_NODE ? node.parentElement : node as Element;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (['SCRIPT', 'STYLE', 'TEXTAREA'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
      if (parent.closest('[data-no-auto-translate]')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  let node = walker.nextNode();
  while (node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const value = node.nodeValue ?? '';
      if (value.trim()) translateTextNode(node as Text, enabled);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      translateElementAttributes(node as Element, enabled);
    }
    node = walker.nextNode();
  }
};

export const useArabicDomTranslation = (enabled: boolean) => {
  useEffect(() => {
    walkAndTranslate(document.body, enabled);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            translateTextNode(node as Text, enabled);
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            walkAndTranslate(node as Element, enabled);
          }
        });

        if (mutation.type === 'attributes' && mutation.target.nodeType === Node.ELEMENT_NODE) {
          translateElementAttributes(mutation.target as Element, enabled);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: attributes,
    });

    return () => observer.disconnect();
  }, [enabled]);
};
