'use client';

import { useIDEStore } from '@/store';
import { NotificationCard } from './NotificationCard';

export function NotificationToast() {
  const notifications = useIDEStore(state => state.notifications);
  const removeNotification = useIDEStore(state => state.removeNotification);

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3 max-w-md">
      {notifications.map(notification => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}