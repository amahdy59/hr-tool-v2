import React, { useMemo, useRef, useState } from 'react';
import { Toaster } from 'sonner';
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

const contentByTab: Record<AppTab, (currentUser: CurrentUser, onUpdateImage: (newImage: string) => void) => React.ReactNode> = {
  dashboard: () => <Dashboard />,
  attendance: () => <Attendance />,
  employees: () => <EmployeeManagement />,
  leaves: () => <LeavesManagement />,
  missions: () => <MissionsManagement />,
  roles: () => <RolesManagement />,
  profile: (currentUser, onUpdateImage) => <Profile currentUser={currentUser} onUpdateImage={onUpdateImage} />,
  payrolls: () => <PayrollUnderDevelopment />,
};

const formatNameFromEmail = (email: string) =>
  email
    .split('@')[0]
    .split(/[._-]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const mainRef = useRef<HTMLElement>(null);

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
      name: formatNameFromEmail(email),
      email,
      position: 'Cloud Engineer',
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

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <Toaster
          position="bottom-right"
          toastOptions={toasterOptions}
        />
        <Login onLogin={handleLogin} />
      </>
    );
  }

  if (!currentUser) {
    return null;
  }

  const activeContent = contentByTab[activeTab](currentUser, updateUserImage);

  const renderContent = () => {
    return <div className="animate-fadeIn">{activeContent}</div>;
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Toaster
        position="bottom-right"
        toastOptions={toasterOptions}
      />
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((collapsed) => !collapsed)}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header currentUser={currentUser} />
        <main ref={mainRef} className="flex-1 overflow-y-auto bg-muted cursor-default">
          {renderContent()}
        </main>
      </div>
      <ScrollToTop scrollContainerRef={mainRef} />
    </div>
  );
}

const PayrollUnderDevelopment: React.FC = () => (
  <div className="p-6 lg:p-8 max-w-7xl mx-auto">
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
