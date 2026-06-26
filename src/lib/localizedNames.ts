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
  'Jay Gupta': '\u062c\u0627\u064a \u062c\u0648\u0628\u062a\u0627',
  'Charles Brown': '\u062a\u0634\u0627\u0631\u0644\u0632 \u0628\u0631\u0627\u0648\u0646',
};

export const isArabicLanguage = (language?: string) => language?.startsWith('ar') ?? false;

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
    return isArabic ? (name.nameAr || arabicNameMap[englishName] || englishName) : englishName;
  }

  if (!isArabic) return name;
  return arabicNameMap[name] ?? name;
};

export const localizeFirstName = (name: string | BilingualPersonName | undefined, language?: string) => {
  const localized = localizePersonName(name, language);
  return localized.split(/\s+/)[0] || localized;
};
