import useSWR from 'swr';
import { taskApi } from '../lib/api';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  ChevronRight,
  ArrowUpRight,
  Plus,
  Wifi,
  Target,
  Zap,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState, useEffect } from 'react';
import { onTaskUpdate } from '../lib/socket';

const DashboardPage = () => {
  const { user } = useAuth();
  const { data: response, isLoading, mutate } = useSWR('dashboard', taskApi.getDashboard);
  const data = response?.data;
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onTaskUpdate((event) => {
      mutate();
      const newActivity = {
        id: Date.now(),
        user: 'Team Member',
        action: event.type === 'TASK_CREATED' ? 'created' : 
                event.type === 'TASK_UPDATED' ? 'updated' : 'removed',
        target: event.data?.title || 'task',
        time: 'Now'
      };
      setActivities(prev => [newActivity, ...prev].slice(0, 5));
    });
    return unsub;
  }, [mutate]);

  useEffect(() => {
    if (activities.length === 0) {
      setActivities([
        { id: 1, user: 'System', action: 'ready', target: 'Project Board', time: '2h ago' },
        { id: 2, user: 'Admin', action: 'synced', target: 'Cloud DB', time: '4h ago' },
      ]);
    }
  }, []);

  if (isLoading) return (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 h-40 glass-card rounded-[2rem]" />
        <div className="h-40 glass-card rounded-[2rem]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <div key={i} className="h-32 glass-card rounded-2xl" />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-8 -mt-4">
      {/* Top Section Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Compact Hero Section */}
        <div className="lg:col-span-8 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-indigo-700 p-8 shadow-2xl shadow-indigo-500/20">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest mb-4 backdrop-blur-md">
                <Wifi className="w-3 h-3 text-emerald-400 animate-pulse" />
                Live Sync Active
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight font-heading leading-tight">
                Welcome Back, <span className="text-indigo-200">{user?.name?.split(' ')[0] || 'Partner'}</span>!
              </h2>
              <p className="text-indigo-100/80 text-base max-w-lg">
                Your roadmap for today looks productive with <span className="font-bold text-white uppercase">{data?.stats.totalAssigned || 0} tasks</span> under your command.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-4">
               <Link to="/tasks" className="flex items-center gap-3 bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 hover:scale-105 transition-all text-sm shadow-xl">
                 Board View <ArrowUpRight className="w-4 h-4" />
               </Link>
               <div className="hidden sm:flex items-center gap-2 text-indigo-100/60 text-xs font-medium">
                  <Clock className="w-4 h-4" />
                  Last updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
               </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Summary on the Side */}
        <div className="lg:col-span-4 glass-card p-6 bg-white/[0.03] border-white/10 flex flex-col justify-between">
           <div className="flex items-center justify-between mb-4">
             <h4 className="text-sm font-bold text-white uppercase tracking-widest text-gray-500">Summary</h4>
             <TrendingUp className="w-4 h-4 text-emerald-400" />
           </div>
           
           <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Efficiency Rate</span>
                <span className="text-white font-bold text-sm">92%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="w-[92%] h-full bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                   <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Created</p>
                   <p className="text-xl font-bold text-white">{data?.stats.totalCreated}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                   <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Overdue</p>
                   <p className="text-xl font-bold text-rose-400">{data?.stats.totalOverdue}</p>
                </div>
              </div>
           </div>

           <button className="w-full mt-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> View Detailed Reports
           </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Section: Active Tasks */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-2">
            <div>
              <h3 className="text-xl font-bold text-white font-heading">Focused for Today</h3>
              <p className="text-gray-500 text-xs mt-1">High priority items needing your attention</p>
            </div>
            <Link to="/tasks" className="text-indigo-400 hover:text-indigo-300 text-xs font-bold flex items-center gap-2 group">
              View All <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data?.assignedTasks.slice(0, 4).map((task) => (
              <div key={task.id} className="glass-card p-5 group cursor-pointer hover:border-indigo-500/30 transition-all relative">
                <div className="flex justify-between items-start mb-4">
                   <div className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter ${
                     task.priority === 'High' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                     task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                     'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                   }`}>
                     {task.priority}
                   </div>
                   <Target className="w-4 h-4 text-gray-700 group-hover:text-indigo-500/40 transition-colors" />
                </div>
                
                <h4 className="text-base text-white font-bold mb-1 truncate group-hover:text-indigo-400 transition-colors">{task.title}</h4>
                <p className="text-xs text-gray-500 line-clamp-2 mb-6 leading-relaxed">{task.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-indigo-500/5 text-indigo-400 text-[9px] font-bold uppercase border border-indigo-500/10">
                    {task.status}
                  </div>
                </div>
              </div>
            ))}
            
            {(!data?.assignedTasks || data.assignedTasks.length === 0) && (
              <div className="col-span-2 glass-card p-12 flex flex-col items-center justify-center text-center opacity-40 border-dashed border-white/10">
                 <CheckCircle2 className="w-10 h-10 text-gray-600 mb-4" />
                 <p className="text-white font-bold text-sm uppercase tracking-widest">Board Clear</p>
                 <p className="text-xs text-gray-500 mt-1">Take a break or create a new mission</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Compact Activity Feed & Quick Actions */}
        <div className="lg:col-span-4 space-y-8">
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white font-heading px-2">Team Signal</h3>
            <div className="glass-card p-6 space-y-6 relative overflow-hidden bg-white/[0.01]">
                <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 blur-[40px] pointer-events-none" />
                
                {activities.map((activity, i) => (
                  <div key={activity.id} className="flex gap-4 relative animate-in slide-in-from-right-4 duration-500">
                    <div className="relative shrink-0">
                       <div className={`w-3.5 h-3.5 rounded-full border-2 border-black mt-1 z-10 ${i === 0 ? 'bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.8)]' : 'bg-gray-800'}`} />
                       {i < activities.length - 1 && <div className="absolute left-1.5 top-6 w-[1px] h-6 bg-white/5" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 leading-tight">
                        <span className="text-white font-bold">{activity.user}</span> {activity.action} <span className="text-indigo-400 font-medium truncate inline-block max-w-[120px] align-bottom">"{activity.target}"</span>
                      </p>
                      <p className="text-[9px] text-gray-600 mt-1 font-bold uppercase tracking-wider">{activity.time}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="space-y-4">
             <button className="w-full glass-card p-5 border-indigo-500/20 bg-indigo-500/5 flex items-center justify-between text-white font-bold hover:bg-indigo-500/10 transition-all hover:scale-[1.02] shadow-xl group">
                <div className="flex items-center gap-3">
                   <div className="p-2 rounded-lg bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors">
                      <Plus className="w-4 h-4 text-indigo-400" />
                   </div>
                   <span className="text-sm">Initiate Project</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:translate-x-1 transition-transform" />
             </button>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/5 transition-colors group">
                   <CheckCircle2 className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                   <span className="text-[10px] font-bold text-gray-500 uppercase">Review</span>
                </div>
                <div className="glass-card p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/5 transition-colors group">
                   <AlertCircle className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" />
                   <span className="text-[10px] font-bold text-gray-500 uppercase">Alerts</span>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;