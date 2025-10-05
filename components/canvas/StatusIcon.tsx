'use client';

import { Circle, Loader2, CheckCircle2, AlertCircle, Pause, SkipForward } from 'lucide-react';
import type { PlanStatus, PhaseStatus, StepStatus } from '@/types';

interface StatusIconProps {
  status: PlanStatus | PhaseStatus | StepStatus;
  className?: string;
}

export function StatusIcon({ status, className = 'w-4 h-4' }: StatusIconProps) {
  const statusConfig = {
    draft: { Icon: Circle, color: 'text-[#64748b]', animate: false },
    pending: { Icon: Circle, color: 'text-[#64748b]', animate: false },
    active: { Icon: Loader2, color: 'text-[#f59e0b]', animate: true },
    'in-progress': { Icon: Loader2, color: 'text-[#f59e0b]', animate: true },
    completed: { Icon: CheckCircle2, color: 'text-[#10b981]', animate: false },
    failed: { Icon: AlertCircle, color: 'text-[#ef4444]', animate: false },
    paused: { Icon: Pause, color: 'text-[#94a3b8]', animate: false },
    skipped: { Icon: SkipForward, color: 'text-[#64748b]', animate: false },
  };

  const config = statusConfig[status as keyof typeof statusConfig];
  if (!config) return null;

  const { Icon, color, animate } = config;

  return (
    <Icon 
      className={`${color} ${className} ${animate ? 'animate-spin' : ''}`}
    />
  );
}
