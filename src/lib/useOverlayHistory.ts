import { useEffect, useId, useRef } from 'react';
const overlays = new Map<string, () => void>();
let queued = false;
let traversing = false;
const internalEvents = new WeakSet<PopStateEvent>();
if (typeof window !== 'undefined') window.addEventListener('popstate', event => {
  if (traversing) {
    internalEvents.add(event);
    traversing = false;
    // A new overlay may have opened while the previous entry was being removed.
    window.setTimeout(reconcile, 0);
  }
});
function reconcile() {
  if (queued) return;
  queued = true;
  queueMicrotask(() => {
    queued = false;
    if (traversing) return;
    const top = Array.from(overlays.keys()).slice(-1)[0];
    const current = history.state?.hrOverlay;
    if (top && current !== top) {
      history[current ? 'replaceState' : 'pushState']({ ...history.state, hrOverlay: top }, '');
    } else if (!top && current) { traversing = true; history.back(); }
  });
}
export function useOverlayHistory(open: boolean | undefined, close: () => void) {
  const id = useId(); const closeRef = useRef(close); closeRef.current = close;
  useEffect(() => {
    if (!open) return;
    const callback = () => closeRef.current();
    overlays.set(id, callback); reconcile();
    const back = (event: PopStateEvent) => {
      if (internalEvents.has(event)) return;
      if (history.state?.hrOverlay !== id && Array.from(overlays.keys()).slice(-1)[0] === id) {
        overlays.delete(id); callback();
      }
    };
    window.addEventListener('popstate', back);
    return () => { overlays.delete(id); window.removeEventListener('popstate', back); reconcile(); };
  }, [open, id]);
}
