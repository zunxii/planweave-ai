import { useIDEStore } from '@/store';

export function usePlanActions() {
  const createPlan = useIDEStore(state => state.createPlan);
  const updatePlan = useIDEStore(state => state.updatePlan);
  const deletePlan = useIDEStore(state => state.deletePlan);
  const setActivePlan = useIDEStore(state => state.setActivePlan);
  const getActivePlan = useIDEStore(state => state.getActivePlan);
  const calculatePlanProgress = useIDEStore(state => state.calculatePlanProgress);

  return {
    createPlan,
    updatePlan,
    deletePlan,
    setActivePlan,
    getActivePlan,
    calculatePlanProgress,
  };
}
