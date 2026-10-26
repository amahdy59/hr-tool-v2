import React from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarDays, Briefcase, ArrowUpRight, RefreshCw } from 'lucide-react';
import { LeaveService, MissionService, type LeaveRequest } from '@/lib/services/dbServices';
import { RequestStatusChart, RequestProgress, requestStatus } from './RequestVisuals';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { StatusBadge } from './StatusBadge';
import { localizePersonName } from '@/lib/localizedNames';
type Item = LeaveRequest & { kind: 'leave' | 'mission' };
export const Requests: React.FC<{ active: boolean; onNew: () => void }> = ({ active, onNew }) => {
  const { t, i18n } = useTranslation(); const [items, setItems] = React.useState<Item[]>([]);
  const [query, setQuery] = React.useState(''); const [kind, setKind] = React.useState('all');
  const [selected, setSelected] = React.useState<Item | null>(null);
  const [error, setError] = React.useState(false); const [loading, setLoading] = React.useState(true);
  const load = React.useCallback(async () => {
    setError(false); setLoading(true);
    try { const [leaves, missions] = await Promise.all([LeaveService.getAll(), MissionService.getAll()]);
      setItems([...leaves.map(item => ({ ...item, kind: 'leave' as const })), ...missions.map(item => ({ ...item, kind: 'mission' as const }))]);
    } catch { setError(true); } finally { setLoading(false); }
  }, []);
  React.useEffect(() => {
    if (!active) return;
    void load();
    const refresh = () => { void load(); };
    window.addEventListener('hr-data-changed', refresh);
    return () => window.removeEventListener('hr-data-changed', refresh);
  }, [active, load]);
  const filtered = items.filter(item => (kind === 'all' || item.kind === kind) && `${localizePersonName(item.name, i18n.language)} ${item.type} ${item.range}`.toLowerCase().includes(query.toLowerCase().trim()));
  return <div className="mobile-page space-y-5 max-w-5xl mx-auto">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-xl font-semibold">{t('mobile.requests')}</h2><p className="mt-1 text-sm text-muted-foreground">{t('mobile.requestsDescription')}</p></div><Button className="hidden lg:inline-flex" onClick={onNew}>{t('mobile.newRequest')}</Button></div>
    {loading ? <p role="status">{t('common.loading')}</p> : error ? <div role="alert" className="rounded-xl border border-border bg-card p-4"><p>{t('mobile.loadError')}</p><Button variant="outline" className="mt-3 gap-2" onClick={() => void load()}><RefreshCw className="h-4 w-4" aria-hidden="true" />{t('mobile.retry')}</Button></div> : <RequestStatusChart items={items} />}
    <div className="space-y-3"><label className="block space-y-1"><span className="text-sm font-medium">{t('mobile.searchRequests')}</span><Input type="search" value={query} onChange={event => setQuery(event.target.value)} /></label>
      <div role="group" aria-label={t('mobile.requestType')} className="flex gap-2">{['all', 'leave', 'mission'].map(value => <button key={value} type="button" aria-pressed={kind === value} onClick={() => setKind(value)} className="min-h-11 rounded-xl border border-border px-4 text-sm aria-pressed:border-primary aria-pressed:bg-primary/10">{t('mobile.' + value)}</button>)}</div>
    </div>
    {!loading && !error && <p role="status" className="text-sm text-muted-foreground">{t('mobile.results', { count: filtered.length })}</p>}
    <ul className="space-y-3">{filtered.map(item => {
      const status = requestStatus(item.status); const Icon = item.kind === 'leave' ? CalendarDays : Briefcase;
      return <li key={item.kind + item.id}><button type="button" onClick={() => setSelected(item)} className="flex w-full items-start gap-3 rounded-2xl border border-border bg-card p-4 text-start hover:border-primary focus-visible:ring-2 focus-visible:ring-ring">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" aria-hidden="true" /></span>
        <span className="min-w-0 flex-1 space-y-1"><span className="flex flex-wrap items-center justify-between gap-2"><span className="font-semibold">{item.type}</span><StatusBadge variant={status === 'rejected' ? 'rejected' : status === 'approved' ? 'approved' : status === 'cancelled' ? 'cancelled' : 'pending'}>{t('status.' + status, status)}</StatusBadge></span>
          <span className="block text-sm text-muted-foreground">{localizePersonName(item.name, i18n.language)}</span><span className="block break-words text-sm">{item.range} · {item.duration}</span></span>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      </button></li>;
    })}</ul>
    {!loading && !error && !filtered.length && <div className="rounded-2xl border border-dashed border-border p-6 text-center"><p>{t('mobile.noMatchingRequests')}</p>{query && <Button variant="ghost" onClick={() => { setQuery(''); setKind('all'); }}>{t('mobile.clearFilters')}</Button>}</div>}
    <Dialog open={Boolean(selected)} onOpenChange={open => { if (!open) setSelected(null); }}>
      <DialogContent><DialogHeader><DialogTitle>{selected?.type}</DialogTitle><DialogDescription>{selected && localizePersonName(selected.name, i18n.language)}</DialogDescription></DialogHeader>
        {selected && <><dl className="space-y-3 text-sm"><div><dt className="text-muted-foreground">{t('mobile.dates')}</dt><dd>{selected.range} · {selected.duration}</dd></div>{selected.notes && <div><dt className="text-muted-foreground">{t('mobile.notes')}</dt><dd className="break-words">{selected.notes}</dd></div>}</dl><RequestProgress status={selected.status} /></>}
      </DialogContent>
    </Dialog>
  </div>;
};
