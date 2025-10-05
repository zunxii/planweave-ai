'use client';

import { useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import type { Notification } from '@/types';

interface NotificationCardProps {
  notification: Notification;
  onClose: () => void;
}

export function NotificationCard({ notification, onClose }: NotificationCardProps) {
  useEffect(() => {
    if (notification.autoHide) {
      const timer = setTimeout(() => {
        onClose();
      }, notification.duration || 5000);
      return () => clearTimeout(timer);
    }
  }, [notification.autoHide, notification.duration, onClose]);

  const typeStyles = {
    info: {
      bg: 'bg-blue-950/90 border-blue-600/30',
      icon: <Info className="w-5 h-5 text-blue-400" />,
    },
    success: {
      bg: 'bg-emerald-950/90 border-emerald-600/30',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    },
    warning: {
      bg: 'bg-amber-950/90 border-amber-600/30',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    },
    error: {
      bg: 'bg-red-950/90 border-red-600/30',
      icon: <AlertCircle className="w-5 h-5 text-red-400" />,
    },
  };

  const style = typeStyles[notification.type];

  return (
    <div className={`${style.bg} border backdrop-blur-xl rounded-lg p-4 shadow-2xl animate-in slide-in-from-right fade-in`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {style.icon}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-zinc-100 mb-1">
            {notification.title}
          </h4>
          <p className="text-xs text-zinc-400">
            {notification.message}
          </p>

          {notification.actionLabel && notification.actionCallback && (
            <button
              onClick={notification.actionCallback}
              className="mt-2 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              {notification.actionLabel}
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="flex-shrink-0 w-6 h-6 rounded hover:bg-zinc-800/50 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-zinc-500" />
        </button>
      </div>
    </div>
  );
}