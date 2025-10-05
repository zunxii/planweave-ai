import { useState, useCallback } from 'react';
import type { PlanNode, Message } from '@/types';

export function usePlanGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePlan = useCallback(async (messages: Message[]): Promise<PlanNode[]> => {
    setIsGenerating(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const nodes: PlanNode[] = [
      {
        id: 'start',
        type: 'start',
        label: 'Start',
        x: 0,
        y: 0,
        children: ['phase-1']
      },
    ];

    setIsGenerating(false);
    return nodes;
  }, []);

  return { generatePlan, isGenerating };
}