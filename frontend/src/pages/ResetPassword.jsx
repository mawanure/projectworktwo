import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    // Simulate reset completion
    setSuccess(true);
    toast.success('Your password has been reset successfully!');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50/50 px-6 py-12">
      <div className="w-full max-w-md bg-white border border-gray-100 p-8 rounded-2xl shadow-xl shadow-gray-100/50">
        {success ? (
          <div className="text-center py-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600 mb-6 scale-110">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold font-spartan text-dark">Password Updated</h2>
            <p className="text-sm text-gray-500 mt-2">
              Your password has been successfully updated. You can now use your new password to sign in.
            </p>
            <Link
              to="/login"
              className="mt-8 w-full h-12 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl flex items-center justify-center transition-colors cursor-pointer shadow-lg shadow-primary/10"
            >
              Sign In
            </Link>
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold font-spartan text-dark">Reset Password</h2>
              <p className="text-sm text-gray-400 mt-2">
                Choose a new secure password for your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-450 uppercase tracking-wider mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none text-sm focus:ring-1 focus:ring-primary focus:border-primary bg-gray-50"
                    placeholder="••••••••"
                    required
                  />
                  <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-450 uppercase tracking-wider mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none text-sm focus:ring-1 focus:ring-primary focus:border-primary bg-gray-50"
                    placeholder="••••••••"
                    required
                  />
                  <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-400" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-lg shadow-primary/10"
              >
                <ShieldCheck className="h-4.5 w-4.5" />
                <span>Save New Password</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
