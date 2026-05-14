import React from 'react';
import { 
  X, 
  Calendar, 
  User, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Timer, 
  Layers,
  ArrowRight
} from 'lucide-react';
import type { Task, Status } from '../../types';
import { taskApi } from '../../lib/api';
import { useSWRConfig } from 'swr';

interface ViewTaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_CONFIG: Record<Status, { label: string; icon: any; color: string; bg: string }> = {
  ToDo: { label: 'To Do', icon: Clock, color: 'text-gray-600', bg: 'bg-gray-100' },
  InProgress: { label: 'In Progress', icon: Timer, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  Review: { label: 'In Review', icon: Layers, color: 'text-amber-600', bg: 'bg-amber-50' },
  Completed: { label: 'Completed', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
};

const PRIORITY_CONFIG: Record<string, string> = {
  Urgent: 'bg-rose-50 text-rose-600 border-rose-100',
  High: 'bg-amber-50 text-amber-600 border-amber-100',
  Medium: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  Low: 'bg-gray-50 text-gray-600 border-gray-100',
};

const ViewTaskModal: React.FC<ViewTaskModalProps> = ({ task, isOpen, onClose }) => {
  const { mutate } = useSWRConfig();
  const [isUpdating, setIsUpdating] = React.useState(false);

  if (!isOpen || !task) return null;

  const handleStatusChange = async (newStatus: Status) => {
    if (newStatus === task.status) return;
    
    setIsUpdating(true);
    try {
      await taskApi.update(task.id, { status: newStatus });
      mutate('tasks');
      onClose();
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100">
        {/* Header */}
        <div className="p-8 pb-4 flex justify-between items-start">
          <div className="space-y-3">
             <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${PRIORITY_CONFIG[task.priority]}`}>
                  {task.priority} Priority
                </span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Ref: {task.id.slice(-8)}
                </span>
             </div>
             <h2 className="text-3xl font-black text-black leading-tight tracking-tighter">
               {task.title}
             </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-3 rounded-2xl hover:bg-gray-50 text-gray-400 hover:text-black transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 pt-4 space-y-8">
          {/* Description */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</h4>
            <div className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100">
               <p className="text-gray-700 text-sm font-medium leading-relaxed">
                 {task.description || 'No description provided for this task.'}
               </p>
            </div>
          </div>

          {/* Meta Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-50 bg-white">
               <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <User className="w-5 h-5" />
               </div>
               <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Assigned To</p>
                  <p className="text-sm font-black text-black">{task.assignedTo?.name || 'Unassigned'}</p>
               </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-50 bg-white">
               <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                  <Calendar className="w-5 h-5" />
               </div>
               <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Due Date</p>
                  <p className="text-sm font-black text-black">{new Date(task.dueDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
               </div>
            </div>
          </div>

          {/* Status Progression */}
          <div className="space-y-4">
             <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Update Progress</h4>
             <div className="flex flex-wrap gap-3">
                {(['ToDo', 'InProgress', 'Review', 'Completed'] as Status[]).map((status) => {
                  const config = STATUS_CONFIG[status];
                  const isActive = task.status === status;
                  return (
                    <button
                      key={status}
                      disabled={isUpdating}
                      onClick={() => handleStatusChange(status)}
                      className={`flex-1 min-w-[140px] flex items-center gap-3 p-4 rounded-2xl border-2 transition-all group ${
                        isActive 
                          ? `${config.bg} border-indigo-600 shadow-lg shadow-indigo-600/10` 
                          : 'bg-white border-gray-100 hover:border-indigo-200'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400 group-hover:text-indigo-600 transition-colors'}`}>
                        <config.icon className="w-4 h-4" />
                      </div>
                      <span className={`text-xs font-black uppercase tracking-wider ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-black'}`}>
                        {config.label}
                      </span>
                    </button>
                  );
                })}
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-gray-50/50 flex items-center justify-between border-t border-gray-100">
           <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <AlertCircle className="w-4 h-4" />
              Progress updates are logged in system
           </div>
           <button 
             onClick={onClose}
             className="px-8 py-3 bg-black text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-black/10"
           >
             Close Preview
           </button>
        </div>
      </div>
    </div>
  );
};

export default ViewTaskModal;
