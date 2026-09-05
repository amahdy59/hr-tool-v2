import React, { useState } from 'react';
import { Bell, CheckCheck, Trash2, Calendar, FileText, Sparkles, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';

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
  {
    id: 'n-4',
    title: 'PWA Offline Sync Ready',
    titleAr: 'المزامنة دون اتصال جاهزة',
    message: 'Offline caching activated. Offline submissions will sync automatically.',
    messageAr: 'تم تفعيل التخزين دون اتصال. ستتم المزامنة تلقائياً عند الاتصال.',
    timestamp: '1d ago',
    timestampAr: 'منذ يوم',
    type: 'system',
    unread: false,
  },
];

export const NotificationCenter: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === 'ar' || i18n.language.startsWith('ar');
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;
  const filteredList = notifications.filter((n) => (filter === 'unread' ? n.unread : true));

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const simulateIncomingAlert = () => {
    const alertTypes: Array<'leave' | 'attendance' | 'mission'> = ['leave', 'attendance', 'mission'];
    const randomType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const newId = `n-${Date.now()}`;

    const newNotification: NotificationItem = {
      id: newId,
      title: randomType === 'leave' ? 'Urgent Sick Leave' : randomType === 'attendance' ? 'Overtime Request' : 'New Field Mission',
      titleAr: randomType === 'leave' ? 'إجازة مرضية عاجلة' : randomType === 'attendance' ? 'طلب وقت إضافي' : 'مأمورية عمل جديدة',
      message: randomType === 'leave' ? 'Michael Chen requested 1 day emergency leave.' : 'Field engineer requested 2 hours overtime.',
      messageAr: randomType === 'leave' ? 'طلب مايكل تشين إجازة طارئة ليوم واحد.' : 'طلب مهندس الموقع ساعتين وقت إضافي.',
      timestamp: isArabic ? 'الآن' : 'Just now',
      timestampAr: 'الآن',
      type: randomType,
      unread: true,
    };

    setNotifications((prev) => [newNotification, ...prev]);
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'leave':
        return <FileText className="w-4 h-4 text-amber-500" aria-hidden="true" />;
      case 'attendance':
        return <Calendar className="w-4 h-4 text-sky-500" aria-hidden="true" />;
      case 'mission':
        return <Sparkles className="w-4 h-4 text-emerald-500" aria-hidden="true" />;
      default:
        return <Bell className="w-4 h-4 text-primary" aria-hidden="true" />;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="relative flex h-11 w-11 items-center justify-center rounded-md border border-border bg-muted/50 text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
          aria-label={
            unreadCount > 0
              ? `${t('header.notifications', 'Notifications')} (${unreadCount} unread)`
              : t('header.notifications', 'Notifications')
          }
          title={t('header.notifications', 'Notifications')}
        >
          <Bell className="w-4 h-4 shrink-0" aria-hidden="true" />
          {unreadCount > 0 && (
            <>
              <span className="absolute -top-1 -end-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground shadow-sm animate-pulse">
                {unreadCount}
              </span>
              <span className="sr-only">{`${unreadCount} unread notifications`}</span>
            </>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align={isArabic ? 'start' : 'end'}
        sideOffset={8}
        className="w-80 sm:w-96 p-0 shadow-lg border-border bg-card overflow-hidden z-[100]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/70 px-4 py-3 bg-muted/30">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">
              {t('notifications.title', 'Notifications')}
            </h3>
            {unreadCount > 0 && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {unreadCount} {t('notifications.new', 'new')}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors p-1 rounded hover:bg-muted"
                title={t('notifications.markAllRead', 'Mark all as read')}
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('notifications.markAllRead', 'Mark all read')}</span>
              </button>
            )}
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors p-1 rounded hover:bg-muted"
                title={t('notifications.clearAll', 'Clear all')}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-border/70 bg-muted/20 px-3 py-1.5 gap-2 text-xs">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={cn(
              'px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer',
              filter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t('notifications.all', 'All')} ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('unread')}
            className={cn(
              'px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer',
              filter === 'unread'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t('notifications.unread', 'Unread')} ({unreadCount})
          </button>

          <button
            type="button"
            onClick={simulateIncomingAlert}
            className="ms-auto text-[11px] text-muted-foreground hover:text-primary transition-colors underline decoration-dotted cursor-pointer"
          >
            {isArabic ? '+ تنبيه تجريبي' : '+ Demo alert'}
          </button>
        </div>

        {/* Notification List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-border/60">
          {filteredList.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              {t('notifications.empty', 'No notifications to display')}
            </div>
          ) : (
            filteredList.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleRead(item.id)}
                className={cn(
                  'flex items-start gap-3 p-3 transition-colors cursor-pointer hover:bg-muted/40 relative group',
                  item.unread ? 'bg-primary/[0.04]' : 'opacity-80'
                )}
              >
                <div className="mt-0.5 shrink-0 rounded-full bg-background p-1.5 border border-border shadow-xs">
                  {getIcon(item.type)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {isArabic ? item.titleAr : item.title}
                    </p>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {isArabic ? item.timestampAr : item.timestamp}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {isArabic ? item.messageAr : item.message}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(item.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive rounded transition-opacity"
                  title={t('common.delete', 'Delete')}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
