import React from 'react';
import { Moon, Sun, Laptop } from 'lucide-react';
import { useTheme, Theme } from '../../hooks/useTheme';
import { Button } from './Button';

export const ThemeToggle: React.FC<{ showLabel?: boolean }> = ({ showLabel = false }) => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const cycleTheme = () => {
    const options: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = options.indexOf(theme);
    const nextTheme = options[(currentIndex + 1) % options.length];
    setTheme(nextTheme);
  };

  const getIcon = () => {
    if (theme === 'system') return <Laptop className="w-4 h-4 text-slate-600 dark:text-slate-300" />;
    return resolvedTheme === 'dark' ? (
      <Moon className="w-4 h-4 text-indigo-400" />
    ) : (
      <Sun className="w-4 h-4 text-amber-500" />
    );
  };

  const getLabel = () => {
    if (theme === 'system') return 'System';
    return theme === 'dark' ? 'Dark' : 'Light';
  };

  return (
    <Button
      variant="ghost"
      size={showLabel ? 'sm' : 'icon'}
      onClick={cycleTheme}
      title={`Current theme: ${theme}. Click to switch.`}
      className="relative transition-all duration-200"
    >
      {getIcon()}
      {showLabel && <span className="ml-2 capitalize text-xs font-medium">{getLabel()}</span>}
    </Button>
  );
};
