import { useState, useCallback } from 'react';
import type { PlanNode, Message } from '@/types/planweave';

export function usePlanGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePlan = useCallback(async (messages: Message[]): Promise<PlanNode[]> => {
    setIsGenerating(true);
    
    // Simulate AI plan generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return mock plan structure
    const nodes: PlanNode[] = [
      {
        id: 'start',
        type: 'start',
        label: 'Start',
        x: 0,
        y: 0,
        children: ['phase-1']
      },
      // Add more nodes based on conversation context
    ];

    setIsGenerating(false);
    return nodes;
  }, []);

  return { generatePlan, isGenerating };
}