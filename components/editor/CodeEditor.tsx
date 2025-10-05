'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { EditorTabs } from './EditorTabs';
import { EmptyEditorState } from './EmptyEditorState';
import { useIDEStore } from '@/store';
import { getSessionId } from '@/lib/session';
import { syncStore } from '@/services/langchain/syncStore';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface CodeEditorProps {
  onFileChange: (path: string, content: string) => void;
  onFileSelect: (path: string) => void;
  onAddFile: () => void;
  onDeleteFile: (path: string) => void;
  onRenameFile: (oldPath: string, newPath: string) => void;
}

export function CodeEditor({ 
  onFileChange, 
  onFileSelect, 
  onAddFile, 
  onDeleteFile, 
  onRenameFile 
}: CodeEditorProps) {
  const files = useIDEStore(state => state.files);
  const currentFilePath = useIDEStore(state => state.currentFilePath);
  const currentFile = files.find(f => f.path === currentFilePath);

  const [unsaved, setUnsaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (currentFile) {
      setUnsaved(true);
    }
  }, [currentFile?.content]);

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
        body: JSON.stringify({ files, sessionId }),
      });
      
      const data = await res.json();
      if (data.success) {
        setUnsaved(false);
        console.log('Files saved and indexed');
      }
    } catch (err) {
      console.error('Save failed', err);
    } finally {
      setSaving(false);
    }
  };

  const handleRenameFile = async (oldPath: string, newPath: string) => {
    onRenameFile(oldPath, newPath);
    await syncStore('sync');
  };

  return (
    <div className="flex-1 flex flex-col bg-black">
      <EditorTabs
        files={files}
        currentFilePath={currentFilePath}
        hasUnsaved={unsaved}
        isSaving={saving}
        onFileSelect={onFileSelect}
        onFileRename={handleRenameFile}
        onFileDelete={handleDeleteFile}
        onAddFile={onAddFile}
        onSave={handleSaveFile}
      />

      <div className="flex-1">
        {currentFile ? (
          <Editor
            height="100%"
            language={currentFile.language}
            value={currentFile.content}
            onChange={value => onFileChange(currentFile.path, value || '')}
            theme="vs-dark"
            options={{ 
              automaticLayout: true, 
              fontSize: 16, 
              minimap: { enabled: false } 
            }}
          />
        ) : (
          <EmptyEditorState onAddFile={onAddFile} />
        )}
      </div>
    </div>
  );
}