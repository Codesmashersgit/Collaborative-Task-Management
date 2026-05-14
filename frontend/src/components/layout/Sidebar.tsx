import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  LogOut,
  Users,
  Bell,
  Layers,
  ChevronRight,
  Settings,
  CheckCircle2,
  PieChart,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ onMobileClose }: { onMobileClose?: () => void }) => {
    const { logout, user } = useAuth();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Layers, label: 'Tasks', path: '/tasks' },
        ...(user?.role === 'ADMIN' ? [{ icon: Users, label: 'Team Members', path: '/team' }] : []),
        { icon: Bell, label: 'Notifications', path: '/notifications' },
    ];


    const adminItems = user?.role === 'ADMIN' ? [
        { icon: ShieldCheck, label: 'Admin Console', path: '/admin' },
    ] : [];

    const secondaryItems = [
        { icon: PieChart, label: 'Analytics', path: '/dashboard' },
        { icon: Settings, label: 'Settings', path: '/settings' },
        { icon: HelpCircle, label: 'Support', path: '/dashboard' },
    ];

    return (
        <aside className="w-[280px] h-screen bg-white border-r border-gray-100 flex flex-col relative z-50 overflow-hidden">
            {/* Logo Section - Fixed at top */}
            <div className="p-8 pb-6 bg-white z-10">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-600/20 transform rotate-3">
                        <CheckCircle2 className="w-7 h-7 text-white" />
                    </div>
                    <div className="space-y-0">
                       <h1 className="text-xl font-black text-black tracking-tighter font-heading uppercase">TaskFlow</h1>
                       <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">System Online</span>
                       </div>
                    </div>
                </div>
            </div>

            {/* Scrollable Navigation Area */}
            <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                <div className="px-4 mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Overview</div>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        onClick={onMobileClose}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300 group ${isActive
                                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20'
                                : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                        <span className="text-sm font-black uppercase tracking-wider">{item.label}</span>
                        <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </NavLink>
                ))}

                {adminItems.length > 0 && (
                    <>
                        <div className="px-4 mt-8 mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">Administration</div>
                        {adminItems.map((item) => (
                            <NavLink
                                key={item.label}
                                to={item.path}
                                onClick={onMobileClose}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300 group ${isActive
                                        ? 'bg-rose-600 text-white shadow-xl shadow-rose-600/20'
                                        : 'text-gray-500 hover:text-rose-600 hover:bg-rose-50'
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                                <span className="text-sm font-black uppercase tracking-wider">{item.label}</span>
                                <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                            </NavLink>
                        ))}
                    </>
                )}

                <div className="px-4 mt-10 mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">System</div>
                {secondaryItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        onClick={onMobileClose}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300 group ${isActive
                                ? 'bg-gray-100 text-black border-gray-200'
                                : 'text-gray-500 hover:text-black hover:bg-gray-50'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="text-sm font-black uppercase tracking-wider">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer Section - Fixed at bottom */}
            <div className="p-6 border-t border-gray-50 bg-white z-10">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-5 py-4 w-full rounded-2xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all duration-300 group shadow-sm hover:shadow-md border border-transparent hover:border-rose-100"
                >
                    <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    <span className="text-sm font-black uppercase tracking-wider">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
