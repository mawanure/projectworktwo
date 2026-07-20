import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Lock, Phone, UserPlus, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required').max(20),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await registerUser(data.name, data.email, data.phone, data.password);
      toast.success('Registration successful! Please sign in.');
      navigate('/login');
    } catch (err) {
      setServerError(err.message || 'Registration failed. Email may already be in use.');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-gray-50/50 px-6 py-12">
      <div className="w-full max-w-md bg-white border border-gray-100 p-8 rounded-2xl shadow-xl shadow-gray-100/50">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold font-spartan text-dark">Sign Up</h2>
          <p className="text-sm text-gray-400 mt-2">Create your account to start shopping.</p>
        </div>

        {serverError && (
          <div className="flex items-center space-x-2 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm mb-6">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span className="font-medium">{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-gray-450 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                {...register('name')}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none text-sm transition-all focus:ring-1 focus:ring-primary ${
                  errors.name ? 'border-red-300 bg-red-50/20' : 'border-gray-200 focus:border-primary bg-gray-50'
                }`}
                placeholder="John Doe"
              />
              <User className="absolute left-3.5 top-3 h-4.5 w-4.5 text-gray-400" />
            </div>
            {errors.name && (
              <p className="text-xs text-red-500 font-semibold mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-gray-450 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                {...register('email')}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none text-sm transition-all focus:ring-1 focus:ring-primary ${
                  errors.email ? 'border-red-300 bg-red-50/20' : 'border-gray-200 focus:border-primary bg-gray-50'
                }`}
                placeholder="john@example.com"
              />
              <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-400" />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 font-semibold mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-gray-450 uppercase tracking-wider mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <input
                type="text"
                {...register('phone')}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none text-sm transition-all focus:ring-1 focus:ring-primary ${
                  errors.phone ? 'border-red-300 bg-red-50/20' : 'border-gray-200 focus:border-primary bg-gray-50'
                }`}
                placeholder="018XXXXXXXX"
              />
              <Phone className="absolute left-3.5 top-3 h-4.5 w-4.5 text-gray-400" />
            </div>
            {errors.phone && (
              <p className="text-xs text-red-500 font-semibold mt-1">{errors.phone.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-gray-450 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                {...register('password')}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none text-sm transition-all focus:ring-1 focus:ring-primary ${
                  errors.password ? 'border-red-300 bg-red-50/20' : 'border-gray-200 focus:border-primary bg-gray-50'
                }`}
                placeholder="••••••••"
              />
              <Lock className="absolute left-3.5 top-3 h-4.5 w-4.5 text-gray-400" />
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 font-semibold mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-gray-450 uppercase tracking-wider mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                {...register('confirmPassword')}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none text-sm transition-all focus:ring-1 focus:ring-primary ${
                  errors.confirmPassword ? 'border-red-300 bg-red-50/20' : 'border-gray-200 focus:border-primary bg-gray-50'
                }`}
                placeholder="••••••••"
              />
              <Lock className="absolute left-3.5 top-3 h-4.5 w-4.5 text-gray-400" />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 font-semibold mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-lg shadow-primary/10 disabled:bg-gray-200 disabled:cursor-not-allowed pt-1"
          >
            <UserPlus className="h-5 w-5" />
            <span>{isSubmitting ? 'Creating Account...' : 'Sign Up'}</span>
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="font-bold text-primary hover:text-primary-hover transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
