'use client';

import { Circle, Loader2, CheckCircle2, AlertCircle, Pause, SkipForward } from 'lucide-react';
import type { PlanStatus, PhaseStatus, StepStatus } from '@/types';

interface StatusIconProps {
  status: PlanStatus | PhaseStatus | StepStatus;
  className?: string;
}

export function StatusIcon({ status, className = 'w-4 h-4' }: StatusIconProps) {
  const statusConfig = {
    draft: { Icon: Circle, color: 'text-zinc-500' },
    pending: { Icon: Circle, color: 'text-zinc-600' },
    active: { Icon: Loader2, color: 'text-amber-500', animate: true },
    'in-progress': { Icon: Loader2, color: 'text-amber-500', animate: true },
    completed: { Icon: CheckCircle2, color: 'text-emerald-500' },
    failed: { Icon: AlertCircle, color: 'text-red-500' },
    paused: { Icon: Pause, color: 'text-zinc-400' },
    skipped: { Icon: SkipForward, color: 'text-zinc-600' },
  };

  const config = statusConfig[status as keyof typeof statusConfig];
  if (!config) return null;

  const { Icon, color } = config;

  return (
    <Icon 
      className={`${color} ${className}`}
    />
  );
}
