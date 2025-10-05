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
    <div className="h-14 glass-panel border-b flex items-center px-3 gap-2 overflow-x-auto relative">
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
        className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-900/40 rounded ml-2"
      >
        <Plus className="w-5 h-5" />
        New File
      </button>

      {onSave && currentFilePath && (
        <button
          onClick={onSave}
          disabled={isSaving || !hasUnsaved}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 text-sm bg-zinc-800 hover:bg-zinc-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : <><Save className="w-4 h-4" /> Save</>}
        </button>
      )}
    </div>
  );
}
