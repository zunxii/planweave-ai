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
  const getColorClass = () => {
    switch (variant) {
      case 'phase':
        return 'from-violet-600 to-indigo-600';
      case 'step':
        return 'from-emerald-500 to-emerald-600';
      default:
        return 'from-violet-600 to-indigo-600';
    }
  };

  return (
    <div className="space-y-2">
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-500">Progress</span>
          <span className="text-zinc-300 font-medium">{progress}%</span>
        </div>
      )}
      
      <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${getColorClass()} transition-all duration-500 ease-out`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
