'use client';

import { Code, FileCode, Zap, Eye, TrendingUp } from 'lucide-react';

interface StepTypeIconProps {
  type: 'code' | 'file' | 'command' | 'review' | 'test';
}

export function StepTypeIcon({ type }: StepTypeIconProps) {
  const typeConfig = {
    code: { 
      icon: <Code className="w-3 h-3" />,
      bg: 'bg-[#3b82f6]/10',
      border: 'border-[#3b82f6]/30',
      text: 'text-[#3b82f6]'
    },
    file: { 
      icon: <FileCode className="w-3 h-3" />,
      bg: 'bg-[#10b981]/10',
      border: 'border-[#10b981]/30',
      text: 'text-[#10b981]'
    },
    command: { 
      icon: <Zap className="w-3 h-3" />,
      bg: 'bg-[#f59e0b]/10',
      border: 'border-[#f59e0b]/30',
      text: 'text-[#f59e0b]'
    },
    review: { 
      icon: <Eye className="w-3 h-3" />,
      bg: 'bg-[#94a3b8]/10',
      border: 'border-[#94a3b8]/30',
      text: 'text-[#94a3b8]'
    },
    test: { 
      icon: <TrendingUp className="w-3 h-3" />,
      bg: 'bg-[#06b6d4]/10',
      border: 'border-[#06b6d4]/30',
      text: 'text-[#06b6d4]'
    },
  };

  const defaultConfig = { 
    icon: <Code className="w-3 h-3" />, 
    bg: 'bg-[#3b82f6]/10', 
    border: 'border-[#3b82f6]/30', 
    text: 'text-[#3b82f6]'
  };
  const config = (type ? (typeConfig as any)[type] : undefined) || defaultConfig;

  return (
    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md ${config.bg} border ${config.border}`}>
      {config.icon}
      <span className={`text-[9px] uppercase font-bold ${config.text}`}>{type || 'code'}</span>
    </div>
  );
}
