import type { ExecutionPlan, PhaseStatus, PlanPhase, PlanStep } from '@/types';

export function calculatePlanProgress(plan: ExecutionPlan): number {
  const allSteps = plan.phases.flatMap(phase => phase.steps);
  if (allSteps.length === 0) return 0;

  const completedSteps = allSteps.filter(
    step => step.status === 'completed' || step.status === 'skipped'
  ).length;

  return Math.round((completedSteps / allSteps.length) * 100);
}

export function calculatePhaseProgress(phase: PlanPhase): number {
  if (phase.steps.length === 0) return 0;

  const completedSteps = phase.steps.filter(
    step => step.status === 'completed' || step.status === 'skipped'
  ).length;

  return Math.round((completedSteps / phase.steps.length) * 100);
}

export function updatePhaseStatus(phase: PlanPhase): PlanPhase {
  const allCompleted = phase.steps.every(s => s.status === 'completed' || s.status === 'skipped');
  const anyInProgress = phase.steps.some(s => s.status === 'in-progress');
  const anyFailed = phase.steps.some(s => s.status === 'failed');

  let status: PhaseStatus = 'pending';
  if (anyFailed) status = 'failed';
  else if (allCompleted) status = 'completed';
  else if (anyInProgress) status = 'in-progress';

  return { ...phase, status };
}

export function updatePlanStatus(plan: ExecutionPlan): ExecutionPlan {
  const allPhasesCompleted = plan.phases.every(p => p.status === 'completed');
  const anyPhaseFailed = plan.phases.some(p => p.status === 'failed');
  const anyPhaseInProgress = plan.phases.some(p => p.status === 'in-progress');

  let status: typeof plan.status = 'draft';
  if (anyPhaseFailed) status = 'failed';
  else if (allPhasesCompleted) status = 'completed';
  else if (anyPhaseInProgress) status = 'active';

  return { ...plan, status };
}

export function getMetadata(plan: ExecutionPlan) {
  const allSteps = plan.phases.flatMap(p => p.steps);
  const completedSteps = allSteps.filter(s => s.status === 'completed' || s.status === 'skipped').length;
  const filesAffected = Array.from(new Set(allSteps.flatMap(s => s.files || [])));

  return {
    totalSteps: allSteps.length,
    completedSteps,
    filesAffected,
  };
}
