'use client';

import { useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { useIDEStore } from '@/store';
import { syncStore } from '@/services/langchain/syncStore';
import { CodeEditor } from './editor';
import { ExpandableChatPanel } from './chat';
import { IDELayout } from './layout';
import { NotificationToast } from './notifications';
import { FinalPlanModal } from './plan/FinalPlanModal';
import { getSessionId } from '@/lib/session';

export function PlanWeaveIDE() {
  const files = useIDEStore(state => state.files);
  const setCurrentFilePath = useIDEStore(state => state.setCurrentFilePath);
  const updateFileContent = useIDEStore(state => state.updateFileContent);
  const addFile = useIDEStore(state => state.addFile);
  const deleteFile = useIDEStore(state => state.deleteFile);
  const renameFile = useIDEStore(state => state.renameFile);
  const addMessage = useIDEStore(state => state.addMessage);
  const setIsThinking = useIDEStore(state => state.setIsThinking);
  const createPlan = useIDEStore(state => state.createPlan);
  const setActivePlan = useIDEStore(state => state.setActivePlan);
  const setCanvasOpen = useIDEStore(state => state.setCanvasOpen);
  const addNotification = useIDEStore(state => state.addNotification);

  const sessionId = getSessionId();

  useEffect(() => {
    const init = async () => {
      if (sessionId) {
        await syncStore('clear');
        console.log(' Vector store initialized for session:', sessionId);
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

  const handleSendMessage = useCallback(async (content: string) => {
    if (!sessionId) {
      console.error('Session not ready');
      return;
    }

    // Add user message
    const userMessage = {
      id: nanoid(),
      role: 'user' as const,
      content,
      timestamp: new Date()
    };
    addMessage(userMessage);

    // Create streaming assistant message
    const streamingMessageId = nanoid();
    const streamingMessage = {
      id: streamingMessageId,
      role: 'assistant' as const,
      content: '',
      timestamp: new Date(),
      isStreaming: true,
      status: 'Thinking...'
    };
    addMessage(streamingMessage);

    setIsThinking(true);
    
    try {
      const res = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId, 
          message: content,
          files
        }),
      });

      if (!res.ok) {
        throw new Error('Stream request failed');
      }

      const reader = res.body?.getReader();
      if (!reader) {
        throw new Error('No response stream');
      }

      const decoder = new TextDecoder();
      let fullReply = '';
      let plan = null;
      let shouldCreatePlan = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === 'status') {
                // Update status in streaming message
                useIDEStore.setState(state => ({
                  messages: state.messages.map(m =>
                    m.id === streamingMessageId 
                      ? { ...m, status: data.message }
                      : m
                  )
                }));
              } else if (data.type === 'token') {
                // Append token to message content
                fullReply += data.content;
                useIDEStore.setState(state => ({
                  messages: state.messages.map(m =>
                    m.id === streamingMessageId 
                      ? { ...m, content: fullReply }
                      : m
                  )
                }));
              } else if (data.type === 'plan') {
                plan = data.plan;
                shouldCreatePlan = data.shouldCreatePlan;
              } else if (data.type === 'done') {
                console.log(' Stream completed');
              } else if (data.type === 'error') {
                console.error(' Stream error:', data.error);
                throw new Error(data.error);
              }
            } catch (e) {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }

      // Mark message as complete
      useIDEStore.setState(state => ({
        messages: state.messages.map(m =>
          m.id === streamingMessageId 
            ? { ...m, content: fullReply, isStreaming: false, status: undefined }
            : m
        )
      }));

      // Create plan if needed
      if (shouldCreatePlan && plan) {
        console.log(' Creating execution plan...');
        
        const planId = createPlan(plan);
        setActivePlan(planId);
        setCanvasOpen(true);
        
        addNotification({
          type: 'success',
          title: ' Plan Created',
          message: 'Check the canvas to review your execution plan!',
          autoHide: true,
          duration: 4000,
        });
      }

    } catch (err: any) {
      console.error(' Streaming error:', err);
      
      // Update message with error
      useIDEStore.setState(state => ({
        messages: state.messages.map(m =>
          m.id === streamingMessageId 
            ? { 
                ...m, 
                content: 'Sorry, an error occurred. Please try again.',
                isStreaming: false,
                status: undefined
              }
            : m
        )
      }));

      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to get response. Please try again.',
        autoHide: true,
        duration: 3000
      });
    } finally {
      setIsThinking(false);
    }
  }, [sessionId, files, addMessage, setIsThinking, createPlan, setActivePlan, setCanvasOpen, addNotification]);

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