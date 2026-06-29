const arabicNameMap: Record<string, string> = {
  'Ahmed Mahdy': 'أحمد مهدي',
  Ahmed: 'أحمد',
  'Ahmed Salem': 'أحمد سالم',
  'Ahmed M.': 'أحمد م.',
  'Sara K.': 'سارة ك.',
  'Sara Khalil': 'سارة خليل',
  'Omar Farouk': 'عمر فاروق',
  'Fatima Noor': 'فاطمة نور',
  'Mohamed Shalaby': 'محمد شلبي',
  'Mohamed Thursday': 'محمد ثيرسداي',
  'Mahmoud Thursday': 'محمود ثيرسداي',
  'Aly Othman': 'علي عثمان',
  'Aleksander Garcia': 'ألكسندر غارسيا',
  'Tanvi Lumari': 'تانفي لوماري',
  'Jack Gray': 'جاك غراي',
  'Saad Jawahir': 'سعد جواهر',
  'Imani Adimbola': 'إيماني أديمبولا',
  'Muhammed Habib': 'محمد حبيب',
  'Mohammed Habib': 'محمد حبيب',
  'Lena Mohamed': 'لينا محمد',
  'Muhammed Nasir': 'محمد ناصر',
  'Layla El-Amin': 'ليلى الأمين',
  'Li Wei Su': 'لي وي سو',
  'Dmitri Reznikov': 'ديمتري ريزنيكوف',
  'Amara Okonkwo': 'أمارا أوكونكو',
  'Pablo Morales': 'بابلو موراليس',
  'Fatima Waluyo': 'فاطمة والويو',
  'Johan Andersen': 'يوهان أندرسن',
  'Maryam Hussein': 'مريم حسين',
  'Sara Abdallah': '\u0633\u0627\u0631\u0629 \u0639\u0628\u062f \u0627\u0644\u0644\u0647',
  'Vinay Ansari': '\u0641\u064a\u0646\u0627\u064a \u0623\u0646\u0635\u0627\u0631\u064a',
  'Sara Kasongo': '\u0633\u0627\u0631\u0629 \u0643\u0627\u0633\u0648\u0646\u062c\u0648',
  'Maria Fernanda': '\u0645\u0627\u0631\u064a\u0627 \u0641\u0631\u0646\u0627\u0646\u062f\u0627',
  'MarÃ­a Fernanda': '\u0645\u0627\u0631\u064a\u0627 \u0641\u0631\u0646\u0627\u0646\u062f\u0627',
  'Luka Silva': '\u0644\u0648\u0643\u0627 \u0633\u064a\u0644\u0641\u0627',
  'Priyanka Ram': '\u0628\u0631\u064a\u0627\u0646\u0643\u0627 \u0631\u0627\u0645',
  'Natalia Díaz': '\u0646\u0627\u062a\u0627\u0644\u064a\u0627 \u062f\u064a\u0627\u0632',
  'Natalia DÃ­az': '\u0646\u0627\u062a\u0627\u0644\u064a\u0627 \u062f\u064a\u0627\u0632',
  'Jay Gupta': 'جي غوبتا',
  'Charles Brown': 'تشارلز براون',
  'Mona Tawfik': 'منى توفيق',
};

export const isArabicLanguage = (language?: string) => language?.startsWith('ar') ?? false;

const supplementalArabicNameMap: Record<string, string> = {
  'Sarah Johnson': '\u0633\u0627\u0631\u0629 \u062c\u0648\u0646\u0633\u0648\u0646',
  'Michael Chen': '\u0645\u0627\u064a\u0643\u0644 \u062a\u0634\u064a\u0646',
  'Emily Rodriguez': '\u0625\u0645\u064a\u0644\u064a \u0631\u0648\u062f\u0631\u064a\u063a\u064a\u0632',
  'James Williams': '\u062c\u064a\u0645\u0633 \u0648\u064a\u0644\u064a\u0627\u0645\u0632',
  'Lisa Anderson': '\u0644\u064a\u0632\u0627 \u0623\u0646\u062f\u0631\u0633\u0648\u0646',
  'David Martinez': '\u062f\u064a\u0641\u064a\u062f \u0645\u0627\u0631\u062a\u064a\u0646\u064a\u0632',
  'Jennifer Taylor': '\u062c\u064a\u0646\u064a\u0641\u0631 \u062a\u0627\u064a\u0644\u0648\u0631',
  'Robert Brown': '\u0631\u0648\u0628\u0631\u062a \u0628\u0631\u0627\u0648\u0646',
  'Amanda Lee': '\u0623\u0645\u0627\u0646\u062f\u0627 \u0644\u064a',
  'Christopher Davis': '\u0643\u0631\u064a\u0633\u062a\u0648\u0641\u0631 \u062f\u064a\u0641\u064a\u0633',
};

