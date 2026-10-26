import React, { useEffect, useMemo, useRef, useState, Suspense } from 'react';
import { Toaster, toast } from 'sonner';
import { format, parseISO, isValid } from 'date-fns';
import { LayoutDashboard, CalendarCheck, MoreHorizontal, Files, Plus, CalendarPlus, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';
import { clearFormDraft } from '@/lib/formDraft';
import { useAppNavigation } from '@/lib/useAppNavigation';
import { useKeyboardViewport } from '@/lib/useKeyboardViewport';
const Requests = React.lazy(() => import('./components/Requests').then(module => ({ default: module.Requests })));
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './components/ui/dialog';
import { Button } from './components/ui/button';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ScrollToTop } from './components/ScrollToTop';

const Attendance = React.lazy(() => import('./components/Attendance').then(m => ({ default: m.Attendance })));
const EmployeeManagement = React.lazy(() => import('./components/EmployeeManagement').then(m => ({ default: m.EmployeeManagement })));
const LeavesManagement = React.lazy(() => import('./components/LeavesManagement').then(m => ({ default: m.LeavesManagement })));
const MissionsManagement = React.lazy(() => import('./components/MissionsManagement').then(m => ({ default: m.MissionsManagement })));
const RolesManagement = React.lazy(() => import('./components/RolesManagement').then(m => ({ default: m.RolesManagement })));
const Profile = React.lazy(() => import('./components/Profile').then(m => ({ default: m.Profile })));
const Payroll = React.lazy(() => import('./components/Payroll').then(m => ({ default: m.Payroll })));
import { Login } from './components/Login';
import { CommandPalette } from './components/CommandPalette';
import { KeyboardShortcutsPanel } from './components/KeyboardShortcutsPanel';
import { RequestLeaveModal } from './components/RequestLeaveModal';
import { RequestMissionModal } from './components/RequestMissionModal';
import { ConfirmDialog } from './components/ConfirmDialog';
import { OfflineBanner } from './components/OfflineBanner';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';
import { ComponentStyleguideModal } from './components/ComponentStyleguideModal';
import { ReloadPrompt } from './components/ReloadPrompt';
import { useArabicDomTranslation } from '@/lib/useArabicDomTranslation';
import { useTheme } from '@/lib/useTheme';
import { DirectionProvider } from '@radix-ui/react-direction';
import { EmployeeService, LeaveService, MissionService } from '@/lib/services/dbServices';

export type AppTab =
  | 'requests'
  | 'dashboard'
  | 'attendance'
  | 'employees'
  | 'leaves'
  | 'missions'
  | 'roles'
  | 'profile'
  | 'payrolls';

export interface CurrentUser {
  name: string;
  email: string;
  position: string;
  image: string;
}

import { useTranslation } from 'react-i18next';

