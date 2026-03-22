import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, Sparkles, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

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
    <div className="min-h-screen bg-[#020202] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Side: Branding & Info */}
        <div className="hidden lg:block space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight font-heading">TaskFlow</h1>
          </div>

          <div className="space-y-6">
            <h2 className="text-6xl font-bold text-white leading-tight font-heading">
              Manage projects <br />
              <span className="text-indigo-500">without the mess.</span>
            </h2>
            <p className="text-gray-400 text-xl leading-relaxed max-w-lg">
              The industry standard task management platform for high-performance engineering teams.
            </p>
          </div>

          <div className="flex gap-12">
            <div>
              <p className="text-3xl font-bold text-white">99.9%</p>
              <p className="text-gray-500 text-sm font-medium mt-1 uppercase tracking-widest">Uptime</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">20k+</p>
              <p className="text-gray-500 text-sm font-medium mt-1 uppercase tracking-widest">Users</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">150+</p>
              <p className="text-gray-500 text-sm font-medium mt-1 uppercase tracking-widest">Countries</p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="glass-card p-8 md:p-12 border-white/10 shadow-2xl">
          <div className="mb-10 text-center lg:text-left">
            <h3 className="text-3xl font-bold text-white mb-3 font-heading">Welcome Back</h3>
            <p className="text-gray-400 font-medium">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 ml-1 uppercase tracking-widest">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Password</label>
                <Link to="/forgot-password" title='Coming Soon' className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">Forgot Password?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-premium py-4 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-3 shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center bg-white/5 py-4 rounded-2xl border border-white/5">
            <p className="text-gray-400 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors ml-1">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