const departmentNameMap: Record<string, string> = {
  Administration: '\u0627\u0644\u0625\u062f\u0627\u0631\u0629',
  Design: '\u0627\u0644\u062a\u0635\u0645\u064a\u0645',
  Engineering: '\u0627\u0644\u0647\u0646\u062f\u0633\u0629',
  FIN: '\u0627\u0644\u0645\u0627\u0644\u064a\u0629',
  Finance: '\u0627\u0644\u0645\u0627\u0644\u064a\u0629',
  Global: '\u0627\u0644\u0639\u0627\u0644\u0645\u064a',
  HR: '\u0627\u0644\u0645\u0648\u0627\u0631\u062f \u0627\u0644\u0628\u0634\u0631\u064a\u0629',
  'Human Resources': '\u0627\u0644\u0645\u0648\u0627\u0631\u062f \u0627\u0644\u0628\u0634\u0631\u064a\u0629',
  IT: '\u062a\u0642\u0646\u064a\u0629 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062a',
  'Information Technology': '\u062a\u0642\u0646\u064a\u0629 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062a',
  'Customer Support': '\u062f\u0639\u0645 \u0627\u0644\u0639\u0645\u0644\u0627\u0621',
  'Legal & Compliance': '\u0627\u0644\u0634\u0624\u0648\u0646 \u0627\u0644\u0642\u0627\u0646\u0648\u0646\u064a\u0629 \u0648\u0627\u0644\u0627\u0645\u062a\u062b\u0627\u0644',
  Marketing: '\u0627\u0644\u062a\u0633\u0648\u064a\u0642',
  'Oil & Gas': '\u0627\u0644\u0646\u0641\u0637 \u0648\u0627\u0644\u063a\u0627\u0632',
  Operations: '\u0627\u0644\u0639\u0645\u0644\u064a\u0627\u062a',
  OPS: '\u0627\u0644\u0639\u0645\u0644\u064a\u0627\u062a',
  Procurement: '\u0627\u0644\u0645\u0634\u062a\u0631\u064a\u0627\u062a',
  Product: '\u0627\u0644\u0645\u0646\u062a\u062c',
  SAL: '\u0627\u0644\u0645\u0628\u064a\u0639\u0627\u062a',
  Sales: '\u0627\u0644\u0645\u0628\u064a\u0639\u0627\u062a',
  SCADA: '\u0633\u0643\u0627\u062f\u0627',
  Software: '\u0627\u0644\u0628\u0631\u0645\u062c\u064a\u0627\u062a',
  Technology: '\u062a\u0642\u0646\u064a\u0629 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062a',
  Unassigned: '\u063a\u064a\u0631 \u0645\u0639\u064a\u0646',
  'Company HR Management': '\u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u0645\u0648\u0627\u0631\u062f \u0627\u0644\u0628\u0634\u0631\u064a\u0629',
};

