import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Info } from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';
import { loginSchema, LoginFormData } from '../../utils/validators';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      await login(data);
      toast.success('Authentication successful! Welcome back.');
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials or API error';
      setServerError(msg);
      toast.error(msg);
    }
  };

  return (
    <Card className="w-full shadow-xl border-slate-200/80 dark:border-slate-800">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-bold tracking-tight">Sign in to Console</CardTitle>
        <CardDescription>
          Enter your organization credentials to access the enterprise portal
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Info Banner on VITE_API_URL usage */}
        <div className="p-3.5 rounded-xl bg-indigo-50/80 border border-indigo-100 text-indigo-900 dark:bg-indigo-950/40 dark:border-indigo-900/60 dark:text-indigo-200 text-xs flex items-start gap-2.5">
          <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">API Target: </span>
            <code className="bg-indigo-100 dark:bg-indigo-900/80 px-1.5 py-0.5 rounded text-[11px] font-mono">
              {import.meta.env.VITE_API_URL || 'VITE_API_URL'}
            </code>
            <p className="mt-1 text-[11px] text-indigo-700 dark:text-indigo-300">
              Form submit triggers <code className="font-mono">authService.login()</code> via Axios instance.
            </p>
          </div>
        </div>

        {serverError && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/50 dark:border-rose-900 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email" required>
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="alex.smith@company.com"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" required>
                Password
              </Label>
              <Link
                to="/forgot-password"
                className="text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 font-medium hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              error={errors.password?.message}
              {...register('password')}
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900"
                {...register('rememberMe')}
              />
              Remember session details
            </label>
          </div>

          <Button
            type="submit"
            className="w-full mt-2"
            isLoading={isSubmitting}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col items-center justify-center border-t border-slate-100 dark:border-slate-800 pt-4 text-xs text-slate-500 dark:text-slate-400">
        <p>
          Don&apos;t have an enterprise account?{' '}
          <Link
            to="/register"
            className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 hover:underline"
          >
            Create an Account
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
