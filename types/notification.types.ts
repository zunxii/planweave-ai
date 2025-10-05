import { NotificationType } from './common.types';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  actionLabel?: string;
  actionCallback?: () => void;
  autoHide?: boolean;
  duration?: number;
}
