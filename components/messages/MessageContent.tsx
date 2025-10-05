'use client';

interface MessageContentProps {
  content: string;
  isUser: boolean;
}

export function MessageContent({ content, isUser }: MessageContentProps) {
  return (
    <div className={`text-sm whitespace-pre-wrap ${
      isUser ? 'text-zinc-200' : 'text-zinc-300'
    }`}>
      {renderMessageContent(content)}
    </div>
  );
}

function renderMessageContent(content: string) {
  const parts = content.split(/(```[\s\S]*?```)/g);
  
  return parts.map((part, idx) => {
    if (part.startsWith('```')) return null;

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
