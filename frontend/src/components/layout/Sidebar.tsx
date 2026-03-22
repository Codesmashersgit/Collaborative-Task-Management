import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Settings, LogOut, Users, Bell, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
    const { logout } = useAuth();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
        { icon: Users, label: 'Team', path: '/team' },
        { icon: Bell, label: 'Notifications', path: '/notifications' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <aside className="w-64 h-screen bg-black/40 backdrop-blur-3xl border-r border-white/5 flex flex-col">
            <div className="p-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight font-heading">TaskFlow</h1>
                </div>
                <p className="text-[10px] text-indigo-400/60 font-bold uppercase tracking-[0.2em] pl-1">Enterprise Edition</p>
            </div>

            <nav className="flex-1 px-4 space-y-1.5 mt-4">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${isActive
                                ? 'text-white'
                                : 'text-gray-400 hover:text-white'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent border-l-2 border-indigo-500" />
                                )}
                                <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-indigo-400' : 'text-gray-500'}`} />
                                <span className={`font-medium transition-all duration-300 ${isActive ? 'translate-x-1' : ''}`}>{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-6">
                <div className="glass-card p-4 bg-indigo-500/5 group cursor-pointer hover:bg-indigo-500/10 transition-colors mb-6">
                    <p className="text-xs text-indigo-300 font-semibold mb-1">Current Plan</p>
                    <p className="text-sm text-white font-bold">Pro Workspace</p>
                </div>
                
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-gray-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-300 group"
                >
                    <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
