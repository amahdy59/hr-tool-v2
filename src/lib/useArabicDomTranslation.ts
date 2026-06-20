import { useEffect } from 'react';

const dictionary: Record<string, string> = {
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
  'Date of Birth': 'تاريخ الميلاد',
  'Marital Status': 'الحالة الاجتماعية',
  Nationality: 'الجنسية',
  LinkedIn: 'لينكد إن',
  Dribbble: 'دريبل',
  Portfolio: 'معرض الأعمال',
  'Working Hours': 'ساعات العمل',
  'Time Zone': 'المنطقة الزمنية',
  'Work Location': 'مكان العمل',
  'Save changes': 'حفظ التغييرات',
  'Selected Projects': 'المشاريع المختارة',
  'UX Design': 'تصميم تجربة المستخدم',
  'Data Visualization': 'تصوير البيانات',
  'Dashboard Design': 'تصميم لوحات التحكم',
  'Print dialog opened. Save as PDF to download your resume.': 'تم فتح نافذة الطباعة. احفظ كملف PDF لتنزيل سيرتك الذاتية.',
  'Failed to generate resume': 'فشل في إنشاء السيرة الذاتية',
  'Generating your resume...': 'جاري إنشاء سيرتك الذاتية...',
  'Accessibility Tools': 'أدوات إمكانية الوصول',
  'Adjust your preferences.': 'تعديل تفضيلاتك.',
  'AAA High Contrast': 'تباين عالي AAA',
  'Force maximum text-to-background contrast ratio (7:1).': 'فرض أقصى نسبة تباين بين النص والخلفية (7:1).',
  'AAA Large Targets': 'أهداف كبيرة AAA',
  'Resize interactive buttons/inputs to minimum 44px.': 'تغيير حجم الأزرار/المدخلات التفاعلية ليكون الحد الأدنى 44 بكسل.',
  'AAA Text Scale': 'تكبير النص AAA',
  'Increase base text sizing by 120% for readability.': 'زيادة حجم النص الأساسي بنسبة 120% لسهولة القراءة.',
  'Dyslexia Font': 'خط عسر القراءة',
  'Change typeface to a more readable font style.': 'تغيير نوع الخط إلى نمط أكثر قابلية للقراءة.',
  'Focus Highlights': 'إبراز التركيز',
  'Apply heavy outlines to key elements when tabbed.': 'تطبيق إطارات سميكة على العناصر الأساسية عند التركيز.',
  'Company': 'الشركة',
  'Role': 'الدور',
  'Employment Type': 'نوع التوظيف',
  'Start Date': 'تاريخ البدء',
  'End Date': 'تاريخ الانتهاء',
  'Currently working here': 'أعمل هنا حالياً',
  'Description': 'الوصف',
  'School/University': 'المدرسة/الجامعة',
  'Degree/Certificate': 'الدرجة العلمية/الشهادة',
  'Field of Study': 'مجال الدراسة',
  'Field of Study (Optional)': 'مجال الدراسة (اختياري)',
  'Start Year': 'سنة البدء',
  'End Year': 'سنة الانتهاء',
  'Project Name': 'اسم المشروع',
  'Project Link': 'رابط المشروع',
  'Tools Used': 'الأدوات المستخدمة',
  'First Name': 'الاسم الأول',
  'Last Name': 'اسم العائلة',
  'Email Address': 'البريد الإلكتروني',
  'Phone Number': 'رقم الهاتف',
  'Employee ID': 'الرقم الوظيفي',
  'Full-time': 'دوام كامل',
  'Part-time': 'دوام جزئي',
  'Contract': 'عقد',
  'Hybrid': 'هجين',
  'Remote': 'عن بُعد',
  'On-site': 'في مقر العمل',
  'Male': 'ذكر',
  'Female': 'أنثى',
  'Single': 'أعزب',
  'Married': 'متزوج',
  'Confirm Delete': 'تأكيد الحذف',
  'Are you sure you want to delete': 'هل أنت متأكد أنك تريد حذف',
  'This action cannot be undone.': 'لا يمكن التراجع عن هذا الإجراء.',
  'Add Skill': 'إضافة مهارة',
  'Search skills...': 'البحث عن المهارات...',
  'Issuing Organization': 'الجهة المانحة',
  'Credential ID': 'رقم الشهادة',
  'Credential URL': 'رابط الشهادة',
  'Issue Month': 'شهر الإصدار',
  'Issue Year': 'سنة الإصدار',
  'Optional': 'اختياري',
  'Optional...': 'اختياري...',
  'Other': 'أخرى',
  'Divorced': 'مطلق',
  'Widowed': 'أرمل',
  'Design': 'التصميم',
  'Engineering': 'الهندسة',
  'Product': 'المنتج',
  'HR': 'الموارد البشرية',
  'Marketing': 'التسويق',
  'Internship': 'تدريب',
  'Timesheet': 'جدول الأوقات',
  'My Requests': 'طلباتي',
  'Export CSV': 'تصدير CSV',
  'Req Date': 'تاريخ الطلب',
  'Range': 'الفترة',
  'Cancel Request': 'إلغاء الطلب',
  'View Details': 'عرض التفاصيل',
  'Sick': 'مرضي',
  'Vacation': 'إجازة',
  'Fever and flu': 'حمى وأنفلونزا',
  'Annual leave': 'إجازة سنوية',
  'Stomachache': 'ألم في المعدة',
  'Holiday travel': 'سفر لقضاء عطلة',
  'Available': 'متاح',
  'Used': 'مستخدم',
  'Total': 'الإجمالي',
  'Unfilled': 'غير مسجل',
  'Weekend': 'عطلة نهاية الأسبوع',
  'Mission': 'مأمورية',
  'Holiday': 'عطلة',
  'All': 'الكل',
  'Oil and Gas': 'النفط والغاز',
  'IT': 'تقنية المعلومات',
  'Finance': 'المالية',
  'Human Resources': 'الموارد البشرية',
  'Operations': 'العمليات',
  'Engineer': 'مهندس',
  'Lead Engineer': 'مهندس رئيسي',
  'Application Consultant': 'مستشار تطبيقات',
  'Project Manager': 'مدير مشروع',
  'Senior Engineer': 'مهندس أول',
  'Analyst': 'محلل',
  'Day': 'اليوم',
  'Time In': 'وقت الحضور',
  'Time Out': 'وقت الانصراف',
  'Month': 'الشهر',
  'Monday': 'الإثنين',
  'Tuesday': 'الثلاثاء',
  'Wednesday': 'الأربعاء',
  'Thursday': 'الخميس',
  'Friday': 'الجمعة',
  'Saturday': 'السبت',
  'Sunday': 'الأحد',
  'Leave Type': 'نوع الإجازة',
  'Annual Leave': 'إجازة سنوية',
  'Sick Leave': 'إجازة مرضية',
  'Casual Leave': 'إجازة عارضة',
  'From': 'من',
  'To': 'إلى',
  'Submit Request': 'تقديم الطلب',
  'Continue': 'متابعة',
  'Are you sure?': 'هل أنت متأكد؟',
  'Request Mission': 'طلب مأمورية',
  'Mission Type': 'نوع المأمورية',
  'Work From Home': 'عمل من المنزل',
  'Client Visit': 'زيارة عميل',
  'Conference': 'مؤتمر',
  'Location': 'الموقع',
  'Leave Details': 'تفاصيل الإجازة',
  'Resubmit Request': 'إعادة تقديم الطلب',
  'Dates': 'التواريخ',
  'Select a date': 'اختر تاريخاً',
  'Pick a date': 'اختر تاريخاً',
  'Gender': 'الجنس',
  'Department': 'القسم',
  'Job Title': 'المسمى الوظيفي',
  'Hire Date': 'تاريخ التعيين',
  'Personal Information': 'المعلومات الشخصية',
  'Contact Information': 'معلومات التواصل',
  'Work Information': 'معلومات العمل',
};

const phraseDictionary: Array<[RegExp, string]> = [
  [/^Welcome (.*)$/, 'مرحباً $1'],
  [/^(\d+) days?$/, '$1 أيام'],
  [/^(\d+)h (\d+)m$/, '$1س $2د'],
  [/^(\d{1,2}) (January|February|March|April|May|June|July|August|September|October|November|December) (\d{4})$/, '$1 $2 $3'],
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
