import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  User as UserIcon,
  Mail,
  Building2,
  Briefcase,
  Phone,
  FileText,
  Camera,
  Save,
  Trash2,
  CheckCircle,
} from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { profileUpdateSchema, ProfileUpdateFormData } from '../../utils/validators';

export const ProfileSettingsTab: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl || null);
  const [bio, setBio] = useState('Senior Technical Support Lead managing high-priority enterprise SLA escalations.');
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 234-5678');
  const [jobTitle, setJobTitle] = useState('Support Engineering Lead');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: user?.name || 'Alex Smith',
      email: user?.email || 'alex.smith@company.com',
      department: user?.department || 'Engineering Support',
      avatarUrl: user?.avatarUrl || '',
    },
  });

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        toast.success('Avatar image updated preview!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    toast.info('Avatar removed. Using default monogram.');
  };

  const onSubmit = async (data: ProfileUpdateFormData) => {
    try {
      updateUser({
        ...data,
        avatarUrl: avatarPreview || '',
      });
      toast.success('Profile details updated successfully!');
    } catch {
      toast.error('Failed to update profile.');
    }
  };

  return (
    <Card className="border-slate-200/80 dark:border-slate-800 shadow-2xs">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Personal Profile Information
        </CardTitle>
        <CardDescription>
          Update your public display name, avatar photo, role title, and contact details.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <div className="relative group">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="User Avatar"
                className="h-20 w-20 rounded-full object-cover border-2 border-indigo-500 shadow-md"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AS'}
              </div>
            )}

            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 p-1.5 rounded-full bg-indigo-600 text-white shadow-md hover:bg-indigo-500 cursor-pointer transition-transform group-hover:scale-110"
              title="Upload new avatar"
            >
              <Camera className="w-3.5 h-3.5" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarFileChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-1 text-center sm:text-left flex-1">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Profile Photo
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              PNG, JPG or WebP. Maximum file size 2MB.
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
              <label htmlFor="avatar-upload">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900 text-xs font-bold hover:bg-indigo-100 cursor-pointer transition-colors">
                  Upload Photo
                </span>
              </label>

              {avatarPreview && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-xs font-bold hover:bg-rose-100 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Details Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="name" required>
                Full Name
              </Label>
              <Input
                id="name"
                leftIcon={<UserIcon className="w-4 h-4" />}
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
                leftIcon={<Mail className="w-4 h-4" />}
                error={errors.email?.message}
                {...register('email')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                leftIcon={<Briefcase className="w-4 h-4" />}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                leftIcon={<Building2 className="w-4 h-4" />}
                error={errors.department?.message}
                {...register('department')}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              leftIcon={<Phone className="w-4 h-4" />}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="bio">Professional Bio</Label>
            <textarea
              id="bio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-800 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Brief summary of your responsibilities..."
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <Button
              type="submit"
              isLoading={isSubmitting}
              leftIcon={<Save className="w-4 h-4" />}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
            >
              Save Profile Details
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
