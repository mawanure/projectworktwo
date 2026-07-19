import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // Calculate redirect destination
  const from = location.state?.from?.pathname || '/';

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const userData = await login(data.email, data.password);
      toast.success(`Welcome back, ${userData.name}!`);
      
      // If user is Admin, default redirect to /admin dashboard
      if (userData.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setServerError(err.message || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-gray-50/50 px-6 py-12">
      <div className="w-full max-w-md bg-white border border-gray-100 p-8 rounded-2xl shadow-xl shadow-gray-100/50">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold font-spartan text-dark">Sign In</h2>
          <p className="text-sm text-gray-400 mt-2">Welcome back! Please enter your details.</p>
        </div>

        {serverError && (
          <div className="flex items-center space-x-2 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm mb-6">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span className="font-medium">{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-gray-450 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                {...register('email')}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none text-sm transition-all focus:ring-1 focus:ring-primary ${
                  errors.email ? 'border-red-300 bg-red-50/20' : 'border-gray-200 focus:border-primary bg-gray-50'
                }`}
                placeholder="example@gmail.com"
              />
              <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-400" />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 font-semibold mt-1.5">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-gray-450 uppercase tracking-wider">
                Password
              </label>
              <Link 
                to="/forgot-password" 
                className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                {...register('password')}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none text-sm transition-all focus:ring-1 focus:ring-primary ${
                  errors.password ? 'border-red-300 bg-red-50/20' : 'border-gray-200 focus:border-primary bg-gray-50'
                }`}
                placeholder="••••••••"
              />
              <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-400" />
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 font-semibold mt-1.5">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-lg shadow-primary/10 disabled:bg-gray-200 disabled:cursor-not-allowed"
          >
            <LogIn className="h-5 w-5" />
            <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="font-bold text-primary hover:text-primary-hover transition-colors"
            >
              Sign Up For Free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
