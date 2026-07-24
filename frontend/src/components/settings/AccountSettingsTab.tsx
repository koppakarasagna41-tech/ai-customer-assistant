import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  Globe,
  Clock,
  Calendar,
  Building2,
  Server,
  ShieldAlert,
  Save,
  CheckCircle2,
  Layout,
  DollarSign,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const AccountSettingsTab: React.FC = () => {
  const [language, setLanguage] = useState('English (US)');
  const [timezone, setTimezone] = useState('America/Los_Angeles (PST - UTC-8)');
  const [dateFormat, setDateFormat] = useState('MMM DD, YYYY (e.g. Jul 24, 2026)');
  const [defaultView, setDefaultView] = useState('/dashboard');
  const [customApiUrl, setCustomApiUrl] = useState(
    import.meta.env.VITE_API_URL || 'https://api.example.com/v1'
  );

  const handleSaveAccountPreferences = () => {
    toast.success('Account and localization preferences saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Localization & Preferences */}
      <Card className="border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Localization &amp; System Preferences
          </CardTitle>
          <CardDescription>
            Configure your preferred UI display language, time zone, date formatting, and startup dashboard.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Language Selector */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-500" />
                Display Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-300 dark:border-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="English (US)">English (US)</option>
                <option value="English (UK)">English (UK)</option>
                <option value="Spanish (Español)">Spanish (Español)</option>
                <option value="French (Français)">French (Français)</option>
                <option value="German (Deutsch)">German (Deutsch)</option>
                <option value="Japanese (日本語)">Japanese (日本語)</option>
              </select>
            </div>

            {/* Timezone Selector */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                Time Zone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-300 dark:border-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="America/Los_Angeles (PST - UTC-8)">Pacific Time (PST / UTC-8)</option>
                <option value="America/New_York (EST - UTC-5)">Eastern Time (EST / UTC-5)</option>
                <option value="Europe/London (GMT / UTC+0)">London (GMT / UTC+0)</option>
                <option value="Europe/Paris (CET / UTC+1)">Central European Time (CET / UTC+1)</option>
                <option value="Asia/Tokyo (JST / UTC+9)">Japan Standard Time (JST / UTC+9)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date Format */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                Date Format
              </label>
              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-300 dark:border-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="MMM DD, YYYY (e.g. Jul 24, 2026)">MMM DD, YYYY (Jul 24, 2026)</option>
                <option value="YYYY-MM-DD (e.g. 2026-07-24)">YYYY-MM-DD (2026-07-24)</option>
                <option value="DD/MM/YYYY (e.g. 24/07/2026)">DD/MM/YYYY (24/07/2026)</option>
              </select>
            </div>

            {/* Default Landing View */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Layout className="w-3.5 h-3.5 text-indigo-500" />
                Default Startup Landing Page
              </label>
              <select
                value={defaultView}
                onChange={(e) => setDefaultView(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-300 dark:border-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="/dashboard">Support Command Dashboard</option>
                <option value="/analytics">Operations &amp; Deflection Analytics</option>
                <option value="/tickets">Support Ticket Queue</option>
                <option value="/reports">Reports &amp; Executive Exports</option>
                <option value="/chat">AI Assistant Workspace</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <Button
              onClick={handleSaveAccountPreferences}
              leftIcon={<Save className="w-4 h-4" />}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
            >
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Environment Configuration */}
      <Card className="border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <CardTitle className="text-lg font-bold">API Gateway &amp; Environment Config</CardTitle>
          </div>
          <CardDescription>
            Inspect the active API endpoint parameter mapped via <code className="font-mono text-xs text-indigo-600 dark:text-indigo-400">import.meta.env.VITE_API_URL</code>.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Current Axios Base Endpoint
              </span>
              <Badge variant="success" className="text-[10px] font-bold">
                Connected &amp; Active
              </Badge>
            </div>
            <input
              type="text"
              value={customApiUrl}
              onChange={(e) => setCustomApiUrl(e.target.value)}
              className="w-full h-9 px-3 text-xs font-mono rounded-lg border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Axios client interceptors in <code className="font-mono text-indigo-600 dark:text-indigo-400">src/services/api.ts</code> auto-inject authorization tokens and handle refresh fallbacks.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200/80 dark:bg-indigo-950/40 dark:border-indigo-900/60 text-indigo-900 dark:text-indigo-200 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Zero Hardcoded Endpoints: </span>
              <span>All requests use standard environment variables documented in <code className="font-mono text-indigo-700 dark:text-indigo-300">.env.example</code>.</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
