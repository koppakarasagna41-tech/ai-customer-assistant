import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  Bell,
  Mail,
  Smartphone,
  Volume2,
  ShieldAlert,
  Ticket,
  Sparkles,
  Smile,
  Save,
  CheckCircle2,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';

export const NotificationSettingsTab: React.FC = () => {
  const [notifications, setNotifications] = useState({
    // Channel Level
    emailEnabled: true,
    pushEnabled: true,
    soundEnabled: false,

    // Specific Events
    ticketAssigned: true,
    slaBreachAlerts: true,
    csatReviews: true,
    dailyDigest: false,
    securityAlerts: true,
    aiDeflectionSummary: true,
    mentionsInNotes: true,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveNotifications = () => {
    toast.success('Notification preferences updated successfully!');
  };

  return (
    <Card className="border-slate-200/80 dark:border-slate-800 shadow-2xs">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Notification &amp; Alert Preferences
        </CardTitle>
        <CardDescription>
          Customize how and when you receive alerts for ticket escalations, SLA breaches, and system updates.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Delivery Channels */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Delivery Channels
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Email Channel */}
            <div
              onClick={() => toggleNotification('emailEnabled')}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                notifications.emailEnabled
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Email Digest
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    Send to verified email
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifications.emailEnabled}
                onChange={() => {}}
                className="h-4 w-4 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            {/* Browser Push */}
            <div
              onClick={() => toggleNotification('pushEnabled')}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                notifications.pushEnabled
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Browser Push
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    Desktop popups
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifications.pushEnabled}
                onChange={() => {}}
                className="h-4 w-4 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            {/* Audio Alerts */}
            <div
              onClick={() => toggleNotification('soundEnabled')}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                notifications.soundEnabled
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Sound Alerts
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    Chime on urgent
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifications.soundEnabled}
                onChange={() => {}}
                className="h-4 w-4 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Event Triggers */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Specific Event Triggers
          </h4>

          <div className="space-y-2">
            {[
              {
                id: 'ticketAssigned',
                title: 'Ticket Assigned to Me',
                description: 'Notify when an incoming support ticket is directly assigned to your queue.',
                icon: Ticket,
              },
              {
                id: 'slaBreachAlerts',
                title: 'SLA Warning & Response Time Breaches',
                description: 'Immediate high-priority alert when a ticket approaches or exceeds SLA response window.',
                icon: ShieldAlert,
              },
              {
                id: 'csatReviews',
                title: 'Customer CSAT Feedback & Reviews',
                description: 'Alert when a customer leaves a rating or verbatim review following ticket resolution.',
                icon: Smile,
              },
              {
                id: 'aiDeflectionSummary',
                title: 'Daily AI Deflection & Efficiency Summary',
                description: 'Receive automated daily breakdown of AI bot deflections and human agent hand-offs.',
                icon: Sparkles,
              },
              {
                id: 'securityAlerts',
                title: 'Security & New Device Logins',
                description: 'Alert when your account is accessed from a new IP address or unrecognized browser.',
                icon: Bell,
              },
            ].map((item) => {
              const Icon = item.icon;
              const isChecked = notifications[item.id as keyof typeof notifications];

              return (
                <div
                  key={item.id}
                  onClick={() => toggleNotification(item.id as keyof typeof notifications)}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                        {item.description}
                      </div>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="h-4 w-4 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer shrink-0"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <Button
            onClick={handleSaveNotifications}
            leftIcon={<Save className="w-4 h-4" />}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
          >
            Save Notification Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
