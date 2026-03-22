import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, Sparkles, User, ArrowRight, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match. Please check and try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register(formData.email, formData.password, formData.name);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
        {/* Left Side: Branding & Perks */}
        <div className="hidden lg:block space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight font-heading">TaskFlow</h1>
          </div>

          <div className="space-y-6">
            <h2 className="text-6xl font-bold text-white leading-tight font-heading">
              Join the <br />
              <span className="text-indigo-500">elite teams.</span>
            </h2>
            <p className="text-gray-400 text-xl leading-relaxed max-w-lg">
              Experience the next generation of project management with real-time collaboration and premium analytics.
            </p>
          </div>

          <div className="space-y-4">
            {[
              "Real-time Kanban synchronization",
              "Advanced team performance metrics",
              "Secure enterprise-grade encryption",
              "24/7 Priority support access"
            ].map((text) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <span className="text-gray-300 font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Register Form */}
        <div className="glass-card p-8 md:p-12 border-white/10 shadow-2xl">
          <div className="mb-8 text-center lg:text-left">
            <h3 className="text-3xl font-bold text-white mb-2 font-heading">Get Started</h3>
            <p className="text-gray-400 font-medium">Create your professional workspace today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-widest text-[10px]">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-widest text-[10px]">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@company.com"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-widest text-[10px]">Create Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-widest text-[10px]">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-premium py-4 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-3 shadow-xl transition-all disabled:opacity-50 group mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Free Account</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400 font-medium">
              Already a member?{' '}
              <Link to="/login" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors ml-1">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
