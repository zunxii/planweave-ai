import { create } from 'zustand';
import type { 
  Message, 
  PlanNode, 
  FileItem,
  ExecutionPlan,
  PlanPhase,
  PlanStep,
  CodeChange,
  CanvasState,
  PanelConfig,
  Notification,
  StepActionPayload,
  CanvasView
} from '@/types/planweave';

interface IDEState {
  files: FileItem[];
  currentFilePath: string;
  setFiles: (files: FileItem[]) => void;
  setCurrentFilePath: (path: string) => void;
  updateFileContent: (path: string, content: string) => void;
  addFile: (file: FileItem) => void;
  deleteFile: (path: string) => void;
  renameFile: (oldPath: string, newPath: string) => void;

  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;

  planNodes: PlanNode[];
  setPlanNodes: (nodes: PlanNode[]) => void;
  toggleNodeExpansion: (nodeId: string) => void;
  showFlowchart: boolean;
  setShowFlowchart: (show: boolean) => void;

  isThinking: boolean;
  setIsThinking: (thinking: boolean) => void;

  canvas: CanvasState;
  setCanvasOpen: (isOpen: boolean) => void;
  setCanvasView: (view: CanvasView) => void;
  toggleCanvas: () => void;
  
  executionPlans: ExecutionPlan[];
  activePlanId: string | null;
  
