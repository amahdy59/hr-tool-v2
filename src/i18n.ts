import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
const en = {
  translation: {
    sidebar: {
      dashboard: "Dashboard",
      attendance: "Attendance",
      employees: "Employees",
      leaves: "Leaves Management",
      missions: "Missions Management",
      roles: "Roles Management",
      profile: "Profile",
      logout: "Log out",
    },
    header: {
      search: "Search...",
      commandPalette: "Command Palette",
      shortcuts: "Keyboard Shortcuts",
      accessibility: "Accessibility Options",
      userProfile: "User Profile"
    },
    dashboard: {
      welcome: "Welcome",
      quickActions: "Quick Actions",
      requestLeave: "Request Leave",
      requestMission: "Request Mission",
      upcomingLeaves: "Upcoming Leaves",
      missionsPending: "Missions Pending Approval"
    },
    leave: {
      annualLeave: "Annual Leave",
      sickLeave: "Sick Leave",
      casualLeave: "Casual Leave"
    },
    status: {
      approved: "Approved",
      pending: "Pending",
      rejected: "Rejected"
    }
  }
};

// Arabic translations
const ar = {
  translation: {
    sidebar: {
      dashboard: "لوحة القيادة",
      attendance: "الحضور والانصراف",
      employees: "الموظفين",
      leaves: "إدارة الإجازات",
      missions: "إدارة المأموريات",
      roles: "إدارة الصلاحيات",
      profile: "الملف الشخصي",
      logout: "تسجيل الخروج",
    },
    header: {
      search: "بحث...",
      commandPalette: "لوحة الأوامر",
      shortcuts: "اختصارات لوحة المفاتيح",
      accessibility: "خيارات الوصول",
      userProfile: "الملف الشخصي"
    },
    dashboard: {
      welcome: "مرحباً",
      quickActions: "إجراءات سريعة",
      requestLeave: "طلب إجازة",
      requestMission: "طلب مأمورية",
      upcomingLeaves: "الإجازات القادمة",
      missionsPending: "مأموريات بانتظار الموافقة"
    },
    leave: {
      annualLeave: "إجازة سنوية",
      sickLeave: "إجازة مرضية",
      casualLeave: "إجازة عارضة"
    },
    status: {
      approved: "موافق عليه",
      pending: "قيد الانتظار",
      rejected: "مرفوض"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en,
      ar,
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
