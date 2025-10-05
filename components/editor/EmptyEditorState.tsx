'use client';

import { FolderOpen } from 'lucide-react';

interface EmptyEditorStateProps {
  onAddFile: () => void;
}

export function EmptyEditorState({ onAddFile }: EmptyEditorStateProps) {
  return (
    <div className="flex items-center justify-center h-full bg-[#1e1e1e]">
      <div className="text-center">
        <FolderOpen className="w-16 h-16 mx-auto mb-4 text-[#6a6a6a] opacity-50" />
        <p className="text-sm text-[#858585] mb-4">No file selected</p>
        <button
          onClick={onAddFile}
          className="px-4 py-2 bg-[#007acc] hover:bg-[#0098ff] rounded text-sm text-white smooth-transition"
        >
          Create a new file
        </button>
      </div>
    </div>
  );
}