export default function App() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === 'ar' || i18n.language.startsWith('ar');
  const language: 'en' | 'ar' = isArabic ? 'ar' : 'en';
  useArabicDomTranslation(isArabic);
  const setLanguage = React.useCallback((nextLanguage: 'en' | 'ar') => {
    i18n.changeLanguage(nextLanguage);
  }, [i18n]);

  useEffect(() => {
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.documentElement.lang = isArabic ? 'ar' : 'en';
  }, [isArabic]);

  const [requestLeaveOpen, setRequestLeaveOpen] = useState(false);
  const [requestLeaveData, setRequestLeaveData] = useState<any>(null);
  const [requestMissionOpen, setRequestMissionOpen] = useState(false);
  const [requestMissionData, setRequestMissionData] = useState<any>(null);
  const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false);
  const [confirmMissionOpen, setConfirmMissionOpen] = useState(false);
  const [pendingLeaveData, setPendingLeaveData] = useState<any>(null);
  const [pendingMissionData, setPendingMissionData] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return typeof window !== 'undefined' && localStorage.getItem('hr_tool_auth') === 'true';
  });
  const [activeTab, navigate] = useAppNavigation();
  useKeyboardViewport();
  const [visitedTabs, setVisitedTabs] = useState<AppTab[]>([activeTab]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newRequestOpen, setNewRequestOpen] = useState(false);
  const scrollPositions = useRef<Partial<Record<AppTab, number>>>({});
  const previousTab = useRef(activeTab);
  const setActiveTab = React.useCallback((tab: AppTab) => {
    if (mainRef.current) scrollPositions.current[previousTab.current] = mainRef.current.scrollTop;
    navigate(tab);
  }, [navigate]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem('hr_tool_user');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return null;
  });
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [styleguideOpen, setStyleguideOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  // Accessibility states
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('accessibility-aaa-contrast') === 'true');
  const [largeTargets, setLargeTargets] = useState(() => localStorage.getItem('accessibility-aaa-targets') === 'true');
  const [largeText, setLargeText] = useState(() => localStorage.getItem('accessibility-large-text') === 'true');
  const [dyslexic, setDyslexic] = useState(() => localStorage.getItem('accessibility-dyslexic') === 'true');
  const [focusHeavy, setFocusHeavy] = useState(() => localStorage.getItem('accessibility-focus-heavy') === 'true');
  const [announcement, setAnnouncement] = useState('');

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const title = isAuthenticated
      ? `${t(`pages.${activeTab}`)} - ${t('common.appName')}`
      : `${t('login.signInHeading')} - ${t('common.appName')}`;
    document.title = title;
    if (isAuthenticated) {
      setAnnouncement(title);
    }
  }, [activeTab, isAuthenticated, t]);

  React.useLayoutEffect(() => {
    previousTab.current = activeTab;
    setVisitedTabs(tabs => tabs.includes(activeTab) ? tabs : [...tabs, activeTab]);
    mainRef.current?.scrollTo({ top: scrollPositions.current[activeTab] || 0, behavior: 'instant' });
    window.dispatchEvent(new CustomEvent('hr-screen-visible', { detail: activeTab }));
  }, [activeTab, isAuthenticated]);

  useEffect(() => {
    const el = document.documentElement;
    el.classList.toggle('hc', highContrast);
    localStorage.setItem('accessibility-aaa-contrast', String(highContrast));
  }, [highContrast]);

  useEffect(() => {
    const el = document.documentElement;
    el.classList.toggle('accessibility-aaa-targets', largeTargets);
    localStorage.setItem('accessibility-aaa-targets', String(largeTargets));
  }, [largeTargets]);

  useEffect(() => {
    let pendingPrefix: 'g' | 'n' | null = null;
    let prefixTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isAuthenticated || e.defaultPrevented) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        if (document.querySelector('[role="dialog"]:not([data-panel="search"])')) return;
        e.preventDefault();
        setCommandPaletteOpen((open) => !open);
        return;
      }
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.closest('[role="dialog"], [role="menu"], [role="combobox"]') ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      if (import.meta.env.DEV && e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setStyleguideOpen((open) => !open);
        return;
      }

      const key = e.key.toLowerCase();

      if (pendingPrefix) {
        if (pendingPrefix === 'g') {
          if (key === 'd') { e.preventDefault(); setActiveTab('dashboard'); }
          else if (key === 'a') { e.preventDefault(); setActiveTab('attendance'); }
          else if (key === 'e') { e.preventDefault(); setActiveTab('employees'); }
          else if (key === 'l') { e.preventDefault(); setActiveTab('leaves'); }
          else if (key === 'm') { e.preventDefault(); setActiveTab('missions'); }
          else if (key === 'r') { e.preventDefault(); setActiveTab('roles'); }
          else if (key === 'p') { e.preventDefault(); setActiveTab('profile'); }
        } else if (pendingPrefix === 'n') {
          if (key === 'l') { e.preventDefault(); setRequestLeaveOpen(true); }
          else if (key === 'm') { e.preventDefault(); setRequestMissionOpen(true); }
        }
        pendingPrefix = null;
        if (prefixTimeout) clearTimeout(prefixTimeout);
        return;
      }

      if (key === 'g' || key === 'n') {
        pendingPrefix = key;
        prefixTimeout = setTimeout(() => {
          pendingPrefix = null;
        }, 1200);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (prefixTimeout) clearTimeout(prefixTimeout);
    };
  }, [isAuthenticated]);

  useEffect(() => {
    const el = document.documentElement;
    el.classList.toggle('accessibility-large-text', largeText);
    localStorage.setItem('accessibility-large-text', String(largeText));
  }, [largeText]);

  useEffect(() => {
    const el = document.documentElement;
    el.classList.toggle('accessibility-dyslexic', dyslexic);
    localStorage.setItem('accessibility-dyslexic', String(dyslexic));
  }, [dyslexic]);

  useEffect(() => {
    const el = document.documentElement;
    el.classList.toggle('accessibility-focus-heavy', focusHeavy);
    localStorage.setItem('accessibility-focus-heavy', String(focusHeavy));
  }, [focusHeavy]);

  const accessibility = {
    highContrast, setHighContrast,
    largeTargets, setLargeTargets,
    largeText, setLargeText,
    dyslexic, setDyslexic,
    focusHeavy, setFocusHeavy,
    theme, setTheme,
    language,
    setLanguage,
  };

  const toasterOptions = useMemo(
    () => ({
      style: {
        fontFamily: "'Inter', sans-serif",
        fontSize: 'var(--text-sm)',
      },
    }),
    []
  );

  const handleLogin = (email: string) => {
    setIsAuthenticated(true);
    const user: CurrentUser = {
      name: 'Ahmed Mahdy',
      email: email || 'amahdy59@gmail.com',
      position: 'UX Designer & Data Analyst',
      image: '',
    };
    setCurrentUser(user);
    localStorage.setItem('hr_tool_auth', 'true');
    localStorage.setItem('hr_tool_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    clearFormDraft('leave'); clearFormDraft('mission');
    setVisitedTabs(['dashboard']); scrollPositions.current = {};
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('hr_tool_auth');
    localStorage.removeItem('hr_tool_user');
    setActiveTab('dashboard');
  };

  const updateUserImage = (newImage: string) => {
    setCurrentUser((user) => (user ? { ...user, image: newImage } : user));
  };

  const handleLeaveSubmit = (data: any) => {
    setPendingLeaveData(data);
    setRequestLeaveOpen(false);
    setConfirmLeaveOpen(true);
  };

  const handleMissionSubmit = (data: any) => {
    setPendingMissionData(data);
    setRequestMissionOpen(false);
    setConfirmMissionOpen(true);
  };

  const handleConfirmLeave = async () => {
    if (pendingLeaveData) {
      try {
        const allEmployees = await EmployeeService.getAll();
        const matchingEmployee = allEmployees.find(
          emp =>
            emp.email.toLowerCase() === currentUser?.email?.toLowerCase() ||
            (typeof emp.name === 'string' ? emp.name : emp.name.nameEn).toLowerCase() === currentUser?.name?.toLowerCase()
        ) || allEmployees[0];

        if (!matchingEmployee) {
          toast.error('Could not find logged-in employee record');
          return;
        }

        const type = pendingLeaveData.leaveType || 'Annual Leave';
        const fromStr = pendingLeaveData.fromDate ? format(parseISO(pendingLeaveData.fromDate), 'dd MMMM yyyy') : '—';
        const toStr = pendingLeaveData.toDate ? format(parseISO(pendingLeaveData.toDate), 'dd MMMM yyyy') : '—';
        const days = pendingLeaveData.daysRequested || 0;

        await LeaveService.create({
          name: typeof matchingEmployee.name === 'string' ? matchingEmployee.name : matchingEmployee.name.nameEn,
          img: matchingEmployee.img || '',
          type: type,
          range: `${pendingLeaveData.fromDate} - ${pendingLeaveData.toDate}`,
          duration: `${days} day${days !== 1 ? 's' : ''}`,
          notes: pendingLeaveData.notes || '',
          employeeNumber: matchingEmployee.employeeNumber,
          employeeId: matchingEmployee.id,
          status: 'pending'
        });

        clearFormDraft('leave');
        window.dispatchEvent(new Event('hr-data-changed'));
        if (type === 'Sick') {
          toast.success(
            `Your sick leave request (${days} day${days !== 1 ? 's' : ''}) has been submitted. Take care! 🤗`,
            { duration: 5000 }
          );
        } else {
          toast.success(
            `Got it! Your ${type.toLowerCase()} from ${fromStr} to ${toStr} (${days} day${days !== 1 ? 's' : ''}) has been submitted. Enjoy your time off 🎉`,
            { duration: 5000 }
          );
        }
      } catch (e) {
        console.error(e);
        toast.error('Failed to submit leave request');
      }
    }
    setPendingLeaveData(null);
  };

  const handleConfirmMission = async () => {
    if (pendingMissionData) {
      try {
        const allEmployees = await EmployeeService.getAll();
        const matchingEmployee = allEmployees.find(
          emp =>
            emp.email.toLowerCase() === currentUser?.email?.toLowerCase() ||
            (typeof emp.name === 'string' ? emp.name : emp.name.nameEn).toLowerCase() === currentUser?.name?.toLowerCase()
        ) || allEmployees[0];

        if (!matchingEmployee) {
          toast.error('Could not find logged-in employee record');
          return;
        }

        const mType = pendingMissionData.missionType || t('mission.workFromHome');
        const fromStr = pendingMissionData.fromDate ? format(parseISO(pendingMissionData.fromDate), 'dd MMMM yyyy') : '—';
        const toStr = pendingMissionData.toDate ? format(parseISO(pendingMissionData.toDate), 'dd MMMM yyyy') : '—';
        const days = pendingMissionData.daysRequested || 0;

        await MissionService.create({
          name: typeof matchingEmployee.name === 'string' ? matchingEmployee.name : matchingEmployee.name.nameEn,
          img: matchingEmployee.img || '',
          type: mType,
          range: `${pendingMissionData.fromDate} - ${pendingMissionData.toDate}`,
          duration: `${days} day${days !== 1 ? 's' : ''}`,
          notes: pendingMissionData.notes || '',
          employeeNumber: matchingEmployee.employeeNumber,
          employeeId: matchingEmployee.id,
          status: 'pending'
        });

        clearFormDraft('mission');
        window.dispatchEvent(new Event('hr-data-changed'));
        toast.success(
          `${mType} from ${fromStr} to ${toStr} (${days} day${days !== 1 ? 's' : ''}) submitted successfully.`,
          { duration: 5000 }
        );
      } catch (e) {
        console.error(e);
        toast.error('Failed to submit mission request');
      }
    }
    setPendingMissionData(null);
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <DirectionProvider dir={isArabic ? 'rtl' : 'ltr'}>
        <OfflineBanner />
        <Toaster
          position="bottom-right"
          toastOptions={toasterOptions}
          closeButton
        />
        <ReloadPrompt />
        <Login onLogin={handleLogin} accessibility={accessibility} />
      </DirectionProvider>
    );
  }

  if (!currentUser) {
    return null;
  }

  const renderContent = (tab: AppTab) => {
    let content: React.ReactNode = null;
    switch (tab) {
      case 'dashboard':
        content = (
          <Dashboard
            onRequestLeave={(data) => {
              setRequestLeaveData(data || null);
              setRequestLeaveOpen(true);
            }}
            onRequestMission={(data) => {
              setRequestMissionData(data || null);
              setRequestMissionOpen(true);
            }}
            currentUser={currentUser}
          />
        );
        break;
      case 'requests':
        content = <Requests active={activeTab === 'requests'} onNew={() => setNewRequestOpen(true)} />;
        break;
      case 'attendance':
        content = <Attendance />;
        break;
      case 'employees':
        content = <EmployeeManagement />;
        break;
      case 'leaves':
        content = <LeavesManagement />;
        break;
      case 'missions':
        content = <MissionsManagement />;
        break;
      case 'roles':
        content = <RolesManagement />;
        break;
      case 'profile':
        content = <Profile currentUser={currentUser} onUpdateImage={updateUserImage} />;
        break;
      case 'payrolls':
        content = <Payroll />;
        break;
      default:
        content = null;
    }
    return (
      <div className="animate-fadeIn">
        <Suspense fallback={
          <div role="status" className="flex items-center justify-center min-h-[400px] text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="flex flex-col items-center gap-3">
              <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></span>
              <span>{t('common.loading')}</span>
            </div>
          </div>
        }>
          {content}
        </Suspense>
      </div>
    );
  };

  return (
    <DirectionProvider dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="flex h-dvh bg-background text-foreground overflow-hidden">
      <a
        href="#main-content"
        className="skip-link fixed start-4 top-4 z-[100] flex min-h-11 min-w-11 -translate-y-20 items-center justify-center rounded-md bg-primary px-4 py-2.5 text-primary-foreground opacity-0 shadow-lg transition-transform focus:translate-y-0 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {t('common.skipToMain')}
      </a>
      {/* Accessibility Announcement Region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
      <Toaster
        position="bottom-right"
        toastOptions={toasterOptions}
        closeButton
      />
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((collapsed) => !collapsed)}
        onLogout={handleLogout}
        currentUser={currentUser}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Header
          currentUser={currentUser}
          accessibility={accessibility}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onOpenShortcuts={() => setShortcutsOpen(true)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
          mobileMenuOpen={mobileMenuOpen}
          onMobileMenuChange={setMobileMenuOpen}
        />
        <div data-slot="app-notices" className="shrink-0 max-h-[40dvh] overflow-y-auto">
          <OfflineBanner />
          <ReloadPrompt />
          <PwaInstallPrompt />
        </div>
        <main onScroll={() => { if (mainRef.current) scrollPositions.current[activeTab] = mainRef.current.scrollTop; }} ref={mainRef} id="main-content" tabIndex={-1} aria-label={t('common.mainContent', 'Main content')} className="app-main-scroll min-h-0 flex-1 overflow-y-auto bg-muted cursor-default mb-[calc(4.25rem+env(safe-area-inset-bottom))] pb-24 lg:mb-0 lg:pb-6 outline-none">
          <h1 className="sr-only">{t(`pages.${activeTab}`)}</h1>
          {Array.from(new Set([...visitedTabs, activeTab])).map(tab => (
            <section key={tab} data-screen={tab} hidden={tab !== activeTab} aria-label={t(`pages.${tab}`)}>
              {renderContent(tab)}
            </section>
          ))}
        </main>
      </div>
      <ScrollToTop scrollContainerRef={mainRef} />
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        onSelectTab={setActiveTab}
      />
      <KeyboardShortcutsPanel
        open={shortcutsOpen}
        onOpenChange={setShortcutsOpen}
      />
      {import.meta.env.DEV && <ComponentStyleguideModal
        open={styleguideOpen}
        onOpenChange={setStyleguideOpen}
      />}

      {/* Global Modals */}
      <RequestLeaveModal
        open={requestLeaveOpen}
        onOpenChange={setRequestLeaveOpen}
        onSubmit={handleLeaveSubmit}
        initialData={requestLeaveData}
      />
      <RequestMissionModal
        open={requestMissionOpen}
        onOpenChange={setRequestMissionOpen}
        onSubmit={handleMissionSubmit}
        initialData={requestMissionData}
      />
      <ConfirmDialog
        open={confirmLeaveOpen}
        onOpenChange={setConfirmLeaveOpen}
        title={t('leave.confirmTitle')}
        message={
          <>
            You're requesting{' '}
            <strong style={{ fontWeight: 'var(--font-weight-semibold)' }}>
              {pendingLeaveData?.leaveType?.toLowerCase() || 'annual'} leave
            </strong>{' '}
            {pendingLeaveData?.fromDate && pendingLeaveData?.toDate ? (
              <>
                from{' '}
                <strong style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                  {isValid(parseISO(pendingLeaveData.fromDate)) ? format(parseISO(pendingLeaveData.fromDate), 'dd MMMM yyyy') : '—'}
                </strong>{' '}
                to{' '}
                <strong style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                  {isValid(parseISO(pendingLeaveData.toDate)) ? format(parseISO(pendingLeaveData.toDate), 'dd MMMM yyyy') : '—'}
                </strong>
                {' '}({pendingLeaveData.daysRequested || 0} day{(pendingLeaveData.daysRequested || 0) !== 1 ? 's' : ''}).
              </>
            ) : null}{' '}
            Ready to submit?
          </>
        }
        confirmLabel={t('common.submit')}
        cancelLabel={t('common.cancel')}
        confirmVariant="default"
        onConfirm={handleConfirmLeave}
      />
      <ConfirmDialog
        open={confirmMissionOpen}
        onOpenChange={setConfirmMissionOpen}
        title={t('mission.confirmTitle')}
        message={
          <>
            You're requesting a{' '}
            <strong style={{ fontWeight: 'var(--font-weight-semibold)' }}>
              {pendingMissionData?.missionType || t('mission.workFromHome')}
            </strong>{' '}
            {pendingMissionData?.fromDate && pendingMissionData?.toDate ? (
              <>
                from{' '}
                <strong style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                  {isValid(parseISO(pendingMissionData.fromDate)) ? format(parseISO(pendingMissionData.fromDate), 'dd MMMM yyyy') : '—'}
                </strong>{' '}
                to{' '}
                <strong style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                  {isValid(parseISO(pendingMissionData.toDate)) ? format(parseISO(pendingMissionData.toDate), 'dd MMMM yyyy') : '—'}
                </strong>
                {' '}({pendingMissionData.daysRequested || 0} day{(pendingMissionData.daysRequested || 0) !== 1 ? 's' : ''}).
              </>
            ) : null}{' '}
            Ready to submit?
          </>
        }
        confirmLabel={t('common.submit')}
        cancelLabel={t('common.cancel')}
        confirmVariant="default"
        onConfirm={handleConfirmMission}
      />

      {/* Global Bottom Toolbar */}
      <BottomToolbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onMore={() => setMobileMenuOpen(true)}
        onNew={() => setNewRequestOpen(true)}
      />
      <Dialog open={newRequestOpen} onOpenChange={setNewRequestOpen}>
        <DialogContent data-layout="compact" data-panel="new-request">
          <DialogHeader><DialogTitle>{t('mobile.newRequest')}</DialogTitle><DialogDescription>{t('mobile.chooseRequest')}</DialogDescription></DialogHeader>
          <div className="grid gap-3">
            <Button className="justify-start gap-3 min-h-14" onClick={() => { setNewRequestOpen(false); setRequestLeaveData(null); setRequestLeaveOpen(true); }}><CalendarPlus className="h-5 w-5" aria-hidden="true" />{t('dashboard.requestLeave')}</Button>
            <Button variant="outline" className="justify-start gap-3 min-h-14" onClick={() => { setNewRequestOpen(false); setRequestMissionData(null); setRequestMissionOpen(true); }}><Rocket className="h-5 w-5" aria-hidden="true" />{t('dashboard.requestMission')}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </DirectionProvider>
  );
}

