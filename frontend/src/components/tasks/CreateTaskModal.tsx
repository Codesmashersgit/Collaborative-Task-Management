import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSWRConfig } from 'swr';
import { taskApi, userApi } from '../../lib/api';
import useSWR from 'swr';
import { 
  X, 
  Calendar, 
  Flag, 
  UserPlus, 
  Type, 
  AlignLeft, 
  Loader2, 
  ChevronRight,
  ClipboardList,
  ChevronDown
} from 'lucide-react';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().min(1, 'Description is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']),
  assignedToId: z.string().min(1, 'Assignee is required'),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose }) => {
  const { mutate } = useSWRConfig();
  const { data: usersResponse } = useSWR('users', () => userApi.getAll());
  const users = usersResponse?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: 'Medium',
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    try {
      await taskApi.create({
        ...data,
        dueDate: new Date(data.dueDate).toISOString(),
      });
      mutate('tasks');
      mutate('dashboard');
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-start justify-center p-4 pt-32 overflow-y-auto custom-scrollbar selection:bg-indigo-500/30">


      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-300"
        onClick={onClose} 
      />

      <div className="relative w-full max-w-xl bg-white border border-gray-100 rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/10">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-black tracking-tight">Create New Task</h2>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Define your next milestone</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 rounded-xl text-gray-400 hover:text-black hover:bg-gray-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Task Title</label>
            <div className="relative group">
              <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                {...register('title')}
                placeholder="What needs to be done?"
                className={`w-full bg-white border-2 ${errors.title ? 'border-rose-100' : 'border-gray-100 focus:border-indigo-600'} rounded-2xl py-3.5 pl-12 pr-4 text-black text-sm focus:outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all font-bold placeholder:text-gray-300 shadow-sm`}
              />
            </div>
            {errors.title && <p className="text-rose-500 text-[10px] font-black ml-1">{errors.title.message}</p>}
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Description</label>
            <div className="relative group">
              <AlignLeft className="absolute left-4 top-4 w-4.5 h-4.5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
              <textarea
                {...register('description')}
                rows={4}
                placeholder="Add more details about this task..."
                className={`w-full bg-white border-2 ${errors.description ? 'border-rose-100' : 'border-gray-100 focus:border-indigo-600'} rounded-2xl py-3.5 pl-12 pr-4 text-black text-sm focus:outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all font-bold placeholder:text-gray-300 resize-none shadow-sm`}
              />
            </div>
            {errors.description && <p className="text-rose-500 text-[10px] font-black ml-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Due Date</label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
                <input
                  type="date"
                  {...register('dueDate')}
                  className={`w-full bg-white border-2 ${errors.dueDate ? 'border-rose-100' : 'border-gray-100 focus:border-indigo-600'} rounded-2xl py-3.5 pl-12 pr-4 text-black text-sm focus:outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all font-bold shadow-sm`}
                />
              </div>
              {errors.dueDate && <p className="text-rose-500 text-[10px] font-black ml-1">{errors.dueDate.message}</p>}
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Assign To</label>
              <div className="relative group">
                <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
                <select
                  {...register('assignedToId')}
                  className={`w-full bg-white border-2 ${errors.assignedToId ? 'border-rose-100' : 'border-gray-100 focus:border-indigo-600'} rounded-2xl py-3.5 pl-12 pr-10 text-black text-sm focus:outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all font-bold appearance-none cursor-pointer shadow-sm`}
                >
                  <option value="">Select member</option>
                  {users.map((user: any) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
              </div>
              {errors.assignedToId && <p className="text-rose-500 text-[10px] font-black ml-1">{errors.assignedToId.message}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Priority Level</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(['Low', 'Medium', 'High', 'Urgent'] as const).map((level) => (
                <label key={level} className="cursor-pointer group">
                  <input
                    type="radio"
                    value={level}
                    {...register('priority')}
                    className="hidden peer"
                  />
                  <div className={`py-4 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest border-2 transition-all duration-200 peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:border-indigo-600 shadow-sm ${
                    level === 'Urgent' ? 'text-rose-600 border-rose-50 bg-rose-50/30 hover:bg-rose-50' :
                    level === 'High' ? 'text-amber-600 border-amber-50 bg-amber-50/30 hover:bg-amber-50' :
                    level === 'Medium' ? 'text-indigo-600 border-indigo-50 bg-indigo-50/30 hover:bg-indigo-50' :
                    'text-gray-500 border-gray-50 bg-gray-50/30 hover:bg-gray-50'
                  }`}>
                    {level}
                  </div>
                </label>
              ))}
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
              className="btn-premium px-10 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 h-14 min-w-[180px] shadow-xl shadow-indigo-600/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Create Task
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

export default CreateTaskModal;
