import { StateCreator } from 'zustand';
import type { Notification } from '@/types/planweave';

export interface NotificationSlice {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const createNotificationSlice: StateCreator<NotificationSlice> = (set, get) => ({
  notifications: [],

  addNotification: (notificationData) => {
    const id = `notif-${Date.now()}`;
    const notification: Notification = {
      ...notificationData,
      id,
      timestamp: new Date(),
    };

    set({ notifications: [...get().notifications, notification] });

    if (notification.autoHide) {
      setTimeout(() => {
        get().removeNotification(id);
      }, notification.duration || 5000);
    }
  },

  removeNotification: (id) => {
    set({ notifications: get().notifications.filter(n => n.id !== id) });
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },
});