// Mobile destinations stay consistent across all screens.
const BottomToolbar: React.FC<{
  activeTab: AppTab; setActiveTab: (tab: AppTab) => void;
  onMore: () => void; onNew: () => void;
}> = ({ activeTab, setActiveTab, onMore, onNew }) => {
  const { t } = useTranslation();
  return <div className="mobile-navigation lg:hidden">
    <button type="button" data-slot="new-request" onClick={onNew} className="mobile-create fixed end-4 z-30 flex min-h-12 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-lg"><Plus className="h-5 w-5" aria-hidden="true" />{t('mobile.newRequest')}</button>
    <nav aria-label={t('navigation.bottomNavigation')} className="mobile-bottom-bar fixed bottom-0 start-0 end-0 z-30 grid grid-cols-4 border-t border-border bg-card px-2 pb-[env(safe-area-inset-bottom)]">
      {([{ tab: 'dashboard', icon: LayoutDashboard, label: 'home' }, { tab: 'requests', icon: Files, label: 'requests' }, { tab: 'attendance', icon: CalendarCheck, label: 'attendance' }] as const).map(({ tab, icon: Icon, label }) => <button key={tab} data-nav={tab} type="button" onClick={() => setActiveTab(tab)} aria-current={activeTab === tab ? 'page' : undefined} className="flex min-h-16 min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-xs font-medium text-muted-foreground aria-[current=page]:text-blue-800 dark:aria-[current=page]:text-primary aria-[current=page]:bg-primary/10"><Icon className="h-5 w-5" aria-hidden="true" /><span className="text-center">{t('mobile.' + label)}</span></button>)}
      <button type="button" aria-current={!['dashboard', 'requests', 'attendance'].includes(activeTab) ? 'page' : undefined} onClick={onMore} className="flex min-h-16 min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-xs font-medium text-muted-foreground aria-[current=page]:text-blue-800 dark:aria-[current=page]:text-primary aria-[current=page]:bg-primary/10" aria-haspopup="dialog"><MoreHorizontal className="h-5 w-5" aria-hidden="true" /><span>{t('mobile.more')}</span></button>
    </nav>
  </div>;
};
