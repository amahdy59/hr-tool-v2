const fs = require('fs');

const data = JSON.parse(fs.readFileSync('translations.json', 'utf8'));

// Build dictionary object from 'English Text' -> 'Arabic Translation'
const dict = {};

const normalizeArabic = (value) => value
  .replace(/الأجازات/g, 'الإجازات')
  .replace(/الأجازة/g, 'الإجازة')
  .replace(/اجازات/g, 'إجازات')
  .replace(/اجازة/g, 'إجازة')
  .replace(/أجازات/g, 'إجازات')
  .replace(/أجازة/g, 'إجازة')
  .replace(/اجاز/g, 'إجاز')
  .replace(/أجاز/g, 'إجاز')
  .replace(/الفلاتر/g, 'عوامل التصفية')
  .replace(/الفلتر/g, 'عامل التصفية')
  .replace(/\bفلتر\b/g, 'تصفية')
  .replace(/حجز المامورية/g, 'طلب مأمورية')
  .replace(/المامورية/g, 'المأمورية');

const curatedTranslations = {
  'Dashboard': 'لوحة التحكم',
  'Leaves Management': 'إدارة الإجازات',
  'Leave Management': 'إدارة الإجازات',
  'Leave': 'إجازة',
  'Leaves': 'الإجازات',
  'Leave Type': 'نوع الإجازة',
  'Leave Details': 'تفاصيل الإجازة',
  'Leave request details': 'تفاصيل طلب الإجازة',
  'Request Leave': 'طلب إجازة',
  'Request leave': 'طلب إجازة',
  'Request Mission': 'طلب مأمورية',
  'Create Leave': 'إنشاء طلب إجازة',
  'Create a new leave request': 'إنشاء طلب إجازة جديد',
  'Other leave balances': 'أرصدة الإجازات الأخرى',
  'Paternity Leave': 'إجازة أبوة',
  'Hajj': 'الحج',
  'Annual Leave': 'إجازة سنوية',
  'Annual leave': 'إجازة سنوية',
  'Sick Leave': 'إجازة مرضية',
  'Casual Leave': 'إجازة عارضة',
  'Maternity (appears only to females)': 'إجازة أمومة (تظهر للإناث فقط)',
  'Paternity (appears only to males)': 'إجازة أبوة (تظهر للذكور فقط)',
  'Vacation': 'إجازة',
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
  'Approve Leave': 'الموافقة على الإجازة',
  'Approve Leaves': 'الموافقة على الإجازات',
  'Approve Mission': 'الموافقة على المأمورية',
  'Approve Missions': 'الموافقة على المأموريات',
  '4 weeks (20 working days)': '4 أسابيع (20 يوم عمل)',
  '2 weeks (10 working days)': 'أسبوعان (10 أيام عمل)',
  '1 week (5 working days)': 'أسبوع واحد (5 أيام عمل)',
  'Case-by-case / No limit': 'حسب الحالة / بدون حد أقصى',
  'Please ensure all carried-over vacation days from last year are used before': 'يرجى التأكد من استخدام جميع أيام الإجازة المرحلة من العام الماضي قبل',
  'March 31st this year': '31 مارس من هذا العام',
  "Carried over days are deducted automatically before this year's vacation.": 'تُخصم الأيام المرحلة تلقائيًا قبل رصيد إجازات هذا العام.',
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
