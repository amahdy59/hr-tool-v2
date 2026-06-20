import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Toaster, toast } from 'sonner';
import { format, parseISO, isValid } from 'date-fns';
import { LayoutDashboard, CalendarPlus, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Attendance } from './components/Attendance';
import { EmployeeManagement } from './components/EmployeeManagement';
import { LeavesManagement } from './components/LeavesManagement';
import { MissionsManagement } from './components/MissionsManagement';
import { RolesManagement } from './components/RolesManagement';
import { Profile } from './components/Profile';
import { Login } from './components/Login';
import { ScrollToTop } from './components/ScrollToTop';
import { CommandPalette } from './components/CommandPalette';
import { KeyboardShortcutsPanel } from './components/KeyboardShortcutsPanel';
import { RequestLeaveModal } from './components/RequestLeaveModal';
import { RequestMissionModal } from './components/RequestMissionModal';
import { ConfirmDialog } from './components/ConfirmDialog';

export type AppTab =
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
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const [requestLeaveOpen, setRequestLeaveOpen] = useState(false);
  const [requestMissionOpen, setRequestMissionOpen] = useState(false);
  const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false);
  const [confirmMissionOpen, setConfirmMissionOpen] = useState(false);
  const [pendingLeaveData, setPendingLeaveData] = useState<any>(null);
  const [pendingMissionData, setPendingMissionData] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  // Accessibility states
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('accessibility-aaa-contrast') === 'true');
  const [largeTargets, setLargeTargets] = useState(() => localStorage.getItem('accessibility-aaa-targets') === 'true');
  const [largeText, setLargeText] = useState(() => localStorage.getItem('accessibility-large-text') === 'true');
  const [dyslexic, setDyslexic] = useState(() => localStorage.getItem('accessibility-dyslexic') === 'true');
  const [focusHeavy, setFocusHeavy] = useState(() => localStorage.getItem('accessibility-focus-heavy') === 'true');
  const [announcement, setAnnouncement] = useState('');

  const pageTitles: Record<AppTab, string> = {
    dashboard: 'Dashboard — HR Tool',
    attendance: 'Attendance — HR Tool',
    employees: 'Employees — HR Tool',
    leaves: 'Leave Management — HR Tool',
    missions: 'Missions — HR Tool',
    roles: 'Roles & Permissions — HR Tool',
    profile: 'My Profile — HR Tool',
    payrolls: 'Payrolls — HR Tool',
  };

  useEffect(() => {
    const title = pageTitles[activeTab];
    document.title = title;
    setAnnouncement(`Navigated to ${title}`);
  }, [activeTab]);

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
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(open => !open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    focusHeavy, setFocusHeavy
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

    setCurrentUser({
      name: 'Ahmed Mahdy',
      email: 'amahdy59@gmail.com',
      position: 'UX Designer & Data Analyst',
      image: '',
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
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

  const handleConfirmLeave = () => {
    if (pendingLeaveData) {
      const type = pendingLeaveData.leaveType || 'annual';
      const fromStr = pendingLeaveData.fromDate ? format(parseISO(pendingLeaveData.fromDate), 'dd MMMM yyyy') : '—';
      const toStr = pendingLeaveData.toDate ? format(parseISO(pendingLeaveData.toDate), 'dd MMMM yyyy') : '—';
      const days = pendingLeaveData.daysRequested || 0;
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
    }
    setPendingLeaveData(null);
  };

  const handleConfirmMission = () => {
    if (pendingMissionData) {
      const mType = pendingMissionData.missionType || 'Work From Home';
      const fromStr = pendingMissionData.fromDate ? format(parseISO(pendingMissionData.fromDate), 'dd MMMM yyyy') : '—';
      const toStr = pendingMissionData.toDate ? format(parseISO(pendingMissionData.toDate), 'dd MMMM yyyy') : '—';
      const days = pendingMissionData.daysRequested || 0;
      toast.success(
        `${mType} from ${fromStr} to ${toStr} (${days} day${days !== 1 ? 's' : ''}) submitted successfully.`,
        { duration: 5000 }
      );
    }
    setPendingMissionData(null);
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <Toaster
          position="bottom-right"
          toastOptions={toasterOptions}
          closeButton
        />
        <Login onLogin={handleLogin} accessibility={accessibility} />
      </>
    );
  }

  if (!currentUser) {
    return null;
  }

  const renderContent = () => {
    let content: React.ReactNode = null;
    switch (activeTab) {
      case 'dashboard':
        content = (
          <Dashboard
            onRequestLeave={() => setRequestLeaveOpen(true)}
            onRequestMission={() => setRequestMissionOpen(true)}
            currentUser={currentUser}
          />
        );
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
        content = <PayrollUnderDevelopment />;
        break;
      default:
        content = null;
    }
    return <div className="animate-fadeIn">{content}</div>;
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:px-4 focus:py-2.5 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        Skip to main content
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
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          currentUser={currentUser} 
          accessibility={accessibility} 
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onOpenShortcuts={() => setShortcutsOpen(true)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
        />
        <main ref={mainRef} id="main-content" className="flex-1 overflow-y-auto bg-muted cursor-default pb-24 lg:pb-6">
          {renderContent()}
        </main>
      </div>
      <ScrollToTop scrollContainerRef={mainRef} />
      <CommandPalette 
        open={commandPaletteOpen} 
        onOpenChange={setCommandPaletteOpen} 
        onSelectTab={setActiveTab}
        onLogout={handleLogout}
      />
      <KeyboardShortcutsPanel 
        open={shortcutsOpen} 
        onOpenChange={setShortcutsOpen} 
      />

      {/* Global Modals */}
      <RequestLeaveModal
        open={requestLeaveOpen}
        onOpenChange={setRequestLeaveOpen}
        onSubmit={handleLeaveSubmit}
      />
      <RequestMissionModal
        open={requestMissionOpen}
        onOpenChange={setRequestMissionOpen}
        onSubmit={handleMissionSubmit}
      />
      <ConfirmDialog
        open={confirmLeaveOpen}
        onOpenChange={setConfirmLeaveOpen}
        title="Confirm Leave"
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
        confirmLabel="Submit"
        cancelLabel="Cancel"
        confirmVariant="default"
        confirmClassName="bg-chart-3 hover:bg-chart-3/90 text-white"
        onConfirm={handleConfirmLeave}
      />
      <ConfirmDialog
        open={confirmMissionOpen}
        onOpenChange={setConfirmMissionOpen}
        title="Confirm Mission"
        message={
          <>
            You're requesting a{' '}
            <strong style={{ fontWeight: 'var(--font-weight-semibold)' }}>
              {pendingMissionData?.missionType || 'Work From Home'}
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
        confirmLabel="Submit"
        cancelLabel="Cancel"
        confirmVariant="default"
        confirmClassName="bg-chart-3 hover:bg-chart-3/90 text-white"
        onConfirm={handleConfirmMission}
      />

      {/* Global Bottom Toolbar */}
      <BottomToolbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRequestLeave={() => setRequestLeaveOpen(true)}
        onRequestMission={() => setRequestMissionOpen(true)}
      />
    </div>
  );
}

// ── Bottom Toolbar Component ──
const BottomToolbar: React.FC<{
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onRequestLeave: () => void;
  onRequestMission: () => void;
}> = ({ activeTab, setActiveTab, onRequestLeave, onRequestMission }) => {
  return (
    <div className="lg:hidden fixed bottom-0 start-0 end-0 z-30 h-16 border-t border-border bg-card flex items-center justify-around px-4 pb-[env(safe-area-inset-bottom)]">
      <button
        onClick={() => setActiveTab('dashboard')}
        className={cn(
          "flex flex-col items-center justify-center gap-1 text-[10px] font-medium h-12 min-w-11 px-2 rounded-[var(--radius)] transition-colors cursor-pointer",
          activeTab === 'dashboard' ? 'text-primary' : 'text-muted-foreground'
        )}
      >
        <LayoutDashboard className="w-5 h-5" />
        <span>Home</span>
      </button>
      
      <button
        onClick={onRequestLeave}
        className="flex flex-col items-center justify-center gap-1 text-[10px] font-medium h-12 min-w-11 px-2 rounded-[var(--radius)] text-muted-foreground transition-colors cursor-pointer hover:text-primary"
      >
        <CalendarPlus className="w-5 h-5 text-chart-2" />
        <span>Request Leave</span>
      </button>

      <button
        onClick={onRequestMission}
        className="flex flex-col items-center justify-center gap-1 text-[10px] font-medium h-12 min-w-11 px-2 rounded-[var(--radius)] text-muted-foreground transition-colors cursor-pointer hover:text-primary"
      >
        <Rocket className="w-5 h-5 text-chart-3" />
        <span>Request Mission</span>
      </button>
    </div>
  );
}

const PayrollUnderDevelopment: React.FC = () => (
  <div className="px-1 py-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <section className="w-full max-w-2xl rounded-[var(--radius-card)] border border-border bg-card p-8 text-center shadow-[var(--elevation-sm)]">
        <p className="text-[var(--text-xs)] font-[var(--font-weight-semibold)] uppercase tracking-[0.08em] text-accent">
          Under development
        </p>
        <h2
          className="mt-3 text-foreground"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'var(--page-title-size)',
            fontWeight: 'var(--page-title-weight)',
          }}
        >
          Payrolls are coming soon
        </h2>
        <p className="mt-2 text-[var(--text-sm)] text-muted-foreground">
          This section is intentionally paused while payroll workflows, permissions, and audit controls are finalized.
        </p>
      </section>
    </div>
  </div>
);
