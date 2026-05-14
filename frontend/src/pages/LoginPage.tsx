import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, ArrowRight, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 selection:bg-indigo-500/30">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[420px] relative z-10 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-600/20 mb-4 transform -rotate-3 transition-transform hover:rotate-0">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-black font-heading">Welcome Back</h1>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Access your workspace</p>
        </div>

        <div className="bg-white border-2 border-gray-100 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
          {error && (
            <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 rounded-2xl py-4 pl-12 pr-4 text-black text-sm font-bold outline-none transition-all placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Password</label>
                <button type="button" className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest transition-colors">Forgot?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 rounded-2xl py-4 pl-12 pr-4 text-black text-sm font-bold outline-none transition-all placeholder:text-gray-300"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-premium py-4 rounded-2xl mt-6 font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-600/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="pt-8 text-center border-t border-gray-100">
            <p className="text-gray-400 text-sm font-bold">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-indigo-600 font-black hover:text-indigo-700 transition-colors ml-1 uppercase tracking-widest">
                Create one
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-300 text-[10px] uppercase tracking-[0.3em] font-black">Secure Industrial Standard</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
