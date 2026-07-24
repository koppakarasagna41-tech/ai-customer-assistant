import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { Card, CardContent } from './Card';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to load data',
  description = 'An error occurred while connecting to the API endpoint. Please verify your connection or try again.',
  onRetry,
  isRetrying = false,
}) => {
  return (
    <Card className="border-rose-200/80 bg-rose-50/40 dark:border-rose-950/60 dark:bg-rose-950/20">
      <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
        <div className="h-12 w-12 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{title}</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
            {description}
          </p>
        </div>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            isLoading={isRetrying}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            className="mt-2"
          >
            Retry Request
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
