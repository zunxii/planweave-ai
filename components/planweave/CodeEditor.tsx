'use client';

import { useState } from 'react';
import { FileCode, Plus, X, Edit2, FolderOpen } from 'lucide-react';
import dynamic from 'next/dynamic';
import type { FileItem } from '@/types/planweave';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface CodeEditorProps {
  files: FileItem[];
  currentFilePath: string;
  onFileChange: (path: string, content: string) => void;
  onFileSelect: (path: string) => void;
  onAddFile: () => void;
  onDeleteFile: (path: string) => void;
  onRenameFile: (path: string) => void;
}

export function CodeEditor({
  files,
  currentFilePath,
  onFileChange,
  onFileSelect,
  onAddFile,
  onDeleteFile,
  onRenameFile
}: CodeEditorProps) {
  const currentFile = files.find(f => f.path === currentFilePath);

  return (
    <div className="flex-1 flex flex-col bg-black">
      {/* File Tabs */}
      <div className="h-10 glass-panel border-b flex items-center px-2 gap-1 overflow-x-auto">
        {files.map((file) => (
          <div
            key={file.path}
            className={`group flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors relative ${
              file.path === currentFilePath
                ? 'bg-zinc-900 text-zinc-200'
                : 'text-zinc-600 hover:text-zinc-400 hover:bg-zinc-900/50'
            }`}
          >
            <button
              onClick={() => onFileSelect(file.path)}
              className="flex items-center gap-2"
            >
              <FileCode className="w-3 h-3" />
              <span className="font-mono">{file.name}</span>
            </button>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onRenameFile(file.path)}
                className="p-0.5 hover:bg-zinc-800 rounded"
                title="Rename"
              >
                <Edit2 className="w-3 h-3" />
              </button>
              <button
                onClick={() => onDeleteFile(file.path)}
                className="p-0.5 hover:bg-red-900/50 rounded text-red-400"
                title="Delete"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
        
        <button
          onClick={onAddFile}
          className="flex items-center gap-1 px-2 py-1.5 text-zinc-700 hover:text-zinc-400 hover:bg-zinc-900/50 rounded ml-2"
          title="Add new file"
        >
          <Plus className="w-3 h-3" />
          <span className="text-xs">New File</span>
        </button>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        {currentFile ? (
          <Editor
            height="100%"
            language={currentFile.language}
            value={currentFile.content}
            onChange={(value) => onFileChange(currentFile.path, value || '')}
            theme="vs-dark"
            options={{
              fontSize: 14,
              fontFamily: 'JetBrains Mono, Menlo, Monaco, Courier New, monospace',
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              renderLineHighlight: 'line',
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              smoothScrolling: true,
              padding: { top: 16, bottom: 16 },
              bracketPairColorization: { enabled: true },
              guides: {
                bracketPairs: true,
                indentation: true,
              },
              tabSize: 2,
              wordWrap: 'on',
              automaticLayout: true,
              formatOnPaste: true,
              formatOnType: true,
              suggestOnTriggerCharacters: true,
              quickSuggestions: true,
              acceptSuggestionOnCommitCharacter: true,
            }}
            loading={
              <div className="flex items-center justify-center h-full">
                <div className="text-zinc-600">Loading editor...</div>
              </div>
            }
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-zinc-700">
              <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-sm">No file selected</p>
              <button
                onClick={onAddFile}
                className="mt-4 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 rounded text-xs text-zinc-400"
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
