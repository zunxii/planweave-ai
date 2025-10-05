import { StateCreator } from 'zustand';
import type { Message, PlanNode } from '@/types/planweave';

export interface ChatSlice {
  messages: Message[];
  planNodes: PlanNode[];
  showFlowchart: boolean;
  isThinking: boolean;
  
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  setPlanNodes: (nodes: PlanNode[]) => void;
  toggleNodeExpansion: (nodeId: string) => void;
  setShowFlowchart: (show: boolean) => void;
  setIsThinking: (thinking: boolean) => void;
}

export const createChatSlice: StateCreator<ChatSlice> = (set, get) => ({
  messages: [],
  planNodes: [],
  showFlowchart: false,
  isThinking: false,

  addMessage: (message) => set({ messages: [...get().messages, message] }),
  
  clearMessages: () => set({ messages: [] }),

  setPlanNodes: (nodes) => set({ planNodes: nodes }),
  
  toggleNodeExpansion: (nodeId) => set({
    planNodes: get().planNodes.map(node =>
      node.id === nodeId ? { ...node, expanded: !node.expanded } : node
    )
  }),

  setShowFlowchart: (show) => set({ showFlowchart: show }),
  
  setIsThinking: (thinking) => set({ isThinking: thinking }),
});