import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import apiClient from '../api/apiClient';
import { User, Mail, Phone, MapPin, Lock, Save, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be between 6 and 50 characters').max(50),
  confirmPassword: z.string().min(6, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Profile = () => {
  const { user } = useAuth();
  const [passwordError, setPasswordError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmitPassword = async (data) => {
    setPasswordError('');
    try {
      // Endpoint is PUT /api/auth/password as checked in AuthController
      await apiClient.put('/api/auth/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password updated successfully!');
      reset();
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password. Verify your current password.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
      <h1 className="text-3xl font-bold font-spartan text-dark mb-10 tracking-wide">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Attributes Card */}
        <div className="lg:col-span-1 bg-white border border-gray-100 p-6 md:p-8 rounded-2xl shadow-sm self-start space-y-6">
          <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100">
            <div className="h-24 w-24 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-3xl mb-4 select-none">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold font-spartan text-dark">{user?.name}</h2>
            <p className="text-xs text-gray-400 font-bold uppercase mt-1 tracking-wider">{user?.role}</p>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex items-start space-x-3">
              <Mail className="h-4.5 w-4.5 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-0.5">Email Address</h5>
                <p className="text-gray-600 font-sans">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="h-4.5 w-4.5 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-0.5">Phone Number</h5>
                <p className="text-gray-600 font-sans">{user?.phone || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="h-4.5 w-4.5 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-0.5">Delivery Address</h5>
                <p className="text-gray-600 leading-relaxed font-sans">{user?.address || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Form Card */}
        <div className="lg:col-span-2 bg-white border border-gray-100 p-6 md:p-8 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold font-spartan text-dark mb-6 flex items-center space-x-2">
            <Lock className="h-5 w-5 text-primary" />
            <span>Update Password</span>
          </h2>

          {passwordError && (
            <div className="flex items-center space-x-2 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm mb-6">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span className="font-medium">{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-5 max-w-lg">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-bold text-gray-450 uppercase tracking-wider mb-2">
                Current Password
              </label>
              <input
                type="password"
                {...register('currentPassword')}
                className={`w-full px-4 py-2.5 border rounded-xl outline-none text-sm focus:ring-1 focus:ring-primary ${
                  errors.currentPassword ? 'border-red-300 bg-red-50/20' : 'border-gray-200 focus:border-primary bg-gray-50'
                }`}
                placeholder="Enter current password"
              />
              {errors.currentPassword && (
                <p className="text-xs text-red-500 font-semibold mt-1">{errors.currentPassword.message}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-gray-450 uppercase tracking-wider mb-2">
                New Password
              </label>
              <input
                type="password"
                {...register('newPassword')}
                className={`w-full px-4 py-2.5 border rounded-xl outline-none text-sm focus:ring-1 focus:ring-primary ${
                  errors.newPassword ? 'border-red-300 bg-red-50/20' : 'border-gray-200 focus:border-primary bg-gray-50'
                }`}
                placeholder="Minimum 6 characters"
              />
              {errors.newPassword && (
                <p className="text-xs text-red-500 font-semibold mt-1">{errors.newPassword.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-gray-450 uppercase tracking-wider mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                {...register('confirmPassword')}
                className={`w-full px-4 py-2.5 border rounded-xl outline-none text-sm focus:ring-1 focus:ring-primary ${
                  errors.confirmPassword ? 'border-red-300 bg-red-50/20' : 'border-gray-200 focus:border-primary bg-gray-50'
                }`}
                placeholder="Confirm new password"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 font-semibold mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary-hover text-white font-semibold h-11 px-6 rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-lg shadow-primary/10 disabled:bg-gray-200 disabled:cursor-not-allowed"
            >
              <Save className="h-4.5 w-4.5" />
              <span>{isSubmitting ? 'Updating...' : 'Update Password'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
