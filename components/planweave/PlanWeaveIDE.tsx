'use client';

import { useIDEStore } from '@/store/useIDEStore';
import { useChat } from '@/hooks/useChat';
import { CodeEditor } from './CodeEditor';
import { ChatPanel } from './ChatPanel';
import { TopBar } from './TopBar';
import { useEffect } from 'react';
import { nanoid } from 'nanoid';
import { syncStore } from '@/services/langchain/syncStore';

export function PlanWeaveIDE() {
  const files = useIDEStore(state => state.files);
  const currentFilePath = useIDEStore(state => state.currentFilePath);
  const setCurrentFilePath = useIDEStore(state => state.setCurrentFilePath);
  const updateFileContent = useIDEStore(state => state.updateFileContent);
  const addFile = useIDEStore(state => state.addFile);
  const deleteFile = useIDEStore(state => state.deleteFile);
  const renameFile = useIDEStore(state => state.renameFile);

  const { sendMessage, sessionId } = useChat();
  const addMessage = useIDEStore(state => state.addMessage);
  const setIsThinking = useIDEStore(state => state.setIsThinking);

  useEffect(() => {
    const init = async () => {
      if (sessionId) {
        await syncStore('clear');
        console.log('Vector store initialized for session:', sessionId);
      }
    };
    init();
  }, [sessionId]);

  useEffect(() => {
    if (files.length > 0 && sessionId) {
      const timer = setTimeout(() => {
        syncStore('sync');
      }, 1000); 
      return () => clearTimeout(timer);
    }
  }, [files, sessionId]);

  const handleSendMessage = async (content: string) => {
    const userMessage = { 
      id:nanoid(), 
      role: 'user' as const, 
      content, 
      timestamp: new Date() 
    };
    addMessage(userMessage);

    setIsThinking(true);
    const { reply } = await sendMessage(content);
    setIsThinking(false);

    const assistantMessage = { 
      id:nanoid(), 
      role: 'assistant' as const, 
      content: reply, 
      timestamp: new Date() 
    };
    addMessage(assistantMessage);
  };

  const handleAddFile = async () => {
    const fileName = prompt('Enter file name (e.g., components/Button.tsx):');
    if (!fileName) return;
    
    const extension = fileName.split('.').pop() || 'tsx';
    const language = ['ts', 'tsx'].includes(extension)
      ? 'typescript'
      : ['js', 'jsx'].includes(extension)
      ? 'javascript'
      : extension === 'css'
      ? 'css'
      : 'typescript';
    
    const newFile = { 
      name: fileName.split('/').pop()!, 
      path: fileName, 
      language, 
      content: `// ${fileName}\n\n` 
    };
    
    addFile(newFile);
    await syncStore('sync');
  };

  const handleRenameFile = (oldPath: string, newPath: string) => {
    renameFile(oldPath, newPath);
  };

  return (
    <div className="h-screen flex flex-col">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        <ChatPanel onSendMessage={handleSendMessage} />
        <CodeEditor
          onFileChange={updateFileContent}
          onFileSelect={setCurrentFilePath}
          onAddFile={handleAddFile}
          onDeleteFile={deleteFile}
          onRenameFile={handleRenameFile}
        />
      </div>
    </div>
  );
}