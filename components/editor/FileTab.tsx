'use client';

import { FileCode, X, Edit2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface FileTabProps {
  fileName: string;
  filePath: string;
  isActive: boolean;
  isDirty: boolean;
  onSelect: () => void;
  onRename: (newPath: string) => void;
  onDelete: () => void;
}

export function FileTab({
  fileName,
  filePath,
  isActive,
  isDirty,
  onSelect,
  onRename,
  onDelete
}: FileTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleRename = (newName: string) => {
    if (newName.trim()) {
      onRename(newName.trim());
    }
    setIsEditing(false);
  };

  return (
    <div
      className={`group flex items-center gap-2 px-4 py-2 rounded text-sm transition-colors relative ${
        isActive ? 'bg-zinc-900 text-zinc-200' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/40'
      }`}
    >
      <button onClick={onSelect} className="flex items-center gap-2 relative">
        {isDirty && (
          <span
            className="w-3 h-3 bg-white rounded-full border border-zinc-900 mr-1"
            title="Unsaved changes"
          />
        )}

        <FileCode className="w-5 h-5" />

        {isEditing ? (
          <input
            ref={inputRef}
            defaultValue={fileName}
            onBlur={e => handleRename(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleRename(e.currentTarget.value)}
            className="bg-zinc-800 text-white px-1 rounded w-28 text-sm font-mono"
          />
        ) : (
          <span className="font-mono">{fileName}</span>
        )}
      </button>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setIsEditing(true)}
          className="p-1 hover:bg-zinc-800 rounded"
          title="Rename File"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-1 hover:bg-red-900 rounded text-red-400"
          title="Delete File"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
