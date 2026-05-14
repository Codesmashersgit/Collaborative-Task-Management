import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { adminApi } from '../../lib/api';
import { 
  X, 
  UserPlus, 
  Mail, 
  User, 
  Shield, 
  Loader2, 
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

const inviteSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['ADMIN', 'MEMBER']),
});

type InviteFormData = z.infer<typeof inviteSchema>;

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      role: 'MEMBER',
    },
  });

  const onSubmit = async (data: InviteFormData) => {
    try {
      await adminApi.inviteUser(data);
      onSuccess();
      reset();
      onClose();
      alert(`Invitation sent to ${data.email} successfully!`);
    } catch (error) {
      console.error('Failed to invite member:', error);
      alert('Failed to invite member. Email might already be in use.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-start justify-center p-4 pt-32 overflow-y-auto custom-scrollbar selection:bg-indigo-500/30">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-300"
        onClick={onClose} 
      />

      <div className="relative w-full max-w-xl bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-600/10">
              <UserPlus className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-black tracking-tight">Invite New Member</h2>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Expand your workspace team</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 rounded-xl text-gray-400 hover:text-black hover:bg-gray-100 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                {...register('name')}
                placeholder="Enter member's full name"
                className={`w-full bg-white border-2 ${errors.name ? 'border-rose-100' : 'border-gray-100 focus:border-indigo-600'} rounded-2xl py-4 pl-12 pr-4 text-black text-sm focus:outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all font-bold placeholder:text-gray-300 shadow-sm`}
              />
            </div>
            {errors.name && <p className="text-rose-500 text-[10px] font-black ml-1">{errors.name.message}</p>}
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                {...register('email')}
                type="email"
                placeholder="name@company.com"
                className={`w-full bg-white border-2 ${errors.email ? 'border-rose-100' : 'border-gray-100 focus:border-indigo-600'} rounded-2xl py-4 pl-12 pr-4 text-black text-sm focus:outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all font-bold placeholder:text-gray-300 shadow-sm`}
              />
            </div>
            {errors.email && <p className="text-rose-500 text-[10px] font-black ml-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Access Role</label>
            <div className="grid grid-cols-2 gap-4">
              {(['ADMIN', 'MEMBER'] as const).map((role) => (
                <label key={role} className="cursor-pointer group">
                  <input
                    type="radio"
                    value={role}
                    {...register('role')}
                    className="hidden peer"
                  />
                  <div className="p-4 rounded-2xl border-2 border-gray-100 peer-checked:border-indigo-600 peer-checked:bg-indigo-50/30 transition-all text-center">
                    <Shield className={`w-6 h-6 mx-auto mb-2 ${role === 'ADMIN' ? 'text-rose-500' : 'text-indigo-600'}`} />
                    <p className="text-[10px] font-black uppercase tracking-widest text-black">{role}</p>
                    <p className="text-[9px] text-gray-400 mt-1 font-bold">
                      {role === 'ADMIN' ? 'Full Access' : 'Standard Access'}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-start gap-4">
            <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-0.5" />
            <div>
               <p className="text-[11px] font-bold text-indigo-900 leading-tight">
                  A secure invitation link will be sent to the member.
               </p>
               <p className="text-[10px] text-indigo-700/70 mt-1 font-medium">
                  They will be able to set their own password and complete their profile upon joining.
               </p>
            </div>
          </div>

          <div className="pt-8 flex items-center justify-end gap-6">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 rounded-2xl text-gray-500 hover:text-black hover:bg-gray-100 transition-all text-xs font-black uppercase tracking-widest"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-premium px-10 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 h-14 min-w-[200px] shadow-xl shadow-indigo-600/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send Invitation
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteMemberModal;
