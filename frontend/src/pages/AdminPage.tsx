import useSWR from 'swr';
import { adminApi, taskApi } from '../lib/api';
import { 
  Users, 
  Layers, 
  ShieldCheck, 
  Activity, 
  ArrowUpRight, 
  UserCircle,
  Mail,
  Calendar,
  Settings,
  Trash2,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MoreVertical,
  Plus,
  Zap,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { useState } from 'react';
import InviteMemberModal from '../components/team/InviteMemberModal';

const AdminPage = () => {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'tasks'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  
  const { data: statsResponse } = useSWR('admin/stats', adminApi.getStats);
  const { data: usersResponse, isLoading: usersLoading, mutate: mutateUsers } = useSWR('admin/users', adminApi.getUsers);
  const { data: tasksResponse, isLoading: tasksLoading, mutate: mutateTasks } = useSWR('tasks/all', () => taskApi.getAll());
  
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  if (currentUser?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" />;
  }

  const handleToggleRole = async (userId: string, currentRole: string) => {
    setUpdatingId(userId);
    try {
      const newRole = currentRole === 'ADMIN' ? 'MEMBER' : 'ADMIN';
      await adminApi.updateRole(userId, newRole);
      mutateUsers();
    } catch (err) {
      console.error('Failed to update role:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This will also remove their notifications and tasks.`)) return;
    setUpdatingId(userId);
    try {
      await adminApi.deleteUser(userId);
      mutateUsers();
      mutateTasks();
    } catch (err) {
      alert('Failed to delete user');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Delete this task permanently from the system?')) return;
    try {
      await adminApi.deleteTask(taskId);
      mutateTasks();
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  const stats = statsResponse?.data;
  const users = usersResponse?.data?.filter((u: any) => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  
  const tasks = tasksResponse?.data?.filter((t: any) => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-8 animate-fade-in pb-20 selection:bg-indigo-500/30">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            <span className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em]">Administrative Control Center</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-black font-heading uppercase">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">
            Complete workspace oversight and system management
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           <button 
             onClick={() => setIsInviteModalOpen(true)}
             className="btn-premium px-8 py-3.5 rounded-2xl shadow-xl shadow-indigo-600/20"
           >
             <Plus className="w-5 h-5" />
             Invite Member
           </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Members', value: stats?.userCount || 0, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+12%' },
          { label: 'Global Tasks', value: stats?.taskCount || 0, icon: Layers, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+8%' },
          { label: 'System Admins', value: stats?.usersByRole?.find((r: any) => r.role === 'ADMIN')?._count || 0, icon: ShieldCheck, color: 'text-rose-600', bg: 'bg-rose-50', trend: 'Secure' },
          { label: 'Uptime', value: '99.9%', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'Stable' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border-2 border-gray-50 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <stat.icon className="w-16 h-16" />
            </div>
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 shadow-sm`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-end justify-between mt-1">
              <p className="text-3xl font-black text-black">{stat.value}</p>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${stat.trend.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                 {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Card */}
      <div className="bg-white border-2 border-gray-50 rounded-[2.5rem] overflow-hidden shadow-2xl">
        {/* Tab Switcher */}
        <div className="flex border-b border-gray-100 bg-gray-50/30">
          {[
            { id: 'dashboard', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'User Directory', icon: Users },
            { id: 'tasks', label: 'System Tasks', icon: Layers },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-10 py-6 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600 bg-white' : 'border-transparent text-gray-400 hover:text-black'}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="p-8 rounded-[2rem] border-2 border-gray-50 bg-gray-50/30 space-y-6">
                     <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black uppercase tracking-tight">System Performance</h3>
                        <Zap className="w-5 h-5 text-amber-500" />
                     </div>
                     <div className="space-y-4">
                        {[
                           { label: 'API Latency', value: 85, color: 'bg-indigo-600' },
                           { label: 'DB Utilization', value: 42, color: 'bg-emerald-500' },
                           { label: 'Memory Usage', value: 64, color: 'bg-amber-500' },
                        ].map((item, i) => (
                           <div key={i} className="space-y-2">
                              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                                 <span>{item.label}</span>
                                 <span>{item.value}%</span>
                              </div>
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                 <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }} />
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="p-8 rounded-[2rem] border-2 border-gray-50 bg-indigo-600 text-white space-y-6 shadow-xl shadow-indigo-600/20">
                     <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black uppercase tracking-tight">Growth Insights</h3>
                        <TrendingUp className="w-5 h-5 text-indigo-200" />
                     </div>
                     <p className="text-sm text-indigo-100 font-medium leading-relaxed">
                        User engagement has increased by 14% this week. Most active members are from the Engineering department.
                     </p>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
                           <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Active Now</p>
                           <p className="text-2xl font-black mt-1">24</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
                           <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Avg Session</p>
                           <p className="text-2xl font-black mt-1">12m</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="p-8 rounded-[2rem] border-2 border-gray-50">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-black uppercase tracking-tight">Recent System Activity</h3>
                    <button className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] hover:underline">Download Audit Logs</button>
                  </div>
                  <div className="space-y-4">
                     {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                           <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
                              <ShieldCheck className="w-5 h-5" />
                           </div>
                           <div className="flex-1">
                              <p className="text-sm font-black text-black">Role update performed on user ID: {Math.random().toString(36).substring(7)}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Admin Action • {i * 10}m ago</p>
                           </div>
                           <ArrowUpRight className="w-4 h-4 text-gray-300" />
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6 animate-in fade-in duration-500">
               <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search member name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none transition-all"
                    />
                  </div>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="border-b border-gray-50">
                       <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Member Identity</th>
                       <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Access Level</th>
                       <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Join Date</th>
                       <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Operations</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                     {usersLoading ? (
                       <tr><td colSpan={4} className="p-20 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-indigo-600" /></td></tr>
                     ) : users.length === 0 ? (
                       <tr><td colSpan={4} className="p-20 text-center text-gray-400 font-bold">No matching members found.</td></tr>
                     ) : users.map((u: any) => (
                       <tr key={u.id} className="hover:bg-indigo-50/30 transition-colors group">
                         <td className="px-6 py-5">
                           <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-2xl bg-white border-2 border-gray-100 flex items-center justify-center text-indigo-600 font-black shadow-sm group-hover:border-indigo-600 transition-colors">
                               {u.name[0].toUpperCase()}
                             </div>
                             <div>
                               <p className="text-sm font-black text-black">{u.name}</p>
                               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{u.email}</p>
                             </div>
                           </div>
                         </td>
                         <td className="px-6 py-5">
                           <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border-2 ${
                             u.role === 'ADMIN' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-gray-50 text-gray-600 border-gray-100'
                           }`}>
                             {u.role}
                           </span>
                         </td>
                         <td className="px-6 py-5 text-[11px] text-gray-500 font-black uppercase tracking-widest">
                           {new Date(u.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                         </td>
                         <td className="px-6 py-5 text-right">
                           <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button 
                               onClick={() => handleToggleRole(u.id, u.role)}
                               disabled={updatingId === u.id || u.id === currentUser?.id}
                               className="p-3 rounded-xl bg-white border border-gray-200 text-indigo-600 hover:border-indigo-600 hover:shadow-lg transition-all disabled:opacity-20"
                               title="Change Access Level"
                             >
                               <ShieldCheck className="w-5 h-5" />
                             </button>
                             <button 
                               onClick={() => handleDeleteUser(u.id, u.name)}
                               disabled={updatingId === u.id || u.id === currentUser?.id}
                               className="p-3 rounded-xl bg-white border border-gray-200 text-rose-600 hover:border-rose-600 hover:shadow-lg transition-all disabled:opacity-20"
                               title="Revoke All Access"
                             >
                               <Trash2 className="w-5 h-5" />
                             </button>
                           </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-6 animate-in fade-in duration-500">
               <div className="relative max-w-md mb-8">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                 <input 
                   type="text" 
                   placeholder="Search system wide tasks..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none transition-all"
                 />
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="border-b border-gray-50">
                       <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Task Details</th>
                       <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Assigned To</th>
                       <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                       <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Control</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                     {tasksLoading ? (
                       <tr><td colSpan={4} className="p-20 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-indigo-600" /></td></tr>
                     ) : tasks.length === 0 ? (
                       <tr><td colSpan={4} className="p-20 text-center text-gray-400 font-bold">No global tasks found.</td></tr>
                     ) : tasks.map((t: any) => (
                       <tr key={t.id} className="hover:bg-indigo-50/30 transition-colors group">
                         <td className="px-6 py-5">
                            <p className="text-sm font-black text-black group-hover:text-indigo-600 transition-colors">{t.title}</p>
                            <p className="text-[9px] text-gray-400 font-black uppercase mt-1 tracking-widest">Ref: {t.id.slice(-12)}</p>
                         </td>
                         <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-500">
                                  {t.assignedTo?.name?.[0] || '?'}
                               </div>
                               <span className="text-xs text-gray-600 font-bold">{t.assignedTo?.name || 'Unassigned'}</span>
                            </div>
                         </td>
                         <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                t.status === 'Completed' ? 'bg-emerald-500' :
                                t.status === 'InProgress' ? 'bg-indigo-600' : 'bg-gray-400'
                              }`} />
                              <span className="text-[11px] font-black uppercase tracking-widest text-black">{t.status}</span>
                            </div>
                         </td>
                         <td className="px-6 py-5 text-right">
                            <button 
                             onClick={() => handleDeleteTask(t.id)}
                             className="p-3 rounded-xl bg-white border border-gray-200 text-rose-600 opacity-0 group-hover:opacity-100 hover:border-rose-600 hover:shadow-lg transition-all"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          )}
        </div>
      </div>

      <InviteMemberModal 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSuccess={() => {
           mutateUsers();
           setIsInviteModalOpen(false);
        }}
      />
    </div>
  );
};

export default AdminPage;

