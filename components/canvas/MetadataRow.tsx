'use client';

import { Clock, GitBranch, FileCode } from 'lucide-react';

interface MetadataItem {
  icon: 'time' | 'steps' | 'files';
  label: string;
}

interface MetadataRowProps {
  items: MetadataItem[];
}

export function MetadataRow({ items }: MetadataRowProps) {
  const iconMap = {
    time: Clock,
    steps: GitBranch,
    files: FileCode,
  };

  return (
    <div className="flex items-center gap-3 text-[10px] text-[#858585] pt-2">
      {items.map((item, idx) => {
        const Icon = iconMap[item.icon];
        return (
          <div key={idx} className="flex items-center gap-1">
            <Icon className="w-3 h-3" />
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}