'use client';

import { useState } from 'react';
import { X, Copy, Play, Check, Download, Maximize2, Minimize2 } from 'lucide-react';
import { useIDEStore } from '@/store';

export function FinalPlanModal() {
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const isOpen = useIDEStore(state => state.isFinalPlanModalOpen);
  const doc = useIDEStore(state => state.finalPlanDoc);
  const setOpen = useIDEStore(state => state.setFinalPlanModalOpen);
  const addNotification = useIDEStore(state => state.addNotification);

  const handleCopy = async () => {
    if (!doc) return;
    
    try {
      await navigator.clipboard.writeText(doc);
      setCopied(true);
      
      addNotification({
        type: 'success',
        title: 'Plan Copied',
        message: 'Agent execution plan copied to clipboard',
        autoHide: true,
        duration: 2000
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Copy Failed',
        message: 'Could not copy to clipboard',
        autoHide: true,
        duration: 2000
      });
    }
  };

  const handleDownload = () => {
    if (!doc) return;
    
    const blob = new Blob([doc], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `execution-plan-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    addNotification({
      type: 'success',
      title: 'Plan Downloaded',
      message: 'Execution plan saved as markdown file',
      autoHide: true,
      duration: 2000
    });
  };

  const handleExecute = () => {
    addNotification({
      type: 'info',
      title: 'Coming Soon',
      message: 'Agent execution will be available in the next update',
      autoHide: true,
      duration: 3000
    });
  };

  const handleClose = () => {
    setOpen(false);
    setIsFullscreen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center animate-slide-in">
      <div 
        className={`surface-panel border border-[#1f1f28] rounded-xl overflow-hidden shadow-2xl smooth-transition ${
          isFullscreen 
            ? 'w-screen h-screen' 
            : 'w-[90vw] h-[90vh] max-w-6xl'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1f1f28] surface-elevated">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center shadow-lg">
              <Check className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#f8fafc]">
                Agent Execution Plan
              </h2>
              <p className="text-xs text-[#64748b]">
                Ready for coding agent integration
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Action Buttons */}
            <button
              onClick={handleCopy}
              className="btn-3d flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg bg-[#18181f] hover:bg-[#1a1a22] text-[#e2e8f0] border border-[#28283a] smooth-transition"
              title="Copy to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#10b981]" />
                  <span className="text-[#10b981]">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="btn-3d flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg bg-[#18181f] hover:bg-[#1a1a22] text-[#e2e8f0] border border-[#28283a]"
              title="Download as markdown"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>

            <button
              onClick={handleExecute}
              className="btn-3d flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg bg-gradient-to-b from-[#10b981] to-[#059669] text-white accent-glow"
              title="Execute with coding agent"
            >
              <Play className="w-3.5 h-3.5" />
              Execute
            </button>

            <div className="w-px h-6 bg-[#28283a]" />

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="btn-3d p-2 rounded-lg bg-[#18181f] hover:bg-[#1a1a22] text-[#94a3b8] border border-[#28283a]"
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={handleClose}
              className="btn-3d p-2 rounded-lg bg-[#0f0f14] hover:bg-[#101018] text-[#94a3b8] border border-[#1f2937]"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-60px)] overflow-auto p-6 bg-[#0a0a0f]">
          <div className="max-w-4xl mx-auto">
            <pre className="text-sm text-[#cbd5e1] whitespace-pre-wrap font-mono leading-relaxed">
              {doc}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}