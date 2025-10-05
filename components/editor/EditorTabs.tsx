'use client';

import { Plus, Save } from 'lucide-react';
import { FileTab } from './FileTab';
import type { FileItem } from '@/types';

interface EditorTabsProps {
  files: FileItem[];
  currentFilePath: string;
  hasUnsaved?: boolean;
  isSaving?: boolean;
  onFileSelect: (path: string) => void;
  onFileRename: (oldPath: string, newPath: string) => void;
  onFileDelete: (path: string) => void;
  onAddFile: () => void;
  onSave?: () => void;
}

export function EditorTabs({
  files,
  currentFilePath,
  hasUnsaved,
  isSaving,
  onFileSelect,
  onFileRename,
  onFileDelete,
  onAddFile,
  onSave
}: EditorTabsProps) {
  return (
    <div className="h-[38px] vscode-elevated border-b border-[#3e3e42] flex items-center px-2 gap-1 overflow-x-auto relative">
      {files.map(file => (
        <FileTab
          key={file.path}
          fileName={file.name}
          filePath={file.path}
          isActive={file.path === currentFilePath}
          isDirty={file.path === currentFilePath && !!hasUnsaved}
          onSelect={() => onFileSelect(file.path)}
          onRename={(newPath) => onFileRename(file.path, newPath)}
          onDelete={() => onFileDelete(file.path)}
        />
      ))}

      <button
        onClick={onAddFile}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-[#858585] hover:text-[#cccccc] hover:bg-[#2d2d30] rounded smooth-transition ml-1"
      >
        <Plus className="w-4 h-4" />
        New
      </button>

      {onSave && currentFilePath && (
        <button
          onClick={onSave}
          disabled={isSaving || !hasUnsaved}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-[#007acc] hover:bg-[#0098ff] text-white rounded disabled:opacity-40 disabled:cursor-not-allowed smooth-transition"
        >
          {isSaving ? 'Saving...' : <><Save className="w-3.5 h-3.5" /> Save</>}
        </button>
      )}
    </div>
  );
}