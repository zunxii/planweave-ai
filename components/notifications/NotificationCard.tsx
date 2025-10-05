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
      bg: 'bg-[#007acc]/10 border-[#007acc]/30',
      icon: <Info className="w-5 h-5 text-[#007acc]" />,
    },
    success: {
      bg: 'bg-[#4ec9b0]/10 border-[#4ec9b0]/30',
      icon: <CheckCircle2 className="w-5 h-5 text-[#4ec9b0]" />,
    },
    warning: {
      bg: 'bg-[#dcdcaa]/10 border-[#dcdcaa]/30',
      icon: <AlertTriangle className="w-5 h-5 text-[#dcdcaa]" />,
    },
    error: {
      bg: 'bg-[#f48771]/10 border-[#f48771]/30',
      icon: <AlertCircle className="w-5 h-5 text-[#f48771]" />,
    },
  };

  const style = typeStyles[notification.type];

  return (
    <div className={`${style.bg} border backdrop-blur-xl rounded-lg p-4 shadow-2xl animate-slide-in bg-[#2d2d30]`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {style.icon}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-[#ffffff] mb-1">
            {notification.title}
          </h4>
          <p className="text-xs text-[#cccccc]">
            {notification.message}
          </p>

          {notification.actionLabel && notification.actionCallback && (
            <button
              onClick={notification.actionCallback}
              className="mt-2 text-xs font-medium text-[#007acc] hover:text-[#0098ff] smooth-transition"
            >
              {notification.actionLabel}
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="flex-shrink-0 w-6 h-6 rounded hover:bg-[#3c3c3c] flex items-center justify-center smooth-transition"
        >
          <X className="w-4 h-4 text-[#858585]" />
        </button>
      </div>
    </div>
  );
}