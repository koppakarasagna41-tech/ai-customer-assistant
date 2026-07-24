import React from 'react';
import { cn } from '../../lib/utils';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label: React.FC<LabelProps> = ({ className, required, children, ...props }) => {
  return (
    <label
      className={cn(
        'block text-sm font-medium text-slate-700 dark:text-slate-300 select-none mb-1.5',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="ml-1 text-rose-500 font-semibold">*</span>}
    </label>
  );
};
