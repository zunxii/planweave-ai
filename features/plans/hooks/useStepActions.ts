import { useIDEStore } from '@/store';
import type { PlanStep } from '@/types';

export function useStepActions() {
  const toggleStepExpansion = useIDEStore(state => state.toggleStepExpansion);
  const updateStep = useIDEStore(state => state.updateStep);
  const updateStepStatus = useIDEStore(state => state.updateStepStatus);
  const addFile = useIDEStore(state => state.addFile);
  const updateFileContent = useIDEStore(state => state.updateFileContent);
  const addNotification = useIDEStore(state => state.addNotification);

  const applyStep = (step: PlanStep) => {
    if (!step.codeChanges || step.codeChanges.length === 0) return;

    step.codeChanges.forEach(change => {
      if (change.changeType === 'create' && change.content) {
        addFile({
          name: change.file.split('/').pop() || change.file,
          path: change.file,
          content: change.content,
          language: change.language
        });
      } else if (change.changeType === 'modify' && change.after) {
        updateFileContent(change.file, change.after);
      }
    });

    updateStepStatus(step.id, 'completed');
    addNotification({
      type: 'success',
      title: 'Changes Applied',
      message: `Applied changes for: ${step.label}`,
      autoHide: true,
      duration: 3000
    });
  };

  const skipStep = (stepId: string) => {
    updateStepStatus(stepId, 'skipped');
  };

  const retryStep = (stepId: string) => {
    updateStepStatus(stepId, 'pending');
  };

  return {
    toggleStepExpansion,
    updateStep,
    updateStepStatus,
    applyStep,
    skipStep,
    retryStep,
  };
}
