import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Mail, ArrowLeft, Send, CheckCircle2, AlertCircle } from 'lucide-react';

import { authService } from '../../services/api';
import { forgotPasswordSchema, ForgotPasswordFormData } from '../../utils/validators';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';

export const ForgotPasswordPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setServerError(null);
    try {
      await authService.forgotPassword(data);
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
      toast.success('Password reset instructions sent!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to send reset link. Please check email address.';
      setServerError(msg);
      toast.error(msg);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="w-full shadow-xl border-slate-200/80 dark:border-slate-800">
        <CardHeader className="text-center space-y-2 pb-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Reset Email Sent</CardTitle>
          <CardDescription className="text-xs">
            We sent instructions to <span className="font-semibold text-slate-900 dark:text-slate-100">{submittedEmail}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="text-xs text-slate-600 dark:text-slate-400 text-center space-y-3">
          <p>
            Please check your inbox. Click the link in the email to reset your password. If you don&apos;t see it, check your spam folder.
          </p>
          <Button
            variant="outline"
            className="w-full mt-2"
            onClick={() => setIsSubmitted(false)}
          >
            Resend Email
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-slate-100 dark:border-slate-800 pt-4">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-xl border-slate-200/80 dark:border-slate-800">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-bold tracking-tight">Forgot Password?</CardTitle>
        <CardDescription>
          Enter your registered email address and we&apos;ll send you a link to reset your credentials.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
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

          <Button
            type="submit"
            className="w-full mt-2"
            isLoading={isSubmitting}
            rightIcon={<Send className="w-4 h-4" />}
          >
            Send Reset Instructions
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-slate-100 dark:border-slate-800 pt-4 text-xs">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Sign In
        </Link>
      </CardFooter>
    </Card>
  );
};
