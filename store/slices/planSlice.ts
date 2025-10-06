import { StateCreator } from 'zustand';
import type { ExecutionPlan, PlanPhase, PlanStep } from '@/types';

export interface PlanSlice {
  executionPlans: ExecutionPlan[];
  activePlanId: string | null;
  finalPlanDoc: string | null;
  isFinalPlanModalOpen: boolean;
  
  createPlan: (plan: Omit<ExecutionPlan, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updatePlan: (planId: string, updates: Partial<ExecutionPlan>) => void;
  deletePlan: (planId: string) => void;
  setActivePlan: (planId: string | null) => void;
  getActivePlan: () => ExecutionPlan | null;
  calculatePlanProgress: (planId: string) => number;
  finalizeActivePlan: () => void;
  getApprovedFinalPlan: () => ExecutionPlan | null;
  canFinalize: () => boolean;
  setFinalPlanDoc: (doc: string | null) => void;
  setFinalPlanModalOpen: (open: boolean) => void;
  
  togglePhaseExpansion: (phaseId: string) => void;
  updatePhase: (phaseId: string, updates: Partial<PlanPhase>) => void;
  
  toggleStepExpansion: (stepId: string) => void;
  updateStep: (stepId: string, updates: Partial<PlanStep>) => void;
  updateStepStatus: (stepId: string, status: PlanStep['status']) => void;
}

export const createPlanSlice: StateCreator<PlanSlice> = (set, get) => ({
  executionPlans: [],
  activePlanId: null,
  finalPlanDoc: null,
  isFinalPlanModalOpen: false,

  createPlan: (planData) => {
    const id = `plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newPlan: ExecutionPlan = {
      ...planData,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: 0,
    };
    
    set({ 
      executionPlans: [...get().executionPlans, newPlan],
      activePlanId: id,
    });
    
    return id;
  },

  updatePlan: (planId, updates) => {
    set({
      executionPlans: get().executionPlans.map(plan =>
        plan.id === planId
          ? { ...plan, ...updates, updatedAt: new Date() }
          : plan
      )
    });
  },

  deletePlan: (planId) => {
    set({
      executionPlans: get().executionPlans.filter(p => p.id !== planId),
      activePlanId: get().activePlanId === planId ? null : get().activePlanId
    });
  },

  setActivePlan: (planId) => {
    set({ activePlanId: planId });
  },

  getActivePlan: () => {
    const { activePlanId, executionPlans } = get();
    return executionPlans.find(p => p.id === activePlanId) || null;
  },

  finalizeActivePlan: () => {
    const plan = get().getActivePlan();
    if (!plan) return;
    get().updatePlan(plan.id, { status: 'finalized' });
  },

  getApprovedFinalPlan: () => {
    const plan = get().getActivePlan();
    if (!plan) return null;
    const approvedPhases = plan.phases.map(phase => ({
      ...phase,
      steps: phase.steps.filter(step => step.status === 'approved')
    }));
    return { ...plan, phases: approvedPhases } as ExecutionPlan;
  },

  canFinalize: () => {
    const plan = get().getActivePlan();
    if (!plan) return false;
    const allSteps = plan.phases.flatMap(p => p.steps);
    if (allSteps.length === 0) return false;
    return allSteps.every(s => s.status === 'approved' || s.status === 'skipped');
  },

  setFinalPlanDoc: (doc) => set({ finalPlanDoc: doc }),
  setFinalPlanModalOpen: (open) => set({ isFinalPlanModalOpen: open }),

  togglePhaseExpansion: (phaseId) => {
    const phase = get().executionPlans
      .flatMap(p => p.phases)
      .find(ph => ph.id === phaseId);
    
    get().updatePhase(phaseId, { expanded: !phase?.expanded });
  },

  updatePhase: (phaseId, updates) => {
    set({
      executionPlans: get().executionPlans.map(plan => ({
        ...plan,
        phases: plan.phases.map(phase =>
          phase.id === phaseId ? { ...phase, ...updates } : phase
        ),
        updatedAt: new Date()
      }))
    });
  },

  toggleStepExpansion: (stepId) => {
    const step = get().executionPlans
      .flatMap(p => p.phases)
      .flatMap(ph => ph.steps)
      .find(s => s.id === stepId);
    
    get().updateStep(stepId, { expanded: !step?.expanded });
  },

  updateStep: (stepId, updates) => {
    set({
      executionPlans: get().executionPlans.map(plan => ({
        ...plan,
        phases: plan.phases.map(phase => ({
          ...phase,
          steps: phase.steps.map(step =>
            step.id === stepId ? { ...step, ...updates } : step
          )
        })),
        updatedAt: new Date()
      }))
    });
    
    const plan = get().getActivePlan();
    if (plan) {
      const progress = get().calculatePlanProgress(plan.id);
      get().updatePlan(plan.id, { progress });
    }
  },

  updateStepStatus: (stepId, status) => {
    get().updateStep(stepId, { 
      status,
      completedAt: status === 'completed' ? new Date() : undefined
    });
  },

  calculatePlanProgress: (planId) => {
    const plan = get().executionPlans.find(p => p.id === planId);
    if (!plan) return 0;

    const allSteps = plan.phases.flatMap(phase => phase.steps);
    if (allSteps.length === 0) return 0;

    const completedSteps = allSteps.filter(
      step => step.status === 'approved' || step.status === 'skipped'
    ).length;

    return Math.round((completedSteps / allSteps.length) * 100);
  },
});