  createPlan: (plan: Omit<ExecutionPlan, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updatePlan: (planId: string, updates: Partial<ExecutionPlan>) => void;
  deletePlan: (planId: string) => void;
  setActivePlan: (planId: string | null) => void;
  getActivePlan: () => ExecutionPlan | null;
  
  addPhase: (planId: string, phase: Omit<PlanPhase, 'id' | 'planId'>) => void;
  updatePhase: (phaseId: string, updates: Partial<PlanPhase>) => void;
  deletePhase: (phaseId: string) => void;
  togglePhaseExpansion: (phaseId: string) => void;
  
  addStep: (phaseId: string, step: Omit<PlanStep, 'id' | 'phaseId'>) => void;
  updateStep: (stepId: string, updates: Partial<PlanStep>) => void;
  updateStepStatus: (stepId: string, status: PlanStep['status']) => void;
  deleteStep: (stepId: string) => void;
  toggleStepExpansion: (stepId: string) => void;
  
  handleStepAction: (payload: StepActionPayload) => void;
  applyCodeChanges: (stepId: string) => void;
  
  addCodeChange: (stepId: string, change: Omit<CodeChange, 'id' | 'stepId'>) => void;
  markCodeChangeApplied: (changeId: string) => void;
  
  calculatePlanProgress: (planId: string) => number;
  
  panels: PanelConfig[];
  updatePanel: (panelId: string, updates: Partial<PanelConfig>) => void;
  togglePanel: (panelId: string) => void;
  
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useIDEStore = create<IDEState>((set, get) => ({
  files: [],
  currentFilePath: '',

  setFiles: (files) => set({ files }),
  setCurrentFilePath: (path) => set({ currentFilePath: path }),
  
  updateFileContent: (path, content) => {
    const updated = get().files.map(f => f.path === path ? { ...f, content } : f);
    set({ files: updated });
  },
  
  addFile: (file) => {
    const updated = [...get().files, file];
    set({ files: updated, currentFilePath: file.path });
  },
  
  deleteFile: (path) => {
    const updated = get().files.filter(f => f.path !== path);
    const newCurrent = get().currentFilePath === path ? updated[0]?.path || '' : get().currentFilePath;
    set({ files: updated, currentFilePath: newCurrent });
  },
  
  renameFile: (oldPath, newPath) => {
    const updated = get().files.map(f =>
      f.path === oldPath
        ? { ...f, path: newPath, name: newPath.split('/').pop() || newPath }
        : f
    );
    set({
      files: updated,
      currentFilePath: get().currentFilePath === oldPath ? newPath : get().currentFilePath
    });
  },

  messages: [],
  addMessage: (message) => set({ messages: [...get().messages, message] }),
  clearMessages: () => set({ messages: [] }),

  planNodes: [],
  setPlanNodes: (nodes) => set({ planNodes: nodes }),
  toggleNodeExpansion: (nodeId) => set({
    planNodes: get().planNodes.map(node =>
      node.id === nodeId ? { ...node, expanded: !node.expanded } : node
    )
  }),

  showFlowchart: false,
  setShowFlowchart: (show) => set({ showFlowchart: show }),

  isThinking: false,
  setIsThinking: (thinking) => set({ isThinking: thinking }),

  canvas: {
    isOpen: false,
    view: 'timeline',
    activePlanId: null,
    selectedPhaseId: null,
    selectedStepId: null,
    showCodePreviews: true,
    autoAdvance: false,
    splitView: false,
  },

  setCanvasOpen: (isOpen) => set({ canvas: { ...get().canvas, isOpen } }),
  setCanvasView: (view) => set({ canvas: { ...get().canvas, view } }),
  toggleCanvas: () => set({ canvas: { ...get().canvas, isOpen: !get().canvas.isOpen } }),

  executionPlans: [],
  activePlanId: null,

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
      canvas: { ...get().canvas, isOpen: true, activePlanId: id }
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
    set({ 
      activePlanId: planId,
      canvas: { ...get().canvas, activePlanId: planId }
    });
  },

  getActivePlan: () => {
    const { activePlanId, executionPlans } = get();
    return executionPlans.find(p => p.id === activePlanId) || null;
  },

  addPhase: (planId, phaseData) => {
    const id = `phase-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newPhase: PlanPhase = {
      ...phaseData,
      id,
      planId,
      expanded: true,
    };

    set({
      executionPlans: get().executionPlans.map(plan =>
        plan.id === planId
          ? { ...plan, phases: [...plan.phases, newPhase], updatedAt: new Date() }
          : plan
      )
    });
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

  deletePhase: (phaseId) => {
    set({
      executionPlans: get().executionPlans.map(plan => ({
        ...plan,
        phases: plan.phases.filter(p => p.id !== phaseId),
        updatedAt: new Date()
      }))
    });
  },

  togglePhaseExpansion: (phaseId) => {
    get().updatePhase(phaseId, { 
      expanded: !get().executionPlans
        .flatMap(p => p.phases)
        .find(ph => ph.id === phaseId)?.expanded 
    });
  },

  addStep: (phaseId, stepData) => {
    const id = `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newStep: PlanStep = {
      ...stepData,
      id,
      phaseId,
      expanded: false,
    };

    set({
      executionPlans: get().executionPlans.map(plan => ({
        ...plan,
        phases: plan.phases.map(phase =>
          phase.id === phaseId
            ? { ...phase, steps: [...phase.steps, newStep] }
            : phase
        ),
        updatedAt: new Date()
      }))
    });
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

  deleteStep: (stepId) => {
    set({
      executionPlans: get().executionPlans.map(plan => ({
        ...plan,
        phases: plan.phases.map(phase => ({
          ...phase,
          steps: phase.steps.filter(s => s.id !== stepId)
        })),
        updatedAt: new Date()
      }))
    });
  },

  toggleStepExpansion: (stepId) => {
    const currentStep = get().executionPlans
      .flatMap(p => p.phases)
      .flatMap(ph => ph.steps)
      .find(s => s.id === stepId);
    
    get().updateStep(stepId, { expanded: !currentStep?.expanded });
  },

  handleStepAction: (payload) => {
    const { stepId, action, data } = payload;
    
    switch (action) {
      case 'apply':
        get().applyCodeChanges(stepId);
        get().updateStepStatus(stepId, 'completed');
        break;
      case 'skip':
        get().updateStepStatus(stepId, 'skipped');
        break;
      case 'retry':
        get().updateStepStatus(stepId, 'in-progress');
        break;
      case 'expand':
        get().toggleStepExpansion(stepId);
        break;
      case 'collapse':
        get().toggleStepExpansion(stepId);
        break;
    }
  },

  applyCodeChanges: (stepId) => {
    const step = get().executionPlans
      .flatMap(p => p.phases)
      .flatMap(ph => ph.steps)
      .find(s => s.id === stepId);

    if (!step?.codeChanges) return;

    step.codeChanges.forEach(change => {
      if (change.changeType === 'create' && change.content) {
        get().addFile({
          name: change.file.split('/').pop() || change.file,
          path: change.file,
          content: change.content,
          language: change.language
        });
      } else if (change.changeType === 'modify' && change.after) {
        get().updateFileContent(change.file, change.after);
      } else if (change.changeType === 'delete') {
        get().deleteFile(change.file);
      }
      
      get().markCodeChangeApplied(change.id);
    });

    get().addNotification({
      type: 'success',
      title: 'Changes Applied',
      message: `Applied changes for: ${step.label}`,
      autoHide: true,
      duration: 3000
    });
  },

  addCodeChange: (stepId, changeData) => {
    const id = `change-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newChange: CodeChange = {
      ...changeData,
      id,
      stepId,
      applied: false,
    };

    set({
      executionPlans: get().executionPlans.map(plan => ({
        ...plan,
        phases: plan.phases.map(phase => ({
          ...phase,
          steps: phase.steps.map(step =>
            step.id === stepId
              ? { ...step, codeChanges: [...(step.codeChanges || []), newChange] }
              : step
          )
        }))
      }))
    });
  },

  markCodeChangeApplied: (changeId) => {
    set({
      executionPlans: get().executionPlans.map(plan => ({
        ...plan,
        phases: plan.phases.map(phase => ({
          ...phase,
          steps: phase.steps.map(step => ({
            ...step,
            codeChanges: step.codeChanges?.map(change =>
              change.id === changeId
                ? { ...change, applied: true, appliedAt: new Date() }
                : change
            )
          }))
        }))
      }))
    });
  },

  calculatePlanProgress: (planId) => {
    const plan = get().executionPlans.find(p => p.id === planId);
    if (!plan) return 0;

    const allSteps = plan.phases.flatMap(phase => phase.steps);
    if (allSteps.length === 0) return 0;

    const completedSteps = allSteps.filter(
      step => step.status === 'completed' || step.status === 'skipped'
    ).length;

    return Math.round((completedSteps / allSteps.length) * 100);
  },

  panels: [
    { id: 'chat', type: 'chat', position: 'left', size: 480, isVisible: true, isCollapsed: false },
    { id: 'canvas', type: 'canvas', position: 'right', size: 600, isVisible: false, isCollapsed: false },
    { id: 'code', type: 'code', position: 'right', size: 0, isVisible: true, isCollapsed: false },
  ],

  updatePanel: (panelId, updates) => {
    set({
      panels: get().panels.map(panel =>
        panel.id === panelId ? { ...panel, ...updates } : panel
      )
    });
  },

  togglePanel: (panelId) => {
    set({
      panels: get().panels.map(panel =>
        panel.id === panelId
          ? { ...panel, isVisible: !panel.isVisible }
          : panel
      )
    });
  },

  notifications: [],

  addNotification: (notificationData) => {
    const id = `notif-${Date.now()}`;
    const notification: Notification = {
      ...notificationData,
      id,
      timestamp: new Date(),
    };

    set({ notifications: [...get().notifications, notification] });

    if (notification.autoHide) {
      setTimeout(() => {
        get().removeNotification(id);
      }, notification.duration || 5000);
    }
  },

  removeNotification: (id) => {
    set({ notifications: get().notifications.filter(n => n.id !== id) });
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },
}));
