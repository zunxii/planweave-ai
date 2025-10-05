'use client';

import { useState } from 'react';
import { Play, Eye, SkipForward } from 'lucide-react';
import { StatusIcon } from './StatusIcon';
import { StepTypeIcon } from './StepTypeIcon';
import { CodeChangePreview } from './CodeChangePreview';
import { useIDEStore } from '@/store';
import type { PlanStep } from '@/types';

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
    pending: 'surface-inset border-[#1f1f28]',
    'in-progress': 'surface-card border-[#f59e0b]/30 shadow-[#f59e0b]/10',
    completed: 'surface-card border-[#10b981]/30 shadow-[#10b981]/10',
    failed: 'surface-card border-[#ef4444]/30 shadow-[#ef4444]/10',
    skipped: 'surface-inset border-[#1f1f28] opacity-60',
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
      className={`rounded-xl border ${statusColors[step.status]} smooth-transition`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start gap-3 p-3">
        <div className="flex-shrink-0 w-6 h-6 rounded-lg surface-inset border border-[#28283a] flex items-center justify-center mt-0.5">
          <span className="text-[10px] font-bold text-[#64748b]">{stepNumber}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h5 className="text-xs font-semibold text-[#e2e8f0]">{step.label}</h5>
              <StepTypeIcon type={step.type} />
            </div>
            <StatusIcon status={step.status} className="w-4 h-4" />
          </div>

          {step.description && (
            <p className="text-xs text-[#94a3b8] mb-2">{step.description}</p>
          )}

          {step.files && step.files.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {step.files.map((file, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentFilePath(file)}
                  className="text-[10px] px-2 py-1 rounded-md surface-inset border border-[#28283a] text-[#94a3b8] hover:text-[#e2e8f0] hover:border-[#3b82f6]/50 smooth-transition font-mono"
                >
                  {file}
                </button>
              ))}
            </div>
          )}

          {step.expanded && step.codeChanges && step.codeChanges.length > 0 && (
            <div className="mt-3 space-y-2 animate-slide-in">
              {step.codeChanges.map((change) => (
                <CodeChangePreview key={change.id} change={change} />
              ))}
            </div>
          )}

          {(showActions || step.status === 'in-progress') && step.status !== 'completed' && (
            <div className="flex items-center gap-2 mt-3 animate-slide-in">
              <button
                onClick={handleApply}
                className="btn-3d flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-b from-[#10b981] to-[#059669] text-white text-xs font-medium shadow-[#10b981]/20"
              >
                <Play className="w-3 h-3" />
                Apply
              </button>

              {step.codeChanges && step.codeChanges.length > 0 && (
                <button
                  onClick={() => toggleStepExpansion(step.id)}
                  className="btn-3d flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#18181f] hover:bg-[#1a1a22] text-[#94a3b8] text-xs font-medium border border-[#28283a]"
                >
                  <Eye className="w-3 h-3" />
                  {step.expanded ? 'Hide' : 'Preview'}
                </button>
              )}

              <button
                onClick={() => updateStepStatus(step.id, 'skipped')}
                className="btn-3d flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#18181f] hover:bg-[#1a1a22] text-[#64748b] text-xs font-medium border border-[#28283a]"
              >
                <SkipForward className="w-3 h-3" />
                Skip
              </button>
            </div>
          )}

          {step.status === 'completed' && step.completedAt && (
            <div className="flex items-center gap-1.5 mt-2 text-[10px] text-[#10b981]">
              <StatusIcon status="completed" className="w-3 h-3" />
              <span>Completed {step.completedAt.toLocaleTimeString()}</span>
            </div>
          )}

          {step.status === 'failed' && step.error && (
            <div className="flex items-center gap-1.5 mt-2 text-[10px] text-[#ef4444]">
              <StatusIcon status="failed" className="w-3 h-3" />
              <span>{step.error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}