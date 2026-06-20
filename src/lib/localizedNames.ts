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
};

export const isArabicLanguage = (language?: string) => language?.startsWith('ar') ?? false;

export const localizePersonName = (name: string | undefined, language?: string) => {
  if (!name || !isArabicLanguage(language)) return name ?? '';
  return arabicNameMap[name] ?? name;
};

export const localizeFirstName = (name: string | undefined, language?: string) => {
  const localized = localizePersonName(name, language);
  return localized.split(/\s+/)[0] || localized;
};
