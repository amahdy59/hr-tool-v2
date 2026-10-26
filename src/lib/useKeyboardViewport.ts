import { useEffect } from 'react';
/** Keep mobile dialogs within the visible area when an on-screen keyboard opens. */
export function useKeyboardViewport() {
  useEffect(() => {
    const viewport = window.visualViewport;
    const sync = () => {
      const focused = document.activeElement?.matches('input, textarea, [contenteditable="true"]');
      const keyboard = Boolean(focused && viewport && Math.abs(viewport.scale - 1) < 0.01 && window.innerHeight - viewport.height > 120);
      document.documentElement.classList.toggle('keyboard-open', keyboard);
      document.documentElement.style.setProperty('--visible-height', `${viewport?.height || window.innerHeight}px`);
      document.documentElement.style.setProperty('--visible-top', `${viewport?.offsetTop || 0}px`);
    };
    viewport?.addEventListener('resize', sync); viewport?.addEventListener('scroll', sync);
    document.addEventListener('focusin', sync); document.addEventListener('focusout', sync); sync();
    return () => { viewport?.removeEventListener('resize', sync); viewport?.removeEventListener('scroll', sync); document.removeEventListener('focusin', sync); document.removeEventListener('focusout', sync); document.documentElement.classList.remove('keyboard-open'); };
  }, []);
}
