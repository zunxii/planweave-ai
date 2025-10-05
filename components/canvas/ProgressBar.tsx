'use client';

interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
  variant?: 'default' | 'phase' | 'step';
}

export function ProgressBar({ 
  progress, 
  showLabel = true,
  variant = 'default' 
}: ProgressBarProps) {
  const getGradientClass = () => {
    switch (variant) {
      case 'phase':
        return 'bg-gradient-to-r from-[#3b82f6] to-[#06b6d4]';
      case 'step':
        return 'bg-gradient-to-r from-[#10b981] to-[#059669]';
      default:
        return 'bg-gradient-to-r from-[#3b82f6] to-[#06b6d4]';
    }
  };

  return (
    <div className="space-y-2">
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#94a3b8] font-medium">Progress</span>
          <span className="text-[#e2e8f0] font-semibold">{progress}%</span>
        </div>
      )}
      
      <div className="h-2 surface-inset rounded-full overflow-hidden relative">
        <div
          className={`h-full ${getGradientClass()} smooth-transition relative`}
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </div>
      </div>
    </div>
  );
}