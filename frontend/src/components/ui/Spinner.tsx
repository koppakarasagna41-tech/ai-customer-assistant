import React from 'react';
import { cn } from '../../lib/utils';

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'white' | 'subtle';
  fullScreen?: boolean;
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  fullScreen = false,
  label,
  className,
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
    xl: 'w-14 h-14 border-4',
  };

  const variantClasses = {
    primary: 'border-indigo-600 border-t-transparent dark:border-indigo-400 dark:border-t-transparent',
    white: 'border-white border-t-transparent',
    subtle: 'border-slate-400 border-t-transparent dark:border-slate-600 dark:border-t-transparent',
  };

  const spinnerContent = (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)} {...props}>
      <div
        className={cn(
          'rounded-full animate-spin',
          sizeClasses[size],
          variantClasses[variant]
        )}
        role="status"
        aria-label="Loading"
      />
      {label && <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{label}</span>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};
