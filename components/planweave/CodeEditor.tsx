'use client';
import { syncStore } from '@/services/langchain/syncStore';
import { useIDEStore } from '@/store/useIDEStore';
import { FileCode, Plus, X, Edit2, FolderOpen, Save } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState, useEffect, useRef } from 'react';
import { getSessionId } from '@/lib/session';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface CodeEditorProps {
  onFileChange: (path: string, content: string) => void;
  onFileSelect: (path: string) => void;
  onAddFile: () => void;
  onDeleteFile: (path: string) => void;
  onRenameFile: (oldPath: string, newPath: string) => void;
}

export function CodeEditor({ onFileChange, onFileSelect, onAddFile, onDeleteFile, onRenameFile }: CodeEditorProps) {
  const files = useIDEStore(state => state.files);
  const currentFilePath = useIDEStore(state => state.currentFilePath);
  const currentFile = files.find(f => f.path === currentFilePath);

  const [unsaved, setUnsaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingFile, setEditingFile] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentFile) {
      setUnsaved(true);
    }
  }, [currentFile?.content]);

  useEffect(() => {
    if (editingFile && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingFile]);

  const handleDeleteFile = async (path: string) => {
    onDeleteFile(path);
    await syncStore('sync');
  };

  const handleSaveFile = async () => {
    if (!currentFile) return;
    setSaving(true);
    try {
      const sessionId = getSessionId();
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          files: files, 
          sessionId 
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUnsaved(false);
        console.log(' Files saved and indexed');
      }
    } catch (err) {
      console.error('Save failed', err);
    } finally {
      setSaving(false);
    }
  };

  const handleRenameSubmit = async (oldPath: string, newName: string) => {
    if (!newName.trim()) return;
    onRenameFile(oldPath, newName.trim());
    setEditingFile(null);
    await syncStore('sync');
  };

  return (
    <div className="flex-1 flex flex-col bg-black">
      {/* File Tabs */}
      <div className="h-14 glass-panel border-b flex items-center px-3 gap-2 overflow-x-auto relative">
        {files.map(file => {
          const isCurrent = file.path === currentFilePath;
          const isDirty = isCurrent && unsaved;

          return (
            <div
              key={file.path}
              className={`group flex items-center gap-2 px-4 py-2 rounded text-sm transition-colors relative ${
                isCurrent ? 'bg-zinc-900 text-zinc-200' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/40'
              }`}
            >
              <button onClick={() => onFileSelect(file.path)} className="flex items-center gap-2 relative">
                {isDirty && (
                  <span
                    className="w-3 h-3 bg-white rounded-full border border-zinc-900 mr-1"
                    title="Unsaved changes"
                  />
                )}

                <FileCode className="w-5 h-5" />

                {editingFile === file.path ? (
                  <input
                    ref={inputRef}
                    defaultValue={file.name}
                    onBlur={e => handleRenameSubmit(file.path, e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleRenameSubmit(file.path, e.currentTarget.value)}
                    className="bg-zinc-800 text-white px-1 rounded w-28 text-sm font-mono"
                  />
                ) : (
                  <span className="font-mono">{file.name}</span>
                )}
              </button>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setEditingFile(file.path)}
                  className="p-1 hover:bg-zinc-800 rounded"
                  title="Rename File"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteFile(file.path)}
                  className="p-1 hover:bg-red-900 rounded text-red-400"
                  title="Delete File"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        <button
          onClick={onAddFile}
          className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-900/40 rounded ml-2"
        >
          <Plus className="w-5 h-5" />
          New File
        </button>

        {currentFile && (
          <button
            onClick={handleSaveFile}
            disabled={saving || !unsaved}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 text-sm bg-zinc-800 hover:bg-zinc-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save</>}
          </button>
        )}
      </div>

      {/* Editor */}
      <div className="flex-1">
        {currentFile ? (
          <Editor
            height="100%"
            language={currentFile.language}
            value={currentFile.content}
            onChange={value => onFileChange(currentFile.path, value || '')}
            theme="vs-dark"
            options={{ automaticLayout: true, fontSize: 16, minimap: { enabled: false } }}
          />
        ) : (
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
        )}
      </div>
    </div>
  );
}