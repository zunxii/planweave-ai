'use client';

import { ZoomIn, ZoomOut, Maximize2, Minimize2, RotateCcw, Maximize } from 'lucide-react';

interface FlowchartControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToView: () => void;
  onResetViewport: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}

export function FlowchartControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onFitToView,
  onResetViewport,
  onToggleFullscreen,
  isFullscreen,
}: FlowchartControlsProps) {
  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
      {/* Zoom display */}
      <div className="surface-card rounded-lg px-3 py-2 border border-[#1f1f28]">
        <span className="text-xs font-mono text-[#e2e8f0]">
          {Math.round(zoom * 100)}%
        </span>
      </div>

      {/* Control buttons */}
      <div className="surface-card rounded-lg border border-[#1f1f28] overflow-hidden">
        <button
          onClick={onZoomIn}
          disabled={zoom >= 2.0}
          className="w-full px-3 py-2 hover:bg-[#1a1a22] smooth-transition border-b border-[#1f1f28] disabled:opacity-50 disabled:cursor-not-allowed"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4 text-[#94a3b8] mx-auto" />
        </button>
        
        <button
          onClick={onZoomOut}
          disabled={zoom <= 0.5}
          className="w-full px-3 py-2 hover:bg-[#1a1a22] smooth-transition border-b border-[#1f1f28] disabled:opacity-50 disabled:cursor-not-allowed"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4 text-[#94a3b8] mx-auto" />
        </button>
        
        <button
          onClick={onFitToView}
          className="w-full px-3 py-2 hover:bg-[#1a1a22] smooth-transition border-b border-[#1f1f28]"
          title="Fit to View"
        >
          <Maximize className="w-4 h-4 text-[#94a3b8] mx-auto" />
        </button>
        
        <button
          onClick={onResetViewport}
          className="w-full px-3 py-2 hover:bg-[#1a1a22] smooth-transition border-b border-[#1f1f28]"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4 text-[#94a3b8] mx-auto" />
        </button>
        
        <button
          onClick={onToggleFullscreen}
          className="w-full px-3 py-2 hover:bg-[#1a1a22] smooth-transition"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4 text-[#94a3b8] mx-auto" />
          ) : (
            <Maximize2 className="w-4 h-4 text-[#94a3b8] mx-auto" />
          )}
        </button>
      </div>

      {/* Legend */}
      <div className="surface-card rounded-lg p-3 border border-[#1f1f28]">
        <div className="text-[10px] font-semibold text-[#e2e8f0] mb-2">Legend</div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gradient-to-br from-[#3b82f6] to-[#2563eb]" />
            <span className="text-[9px] text-[#94a3b8]">Phase</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded surface-card border border-[#1f1f28]" />
            <span className="text-[9px] text-[#94a3b8]">Step</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-[#3b82f6]" />
            <span className="text-[9px] text-[#94a3b8]">Flow</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 border-t-2 border-dashed border-[#3b82f6]" />
            <span className="text-[9px] text-[#94a3b8]">Dependency</span>
          </div>
        </div>
      </div>
    </div>
  );
}