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

  const panelWidth = canvas.isOpen ? '45%' : '480px';
  const minWidth = canvas.isOpen ? '700px' : '480px';
  const maxWidth = canvas.isOpen ? '55%' : '480px';

  return (
    <div 
      className="flex-shrink-0 glass-panel border-r flex flex-col transition-all duration-300 ease-out"
      style={{ width: panelWidth, minWidth, maxWidth }}
    >
      {canvas.isOpen && activePlan && (
        <div className="border-b border-zinc-800/50 animate-in slide-in-from-top duration-300" style={{ height: '55%' }}>
          <CanvasContent plan={activePlan} />
        </div>
      )}

      <div className={`flex flex-col transition-all duration-300 ${canvas.isOpen ? 'h-[45%]' : 'h-full'}`}>
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
