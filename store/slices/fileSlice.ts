import { StateCreator } from 'zustand';
import type { FileItem } from '@/types';

export interface FileSlice {
  files: FileItem[];
  currentFilePath: string;
  setFiles: (files: FileItem[]) => void;
  setCurrentFilePath: (path: string) => void;
  updateFileContent: (path: string, content: string) => void;
  addFile: (file: FileItem) => void;
  deleteFile: (path: string) => void;
  renameFile: (oldPath: string, newPath: string) => void;
}

export const createFileSlice: StateCreator<FileSlice> = (set, get) => ({
  files: [],
  currentFilePath: '',

  setFiles: (files) => set({ files }),
  
  setCurrentFilePath: (path) => set({ currentFilePath: path }),
  
  updateFileContent: (path, content) => {
    const updated = get().files.map(f => 
      f.path === path ? { ...f, content } : f
    );
    set({ files: updated });
  },
  
  addFile: (file) => {
    const updated = [...get().files, file];
    set({ files: updated, currentFilePath: file.path });
  },
  
  deleteFile: (path) => {
    const updated = get().files.filter(f => f.path !== path);
    const newCurrent = get().currentFilePath === path 
      ? updated[0]?.path || '' 
      : get().currentFilePath;
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
});