const jobTitleMap: Record<string, string> = {
  Accountant: '\u0645\u062d\u0627\u0633\u0628',
  Admin: '\u0645\u0633\u0624\u0648\u0644 \u0646\u0638\u0627\u0645',
  'Administration Manager': '\u0645\u062f\u064a\u0631 \u0627\u0644\u0625\u062f\u0627\u0631\u0629',
  'Backend Developer': '\u0645\u0637\u0648\u0631 \u062e\u0644\u0641\u064a',
  'Content Writer': '\u0643\u0627\u062a\u0628 \u0645\u062d\u062a\u0648\u0649',
  'Cybersecurity Engineer': '\u0645\u0647\u0646\u062f\u0633 \u0623\u0645\u0646 \u0633\u064a\u0628\u0631\u0627\u0646\u064a',
  'Cybersecurity Specialist': '\u0623\u062e\u0635\u0627\u0626\u064a \u0623\u0645\u0646 \u0633\u064a\u0628\u0631\u0627\u0646\u064a',
  'DevOps Engineer': '\u0645\u0647\u0646\u062f\u0633 \u062f\u064a\u0641 \u0623\u0648\u0628\u0633',
  'Director of Supply Chain Optimization': '\u0645\u062f\u064a\u0631 \u062a\u062d\u0633\u064a\u0646 \u0633\u0644\u0633\u0644\u0629 \u0627\u0644\u0625\u0645\u062f\u0627\u062f',
  Employee: '\u0645\u0648\u0638\u0641',
  Engineer: '\u0645\u0647\u0646\u062f\u0633',
  'Financial Reviewer': '\u0645\u0631\u0627\u062c\u0639 \u0645\u0627\u0644\u064a',
  'Financial Analyst': '\u0645\u062d\u0644\u0644 \u0645\u0627\u0644\u064a',
  'Financial Specialist': '\u0623\u062e\u0635\u0627\u0626\u064a \u0645\u0627\u0644\u064a',
  'Facilities Coordinator': '\u0645\u0646\u0633\u0642 \u0627\u0644\u0645\u0631\u0627\u0641\u0642',
  'Business Development Representative': '\u0645\u0645\u062b\u0644 \u062a\u0637\u0648\u064a\u0631 \u0627\u0644\u0623\u0639\u0645\u0627\u0644',
  'Customer Success Specialist': '\u0623\u062e\u0635\u0627\u0626\u064a \u0646\u062c\u0627\u062d \u0627\u0644\u0639\u0645\u0644\u0627\u0621',
  'Global Operations Manager': '\u0645\u062f\u064a\u0631 \u0627\u0644\u0639\u0645\u0644\u064a\u0627\u062a \u0627\u0644\u0639\u0627\u0644\u0645\u064a\u0629',
  'HR Manager': '\u0645\u062f\u064a\u0631 \u0627\u0644\u0645\u0648\u0627\u0631\u062f \u0627\u0644\u0628\u0634\u0631\u064a\u0629',
  'HR Specialist': '\u0623\u062e\u0635\u0627\u0626\u064a \u0645\u0648\u0627\u0631\u062f \u0628\u0634\u0631\u064a\u0629',
  'Legal Manager': '\u0645\u062f\u064a\u0631 \u0627\u0644\u0634\u0624\u0648\u0646 \u0627\u0644\u0642\u0627\u0646\u0648\u0646\u064a\u0629',
  'Marketing Manager': '\u0645\u062f\u064a\u0631 \u0627\u0644\u062a\u0633\u0648\u064a\u0642',
  'Operations Manager': '\u0645\u062f\u064a\u0631 \u0627\u0644\u0639\u0645\u0644\u064a\u0627\u062a',
  'Procurement Manager': '\u0645\u062f\u064a\u0631 \u0627\u0644\u0645\u0634\u062a\u0631\u064a\u0627\u062a',
  'Procurement Specialist': '\u0623\u062e\u0635\u0627\u0626\u064a \u0645\u0634\u062a\u0631\u064a\u0627\u062a',
  'Product Manager': '\u0645\u062f\u064a\u0631 \u0645\u0646\u062a\u062c',
  'QA Engineer': '\u0645\u0647\u0646\u062f\u0633 \u0636\u0645\u0627\u0646 \u0627\u0644\u062c\u0648\u062f\u0629',
  'Sales Manager': '\u0645\u062f\u064a\u0631 \u0627\u0644\u0645\u0628\u064a\u0639\u0627\u062a',
  'Sales Director': '\u0645\u062f\u064a\u0631 \u0627\u0644\u0645\u0628\u064a\u0639\u0627\u062a',
  'Senior Cybersecurity Specialist': '\u0623\u062e\u0635\u0627\u0626\u064a \u0623\u0645\u0646 \u0633\u064a\u0628\u0631\u0627\u0646\u064a \u0623\u0648\u0644',
  'Senior Developer': '\u0645\u0637\u0648\u0631 \u0623\u0648\u0644',
  'Senior Project Manager': '\u0645\u062f\u064a\u0631 \u0645\u0634\u0631\u0648\u0639 \u0623\u0648\u0644',
  'Senior Solutions Architect': '\u0645\u0639\u0645\u0627\u0631\u064a \u062d\u0644\u0648\u0644 \u0623\u0648\u0644',
  'IT Support Specialist': '\u0623\u062e\u0635\u0627\u0626\u064a \u062f\u0639\u0645 \u062a\u0642\u0646\u064a',
  'Legal Specialist': '\u0623\u062e\u0635\u0627\u0626\u064a \u0634\u0624\u0648\u0646 \u0642\u0627\u0646\u0648\u0646\u064a\u0629',
  'Quality Officer': '\u0645\u0633\u0624\u0648\u0644 \u062c\u0648\u062f\u0629',
  'Software Developer': '\u0645\u0637\u0648\u0631 \u0628\u0631\u0645\u062c\u064a\u0627\u062a',
  'Solutions Architect': '\u0645\u0639\u0645\u0627\u0631\u064a \u062d\u0644\u0648\u0644',
  Staff: '\u0645\u0648\u0638\u0641',
  'Super Admin': '\u0645\u0633\u0624\u0648\u0644 \u0646\u0638\u0627\u0645 \u0623\u0648\u0644',
  'Talent Acquisition Specialist': '\u0623\u062e\u0635\u0627\u0626\u064a \u0627\u0633\u062a\u0642\u0637\u0627\u0628 \u0627\u0644\u0645\u0648\u0627\u0647\u0628',
  'Team Leader': '\u0642\u0627\u0626\u062f \u0641\u0631\u064a\u0642',
  'UX Designer': '\u0645\u0635\u0645\u0645 \u062a\u062c\u0631\u0628\u0629 \u0645\u0633\u062a\u062e\u062f\u0645',
  'UX Designer & Data Analyst': '\u0645\u0635\u0645\u0645 \u062a\u062c\u0631\u0628\u0629 \u0645\u0633\u062a\u062e\u062f\u0645 \u0648\u0645\u062d\u0644\u0644 \u0628\u064a\u0627\u0646\u0627\u062a',
};

