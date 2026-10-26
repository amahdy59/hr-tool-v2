import React, { useState } from 'react';
import { Bell, CheckCheck, Calendar, FileText, Briefcase, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from './ui/popover';
import { cn } from '@/lib/utils';
import { readNotificationPreferences, writeNotificationPreferences, notificationStorageKey } from '@/lib/notificationPreferences';

export interface NotificationItem {
  id: string;
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  timestamp: string;
  timestampAr: string;
  type: 'leave' | 'attendance' | 'mission' | 'system';
  unread: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'New Leave Request',
    titleAr: 'طلب إجازة جديد',
    message: 'Sarah Jenkins submitted an Annual Leave request (3 days).',
    messageAr: 'قدمت سارة جنكينز طلب إجازة سنوية (3 أيام).',
    timestamp: '10m ago',
    timestampAr: 'منذ 10 د',
    type: 'leave',
    unread: true,
  },
  {
    id: 'n-2',
    title: 'Attendance Alert',
    titleAr: 'تنبيه الحضور والانصراف',
    message: '3 team members have unconfirmed check-ins for yesterday.',
    messageAr: 'هناك 3 موظفين لديهم تسجيلات حضور غير مؤكدة بالأمس.',
    timestamp: '45m ago',
    timestampAr: 'منذ 45 د',
    type: 'attendance',
    unread: true,
  },
  {
    id: 'n-3',
    title: 'Mission Approved',
    titleAr: 'تمت الموافقة على المأمورية',
    message: 'Client visit to Cairo branch approved by Operations Director.',
    messageAr: 'تمت الموافقة على زيارة العميل لفرع القاهرة من مدير العمليات.',
    timestamp: '2h ago',
    timestampAr: 'منذ ساعتين',
    type: 'mission',
    unread: false,
  },
];

export const NotificationCenter: React.FC<{ triggerClassName?: string; accountId?: string }> = ({ accountId = 'demo', ...props }) => (
  <NotificationCenterContent key={accountId.trim().toLowerCase()} accountId={accountId} {...props} />
);

