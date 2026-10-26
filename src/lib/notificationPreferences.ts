import { z } from 'zod';
import { SafeStorage } from '@/domain/safeStorage';

const schema = z.record(z.string(), z.object({ read: z.boolean().optional(), dismissed: z.boolean().optional() }));
export type NotificationPreferences = z.infer<typeof schema>;
export const notificationStorageKey = (accountId: string) => 'hr_tool_notification_preferences_v1:' + encodeURIComponent(accountId.trim().toLowerCase());

export function readNotificationPreferences(accountId: string): NotificationPreferences {
  return SafeStorage.getItem(notificationStorageKey(accountId), schema, {});
}

export function writeNotificationPreferences(accountId: string, preferences: NotificationPreferences): boolean {
  return SafeStorage.setItem(notificationStorageKey(accountId), preferences, schema);
}
