
import React from 'react';
import { useNotification } from './NotificationContext';
import { Notification } from './Notification';

export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-[100] w-full max-w-sm space-y-3">
      {notifications.map(n => (
        <Notification key={n.id} notification={n} onClose={() => removeNotification(n.id)} />
      ))}
    </div>
  );
};
