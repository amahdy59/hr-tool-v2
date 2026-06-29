const fs = require('fs');

const data = JSON.parse(fs.readFileSync('translations.json', 'utf8'));

// Build dictionary object from 'English Text' -> 'Arabic Translation'
const dict = {};

const normalizeArabic = (value) => value
  .replace(/الأجازات/g, 'الاجازات')
  .replace(/الأجازة/g, 'الاجازة')
  .replace(/اجازات/g, 'اجازات')
  .replace(/اجازة/g, 'اجازة')
  .replace(/أجازات/g, 'اجازات')
  .replace(/أجازة/g, 'اجازة')
  .replace(/اجاز/g, 'اجاز')
  .replace(/أجاز/g, 'اجاز')
  .replace(/الفلاتر/g, 'عوامل التصفية')
  .replace(/الفلتر/g, 'عامل التصفية')
  .replace(/\bفلتر\b/g, 'تصفية')
  .replace(/حجز المامورية/g, 'طلب مأمورية')
  .replace(/المامورية/g, 'المأمورية');

const curatedTranslations = {
  'Dashboard': 'لوحة التحكم',
  'Leaves Management': 'إدارة الاجازات',
  'Leave Management': 'إدارة الاجازات',
  'Leave': 'اجازة',
  'Leaves': 'الاجازات',
  'Leave Type': 'نوع الاجازة',
  'Leave Details': 'تفاصيل الاجازة',
  'Leave request details': 'تفاصيل طلب الاجازة',
  'Request Leave': 'طلب اجازة',
  'Request leave': 'طلب اجازة',
  'Request Mission': 'طلب مأمورية',
  'Create Leave': 'إنشاء طلب اجازة',
  'Create a new leave request': 'إنشاء طلب اجازة جديد',
  'Other leave balances': 'أرصدة الاجازات الأخرى',
  'Paternity Leave': 'اجازة أبوة',
  'Hajj': 'الحج',
  'Annual Leave': 'اجازة سنوية',
  'Annual leave': 'اجازة سنوية',
  'Sick Leave': 'اجازة مرضية',
  'Casual Leave': 'اجازة عارضة',
  'Maternity (appears only to females)': 'اجازة أمومة (تظهر للإناث فقط)',
  'Paternity (appears only to males)': 'اجازة أبوة (تظهر للذكور فقط)',
  'Vacation': 'اجازة',
  'Filter': 'تصفية',
  'Apply Filter': 'تطبيق التصفية',
  'Clear Filter': 'مسح التصفية',
  'clear all filters': 'مسح كل عوامل التصفية',
  'Close filters': 'إغلاق عوامل التصفية',
  'Filters applied': 'تم تطبيق عوامل التصفية',
  'Filters applied successfully': 'تم تطبيق عوامل التصفية بنجاح',
  'Filters cleared': 'تم مسح عوامل التصفية',
  'Search results are based on selected filters.': 'تعتمد نتائج البحث على عوامل التصفية المحددة.',
  'Approve': 'موافقة',
  'Approve Leave': 'الموافقة على الاجازة',
  'Approve Leaves': 'الموافقة على الاجازات',
  'Approve Mission': 'الموافقة على المأمورية',
  'Approve Missions': 'الموافقة على المأموريات',
  '4 weeks (20 working days)': '4 أسابيع (20 يوم عمل)',
  '2 weeks (10 working days)': 'أسبوعان (10 أيام عمل)',
  '1 week (5 working days)': 'أسبوع واحد (5 أيام عمل)',
  'Case-by-case / No limit': 'حسب الحالة / بدون حد أقصى',
  'Please ensure all carried-over vacation days from last year are used before': 'يرجى التأكد من استخدام جميع أيام الاجازة المرحلة من العام الماضي قبل',
  'March 31st this year': '31 مارس من هذا العام',
  "Carried over days are deducted automatically before this year's vacation.": 'تُخصم الأيام المرحلة تلقائيًا قبل رصيد اجازات هذا العام.',
  'Export monthly summary to CSV': 'تصدير ملخص الشهر إلى ملف CSV',
  'Hours are calculated based on clock-in/clock-out records. Lunch breaks are excluded. Minimum day threshold is 4 hours.': 'تُحتسب الساعات بناءً على سجلات الحضور والانصراف. لا تُحتسب استراحات الغداء. الحد الأدنى لليوم هو 4 ساعات.',
  'Show employee search tips': 'عرض إرشادات البحث عن الموظفين',
  'Attendance period': 'فترة الحضور',
  'Export monthly attendance summary': 'تصدير ملخص الحضور الشهري',
  'Explain attendance hours': 'شرح ساعات الحضور',
  'Show daily attendance table details': 'عرض تفاصيل جدول الحضور اليومي',
  'Hired after': 'تاريخ التعيين بعد',
  'Open manager actions': 'فتح إجراءات المدير',
  'Holiday month': 'شهر العطلة',
  'Holiday year': 'سنة العطلة',
  'Open history filters': 'فتح عوامل تصفية السجل',
  'Leave filter from date': 'تصفية الاجازات من تاريخ',
  'Leave filter to date': 'تصفية الاجازات حتى تاريخ',
  'Profile sections': 'أقسام الملف الشخصي',
  'Pause upload': 'إيقاف الرفع مؤقتًا',
  'Cancel upload': 'إلغاء الرفع',
  'Leave balance summary': 'ملخص رصيد الاجازة',
  'Select a request type to continue': 'اختر نوع الطلب للمتابعة',
  'Information about this action': 'معلومات عن هذا الإجراء',
  'Book time off': 'حجز اجازة',
  'PDF, PNG, JPG up to 10MB': 'PDF أو PNG أو JPG حتى 10 ميجابايت',
  'Upload file or drag and drop': 'رفع ملف أو السحب والإفلات',
  'Required for family care requests': 'مطلوب لطلبات رعاية الأسرة',
  'Required for sick requests': 'مطلوب لطلبات الاجازة المرضية',
  'Required for maternity requests': 'مطلوب لطلبات اجازة الأمومة',
  'Required for paternity requests': 'مطلوب لطلبات اجازة الأبوة',
  'Required for hajj requests': 'مطلوب لطلبات اجازة الحج',
  'Required for marriage requests': 'مطلوب لطلبات اجازة الزواج',
  'Required for bereavement requests': 'مطلوب لطلبات اجازة الوفاة',
  'Import Profile from LinkedIn': 'استيراد الملف الشخصي من LinkedIn',
  'Sync your profile with LinkedIn to maintain ATS compatibility and avoid manual data entry.': 'قم بمزامنة ملفك الشخصي مع LinkedIn للحفاظ على التوافق مع أنظمة التوظيف وتجنب إدخال البيانات يدويًا.',
  'LinkedIn PDF Export / Resume': 'تصدير ملف LinkedIn PDF / السيرة الذاتية',
  'Public Profile URL': 'رابط الملف الشخصي العام',
  'To export your profile: Go to your LinkedIn profile page, click "More", and choose "Save to PDF". Then upload the downloaded PDF here.': 'لتصدير ملفك الشخصي: اذهب إلى صفحة ملفك الشخصي على LinkedIn، وانقر على "المزيد"، ثم اختر "حفظ بصيغة PDF". بعد ذلك، ارفع ملف PDF الذي تم تنزيله هنا.',
  'Upload LinkedIn PDF': 'رفع ملف LinkedIn PDF',
  'PDF format up to 5MB': 'صيغة PDF حتى 5 ميجابايت',
  'LinkedIn Profile URL': 'رابط الملف الشخصي على LinkedIn',
  'Import Profile': 'استيراد الملف الشخصي',
  'Connecting to LinkedIn Gateway...': 'الاتصال ببوابة LinkedIn...',
  'Extracting experience and profile headers...': 'استخراج تفاصيل الخبرة والملف الشخصي...',
  'Building ATS schema & mapping skills...': 'بناء مخطط ATS وتعيين المهارات...',
  'Please keep this modal open. This will take a few seconds.': 'يرجى إبقاء هذه النافذة مفتوحة. سيستغرق ذلك بضع ثوانٍ.',
  'LinkedIn import ready!': 'الاستيراد من LinkedIn جاهز!',
  'We parsed ': 'تم تحليل ',
  ' Experiences, ': ' من الخبرات، ',
  ' Education items, ': ' من عناصر التعليم، ',
  ' Projects, and ': ' من المشروعات، و ',
  ' Skills. Review them below before merging.': ' من المهارات. راجعها أدناه قبل الدمج.',
  'Summary / About': 'الملخص / نبذة عني',
  'Experiences': 'الخبرات',
  'Educations': 'التعليم',
  'Back': 'رجوع',
  'Merge & Sync Profile': 'دمج ومزامنة الملف الشخصي',
};

data.forEach(row => {
  const eng = row['English Text'];
  const ar = row['Arabic Translation'];
  if (eng && ar) {
    dict[eng.trim()] = normalizeArabic(ar.trim());
  }
});

Object.assign(dict, curatedTranslations);

let fileContent = fs.readFileSync('src/lib/useArabicDomTranslation.ts', 'utf8');

// The file has:
// const dictionary: Record<string, string> = {
//   ...
// };

const newDictStr = 'const dictionary: Record<string, string> = {\n' + 
  Object.keys(dict).map(k => `  ${JSON.stringify(k)}: ${JSON.stringify(dict[k])}`).join(',\n') +
  '\n};';

fileContent = fileContent.replace(/const dictionary: Record<string, string> = \{[\s\S]*?\};/, newDictStr);

fs.writeFileSync('src/lib/useArabicDomTranslation.ts', fileContent);
console.log('Dictionary updated with ' + Object.keys(dict).length + ' entries.');
