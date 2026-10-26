import { useCallback, useEffect, useState } from 'react';
import type { AppTab } from '@/app/App';
const tabs: AppTab[] = ['dashboard', 'requests', 'attendance', 'employees', 'leaves', 'missions', 'roles', 'payrolls', 'profile'];
function readRoute(): AppTab | null {
  const value = window.location.hash.replace(/^#\//, '');
  return tabs.includes(value as AppTab) ? value as AppTab : null;
}
export function useAppNavigation() {
  const [tab, setTab] = useState<AppTab>(() => readRoute() || 'dashboard');
  useEffect(() => {
    history.replaceState({ hrRoute: true }, '', '#/' + (readRoute() || tab));
    const back = () => { const next = readRoute(); if (next) setTab(next); };
    window.addEventListener('popstate', back); window.addEventListener('hashchange', back);
    return () => { window.removeEventListener('popstate', back); window.removeEventListener('hashchange', back); };
  }, []);
  const navigate = useCallback((next: AppTab) => {
    if (readRoute() !== next) {
      // A destination selected inside an overlay replaces that overlay's history entry.
      const method = history.state?.hrOverlay ? 'replaceState' : 'pushState';
      history[method]({ hrRoute: true }, '', '#/' + next);
      setTab(next);
    }
  }, []);
  return [tab, navigate] as const;
}
