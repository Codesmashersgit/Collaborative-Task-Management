import { Search, Bell, User, Command, Sparkles, X, Loader2, CheckSquare } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useState, useEffect, useRef } from 'react';
import { taskApi } from '../../lib/api';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounced Search
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.length > 2) {
                setIsSearching(true);
                try {
                    const response = await taskApi.getAll({ status: undefined, priority: undefined });
                    // Basic client-side filtering (ideally would call search API)
                    const filtered = response.data.filter(t => 
                        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        t.description.toLowerCase().includes(searchQuery.toLowerCase())
                    ).slice(0, 5);
                    setSearchResults(filtered);
                    setShowResults(true);
                } catch (err) {
                    console.error('Search failed:', err);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    return (
        <header className="h-24 fixed top-0 right-0 left-0 lg:left-64 z-40 bg-black/10 backdrop-blur-xl border-b border-white/5 px-6 md:px-12 flex items-center justify-between transition-all duration-500">
            {/* Logo on Mobile */}
            <div className="flex lg:hidden items-center gap-2 mr-4 ml-14">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
            </div>

            <div className="flex-1 max-w-xl hidden sm:block relative" ref={searchRef}>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        {isSearching ? (
                            <Loader2 className="h-4 w-4 text-indigo-400 animate-spin" />
                        ) : (
                            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
                        )}
                    </div>
                    <input
                        type="text"
                        placeholder="Search tasks, descriptions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => searchQuery.length > 2 && setShowResults(true)}
                        className="block w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-16 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all duration-300"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        {searchQuery ? (
                            <button onClick={() => setSearchQuery('')} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                                <X className="w-4 h-4 text-gray-500" />
                            </button>
                        ) : (
                            <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] font-medium text-gray-500">
                                <Command className="w-3 h-3" /> K
                            </kbd>
                        )}
                    </div>
                </div>

                {/* Search Results Dropdown */}
                {showResults && (
                    <div className="absolute top-full left-0 right-0 mt-3 glass-card bg-black/80 backdrop-blur-2xl border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200 p-2 overflow-hidden">
                        <div className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] border-b border-white/5 mb-2">
                            Quick Results
                        </div>
                        {searchResults.length > 0 ? (
                            <div className="space-y-1">
                                {searchResults.map((task) => (
                                    <Link 
                                        key={task.id} 
                                        to={`/tasks`} 
                                        onClick={() => setShowResults(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all group"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
                                            <CheckSquare className="w-4 h-4 text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white line-clamp-1">{task.title}</p>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">{task.priority} • {task.status}</p>
                                        </div>
                                    </Link>
                                ))}
                                <Link 
                                    to="/tasks" 
                                    className="block p-3 text-center text-xs text-indigo-400 hover:text-indigo-300 font-bold tracking-wider transition-colors border-t border-white/5"
                                >
                                    SEE ALL RESULTS
                                </Link>
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500 text-sm">
                                {searchQuery.length > 2 ? 'No tasks found' : 'Type at least 3 characters...'}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4 md:gap-8 ml-auto">
                <div className="flex items-center gap-1">
                    <button className="relative p-2.5 text-gray-400 hover:text-white transition-all duration-300 hover:bg-white/5 rounded-xl group">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-black group-hover:scale-110 transition-transform" />
                    </button>
                </div>

                <div className="flex items-center gap-3 md:gap-4 pl-4 md:pl-8 border-l border-white/5">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-white font-heading">{user?.name || 'User'}</p>
                        <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Project Lead</p>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center border border-indigo-500/30 shadow-lg shadow-indigo-500/10 group cursor-pointer hover:scale-105 transition-all duration-300">
                        <div className="w-full h-full rounded-2xl flex items-center justify-center bg-indigo-500/10 text-indigo-400 font-bold text-lg uppercase group-hover:bg-indigo-500/20 transition-all">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
