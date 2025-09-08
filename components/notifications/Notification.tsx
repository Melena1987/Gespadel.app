
import React from 'react';
import type { Notification as NotificationType } from './NotificationContext';
import { CloseIcon } from '../icons/CloseIcon';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { ExclamationCircleIcon } from '../icons/ExclamationCircleIcon';
import { InfoCircleIcon } from '../icons/InfoCircleIcon';

interface NotificationProps {
  notification: NotificationType;
  onClose: () => void;
}

const icons = {
  success: <CheckCircleIcon className="h-6 w-6 text-green-400" />,
  error: <ExclamationCircleIcon className="h-6 w-6 text-red-400" />,
  info: <InfoCircleIcon className="h-6 w-6 text-cyan-400" />,
};

const styles = {
  success: 'bg-slate-800 border-green-500/50 text-slate-100',
  error: 'bg-slate-800 border-red-500/50 text-slate-100',
  info: 'bg-slate-800 border-cyan-500/50 text-slate-100',
};

export const Notification: React.FC<NotificationProps> = ({ notification, onClose }) => {
  return (
    <div
      className={`relative flex items-start gap-4 w-full max-w-sm p-4 rounded-lg shadow-2xl ring-1 ring-white/10 backdrop-blur-md transition-all duration-300 transform border-l-4 ${styles[notification.type]}`}
      role="alert"
    >
      <div className="flex-shrink-0">{icons[notification.type]}</div>
      <div className="flex-grow text-sm font-semibold">{notification.message}</div>
      <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-white/10 hover:text-white" aria-label="Cerrar notificación">
        <CloseIcon />
      </button>
    </div>
  );
};
