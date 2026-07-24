import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  ShieldCheck,
  Key,
  Shield,
  Eye,
  EyeOff,
  Smartphone,
  CheckCircle,
  Copy,
  QrCode,
  Laptop,
  Globe,
  Trash2,
  LogOut,
  Save,
  Lock,
} from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';
import { changePasswordSchema, ChangePasswordFormData } from '../../utils/validators';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const SecuritySettingsTab: React.FC = () => {
  const { logout } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 2FA state
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showBackupCodesModal, setShowBackupCodesModal] = useState(false);

  // Active Sessions state
  const [sessions, setSessions] = useState([
    {
      id: 'sess-1',
      device: 'MacBook Pro 16" (Chrome 126)',
      ip: '192.168.1.104',
      location: 'San Francisco, CA, USA',
      lastActive: 'Active Now (Current Session)',
      isCurrent: true,
      icon: Laptop,
    },
    {
      id: 'sess-2',
      device: 'iPhone 15 Pro (AI Support App)',
      ip: '172.56.21.98',
      location: 'San Jose, CA, USA',
      lastActive: '2 hours ago',
      isCurrent: false,
      icon: Smartphone,
    },
    {
      id: 'sess-3',
      device: 'Windows Workstation (Firefox 127)',
      ip: '10.0.4.12',
      location: 'Austin, TX, USA',
      lastActive: 'Yesterday at 4:15 PM',
      isCurrent: false,
      icon: Globe,
    },
  ]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const newPasswordVal = watch('newPassword') || '';

  // Calculate password strength rating (0 to 100)
  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };

  const strengthScore = getPasswordStrength(newPasswordVal);

  const onChangePassword = async (data: ChangePasswordFormData) => {
    try {
      toast.success('Password credentials updated successfully!');
      reset();
    } catch {
      toast.error('Failed to change password.');
    }
  };

  const handleRevokeSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    toast.success('Revoked login session!');
  };

  const handleRevokeAllOtherSessions = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    toast.success('Terminated all other active sessions across devices!');
  };

  const copyBackupCodes = () => {
    navigator.clipboard.writeText('8F92-K10A\n3B74-M98L\n1C23-P55Q\n99ZZ-R12S');
    toast.success('Copied backup recovery codes to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Password Change Form */}
      <Card className="border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Password &amp; Authentication Credentials
          </CardTitle>
          <CardDescription>
            Ensure your account is using a strong, unique password with at least 8 characters.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onChangePassword)} className="space-y-4">
            {/* Current Password */}
            <div className="space-y-1">
              <Label htmlFor="currentPassword" required>
                Current Password
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  leftIcon={<Lock className="w-4 h-4" />}
                  error={errors.currentPassword?.message}
                  {...register('currentPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1">
              <Label htmlFor="newPassword" required>
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  leftIcon={<Key className="w-4 h-4" />}
                  error={errors.newPassword?.message}
                  {...register('newPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Bar */}
              {newPasswordVal.length > 0 && (
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Strength Indicator:</span>
                    <span
                      className={`font-bold ${
                        strengthScore <= 25
                          ? 'text-rose-500'
                          : strengthScore <= 50
                          ? 'text-amber-500'
                          : strengthScore <= 75
                          ? 'text-blue-500'
                          : 'text-emerald-500'
                      }`}
                    >
                      {strengthScore <= 25
                        ? 'Weak'
                        : strengthScore <= 50
                        ? 'Fair'
                        : strengthScore <= 75
                        ? 'Good'
                        : 'Strong'}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strengthScore <= 25
                          ? 'bg-rose-500'
                          : strengthScore <= 50
                          ? 'bg-amber-500'
                          : strengthScore <= 75
                          ? 'bg-blue-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${strengthScore}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1">
              <Label htmlFor="confirmNewPassword" required>
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmNewPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  leftIcon={<CheckCircle className="w-4 h-4" />}
                  error={errors.confirmNewPassword?.message}
                  {...register('confirmNewPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                isLoading={isSubmitting}
                leftIcon={<Save className="w-4 h-4" />}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
              >
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication (2FA) Card */}
      <Card className="border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <div>
                <CardTitle className="text-lg font-bold">Two-Factor Authentication (2FA)</CardTitle>
                <CardDescription>
                  Add an extra layer of protection using TOTP authenticator apps (Google Authenticator, 1Password, Authy).
                </CardDescription>
              </div>
            </div>

            <Badge variant={is2FAEnabled ? 'success' : 'secondary'} className="font-bold">
              {is2FAEnabled ? '2FA Enabled' : '2FA Disabled'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
                Authenticator App (TOTP)
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Generate time-based single use verification codes during sign-in.
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShow2FAModal(true)}
                leftIcon={<QrCode className="w-3.5 h-3.5 text-indigo-500" />}
                className="text-xs font-bold"
              >
                View QR Code
              </Button>

              <Button
                size="sm"
                variant="secondary"
                onClick={() => setShowBackupCodesModal(true)}
                leftIcon={<Copy className="w-3.5 h-3.5 text-slate-500" />}
                className="text-xs font-bold"
              >
                Backup Codes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Login Sessions */}
      <Card className="border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Laptop className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Active Login Sessions &amp; Devices
              </CardTitle>
              <CardDescription>
                Review all active browser sessions currently authenticated with your account.
              </CardDescription>
            </div>

            {sessions.length > 1 && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleRevokeAllOtherSessions}
                leftIcon={<LogOut className="w-3.5 h-3.5 text-rose-500" />}
                className="text-xs font-bold border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300"
              >
                Revoke All Others
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {sessions.map((sess) => {
            const Icon = sess.icon;
            return (
              <div
                key={sess.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 font-bold">
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {sess.device}
                      </span>
                      {sess.isCurrent && (
                        <Badge variant="success" className="text-[9px] px-1.5 py-0 font-bold">
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      IP: {sess.ip} • {sess.location} • {sess.lastActive}
                    </div>
                  </div>
                </div>

                {!sess.isCurrent && (
                  <button
                    onClick={() => handleRevokeSession(sess.id)}
                    className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
                    title="Revoke session"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* 2FA QR Code Modal Simulator */}
      {show2FAModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 text-center">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center justify-center gap-2">
              <QrCode className="w-5 h-5 text-indigo-500" />
              Two-Factor Authenticator Setup
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Scan this QR code with Google Authenticator, 1Password, or Authy to configure your device.
            </p>

            <div className="h-44 w-44 mx-auto rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-indigo-500/40 p-3 flex flex-col items-center justify-center space-y-2 shadow-inner">
              <QrCode className="w-24 h-24 text-slate-800 dark:text-slate-200" />
              <span className="text-[10px] font-mono font-bold text-slate-500">
                KEY: JBSWY3DPEHPK3PXP
              </span>
            </div>

            <Button
              onClick={() => setShow2FAModal(false)}
              className="w-full text-xs font-bold bg-indigo-600 text-white"
            >
              Done Setup
            </Button>
          </div>
        </div>
      )}

      {/* Backup Codes Modal */}
      {showBackupCodesModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Copy className="w-5 h-5 text-indigo-500" />
              2FA Recovery Backup Codes
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Keep these single-use recovery codes in a safe place. You can use them if you lose access to your authenticator app.
            </p>

            <div className="grid grid-cols-2 gap-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-mono text-xs font-bold text-slate-800 dark:text-slate-200 text-center">
              <div>8F92-K10A</div>
              <div>3B74-M98L</div>
              <div>1C23-P55Q</div>
              <div>99ZZ-R12S</div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={copyBackupCodes}
                leftIcon={<Copy className="w-3.5 h-3.5" />}
                className="flex-1 text-xs font-bold"
              >
                Copy Codes
              </Button>
              <Button
                onClick={() => setShowBackupCodesModal(false)}
                className="flex-1 text-xs font-bold bg-indigo-600 text-white"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
