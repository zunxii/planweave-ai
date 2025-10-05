import { useIDEStore } from '@/store';
import type { Notification } from '@/types';

export function useNotifications() {
  const notifications = useIDEStore(state => state.notifications);
  const addNotification = useIDEStore(state => state.addNotification);
  const removeNotification = useIDEStore(state => state.removeNotification);
  const clearNotifications = useIDEStore(state => state.clearNotifications);

  const notify = {
    success: (title: string, message: string, autoHide = true) => {
      addNotification({
        type: 'success',
        title,
        message,
        autoHide,
        duration: 5000,
      });
    },
    error: (title: string, message: string, autoHide = false) => {
      addNotification({
        type: 'error',
        title,
        message,
        autoHide,
        duration: 0,
      });
    },
    warning: (title: string, message: string, autoHide = true) => {
      addNotification({
        type: 'warning',
        title,
        message,
        autoHide,
        duration: 7000,
      });
    },
    info: (title: string, message: string, autoHide = true) => {
      addNotification({
        type: 'info',
        title,
        message,
        autoHide,
        duration: 5000,
      });
    },
  };

  return {
    notifications,
    notify,
    removeNotification,
    clearNotifications,
  };
}