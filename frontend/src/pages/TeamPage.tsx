import useSWR from 'swr';
import { userApi } from '../lib/api';
import { 
    Users, 
    Mail, 
    Clock,
    ShieldCheck, 
    Search as SearchIcon, 
    MoreHorizontal,
    UserPlus,
    Filter,
    ArrowUpRight
} from 'lucide-react';
import { useState } from 'react';
import InviteMemberModal from '../components/team/InviteMemberModal';

const TeamPage = () => {
    const { data: response, error, isLoading, mutate } = useSWR('users', () => userApi.getAll());
    const users = response?.data || [];
    const [searchQuery, setSearchQuery] = useState('');
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    if (isLoading) return (
      <div className="space-y-8 page-container animate-pulse">
        <div className="h-32 bg-white rounded-2xl border border-gray-100" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white rounded-xl border border-gray-100" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-64 bg-white rounded-2xl border border-gray-100" />)}
        </div>
      </div>
    );

    if (error) return (
        <div className="bg-rose-50 p-12 flex flex-col items-center gap-4 border border-rose-100 rounded-[2rem] text-center max-w-xl mx-auto mt-20">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 mb-2">
                <Users className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-black">Failed to load team</h3>
            <p className="text-gray-500 text-sm font-bold">We encountered an error while fetching the team directory. Please try again later.</p>
        </div>
    );

    const filteredUsers = users.filter((user: any) => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <div className="space-y-10 page-container selection:bg-indigo-500/30">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-10">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight text-black font-heading">Team Directory</h1>
                    <p className="text-gray-500 text-base font-medium">
                        Manage your workspace members and their access levels.
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 hover:border-black rounded-2xl text-black text-xs font-black uppercase tracking-widest transition-all shadow-sm">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                    <button 
                        onClick={() => setIsInviteModalOpen(true)}
                        className="btn-premium px-8 py-3 rounded-2xl whitespace-nowrap uppercase tracking-widest text-xs font-black shadow-xl shadow-indigo-600/20"
                    >
                        <UserPlus className="w-5 h-5" />
                        Invite Member
                    </button>
                </div>
            </div>

            <InviteMemberModal 
                isOpen={isInviteModalOpen} 
                onClose={() => setIsInviteModalOpen(false)} 
                onSuccess={() => mutate()}
            />

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Members', value: users.length, sub: 'Active seats', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Administrators', value: users.filter((u: any) => u.role === 'ADMIN').length, sub: 'Full access', color: 'text-rose-600', bg: 'bg-rose-50' },
                    { label: 'Regular Members', value: users.filter((u: any) => u.role !== 'ADMIN').length, sub: 'Standard', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Security Grade', value: 'Gold', sub: 'Verified', color: 'text-amber-600', bg: 'bg-amber-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
                        <div className="flex items-baseline justify-between mt-3">
                            <p className="text-2xl font-black text-black">{stat.value}</p>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${stat.bg} ${stat.color} border border-transparent`}>
                                {stat.sub}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search Bar */}
            <div className="relative group max-w-xl">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm text-black focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-bold placeholder:text-gray-300 shadow-sm"
                />
            </div>

            {/* Member Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredUsers.map((member: any) => (
                    <div 
                        key={member.id} 
                        className="bg-white border-2 border-gray-50 rounded-[2rem] p-8 hover:border-indigo-100 hover:shadow-xl transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-black">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-[2rem] bg-indigo-50 border-4 border-white shadow-xl flex items-center justify-center text-3xl font-black text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                                {member.name.charAt(0)}
                            </div>
                            <h3 className="text-lg font-black text-black group-hover:text-indigo-600 transition-colors">{member.name}</h3>
                            <p className="text-sm text-gray-500 font-bold mb-6">{member.email}</p>

                            <div className="flex items-center gap-3 mb-8">
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                    member.role === 'ADMIN' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-gray-50 text-gray-500 border-gray-100'
                                }`}>
                                    {member.role || 'Member'}
                                </div>
                                <div className="px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                    Active
                                </div>
                            </div>

                            <div className="w-full pt-6 border-t border-gray-50 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        Joined {member.createdAt ? new Date(member.createdAt).toLocaleDateString([], { month: 'short', year: 'numeric' }) : 'Recently'}
                                    </span>
                                </div>
                                <button className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-indigo-600 hover:text-white text-gray-400 flex items-center justify-center transition-all shadow-sm">
                                    <Mail className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredUsers.length === 0 && (
                <div className="py-24 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">No team members matched</p>
                </div>
            )}
        </div>
    );
};

export default TeamPage;