const NotificationCenterContent: React.FC<{ triggerClassName?: string; accountId: string }> = ({ triggerClassName, accountId }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === 'ar' || i18n.language.startsWith('ar');
  const [preferences, setPreferences] = useState(() => readNotificationPreferences(accountId));
  const [persisted, setPersisted] = useState(true);
  const notifications = INITIAL_NOTIFICATIONS.filter(item => !preferences[item.id]?.dismissed).map(item => ({
    ...item, unread: preferences[item.id]?.read === undefined ? item.unread : !preferences[item.id].read,
  }));
  React.useEffect(() => { setPersisted(writeNotificationPreferences(accountId, preferences)); }, [accountId, preferences]);
  React.useEffect(() => {
    const update = (event: StorageEvent) => {
      if (event.key === notificationStorageKey(accountId) || event.key === null) setPreferences(readNotificationPreferences(accountId));
    };
    window.addEventListener('storage', update);
    return () => window.removeEventListener('storage', update);
  }, [accountId]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [isOpen, setIsOpen] = useState(false);
  const filtersRef = React.useRef<HTMLDivElement>(null);
  const focusFilters = () => filtersRef.current?.querySelector<HTMLButtonElement>('[aria-pressed="true"]')?.focus();

  const titleId = React.useId();
  const unreadCount = notifications.filter((n) => n.unread).length;
  const filteredList = notifications.filter((n) => (filter === 'unread' ? n.unread : true));

  const markAllAsRead = () => {
    focusFilters();
    setPreferences(previous => {
      const next = { ...previous };
      INITIAL_NOTIFICATIONS.forEach(item => { next[item.id] = { ...next[item.id], read: true }; });
      return next;
    });
  };

  const toggleRead = (id: string) => {
    if (filter === 'unread') focusFilters();
    const item = notifications.find(notification => notification.id === id);
    if (item) setPreferences(previous => ({ ...previous, [id]: { ...previous[id], read: item.unread } }));
  };

  const deleteNotification = (id: string) => {
    focusFilters();
    setPreferences(previous => ({ ...previous, [id]: { ...previous[id], dismissed: true } }));
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'leave':
        return <FileText className="w-4 h-4 text-amber-500" aria-hidden="true" />;
      case 'attendance':
        return <Calendar className="w-4 h-4 text-sky-500" aria-hidden="true" />;
      case 'mission':
        return <Briefcase className="w-4 h-4 text-emerald-500" aria-hidden="true" />;
      default:
        return <Bell className="w-4 h-4 text-primary" aria-hidden="true" />;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn('relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', triggerClassName)}
          aria-label={unreadCount > 0 ? t('notifications.unreadCount', { count: unreadCount }) : t('header.notifications')}
          title={t('header.notifications')}
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
          {unreadCount > 0 && <span aria-hidden="true" className="absolute end-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-700 px-1 text-[10px] font-semibold text-white">{unreadCount}</span>}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end" sideOffset={8} collisionPadding={16} dir={isArabic ? 'rtl' : 'ltr'}
        aria-labelledby={titleId}
        className="flex max-h-[min(32rem,var(--radix-popover-content-available-height))] w-[calc(100vw-2rem)] flex-col overflow-hidden bg-card p-0 sm:w-96"
      >
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-4 py-3">
          <h2 id={titleId} className="text-base font-semibold">{t('notifications.title')}</h2>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button type="button" onClick={markAllAsRead} aria-label={t('notifications.markAllRead')} title={t('notifications.markAllRead')} className="flex h-11 w-11 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <CheckCheck className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
            <PopoverClose aria-label={t('common.close')} className="flex h-11 w-11 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <X className="h-4 w-4" aria-hidden="true" />
            </PopoverClose>
          </div>
        </div>
        <p className="px-4 pt-3 text-xs text-muted-foreground">{t(persisted ? 'reliability.sampleNotifications' : 'reliability.notificationStorageUnavailable')}</p>
        <div ref={filtersRef} className="flex shrink-0 gap-2 border-b border-border px-3 py-2" role="group" aria-label={t('notifications.title')}>
          {(['all', 'unread'] as const).map((value) => (
            <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)} className="min-h-11 rounded-lg px-3 text-sm text-muted-foreground transition-colors hover:bg-muted aria-pressed:bg-muted aria-pressed:font-semibold aria-pressed:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {t('notifications.' + value)} ({value === 'all' ? notifications.length : unreadCount})
            </button>
          ))}
        </div>
        <span className="sr-only" role="status">{t('notifications.unreadCount', { count: unreadCount })}</span>
        <ul className="m-0 min-h-0 list-none divide-y divide-border overflow-y-auto overscroll-contain p-0">
          {filteredList.length === 0 ? (
            <li className="px-4 py-10 text-center text-sm text-muted-foreground">{t('notifications.empty')}</li>
          ) : filteredList.map((item) => {
            const title = isArabic ? item.titleAr : item.title;
            return (
              <li key={item.id} className={cn('flex items-start gap-1 px-2 py-2', item.unread && 'bg-primary/[0.04]')}>
                <button
                  type="button" onClick={() => toggleRead(item.id)}
                  aria-label={t(item.unread ? 'notifications.markRead' : 'notifications.markUnread') + ': ' + title}
                  aria-describedby={titleId + '-' + item.id}
                  className="flex min-w-0 flex-1 items-start gap-3 rounded-xl p-2 text-start hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="mt-1 shrink-0" aria-hidden="true">{getIcon(item.type)}</span>
                  <span className="min-w-0 flex-1">
                    <span className={cn('block text-sm', item.unread ? 'font-semibold text-foreground' : 'font-medium text-muted-foreground')}>{title}</span>
                    <span id={titleId + '-' + item.id} className="mt-1 block text-xs leading-relaxed text-muted-foreground">{isArabic ? item.messageAr : item.message}</span>
                    <span className="mt-2 block text-xs text-muted-foreground">{isArabic ? item.timestampAr : item.timestamp}</span>
                  </span>
                </button>
                <button type="button" onClick={() => deleteNotification(item.id)} aria-label={t('notifications.dismiss', { title })} title={t('notifications.dismiss', { title })} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
};
