import { create } from 'zustand';
import type { Message, PlanNode, FileItem } from '@/types/planweave';

interface IDEState {
  files: FileItem[];
  currentFilePath: string;
  setFiles: (files: FileItem[]) => void;
  setCurrentFilePath: (path: string) => void;
  updateFileContent: (path: string, content: string) => void;
  addFile: (file: FileItem) => void;
  deleteFile: (path: string) => void;
  renameFile: (oldPath: string, newPath: string) => void;

  messages: Message[];
  addMessage: (message: Message) => void;

  planNodes: PlanNode[];
  setPlanNodes: (nodes: PlanNode[]) => void;
  toggleNodeExpansion: (nodeId: string) => void;

  showFlowchart: boolean;
  setShowFlowchart: (show: boolean) => void;

  isThinking: boolean;
  setIsThinking: (thinking: boolean) => void;
}

export const useIDEStore = create<IDEState>((set, get) => ({
  files: [],
  currentFilePath: '',

  setFiles: (files) => {
    set({ files });
  },

  setCurrentFilePath: (path) => set({ currentFilePath: path }),

  updateFileContent: (path, content) => {
    const updated = get().files.map(f => f.path === path ? { ...f, content } : f);
    set({ files: updated });
  },

  addFile: (file) => {
    const updated = [...get().files, file];
    set({ files: updated, currentFilePath: file.path });
  },

  deleteFile: (path) => {
    const updated = get().files.filter(f => f.path !== path);
    const newCurrent = get().currentFilePath === path ? updated[0]?.path || '' : get().currentFilePath;
    set({ files: updated, currentFilePath: newCurrent });
  },

  renameFile: (oldPath, newPath) => {
    const updated = get().files.map(f =>
      f.path === oldPath
        ? { ...f, path: newPath, name: newPath.split('/').pop() || newPath }
        : f
    );
    set({
      files: updated,
      currentFilePath: get().currentFilePath === oldPath ? newPath : get().currentFilePath
    });
  },

  messages: [],
  addMessage: (message) => set({ messages: [...get().messages, message] }),

  planNodes: [],
  setPlanNodes: (nodes) => set({ planNodes: nodes }),
  toggleNodeExpansion: (nodeId) => set({
    planNodes: get().planNodes.map(node =>
      node.id === nodeId ? { ...node, expanded: !node.expanded } : node
    )
  }),

  showFlowchart: false,
  setShowFlowchart: (show) => set({ showFlowchart: show }),

  isThinking: false,
  setIsThinking: (thinking) => set({ isThinking: thinking }),
}));