import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const en = {
  translation: {
    common: {
      appName: 'HR Tool',
      submit: 'Submit',
      cancel: 'Cancel',
      collapse: 'Collapse',
      underDevelopment: 'Under development',
    },
    sidebar: {
      dashboard: 'Dashboard',
      attendance: 'Attendance',
      employees: 'Employees',
      leaves: 'Leaves Management',
      missions: 'Missions Management',
      roles: 'Roles Management',
      profile: 'Profile',
      myProfile: 'My Profile',
      logout: 'Log out',
      collapse: 'Collapse',
    },
    header: {
      search: 'Search...',
      searchCommand: 'Search or command palette. Shortcut Control K.',
      commandPalette: 'Command Palette',
      shortcuts: 'Keyboard Shortcuts',
      shortcutsTitle: 'Keyboard Shortcuts (?)',
      accessibility: 'Accessibility Options',
      userProfile: 'User Profile',
      toggleLanguage: 'Toggle language',
      goDashboard: 'Go to Dashboard',
      openMenu: 'Open navigation menu',
      closeMenu: 'Close navigation menu',
      menu: 'Menu',
      navigationMenu: 'Navigation menu',
      goProfile: 'Go to my profile',
    },
    dashboard: {
      welcome: 'Welcome',
      quickActions: 'Quick Actions',
      requestLeave: 'Request Leave',
      requestMission: 'Request Mission',
      upcomingLeaves: 'Upcoming Leaves',
      missionsPending: 'Missions Pending Approval',
      home: 'Home',
    },
    leave: {
      annualLeave: 'Annual Leave',
      sickLeave: 'Sick Leave',
      casualLeave: 'Casual Leave',
      confirmTitle: 'Confirm Leave',
    },
    mission: {
      confirmTitle: 'Confirm Mission',
      workFromHome: 'Work From Home',
    },
    status: {
      approved: 'Approved',
      pending: 'Pending',
      rejected: 'Rejected',
    },
    pages: {
      dashboard: 'Dashboard',
      attendance: 'Attendance',
      employees: 'Employees',
      leaves: 'Leave Management',
      missions: 'Missions',
      roles: 'Roles & Permissions',
      profile: 'My Profile',
      payrolls: 'Payrolls',
    },
    payrolls: {
      title: 'Payrolls are coming soon',
      description: 'This section is intentionally paused while payroll workflows, permissions, and audit controls are finalized.',
    },
  },
};

const ar = {
  translation: {
    common: {
      appName: 'HR Tool',
      submit: 'إرسال',
      cancel: 'إلغاء',
      collapse: 'طي القائمة',
      underDevelopment: 'قيد التطوير',
    },
    sidebar: {
      dashboard: 'لوحة التحكم',
      attendance: 'الحضور والانصراف',
      employees: 'الموظفون',
      leaves: 'إدارة الأجازات',
      missions: 'إدارة المأموريات',
      roles: 'إدارة الصلاحيات',
      profile: 'الملف الشخصي',
      myProfile: 'ملفي الشخصي',
      logout: 'تسجيل الخروج',
      collapse: 'طي القائمة',
    },
    header: {
      search: 'بحث...',
      searchCommand: 'البحث أو لوحة الأوامر. الاختصار Control K.',
      commandPalette: 'لوحة الأوامر',
      shortcuts: 'اختصارات لوحة المفاتيح',
      shortcutsTitle: 'اختصارات لوحة المفاتيح (?)',
      accessibility: 'خيارات إمكانية الوصول',
      userProfile: 'الملف الشخصي',
      toggleLanguage: 'تغيير اللغة',
      goDashboard: 'الانتقال إلى لوحة التحكم',
      openMenu: 'فتح قائمة التنقل',
      closeMenu: 'إغلاق قائمة التنقل',
      menu: 'القائمة',
      navigationMenu: 'قائمة التنقل',
      goProfile: 'الانتقال إلى ملفي الشخصي',
    },
    dashboard: {
      welcome: 'مرحباً',
      quickActions: 'إجراءات سريعة',
      requestLeave: 'طلب أجازة',
      requestMission: 'حجز المأمورية',
      upcomingLeaves: 'الأجازات القادمة',
      missionsPending: 'مأموريات بانتظار الموافقة',
      home: 'الرئيسية',
    },
    leave: {
      annualLeave: 'أجازة سنوية',
      sickLeave: 'أجازة مرضية',
      casualLeave: 'أجازة عارضة',
      confirmTitle: 'تأكيد طلب الأجازة',
    },
    mission: {
      confirmTitle: 'تأكيد المأمورية',
      workFromHome: 'العمل من المنزل',
    },
    status: {
      approved: 'تمت الموافقة',
      pending: 'قيد الانتظار',
      rejected: 'مرفوض',
    },
    pages: {
      dashboard: 'لوحة التحكم',
      attendance: 'الحضور والانصراف',
      employees: 'الموظفون',
      leaves: 'إدارة الأجازات',
      missions: 'المأموريات',
      roles: 'الأدوار والصلاحيات',
      profile: 'ملفي الشخصي',
      payrolls: 'الرواتب',
    },
    payrolls: {
      title: 'قسم الرواتب قريباً',
      description: 'هذا القسم متوقف مؤقتاً حتى يتم الانتهاء من مسارات الرواتب والصلاحيات وضوابط المراجعة.',
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en, ar },
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar'],
    load: 'languageOnly',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
