import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Send, UserRoundCheck, Flag } from 'lucide-react';
export const requestStatus = (value: string | undefined) => {
  const status = value?.toLowerCase();
  return status === 'approved' ? 'approved' : status === 'rejected' || status === 'noshow' ? 'rejected' : status === 'cancelled' ? 'cancelled' : 'pending';
};
const statuses = ['approved', 'pending', 'rejected', 'cancelled'] as const;
const colors = ['var(--chart-3)', 'var(--color-amber-500, #f59e0b)', 'var(--destructive)', 'var(--muted-foreground)'];
export const RequestStatusChart: React.FC<{ items: { status?: string }[]; compact?: boolean }> = ({ items, compact }) => {
  const { t, i18n } = useTranslation(); const id = React.useId();
  const number = (value: number) => new Intl.NumberFormat(i18n.language).format(value);
  const counts = statuses.map(status => items.filter(item => requestStatus(item.status) === status).length);
  let offset = 0;
  return (
    <figure data-no-auto-translate className="min-w-0 rounded-2xl border border-border bg-card p-4" aria-labelledby={id}>
      <figcaption id={id} className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm font-semibold">
        {t('mobile.requestOverview')}<span className="text-xs font-normal text-muted-foreground">{t('mobile.totalRequests', { count: items.length, total: number(items.length) })}</span>
      </figcaption>
      <div className="flex flex-wrap items-center gap-4">
        <svg viewBox="0 0 112 112" className={compact ? 'h-24 w-24 shrink-0' : 'h-28 w-28 shrink-0'} aria-hidden="true">
          <circle cx="56" cy="56" r="43" fill="none" stroke="var(--muted)" strokeWidth="12" />
          {counts.map((count, index) => {
            const fraction = items.length ? count / items.length * 100 : 0; const start = offset; offset += fraction;
            return <circle key={index} cx="56" cy="56" r="43" fill="none" stroke={colors[index]} strokeWidth="12" pathLength="100" strokeDasharray={`${fraction} ${100 - fraction}`} strokeDashoffset={-start} transform="rotate(-90 56 56)" />;
          })}
          <text x="56" y="59" textAnchor="middle" fill="var(--foreground)" fontSize="23" fontWeight="700">{number(items.length)}</text>
          <text x="56" y="76" textAnchor="middle" fill="var(--muted-foreground)" fontSize="10">{t('mobile.requests')}</text>
        </svg>
        <dl className="grid min-w-0 flex-1 basis-36 grid-cols-2 gap-x-3 gap-y-3">
          {statuses.map((status, index) => <div key={status} className="min-w-0">
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="h-2 w-2 shrink-0 rounded-full" style={{ background: colors[index] }} />{t('status.' + status, status)}</dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums">{number(counts[index])}</dd>
          </div>)}
        </dl>
      </div>
      {items.length === 0 && <p className="mt-2 text-sm text-muted-foreground">{t('mobile.noRequests')}</p>}
    </figure>
  );
};
export const RequestProgress: React.FC<{ status?: string }> = ({ status }) => {
  const { t } = useTranslation(); const normalized = requestStatus(status);
  const finished = normalized !== 'pending'; const icons = [Send, UserRoundCheck, Flag];
  return <section className="space-y-3" aria-label={t('mobile.requestProgress')}>
    <h3 className="text-sm font-semibold">{t('mobile.requestProgress')}</h3>
    <ol className="grid grid-cols-3 gap-2" data-no-auto-translate>
      {['submitted', 'review', 'decision'].map((step, index) => {
        const complete = finished || index === 0; const current = !finished && index === 1;
        const Icon = complete ? Check : icons[index];
        return <li key={step} aria-current={current ? 'step' : undefined} className="relative flex min-w-0 flex-col items-center gap-2 text-center">
          {index < 2 && <span className="absolute start-[calc(50%+1rem)] top-4 h-px w-[calc(100%-1.5rem)] bg-border" aria-hidden="true" />}
          <span className={`relative flex h-8 w-8 items-center justify-center rounded-full border ${complete || current ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}><Icon className="h-4 w-4" aria-hidden="true" /></span>
          <span className="text-xs text-foreground">{t('mobile.' + step)}</span>
        </li>;
      })}
    </ol>
    <p className="text-sm text-muted-foreground">{t('mobile.currentStatus')}: <strong className="text-foreground">{t('status.' + normalized, normalized)}</strong></p>
  </section>;
};
