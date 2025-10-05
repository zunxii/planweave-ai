'use client';

import { JSX } from "react";

interface MessageContentProps {
  content: string;
  isUser: boolean;
}

export function MessageContent({ content, isUser }: MessageContentProps) {
  return (
    <div className={`markdown-content ${isUser ? 'text-[#cccccc]' : 'text-[#cccccc]'}`}>
      {renderMarkdown(content)}
    </div>
  );
}

function renderMarkdown(content: string) {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(...parseInlineMarkdown(content.slice(lastIndex, match.index)));
    }

    const language = match[1] || 'text';
    const code = match[2].trim();
    parts.push(
      <pre key={match.index} className="my-2">
        <code className="text-[13px]">{code}</code>
      </pre>
    );

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push(...parseInlineMarkdown(content.slice(lastIndex)));
  }

  return parts.length > 0 ? parts : content;
}

function parseInlineMarkdown(text: string): (string | JSX.Element)[] {
  const parts: (string | JSX.Element)[] = [];
  
  const paragraphs = text.split(/\n\n+/);
  
  paragraphs.forEach((para, paraIndex) => {
    if (!para.trim()) return;

    if (para.startsWith('### ')) {
      parts.push(
        <h3 key={`h3-${paraIndex}`} className="text-sm font-semibold text-white mb-2 mt-4 first:mt-0">
          {parseInlineElements(para.slice(4))}
        </h3>
      );
      return;
    }
    if (para.startsWith('## ')) {
      parts.push(
        <h2 key={`h2-${paraIndex}`} className="text-base font-semibold text-white mb-2 mt-4 first:mt-0">
          {parseInlineElements(para.slice(3))}
        </h2>
      );
      return;
    }
    if (para.startsWith('# ')) {
      parts.push(
        <h1 key={`h1-${paraIndex}`} className="text-lg font-semibold text-white mb-2 mt-4 first:mt-0">
          {parseInlineElements(para.slice(2))}
        </h1>
      );
      return;
    }

    const lines = para.split('\n');
    const isList = lines.every(line => line.match(/^[-*]\s/) || line.trim() === '');
    
    if (isList && lines.some(line => line.match(/^[-*]\s/))) {
      const listItems = lines
        .filter(line => line.match(/^[-*]\s/))
        .map((line, idx) => (
          <li key={`li-${paraIndex}-${idx}`}>
            {parseInlineElements(line.slice(2))}
          </li>
        ));
      
      parts.push(
        <ul key={`ul-${paraIndex}`} className="ml-4 mb-2 space-y-1 list-disc">
          {listItems}
        </ul>
      );
      return;
    }

    parts.push(
      <p key={`p-${paraIndex}`} className="mb-2 last:mb-0">
        {parseInlineElements(para)}
      </p>
    );
  });

  return parts;
}

function parseInlineElements(text: string): (string | JSX.Element)[] {
  const parts: (string | JSX.Element)[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const matched = match[0];

    // Bold
    if (matched.startsWith('**') && matched.endsWith('**')) {
      parts.push(
        <strong key={key++} className="font-semibold text-white">
          {matched.slice(2, -2)}
        </strong>
      );
    }
    // Inline code
    else if (matched.startsWith('`') && matched.endsWith('`')) {
      parts.push(
        <code key={key++} className="px-1.5 py-0.5 rounded bg-[#1e1e1e] text-[#4ec9b0] text-[13px] font-mono border border-[#3e3e42]">
          {matched.slice(1, -1)}
        </code>
      );
    }
    // Links
    else if (matched.startsWith('[')) {
      const linkMatch = matched.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        parts.push(
          <a key={key++} href={linkMatch[2]} className="text-[#007acc] hover:text-[#0098ff] underline" target="_blank" rel="noopener noreferrer">
            {linkMatch[1]}
          </a>
        );
      }
    }

    lastIndex = match.index + matched.length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}