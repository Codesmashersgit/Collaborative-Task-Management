import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Menu, X } from 'lucide-react';
import { getSocket, disconnectSocket } from '../../lib/socket';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const socket = getSocket();
        return () => {
            disconnectSocket();
        };
    }, []);

    return (
        <div className="flex min-h-screen bg-black relative isolate overflow-hidden">
            <div className="bg-animate fixed inset-0 z-[-1]" />
            
            {/* Sidebar Section */}
            <aside className={`fixed inset-y-0 left-0 z-50 transition-all duration-500 lg:relative lg:block ${isSidebarOpen ? 'translate-x-0 w-64' : 'translate-x-[-100%] lg:translate-x-0 w-64'}`}>
                {/* Mobile Backdrop */}
                {isSidebarOpen && (
                    <div 
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden z-[-1]" 
                    />
                )}
                <Sidebar />
            </aside>

            {/* Main Content Section */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <Navbar />
                
                {/* Mobile Menu Toggle */}
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="lg:hidden absolute top-6 left-6 z-[60] p-3 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
                >
                    {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>

                <main className="flex-1 overflow-y-auto px-4 md:px-12 py-8 mt-24">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
