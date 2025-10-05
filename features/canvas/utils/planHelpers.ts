import type { ExecutionPlan, PlanPhase, PlanStep } from '@/types';

export function calculateProgress(plan: ExecutionPlan): number {
  const allSteps = plan.phases.flatMap(phase => phase.steps);
  if (allSteps.length === 0) return 0;

  const completedSteps = allSteps.filter(
    step => step.status === 'completed' || step.status === 'skipped'
  ).length;

  return Math.round((completedSteps / allSteps.length) * 100);
}

export function getPhaseProgress(phase: PlanPhase): number {
  if (phase.steps.length === 0) return 0;

  const completedSteps = phase.steps.filter(
    step => step.status === 'completed' || step.status === 'skipped'
  ).length;

  return Math.round((completedSteps / phase.steps.length) * 100);
}

export function getNextStep(plan: ExecutionPlan): PlanStep | null {
  for (const phase of plan.phases) {
    const nextStep = phase.steps.find(step => step.status === 'pending');
    if (nextStep) return nextStep;
  }
  return null;
}

export function canStartPhase(phase: PlanPhase, allPhases: PlanPhase[]): boolean {
  if (!phase.dependencies || phase.dependencies.length === 0) return true;

  return phase.dependencies.every(depId => {
    const depPhase = allPhases.find(p => p.id === depId);
    return depPhase?.status === 'completed';
  });
}