import useSWR from 'swr';
import { taskApi } from '../lib/api';
import {
  CheckCircle2,
  Calendar,
  ChevronRight,
  ArrowUpRight,
  Plus,
  TrendingUp,
  Activity,
  Users,
  Clock,
  Layers,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState, useEffect } from 'react';
import { onTaskUpdate } from '../lib/socket';
import ViewTaskModal from '../components/tasks/ViewTaskModal';
import type { Task } from '../types';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: response, isLoading, mutate } = useSWR('dashboard', taskApi.getDashboard);
  const data = response?.data;
  const [activities, setActivities] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    const unsub = onTaskUpdate((event) => {
      mutate();
      const newActivity = {
        id: Date.now(),
        user: 'System',
        action: event.type === 'TASK_CREATED' ? 'created' : 
                event.type === 'TASK_UPDATED' ? 'updated' : 'deleted',
        target: event.data?.title || 'task',
        time: 'just now'
      };
      setActivities(prev => [newActivity, ...prev].slice(0, 5));
    });
    return () => { unsub(); };
  }, [mutate]);

  useEffect(() => {
    if (activities.length === 0) {
      setActivities([
        { id: 1, user: 'System', action: 'initialized', target: 'workspace', time: '12m ago' },
        { id: 2, user: 'System', action: 'synced', target: 'database', time: '4h ago' },
        { id: 3, user: 'System', action: 'verified', target: 'user session', time: '8h ago' },
      ]);
    }
  }, [activities.length]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsViewModalOpen(true);
  };

  if (isLoading) return (
    <div className="animate-pulse space-y-8 page-container">
      <div className="h-32 bg-white/5 rounded-2xl border border-white/5" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white/5 rounded-xl border border-white/5" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-96 bg-white/5 rounded-2xl border border-white/5" />
        <div className="h-96 bg-white/5 rounded-2xl border border-white/5" />
      </div>
    </div>
  );

  return (
    <div className="space-y-10 page-container selection:bg-indigo-500/30">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-main)] font-heading">
            Good morning, {user?.name?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-[var(--text-muted)] text-sm font-medium">
            Here's what's happening in your workspace today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/tasks')}
            className="btn-premium rounded-lg px-5 py-2.5"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>
      </div>

      <ViewTaskModal 
        task={selectedTask}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Tasks', value: data?.stats.totalCreated || 0, icon: Layers, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
          { label: 'Completed', value: data?.stats.totalCompleted || 0, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Assigned to You', value: data?.stats.totalAssigned || 0, icon: Target, color: 'text-amber-400', bg: 'bg-amber-400/10' },
          { label: 'Overdue', value: data?.stats.totalOverdue || 0, icon: Clock, color: 'text-rose-400', bg: 'bg-rose-400/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-500/50" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-[var(--text-main)] mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[var(--text-main)] font-heading">Recent Tasks</h3>
            <button 
              onClick={() => navigate('/tasks')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1"
            >
              View Board <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-2xl overflow-hidden shadow-sm">
            {data?.assignedTasks.length === 0 ? (
              <div className="p-20 text-center space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-muted)] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6 text-[var(--text-dim)]" />
                </div>
                <p className="text-[var(--text-muted)] text-sm font-medium">All caught up! No pending tasks.</p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--border-muted)]">
                {data?.assignedTasks.slice(0, 5).map((task) => (
                  <div 
                    key={task.id} 
                    onClick={() => handleTaskClick(task)}
                    className="p-5 flex items-center justify-between hover:bg-[var(--bg-surface)] transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${
                        task.priority === 'Urgent' ? 'bg-rose-500' :
                        task.priority === 'High' ? 'bg-amber-500' : 'bg-indigo-500'
                      }`} />
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-[var(--text-main)] group-hover:text-indigo-600 transition-colors">{task.title}</p>
                        <p className="text-xs text-[var(--text-muted)] font-medium">Due {new Date(task.dueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[var(--text-dim)] group-hover:text-[var(--text-main)] transition-all" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-[var(--text-main)] font-heading">Recent Activity</h3>
          <div className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-2xl p-6 space-y-6 shadow-sm">
            {activities.map((activity, i) => (
              <div key={activity.id} className="flex gap-4">
                <div className="relative shrink-0 mt-1">
                  <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-indigo-600' : 'bg-[var(--border-muted)]'}`} />
                  {i < activities.length - 1 && <div className="absolute left-[3.5px] top-4 w-[1px] h-10 bg-[var(--border-muted)]" />}
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-[var(--text-muted)]">
                    <span className="text-[var(--text-main)] font-bold">{activity.user}</span> {activity.action}{' '}
                    <span className="text-indigo-600">{activity.target}</span>
                  </p>
                  <p className="text-[10px] text-[var(--text-dim)] font-bold uppercase tracking-wider">{activity.time}</p>
                </div>
              </div>
            ))}
            <button className="w-full py-2.5 mt-2 bg-[var(--bg-surface)] hover:bg-[var(--border-subtle)] border border-[var(--border-muted)] rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs font-bold transition-all">
              View All Logs
            </button>
          </div>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          ...(user?.role === 'ADMIN' ? [{ label: 'Team Members', desc: 'Manage workspace access', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', link: '/team' }] : []),
          { label: 'Active Reports', desc: 'Download performance metrics', icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50', link: '/dashboard' },
          { label: 'System Settings', desc: 'Configure your environment', icon: Layers, color: 'text-zinc-600', bg: 'bg-zinc-50', link: '/dashboard' },
        ].map((item, i) => (
          <div 
            key={i} 
            onClick={() => navigate(item.link)}
            className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-xl p-6 flex items-center gap-5 cursor-pointer hover:border-indigo-600/30 transition-all group shadow-sm"
          >
            <div className={`p-3 rounded-xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
              <item.icon className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-bold text-[var(--text-main)]">{item.label}</p>
              <p className="text-xs text-[var(--text-muted)] font-medium">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;