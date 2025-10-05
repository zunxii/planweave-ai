'use client';

import { Sparkles, User, Target, ChevronDown, Code, Zap } from 'lucide-react';
import type { Message } from '@/types/planweave';
import { useIDEStore } from '@/store/useIDEStore';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const canvas = useIDEStore(state => state.canvas);
  const toggleCanvas = useIDEStore(state => state.toggleCanvas);
  const setActivePlan = useIDEStore(state => state.setActivePlan);
  const executionPlans = useIDEStore(state => state.executionPlans);

  // Find if this message has an associated plan
  const associatedPlan = message.plan ? executionPlans.find(p => p.title === message.plan?.title) : null;

  const handleViewPlan = () => {
    if (associatedPlan) {
      setActivePlan(associatedPlan.id);
      if (!canvas.isOpen) {
        toggleCanvas();
      }
    }
  };

  return (
    <div className={`flex gap-3 animate-in ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
        isUser ? 'bg-zinc-800' : 'bg-gradient-to-br from-violet-600 to-indigo-600'
      }`}>
        {isUser ? (
          <User className="w-3.5 h-3.5 text-zinc-400" />
        ) : (
          <Sparkles className="w-3.5 h-3.5 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 ${isUser ? 'max-w-[85%]' : 'max-w-full'}`}>
        {/* Plan Indicator Badge */}
        {message.planUpdate && (
          <div className="inline-flex items-center gap-1.5 mb-2 text-xs border border-violet-600/30 bg-violet-950/20 text-violet-400 px-2.5 py-1 rounded-full">
            <Zap className="w-3 h-3" />
            Execution Plan Created
          </div>
        )}

        {/* Main Message Bubble */}
        <div className={`rounded-2xl p-3 ${
          isUser 
            ? 'bg-zinc-800/80 rounded-tr-sm ml-auto' 
            : associatedPlan
            ? 'glass-panel border border-zinc-800/50 rounded-tl-sm'
            : 'glass-subtle rounded-tl-sm'
        }`}>
          <div className={`text-sm whitespace-pre-wrap ${
            isUser ? 'text-zinc-200' : 'text-zinc-300'
          }`}>
            {renderMessageContent(message.content)}
          </div>

          {/* Code Blocks */}
          {message.codeBlocks && message.codeBlocks.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.codeBlocks.map((block, idx) => (
                <CodeBlockPreview key={idx} block={block} />
              ))}
            </div>
          )}
        </div>

        {/* Plan Card - Show if plan exists */}
        {associatedPlan && (
          <button
            onClick={handleViewPlan}
            className="mt-2 w-full glass-panel border border-zinc-800/50 rounded-lg p-3 hover:border-violet-600/30 hover:bg-violet-950/10 transition-all group text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                  <Target className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-medium text-zinc-300">
                  View Execution Plan
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-zinc-600 group-hover:text-violet-400 transition-colors ${canvas.isOpen ? 'rotate-180' : ''}`} />
            </div>

            <div className="space-y-1.5">
              <p className="text-xs text-zinc-500 line-clamp-1">{associatedPlan.title}</p>
              
              {/* Mini Progress */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-zinc-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-500"
                    style={{ width: `${associatedPlan.progress}%` }}
                  />
                </div>
                <span className="text-[10px] text-zinc-600">
                  {associatedPlan.phases.length} phases • {associatedPlan.metadata?.totalSteps || 0} steps
                </span>
              </div>
            </div>
          </button>
        )}
        
        {/* Timestamp */}
        <p className={`text-xs text-zinc-700 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}

// Helper to render message content with basic markdown
function renderMessageContent(content: string) {
  // Split by code blocks first to avoid processing them
  const parts = content.split(/(```[\s\S]*?```)/g);
  
  return parts.map((part, idx) => {
    // Skip code blocks (they're handled separately)
    if (part.startsWith('```')) {
      return null;
    }

    // Process inline code and bold text
    const processedPart = part.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((segment, segIdx) => {
      if (segment.startsWith('`') && segment.endsWith('`')) {
        return (
          <code
            key={segIdx}
            className="px-1.5 py-0.5 rounded bg-zinc-900/50 text-zinc-300 text-xs font-mono border border-zinc-800/50"
          >
            {segment.slice(1, -1)}
          </code>
        );
      }
      if (segment.startsWith('**') && segment.endsWith('**')) {
        return (
          <strong key={segIdx} className="font-semibold text-zinc-200">
            {segment.slice(2, -2)}
          </strong>
        );
      }
      return segment;
    });

    return <span key={idx}>{processedPart}</span>;
  });
}

// Code Block Preview Component
function CodeBlockPreview({ block }: { block: any }) {
  return (
    <div className="rounded-lg border border-zinc-800/50 bg-black/40 overflow-hidden">
      {block.filename && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800/50 bg-zinc-900/30">
          <Code className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-xs font-mono text-zinc-500">{block.filename}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-900/50 text-zinc-600 ml-auto">
            {block.language}
          </span>
        </div>
      )}
      <pre className="p-3 overflow-x-auto text-xs">
        <code className="text-zinc-400 font-mono">
          {block.code}
        </code>
      </pre>
    </div>
  );
}