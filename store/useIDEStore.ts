import { create } from 'zustand';
import { createFileSlice, FileSlice } from './slices/fileSlice';
import { createChatSlice, ChatSlice } from './slices/chatSlice';
import { createCanvasSlice, CanvasSlice } from './slices/canvasSlice';
import { createPlanSlice, PlanSlice } from './slices/planSlice';
import { createNotificationSlice, NotificationSlice } from './slices/notificationSlice';

type IDEStore = FileSlice & ChatSlice & CanvasSlice & PlanSlice & NotificationSlice;

export const useIDEStore = create<IDEStore>()((...a) => ({
  ...createFileSlice(...a),
  ...createChatSlice(...a),
  ...createCanvasSlice(...a),
  ...createPlanSlice(...a),
  ...createNotificationSlice(...a),
}));