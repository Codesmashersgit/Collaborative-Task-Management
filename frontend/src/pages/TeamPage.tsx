
import useSWR from 'swr';
import { userApi } from '../lib/api';
import { Users, Mail, Clock, ShieldCheck, Search as SearchIcon } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useState } from 'react';

const TeamPage = () => {
    const { data: users, error, isLoading } = useSWR('users', () => userApi.getAll());
    const [searchQuery, setSearchQuery] = useState('');

    if (isLoading) return <LoadingSpinner />;
    if (error) return <div className="text-rose-400 p-8">Error loading team data</div>;

    const filteredUsers = users?.data?.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-white tracking-tight font-heading mb-2">Team Members</h1>
                    <p className="text-gray-400">Collaboration is the heart of every successful project</p>
                </div>
                
                <div className="relative group min-w-[300px]">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-hover:text-indigo-400 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search team members..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-6 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all backdrop-blur-xl"
                    />
                </div>
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredUsers.map((member) => (
                    <div 
                        key={member.id} 
                        className="glass-card p-6 group cursor-pointer hover:border-indigo-500/30 transition-all duration-500 relative overflow-hidden"
                    >
                        {/* Hover Gradient Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="relative z-10">
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-xl shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
                                    {member.name.charAt(0)}
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                                    <ShieldCheck className="w-3 h-3" />
                                    Member
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">{member.name}</h3>
                            <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                                <Mail className="w-4 h-4" />
                                {member.email}
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/5">
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Joined On</p>
                                    <div className="flex items-center gap-1.5 text-gray-300 text-xs">
                                        <Clock className="w-3.5 h-3.5" />
                                        {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : 'N/A'}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Permissions</p>
                                    <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                                        Full Access
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredUsers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                        <Users className="w-10 h-10 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No team members found</h3>
                    <p className="text-gray-500">Try adjusting your search criteria</p>
                </div>
            )}
        </div>
    );
};

export default TeamPage;
