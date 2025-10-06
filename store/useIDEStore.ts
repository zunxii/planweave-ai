import { create } from 'zustand';
import { createFileSlice, FileSlice } from './slices/fileSlice';
import { createChatSlice, ChatSlice } from './slices/chatSlice';
import { createCanvasSlice, CanvasSlice } from './slices/canvasSlice';
import { createPlanSlice, PlanSlice } from './slices/planSlice';
import { createNotificationSlice, NotificationSlice } from './slices/notificationSlice';
import { createFlowchartSlice, FlowchartSlice } from './slices/flowchartSlice';

type IDEStore = FileSlice & ChatSlice & CanvasSlice & PlanSlice & NotificationSlice & FlowchartSlice;

export const useIDEStore = create<IDEStore>()((...a) => ({
  ...createFileSlice(...a),
  ...createChatSlice(...a),
  ...createCanvasSlice(...a),
  ...createPlanSlice(...a),
  ...createNotificationSlice(...a),
  ...createFlowchartSlice(...a)
}));