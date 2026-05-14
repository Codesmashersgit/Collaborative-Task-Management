import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { invitationApi } from '../lib/api';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

const JoinPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const [invitation, setInvitation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError('No invitation token provided.');
        setLoading(false);
        return;
      }
      try {
        const response = await invitationApi.get(token);
        setInvitation(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Invalid or expired invitation.');
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await invitationApi.accept({
        token,
        name: formData.name,
        password: formData.password
      });
      alert('Welcome! Your account has been created. Please sign in.');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to complete registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="w-20 h-20 rounded-[2rem] bg-rose-50 flex items-center justify-center text-rose-600 mx-auto shadow-xl shadow-rose-600/10">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-black tracking-tight">Invitation Error</h1>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">{error}</p>
        <button 
          onClick={() => navigate('/login')}
          className="btn-premium px-8 py-3 rounded-2xl w-full"
        >
          Go to Login
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 selection:bg-indigo-500/30">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[500px] relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-600/20 mb-4 transform rotate-3 transition-transform hover:rotate-0">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-black font-heading">Complete Join</h1>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Setup your profile to start collaborating</p>
        </div>

        <div className="bg-white border-2 border-gray-100 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
          <div className="flex items-center gap-4 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
             <div className="w-10 h-10 rounded-xl bg-white border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-sm">
                <Mail className="w-5 h-5" />
             </div>
             <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Invited Email</p>
                <p className="text-sm font-black text-indigo-900">{invitation?.email}</p>
             </div>
             <div className="ml-auto">
                <span className="px-3 py-1 bg-white border border-indigo-200 rounded-full text-[9px] font-black text-indigo-600 uppercase tracking-widest">
                   {invitation?.role}
                </span>
             </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Your Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 rounded-2xl py-4 pl-12 pr-4 text-black text-sm font-bold outline-none transition-all placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 rounded-2xl py-4 pl-12 pr-4 text-black text-sm font-bold outline-none transition-all placeholder:text-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 rounded-2xl py-4 pl-12 pr-4 text-black text-sm font-bold outline-none transition-all placeholder:text-gray-300"
                  />
                </div>
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
                  <span>Finishing...</span>
                </>
              ) : (
                <>
                  <span>Join Workspace</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="flex items-center justify-center gap-8 opacity-50">
           <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Secure Invite</span>
           </div>
           <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Team Verified</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default JoinPage;
