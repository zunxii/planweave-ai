import { useIDEStore } from '@/store';
import type { PlanStep } from '@/types';

export function useStepActions() {
  const toggleStepExpansion = useIDEStore(state => state.toggleStepExpansion);
  const updateStep = useIDEStore(state => state.updateStep);
  const updateStepStatus = useIDEStore(state => state.updateStepStatus);
  const addNotification = useIDEStore(state => state.addNotification);
  const getActivePlan = useIDEStore(state => state.getActivePlan);
  const updatePlan = useIDEStore(state => state.updatePlan);

  const approveStep = (step: PlanStep) => {
    updateStepStatus(step.id, 'approved');
    addNotification({
      type: 'success',
      title: 'Step Approved',
      message: `Approved: ${step.label}`,
      autoHide: true,
      duration: 2000
    });
  };

  const skipStep = (stepId: string) => {
    updateStepStatus(stepId, 'skipped');
  };

  const retryStep = (stepId: string) => {
    updateStepStatus(stepId, 'pending');
  };

  const editStep = async (step: PlanStep, instruction: string) => {
    try {
      const plan = getActivePlan();
      if (!plan) return;
      const res = await fetch('/api/plan/editStep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan.id, stepId: step.id, instruction })
      });
      if (!res.ok) throw new Error('Failed to edit step');
      const data = await res.json();

      // Update the target step with returned fields
      updateStep(step.id, data.step);
      // Optionally update plan metadata
      updatePlan(plan.id, data.planUpdates || {});

      addNotification({
        type: 'success',
        title: 'Step Updated',
        message: `Edited: ${step.label}`,
        autoHide: true,
        duration: 2000
      });
    } catch (e) {
      addNotification({
        type: 'error',
        title: 'Edit Failed',
        message: 'Could not update the step. Please try again.',
        autoHide: true,
        duration: 3000
      });
    }
  };

  return {
    toggleStepExpansion,
    updateStep,
    updateStepStatus,
    approveStep,
    editStep,
    skipStep,
    retryStep,
  };
}
