'use client';

import { useState } from 'react';
import { Circle, CheckCircle2, AlertCircle, Loader2, SkipForward, Code, FileCode, Zap, Eye, TrendingUp, Play, MessageSquare } from 'lucide-react';
import { CodeChangePreview } from './CodeChangePreview';
import type { PlanStep } from '@/types/planweave';
import { useIDEStore } from '@/store/useIDEStore';

interface StepCardProps {
  step: PlanStep;
  stepNumber: number;
}

export function StepCard({ step, stepNumber }: StepCardProps) {
  const [showActions, setShowActions] = useState(false);
  const toggleStepExpansion = useIDEStore(state => state.toggleStepExpansion);
  const updateStepStatus = useIDEStore(state => state.updateStepStatus);
  const setCurrentFilePath = useIDEStore(state => state.setCurrentFilePath);
  const addFile = useIDEStore(state => state.addFile);
  const updateFileContent = useIDEStore(state => state.updateFileContent);
  const addNotification = useIDEStore(state => state.addNotification);

  const statusColors = {
    pending: 'bg-zinc-900/50 border-zinc-800/50',
    'in-progress': 'bg-amber-950/20 border-amber-600/20',
    completed: 'bg-emerald-950/20 border-emerald-600/20',
    failed: 'bg-red-950/20 border-red-600/20',
    skipped: 'bg-zinc-900/30 border-zinc-800/30',
  };

  const statusIcons = {
    pending: <Circle className="w-3.5 h-3.5 text-zinc-600" />,
    'in-progress': <Loader2 className="w-3.5 h-3.5 text-amber-500 animate-spin" />,
    completed: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
    failed: <AlertCircle className="w-3.5 h-3.5 text-red-500" />,
    skipped: <SkipForward className="w-3.5 h-3.5 text-zinc-600" />,
  };

  const typeIcons = {
    code: <Code className="w-3 h-3" />,
    file: <FileCode className="w-3 h-3" />,
    command: <Zap className="w-3 h-3" />,
    review: <Eye className="w-3 h-3" />,
    test: <TrendingUp className="w-3 h-3" />,
  };

  const handleApply = () => {
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

  return (
    <div 
      className={`rounded-lg border ${statusColors[step.status]} transition-all duration-200`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start gap-2 p-2.5">
        {/* Step Number */}
        <div className="flex-shrink-0 w-5 h-5 rounded bg-zinc-900/50 border border-zinc-800/50 flex items-center justify-center mt-0.5">
          <span className="text-[9px] font-medium text-zinc-500">{stepNumber}</span>
        </div>

        {/* Step Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h5 className="text-xs font-medium text-zinc-300">{step.label}</h5>
              <div className="flex items-center gap-0.5 px-1 py-0.5 rounded bg-zinc-900/50 border border-zinc-800/50">
                {typeIcons[step.type]}
                <span className="text-[9px] text-zinc-600 uppercase">{step.type}</span>
              </div>
            </div>
            {statusIcons[step.status]}
          </div>

          {step.description && (
            <p className="text-[10px] text-zinc-500 mb-1.5">{step.description}</p>
          )}

          {/* Files */}
          {step.files && step.files.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1.5">
              {step.files.map((file, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentFilePath(file)}
                  className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 border border-zinc-800/50 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 transition-colors font-mono"
                >
                  {file}
                </button>
              ))}
            </div>
          )}

          {/* Code Preview */}
          {step.expanded && step.codeChanges && step.codeChanges.length > 0 && (
            <div className="mt-2 space-y-1.5">
              {step.codeChanges.map((change) => (
                <CodeChangePreview key={change.id} change={change} />
              ))}
            </div>
          )}

          {/* Actions */}
          {(showActions || step.status === 'in-progress') && step.status !== 'completed' && (
            <div className="flex items-center gap-1.5 mt-2 animate-in fade-in">
              <button
                onClick={handleApply}
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-medium transition-colors"
              >
                <Play className="w-2.5 h-2.5" />
                Apply
              </button>

              {step.codeChanges && step.codeChanges.length > 0 && (
                <button
                  onClick={() => toggleStepExpansion(step.id)}
                  className="flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-medium transition-colors"
                >
                  <Eye className="w-2.5 h-2.5" />
                  {step.expanded ? 'Hide' : 'Preview'}
                </button>
              )}

              <button
                onClick={() => updateStepStatus(step.id, 'skipped')}
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-[10px] font-medium transition-colors"
              >
                <SkipForward className="w-2.5 h-2.5" />
                Skip
              </button>
            </div>
          )}

          {step.status === 'completed' && step.completedAt && (
            <div className="flex items-center gap-1 mt-1.5 text-[9px] text-emerald-600">
              <CheckCircle2 className="w-2.5 h-2.5" />
              <span>Completed {step.completedAt.toLocaleTimeString()}</span>
            </div>
          )}

          {step.status === 'failed' && step.error && (
            <div className="flex items-center gap-1 mt-1.5 text-[9px] text-red-500">
              <AlertCircle className="w-2.5 h-2.5" />
              <span>{step.error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}