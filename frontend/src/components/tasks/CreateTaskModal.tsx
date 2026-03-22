import { useState } from 'react';
import { useSWRConfig } from 'swr';
import { taskApi, userApi } from '../../lib/api';
import useSWR from 'swr';
import { X, Calendar, Flag, User, Type, AlignLeft, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import type { Priority, User as UserType } from '../../types';

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateTaskModal = ({ isOpen, onClose }: CreateTaskModalProps) => {
    const { mutate } = useSWRConfig();
    const { data: teamResponse } = useSWR('users', () => userApi.getAll());
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: new Date().toISOString().split('T')[0],
        priority: 'Medium' as Priority,
        assignedToId: ''
    });

    if (!isOpen) return null;

    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            // Ensure date is full ISO datetime for backend
            const taskData = {
                ...formData,
                dueDate: new Date(formData.dueDate).toISOString()
            };
            await taskApi.create(taskData);
            mutate('tasks');
            onClose();
            setFormData({
                title: '',
                description: '',
                dueDate: new Date().toISOString().split('T')[0],
                priority: 'Medium',
                assignedToId: ''
            });
        } catch (err: any) {
            console.error('Failed to create task:', err);
            setError(err.response?.data?.message || 'Failed to initialize task. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
            
            <div className="glass-card w-full max-w-xl bg-black/80 border-white/10 shadow-2xl relative z-10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[60px] pointer-events-none" />
                
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-white font-heading tracking-tight">Create New Task</h2>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-all">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-400 text-sm animate-in shake duration-500">
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black text-indigo-400 tracking-wider flex items-center gap-2 pl-1">
                                <Type className="w-3 h-3" />
                                Task Title
                            </label>
                            <input
                                required
                                type="text"
                                placeholder="What needs to be done?"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black text-indigo-400 tracking-wider flex items-center gap-2 pl-1">
                                <AlignLeft className="w-3 h-3" />
                                Description
                            </label>
                            <textarea
                                required
                                placeholder="Add some details about this task..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none min-h-[120px]"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-indigo-400 tracking-wider flex items-center gap-2 pl-1">
                                    <Calendar className="w-3 h-3" />
                                    Due Date
                                </label>
                                <input
                                    required
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all color-scheme-dark"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-indigo-400 tracking-wider flex items-center gap-2 pl-1">
                                    <Flag className="w-3 h-3" />
                                    Priority Level
                                </label>
                                <select
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none"
                                >
                                    <option value="Low" className="bg-gray-900">Low</option>
                                    <option value="Medium" className="bg-gray-900">Medium</option>
                                    <option value="High" className="bg-gray-900">High</option>
                                    <option value="Urgent" className="bg-gray-900">Urgent</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black text-indigo-400 tracking-wider flex items-center gap-2 pl-1">
                                <User className="w-3 h-3" />
                                Assignee
                            </label>
                            <select
                                required
                                value={formData.assignedToId}
                                onChange={(e) => setFormData({ ...formData, assignedToId: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none"
                            >
                                <option value="" className="bg-gray-900">Select Member</option>
                                {teamResponse?.data.map((member: UserType) => (
                                    <option key={member.id} value={member.id} className="bg-gray-900">
                                        {member.name} ({member.email})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="pt-4">
                            <button
                                disabled={isLoading}
                                className="w-full btn-premium py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-3 shadow-2xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        Initialize Task
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateTaskModal;
