'use client';

import { Bot, User } from 'lucide-react';

interface MessageAvatarProps {
  role: 'user' | 'assistant';
}

export function MessageAvatar({ role }: MessageAvatarProps) {
  const isUser = role === 'user';
  
  return (
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
      isUser 
        ? 'surface-card' 
        : 'bg-gradient-to-br from-[#3b82f6] to-[#2563eb] shadow-lg shadow-[#3b82f6]/30'
    }`}>
      {isUser ? (
        <User className="w-4 h-4 text-[#94a3b8]" />
      ) : (
        <Bot className="w-4 h-4 text-white" />
      )}
    </div>
  );
}