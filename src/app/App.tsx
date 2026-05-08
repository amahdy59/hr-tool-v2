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
import { Payroll } from './components/Payroll';
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
  payrolls: () => <Payroll />,
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
        <main ref={mainRef} className="flex-1 overflow-y-auto bg-muted">
          {renderContent()}
        </main>
      </div>
      <ScrollToTop scrollContainerRef={mainRef} />
    </div>
  );
}
