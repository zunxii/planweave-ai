'use client';

import { useState } from 'react';
import { useIDEStore } from '@/store/useIDEStore';
import {
  X,
  ChevronRight,
  ChevronDown,
  Circle,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  SkipForward,
  Code,
  FileCode,
  Edit3,
  MessageSquare,
  Zap,
  AlertCircle,
  Loader2,
  MoreVertical,
  Eye,
  GitBranch,
  Target,
  TrendingUp
} from 'lucide-react';
import type { PlanPhase, PlanStep, ExecutionPlan } from '@/types/planweave';

export function CanvasMode() {
  const canvas = useIDEStore(state => state.canvas);
  const activePlan = useIDEStore(state => state.getActivePlan());
  const setCanvasOpen = useIDEStore(state => state.setCanvasOpen);
  const togglePhaseExpansion = useIDEStore(state => state.togglePhaseExpansion);
  const toggleStepExpansion = useIDEStore(state => state.toggleStepExpansion);
  const handleStepAction = useIDEStore(state => state.handleStepAction);
  const setCurrentFilePath = useIDEStore(state => state.setCurrentFilePath);

  if (!canvas.isOpen || !activePlan) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-[800px] glass-panel border-l flex flex-col z-50 animate-in slide-in-from-right">
      <CanvasHeader plan={activePlan} onClose={() => setCanvasOpen(false)} />
      
      <div className="flex-1 overflow-y-auto">
        <CanvasContent
          plan={activePlan}
          onTogglePhase={togglePhaseExpansion}
          onToggleStep={toggleStepExpansion}
          onStepAction={handleStepAction}
          onFileSelect={setCurrentFilePath}
        />
      </div>
    </div>
  );
}

