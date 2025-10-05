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
      className={`group flex items-center gap-2 px-3 py-1.5 rounded text-xs smooth-transition relative ${
        isActive ? 'bg-[#1e1e1e] text-[#ffffff] border-t-2 border-[#007acc]' : 'text-[#858585] hover:text-[#cccccc] hover:bg-[#2d2d30]'
      }`}
    >
      <button onClick={onSelect} className="flex items-center gap-2 relative">
        {isDirty && (
          <span
            className="w-2 h-2 bg-[#007acc] rounded-full mr-0.5"
            title="Unsaved changes"
          />
        )}

        <FileCode className="w-4 h-4" />

        {isEditing ? (
          <input
            ref={inputRef}
            defaultValue={fileName}
            onBlur={e => handleRename(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleRename(e.currentTarget.value)}
            className="bg-[#3c3c3c] text-[#cccccc] px-1.5 py-0.5 rounded w-28 text-xs font-mono border border-[#007acc] focus:outline-none"
          />
        ) : (
          <span className="font-mono">{fileName}</span>
        )}
      </button>

      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 smooth-transition">
        <button
          onClick={() => setIsEditing(true)}
          className="p-1 hover:bg-[#3c3c3c] rounded"
          title="Rename File"
        >
          <Edit2 className="w-3 h-3" />
        </button>
        <button
          onClick={onDelete}
          className="p-1 hover:bg-[#f48771]/20 rounded text-[#f48771]"
          title="Delete File"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}