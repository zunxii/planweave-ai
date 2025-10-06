'use client';

import { useEffect } from 'react';
import { nanoid } from 'nanoid';
import { useIDEStore } from '@/store';
import { useChat } from '@/hooks/useChat';
import { syncStore } from '@/services/langchain/syncStore';
import { CodeEditor } from './editor';
import { ExpandableChatPanel } from './chat';
import { IDELayout } from './layout';
import { NotificationToast } from './notifications';

function FinalPlanModal() {
  const isOpen = useIDEStore(state => state.isFinalPlanModalOpen);
  const doc = useIDEStore(state => state.finalPlanDoc);
  const setOpen = useIDEStore(state => state.setFinalPlanModalOpen);

  const copy = async () => {
    if (doc) await navigator.clipboard.writeText(doc);
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
      <div className="w-[90vw] h-[85vh] surface-panel border border-[#1f1f28] rounded-xl overflow-hidden shadow-xl">
        <div className="flex items-center justify-between p-3 border-b border-[#1f1f28]">
          <div className="text-sm font-semibold text-[#e2e8f0]">Final Plan Document</div>
          <div className="flex items-center gap-2">
            <button onClick={copy} className="btn-3d px-3 py-1.5 text-xs rounded-md bg-[#18181f] hover:bg-[#1a1a22] text-[#e2e8f0] border border-[#28283a]">Copy</button>
            <button onClick={() => setOpen(false)} className="btn-3d px-3 py-1.5 text-xs rounded-md bg-[#0f0f14] hover:bg-[#101018] text-[#94a3b8] border border-[#1f2937]">Close</button>
          </div>
        </div>
        <div className="h-full overflow-auto p-4 text-sm text-[#cbd5e1] whitespace-pre-wrap font-mono">
          {doc}
        </div>
      </div>
    </div>
  );
}

export function PlanWeaveIDE() {
  const files = useIDEStore(state => state.files);
  const setCurrentFilePath = useIDEStore(state => state.setCurrentFilePath);
  const updateFileContent = useIDEStore(state => state.updateFileContent);
  const addFile = useIDEStore(state => state.addFile);
  const deleteFile = useIDEStore(state => state.deleteFile);
  const renameFile = useIDEStore(state => state.renameFile);
  const addMessage = useIDEStore(state => state.addMessage);
  const setIsThinking = useIDEStore(state => state.setIsThinking);

  const { sendMessage, sessionId } = useChat();

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
      id: nanoid(),
      role: 'user' as const,
      content,
      timestamp: new Date()
    };
    addMessage(userMessage);

    setIsThinking(true);
    const { reply } = await sendMessage(content);
    setIsThinking(false);

    const assistantMessage = {
      id: nanoid(),
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
    <IDELayout>
      <ExpandableChatPanel onSendMessage={handleSendMessage} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <CodeEditor
          onFileChange={updateFileContent}
          onFileSelect={setCurrentFilePath}
          onAddFile={handleAddFile}
          onDeleteFile={deleteFile}
          onRenameFile={handleRenameFile}
        />
      </div>

      <NotificationToast />
      <FinalPlanModal />
    </IDELayout>
  );
}