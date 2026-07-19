import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    // Simulate sending password reset email
    setSent(true);
    toast.success('Reset link dispatched to your email.');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50/50 px-6 py-12">
      <div className="w-full max-w-md bg-white border border-gray-100 p-8 rounded-2xl shadow-xl shadow-gray-100/50">
        <Link to="/login" className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gray-400 hover:text-primary transition-colors mb-6">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Sign In</span>
        </Link>

        {sent ? (
          <div className="text-center py-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600 mb-6 scale-110">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold font-spartan text-dark">Check Your Email</h2>
            <p className="text-sm text-gray-500 mt-3 leading-relaxed">
              We've dispatched a password reset link to <strong className="text-dark">{email}</strong>. 
              Please click the link in that email to reset your credentials.
            </p>
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold font-spartan text-dark">Forgot Password</h2>
              <p className="text-sm text-gray-400 mt-2">
                No worries! Input your email, and we'll send a password recovery link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-450 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none text-sm focus:ring-1 focus:ring-primary focus:border-primary bg-gray-50"
                    placeholder="example@gmail.com"
                    required
                  />
                  <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-400" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-lg shadow-primary/10"
              >
                <Send className="h-4.5 w-4.5" />
                <span>Send Reset Link</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
