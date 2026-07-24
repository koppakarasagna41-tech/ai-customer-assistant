import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Mail, Lock, User, Eye, EyeOff, UserPlus, AlertCircle, Building2, CheckCircle2 } from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';
import { registerSchema, RegisterFormData } from '../../utils/validators';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';

export const RegisterPage: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      department: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
  });

  const passwordValue = watch('password', '');

  // Password requirements checklist calculation
  const hasMinLength = passwordValue.length >= 8;
  const hasUppercase = /[A-Z]/.test(passwordValue);
  const hasLowercase = /[a-z]/.test(passwordValue);
  const hasNumber = /[0-9]/.test(passwordValue);

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    try {
      await registerUser(data);
      toast.success('Account created successfully! Welcome to Nexus.');
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setServerError(msg);
      toast.error(msg);
    }
  };

  return (
    <Card className="w-full shadow-xl border-slate-200/80 dark:border-slate-800">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-bold tracking-tight">Create Enterprise Account</CardTitle>
        <CardDescription>
          Join your organization&apos;s workspace with full console permissions
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {serverError && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/50 dark:border-rose-900 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
          <div className="space-y-1">
            <Label htmlFor="name" required>
              Full Name
            </Label>
            <Input
              id="name"
              placeholder="Alex Smith"
              leftIcon={<User className="w-4 h-4" />}
              error={errors.name?.message}
              {...register('name')}
            />
          </div>

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
            <Label htmlFor="department">Department / Division</Label>
            <Input
              id="department"
              placeholder="Engineering / Product"
              leftIcon={<Building2 className="w-4 h-4" />}
              error={errors.department?.message}
              {...register('department')}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="password" required>
              Password
            </Label>
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

            {/* Password strength visual helper */}
            {passwordValue && (
              <div className="grid grid-cols-2 gap-1.5 pt-2 text-[11px] text-slate-500 dark:text-slate-400">
                <div className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-600 dark:text-emerald-400 font-medium' : ''}`}>
                  <CheckCircle2 className="w-3 h-3" /> At least 8 characters
                </div>
                <div className={`flex items-center gap-1 ${hasUppercase ? 'text-emerald-600 dark:text-emerald-400 font-medium' : ''}`}>
                  <CheckCircle2 className="w-3 h-3" /> Uppercase letter
                </div>
                <div className={`flex items-center gap-1 ${hasLowercase ? 'text-emerald-600 dark:text-emerald-400 font-medium' : ''}`}>
                  <CheckCircle2 className="w-3 h-3" /> Lowercase letter
                </div>
                <div className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-600 dark:text-emerald-400 font-medium' : ''}`}>
                  <CheckCircle2 className="w-3 h-3" /> Number included
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="confirmPassword" required>
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="p-1 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
          </div>

          <div className="pt-1">
            <label className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 shrink-0"
                {...register('agreeToTerms')}
              />
              <span>
                I agree to the <a href="#terms" className="text-indigo-600 dark:text-indigo-400 underline">Terms of Service</a> and <a href="#privacy" className="text-indigo-600 dark:text-indigo-400 underline">Privacy Policy</a>
              </span>
            </label>
            {errors.agreeToTerms && (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                {errors.agreeToTerms.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full mt-2"
            isLoading={isSubmitting}
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Create Account
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col items-center justify-center border-t border-slate-100 dark:border-slate-800 pt-4 text-xs text-slate-500 dark:text-slate-400">
        <p>
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 hover:underline"
          >
            Sign In Instead
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
