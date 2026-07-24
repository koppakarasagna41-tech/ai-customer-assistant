import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  Sun,
  Moon,
  Laptop,
  CheckCircle2,
  Palette,
  LayoutGrid,
  Sparkles,
} from 'lucide-react';

import { useTheme, Theme } from '../../hooks/useTheme';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';

export const ThemeSettingsTab: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [accentColor, setAccentColor] = useState('indigo');
  const [density, setDensity] = useState<'comfortable' | 'normal' | 'compact'>('normal');

  const accentOptions = [
    { id: 'indigo', label: 'Indigo Classic', bg: 'bg-indigo-600', ring: 'ring-indigo-500' },
    { id: 'emerald', label: 'Emerald Mint', bg: 'bg-emerald-600', ring: 'ring-emerald-500' },
    { id: 'violet', label: 'Violet Royal', bg: 'bg-violet-600', ring: 'ring-violet-500' },
    { id: 'rose', label: 'Rose Crimson', bg: 'bg-rose-600', ring: 'ring-rose-500' },
    { id: 'amber', label: 'Amber Solar', bg: 'bg-amber-600', ring: 'ring-amber-500' },
  ];

  const handleSelectAccent = (id: string) => {
    setAccentColor(id);
    toast.success(`Applied ${id.toUpperCase()} brand accent theme!`);
  };

  const handleSelectDensity = (d: 'comfortable' | 'normal' | 'compact') => {
    setDensity(d);
    toast.success(`Updated UI layout density to ${d}!`);
  };

  return (
    <div className="space-y-6">
      {/* Light / Dark Mode Card */}
      <Card className="border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-500" />
            Appearance &amp; Dark Mode Switcher
          </CardTitle>
          <CardDescription>
            Choose your preferred theme mode or mirror system dark mode preference.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                id: 'light',
                label: 'Light Mode',
                description: 'High contrast clean light canvas',
                icon: Sun,
              },
              {
                id: 'dark',
                label: 'Dark Mode',
                description: 'Eye-safe slate dark interface',
                icon: Moon,
              },
              {
                id: 'system',
                label: 'System Sync',
                description: 'Automated OS color theme match',
                icon: Laptop,
              },
            ].map((t) => {
              const Icon = t.icon;
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as Theme)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between text-left gap-3 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/60 text-indigo-950 dark:border-indigo-500 dark:bg-indigo-950/60 dark:text-indigo-100 font-bold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold">
                      <Icon className="w-4 h-4" />
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-xs font-bold">{t.label}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                      {t.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Brand Accent Palette */}
      <Card className="border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Palette className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Brand Accent Palette
          </CardTitle>
          <CardDescription>
            Select a custom brand accent color for buttons, badges, and focus rings across the platform.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {accentOptions.map((opt) => {
              const isSelected = accentColor === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectAccent(opt.id)}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-slate-800 dark:border-slate-100 bg-slate-50 dark:bg-slate-800/80 ring-2 ring-indigo-500'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className={`h-6 w-6 rounded-full ${opt.bg} shadow-md flex items-center justify-center text-white`}>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Interface Density */}
      <Card className="border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            UI Spacing &amp; Layout Density
          </CardTitle>
          <CardDescription>
            Adjust table row padding and component spacing for high-density monitoring or spacious reading.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'compact', label: 'Compact', desc: 'Dense tables & tight spacing for fast triage' },
              { id: 'normal', label: 'Normal Standard', desc: 'Balanced padding and standard line heights' },
              { id: 'comfortable', label: 'Comfortable', desc: 'Spacious padding & relaxed line heights' },
            ].map((d) => {
              const isSelected = density === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => handleSelectDensity(d.id as any)}
                  className={`p-3.5 rounded-xl border text-left space-y-1 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/60 dark:border-indigo-500 dark:bg-indigo-950/60 font-bold'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                    <span>{d.label}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    {d.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
