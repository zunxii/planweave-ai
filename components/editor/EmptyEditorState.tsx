'use client';

import { FolderOpen } from 'lucide-react';

interface EmptyEditorStateProps {
  onAddFile: () => void;
}

export function EmptyEditorState({ onAddFile }: EmptyEditorStateProps) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center text-zinc-700">
        <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
        <p className="text-sm">No file selected</p>
        <button
          onClick={onAddFile}
          className="mt-4 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 rounded text-sm text-zinc-400"
        >
          Create a new file
        </button>
      </div>
    </div>
  );
}