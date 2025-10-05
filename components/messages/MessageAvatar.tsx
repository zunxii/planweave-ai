'use client';

import { Sparkles, User } from 'lucide-react';

interface MessageAvatarProps {
  role: 'user' | 'assistant';
}

export function MessageAvatar({ role }: MessageAvatarProps) {
  const isUser = role === 'user';
  
  return (
    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
      isUser ? 'bg-zinc-800' : 'bg-gradient-to-br from-violet-600 to-indigo-600'
    }`}>
      {isUser ? (
        <User className="w-3.5 h-3.5 text-zinc-400" />
      ) : (
        <Sparkles className="w-3.5 h-3.5 text-white" />
      )}
    </div>
  );
}