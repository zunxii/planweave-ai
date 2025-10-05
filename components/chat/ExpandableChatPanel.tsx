'use client';

import { ChatHeader } from './ChatHeader';
import { ChatInput } from './ChatInput';
import { ChatMessageList } from './ChatMessageList';
import { CanvasContent } from '@/components/canvas';
import { useIDEStore } from '@/store';

interface ExpandableChatPanelProps {
  onSendMessage: (content: string) => void;
}

export function ExpandableChatPanel({ onSendMessage }: ExpandableChatPanelProps) {
  const messages = useIDEStore(state => state.messages);
  const isThinking = useIDEStore(state => state.isThinking);
  const canvas = useIDEStore(state => state.canvas);
  const toggleCanvas = useIDEStore(state => state.toggleCanvas);
  const activePlan = useIDEStore(state => state.getActivePlan());

  const panelWidth = canvas.isOpen ? '45%' : '400px';
  const minWidth = canvas.isOpen ? '700px' : '400px';
  const maxWidth = canvas.isOpen ? '55%' : '400px';

  return (
    <div 
      className="flex-shrink-0 surface-panel border-r flex flex-col smooth-transition"
      style={{ width: panelWidth, minWidth, maxWidth }}
    >
      {canvas.isOpen && activePlan && (
        <div 
          className="border-b border-[#1f1f28] animate-slide-in overflow-hidden relative" 
          style={{ height: '55%' }}
        >
          <div className="absolute top-0 left-0 right-0 h-8 gradient-overlay-top pointer-events-none z-10" />
          <CanvasContent plan={activePlan} />
        </div>
      )}

      <div className={`flex flex-col smooth-transition ${canvas.isOpen ? 'h-[45%]' : 'h-full'}`}>
        <ChatHeader 
          showCanvas={canvas.isOpen}
          onToggleCanvas={toggleCanvas}
          hasActivePlan={!!activePlan}
        />
        
        <ChatMessageList 
          messages={messages}
          isThinking={isThinking}
        />
        
        <ChatInput 
          onSendMessage={onSendMessage}
          disabled={isThinking}
        />
      </div>
    </div>
  );
}