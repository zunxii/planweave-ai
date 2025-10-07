'use client';

import { FlowchartCanvas } from './FlowchartCanvas';
import type { ExecutionPlan } from '@/types';

interface FlowchartViewProps {
  plan: ExecutionPlan;
}

export function FlowchartView({ plan }: FlowchartViewProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <FlowchartCanvas plan={plan} />
      </div>
    </div>
  );
}