export type BilingualPersonName = {
  name?: string;
  nameEn?: string;
  nameAr?: string;
};

export const localizePersonName = (name: string | BilingualPersonName | undefined, language?: string) => {
  if (!name) return '';
  const isArabic = isArabicLanguage(language);

  if (typeof name !== 'string') {
    const englishName = name.nameEn || name.name || '';
    return isArabic ? (name.nameAr || arabicNameMap[englishName] || supplementalArabicNameMap[englishName] || englishName) : englishName;
  }

  if (!isArabic) return name;
  return arabicNameMap[name] ?? supplementalArabicNameMap[name] ?? name;
};

export const localizeFirstName = (name: string | BilingualPersonName | undefined, language?: string) => {
  const localized = localizePersonName(name, language);
  return localized.split(/\s+/)[0] || localized;
};

const localizeFromMap = (value: string | undefined, language: string | undefined, map: Record<string, string>) => {
  if (!value) return '';
  if (!isArabicLanguage(language)) return value;
  return map[value] ?? value;
};

export const localizeDepartmentName = (department: string | undefined, language?: string) =>
  localizeFromMap(department, language, departmentNameMap);

export const localizeJobTitle = (jobTitle: string | undefined, language?: string) =>
  localizeFromMap(jobTitle, language, jobTitleMap);

const parseDisplayDate = (value: string) => {
  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const formatLocalizedDate = (date: string | undefined, language?: string) => {
  if (!date) return '';
  const parsed = parseDisplayDate(date);
  if (!parsed) return date;

  if (!isArabicLanguage(language)) {
    return parsed.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  const parts = new Intl.DateTimeFormat('ar-EG', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    numberingSystem: 'arab',
  }).formatToParts(parsed);
  const day = parts.find((part) => part.type === 'day')?.value ?? '';
  const month = parts.find((part) => part.type === 'month')?.value ?? '';
  const year = parts.find((part) => part.type === 'year')?.value ?? '';
  return `${day} ${month} ${year}`;
};