// ============================================
// Canvas Header
// ============================================
function CanvasHeader({ plan, onClose }: { plan: ExecutionPlan; onClose: () => void }) {
  const statusColors = {
    draft: 'text-zinc-500',
    active: 'text-amber-500',
    completed: 'text-emerald-500',
    failed: 'text-red-500',
    paused: 'text-zinc-400',
  };

  const statusIcons = {
    draft: Circle,
    active: Loader2,
    completed: CheckCircle2,
    failed: AlertCircle,
    paused: Pause,
  };

  const StatusIcon = statusIcons[plan.status];

  return (
    <div className="p-6 border-b border-zinc-800/50">
      {/* Top bar */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-zinc-100">{plan.title}</h2>
              <StatusIcon 
                className={`w-4 h-4 ${statusColors[plan.status]} ${
                  plan.status === 'active' ? 'animate-spin' : ''
                }`} 
              />
            </div>
            {plan.description && (
              <p className="text-sm text-zinc-500 mt-0.5">{plan.description}</p>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg hover:bg-zinc-800/50 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-zinc-400" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-400">Overall Progress</span>
          <span className="text-zinc-300 font-medium">{plan.progress}%</span>
        </div>
        
        <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-500 ease-out"
            style={{ width: `${plan.progress}%` }}
          />
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-xs text-zinc-600 pt-2">
          {plan.metadata?.estimatedTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{plan.metadata.estimatedTime}</span>
            </div>
          )}
          {plan.metadata?.totalSteps && (
            <div className="flex items-center gap-1">
              <GitBranch className="w-3.5 h-3.5" />
              <span>{plan.metadata.completedSteps || 0}/{plan.metadata.totalSteps} steps</span>
            </div>
          )}
          {plan.metadata?.filesAffected && plan.metadata.filesAffected.length > 0 && (
            <div className="flex items-center gap-1">
              <FileCode className="w-3.5 h-3.5" />
              <span>{plan.metadata.filesAffected.length} files</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Canvas Content
// ============================================
function CanvasContent({
  plan,
  onTogglePhase,
  onToggleStep,
  onStepAction,
  onFileSelect
}: {
  plan: ExecutionPlan;
  onTogglePhase: (phaseId: string) => void;
  onToggleStep: (stepId: string) => void;
  onStepAction: (payload: any) => void;
  onFileSelect: (path: string) => void;
}) {
  return (
    <div className="p-6 space-y-4">
      {plan.phases.map((phase, index) => (
        <PhaseCard
          key={phase.id}
          phase={phase}
          phaseNumber={index + 1}
          onToggle={() => onTogglePhase(phase.id)}
          onToggleStep={onToggleStep}
          onStepAction={onStepAction}
          onFileSelect={onFileSelect}
        />
      ))}
    </div>
  );
}

// ============================================
// Phase Card
// ============================================
function PhaseCard({
  phase,
  phaseNumber,
  onToggle,
  onToggleStep,
  onStepAction,
  onFileSelect
}: {
  phase: PlanPhase;
  phaseNumber: number;
  onToggle: () => void;
  onToggleStep: (stepId: string) => void;
  onStepAction: (payload: any) => void;
  onFileSelect: (path: string) => void;
}) {
  const statusColors = {
    pending: 'border-zinc-800 bg-zinc-950/50',
    'in-progress': 'border-amber-600/30 bg-amber-950/10',
    completed: 'border-emerald-600/30 bg-emerald-950/10',
    failed: 'border-red-600/30 bg-red-950/10',
  };

  const statusIcons = {
    pending: <Circle className="w-5 h-5 text-zinc-600" />,
    'in-progress': <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />,
    completed: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    failed: <AlertCircle className="w-5 h-5 text-red-500" />,
  };

  const completedSteps = phase.steps.filter(s => s.status === 'completed').length;
  const totalSteps = phase.steps.length;
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <div className={`rounded-xl border ${statusColors[phase.status]} transition-all duration-300`}>
      {/* Phase Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-start gap-4 p-4 hover:bg-zinc-900/20 transition-colors rounded-t-xl"
      >
        {/* Phase Number Badge */}
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
          <span className="text-xs font-semibold text-zinc-400">{phaseNumber}</span>
        </div>

        {/* Phase Content */}
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-zinc-200">{phase.label}</h3>
            {phase.estimatedTime && (
              <span className="text-xs text-zinc-600 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {phase.estimatedTime}
              </span>
            )}
          </div>

          {phase.description && (
            <p className="text-xs text-zinc-500 mb-2">{phase.description}</p>
          )}

          {/* Progress Bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-zinc-900 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  phase.status === 'completed' ? 'bg-emerald-500' :
                  phase.status === 'in-progress' ? 'bg-amber-500' :
                  phase.status === 'failed' ? 'bg-red-500' :
                  'bg-zinc-700'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-zinc-600 min-w-[60px] text-right">
              {completedSteps}/{totalSteps} steps
            </span>
          </div>
        </div>

        {/* Status Icon & Expand Icon */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {statusIcons[phase.status]}
          {phase.expanded ? (
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          )}
        </div>
      </button>

      {/* Phase Steps */}
      {phase.expanded && (
        <div className="border-t border-zinc-800/50 p-2 space-y-2">
          {phase.steps.map((step, index) => (
            <StepCard
              key={step.id}
              step={step}
              stepNumber={index + 1}
              onToggle={() => onToggleStep(step.id)}
              onAction={onStepAction}
              onFileSelect={onFileSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// Step Card
// ============================================
function StepCard({
  step,
  stepNumber,
  onToggle,
  onAction,
  onFileSelect
}: {
  step: PlanStep;
  stepNumber: number;
  onToggle: () => void;
  onAction: (payload: any) => void;
  onFileSelect: (path: string) => void;
}) {
  const [showActions, setShowActions] = useState(false);

  const statusColors = {
    pending: 'bg-zinc-900/50 border-zinc-800/50',
    'in-progress': 'bg-amber-950/20 border-amber-600/20',
    completed: 'bg-emerald-950/20 border-emerald-600/20',
    failed: 'bg-red-950/20 border-red-600/20',
    skipped: 'bg-zinc-900/30 border-zinc-800/30',
  };

  const statusIcons = {
    pending: <Circle className="w-4 h-4 text-zinc-600" />,
    'in-progress': <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />,
    completed: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    failed: <AlertCircle className="w-4 h-4 text-red-500" />,
    skipped: <SkipForward className="w-4 h-4 text-zinc-600" />,
  };

  const typeIcons = {
    code: <Code className="w-3.5 h-3.5" />,
    file: <FileCode className="w-3.5 h-3.5" />,
    command: <Zap className="w-3.5 h-3.5" />,
    review: <Eye className="w-3.5 h-3.5" />,
    test: <TrendingUp className="w-3.5 h-3.5" />,
  };

  return (
    <div 
      className={`rounded-lg border ${statusColors[step.status]} transition-all duration-200`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Step Header */}
      <div className="flex items-start gap-3 p-3">
        {/* Step Number */}
        <div className="flex-shrink-0 w-6 h-6 rounded-md bg-zinc-900/50 border border-zinc-800/50 flex items-center justify-center mt-0.5">
          <span className="text-[10px] font-medium text-zinc-500">{stepNumber}</span>
        </div>

        {/* Step Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium text-zinc-300">{step.label}</h4>
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-900/50 border border-zinc-800/50">
                {typeIcons[step.type]}
                <span className="text-[10px] text-zinc-600 uppercase">{step.type}</span>
              </div>
            </div>
            {statusIcons[step.status]}
          </div>

          {step.description && (
            <p className="text-xs text-zinc-500 mb-2">{step.description}</p>
          )}

          {/* Files */}
          {step.files && step.files.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {step.files.map((file, i) => (
                <button
                  key={i}
                  onClick={() => onFileSelect(file)}
                  className="text-[10px] px-2 py-1 rounded bg-black/40 border border-zinc-800/50 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 transition-colors font-mono"
                >
                  {file}
                </button>
              ))}
            </div>
          )}

          {/* Code Preview */}
          {step.expanded && step.codeChanges && step.codeChanges.length > 0 && (
            <div className="mt-3 space-y-2">
              {step.codeChanges.map((change) => (
                <CodeChangePreview key={change.id} change={change} />
              ))}
            </div>
          )}

          {/* Actions */}
          {(showActions || step.status === 'in-progress') && step.status !== 'completed' && (
            <div className="flex items-center gap-2 mt-3 animate-in fade-in">
              <button
                onClick={() => onAction({ stepId: step.id, action: 'apply' })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
              >
                <Play className="w-3 h-3" />
                Apply
              </button>

              {step.codeChanges && step.codeChanges.length > 0 && (
                <button
                  onClick={onToggle}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
                >
                  <Eye className="w-3 h-3" />
                  {step.expanded ? 'Hide' : 'Preview'}
                </button>
              )}

              <button
                onClick={() => onAction({ stepId: step.id, action: 'skip' })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs font-medium transition-colors"
              >
                <SkipForward className="w-3 h-3" />
                Skip
              </button>

              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs font-medium transition-colors"
              >
                <MessageSquare className="w-3 h-3" />
                Ask
              </button>
            </div>
          )}

          {step.status === 'completed' && step.completedAt && (
            <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-600">
              <CheckCircle2 className="w-3 h-3" />
              <span>Completed {step.completedAt.toLocaleTimeString()}</span>
            </div>
          )}

          {step.status === 'failed' && step.error && (
            <div className="flex items-center gap-1 mt-2 text-[10px] text-red-500">
              <AlertCircle className="w-3 h-3" />
              <span>{step.error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Code Change Preview
// ============================================
function CodeChangePreview({ change }: { change: any }) {
  const changeTypeColors = {
    create: 'border-emerald-600/30 bg-emerald-950/10',
    modify: 'border-amber-600/30 bg-amber-950/10',
    delete: 'border-red-600/30 bg-red-950/10',
  };

  const changeTypeLabels = {
    create: 'Create',
    modify: 'Modify',
    delete: 'Delete',
  };

  return (
    <div className={`rounded-lg border ${changeTypeColors[change.changeType]} p-3`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <FileCode className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-xs font-mono text-zinc-400">{change.file}</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900/50 text-zinc-500">
          {changeTypeLabels[change.changeType]}
        </span>
      </div>

      {change.content && (
        <pre className="text-[11px] font-mono text-zinc-400 bg-black/40 rounded p-2 overflow-x-auto">
          <code>{change.content.slice(0, 200)}{change.content.length > 200 ? '...' : ''}</code>
        </pre>
      )}

      {change.diff && (
        <pre className="text-[11px] font-mono text-zinc-400 bg-black/40 rounded p-2 overflow-x-auto">
          <code>{change.diff}</code>
        </pre>
      )}

      {change.applied && (
        <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-600">
          <CheckCircle2 className="w-3 h-3" />
          <span>Applied {change.appliedAt?.toLocaleTimeString()}</span>
        </div>
      )}
    </div>
  );
}