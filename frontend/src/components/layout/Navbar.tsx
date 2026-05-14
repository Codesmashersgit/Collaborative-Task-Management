import { useState, useCallback, useEffect } from 'react';
import { Search, User, Menu, Command, ArrowRight, Loader2, Bell } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { taskApi } from '../../lib/api';
import debounce from 'lodash/debounce';
import NotificationBell from './Notification';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const response = await taskApi.search(query);
        setSearchResults(response.data);
        setShowResults(true);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  return (
    <header className="sticky top-0 z-30 w-full bg-[var(--bg-main)]/80 backdrop-blur-xl border-b border-[var(--border-muted)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between gap-8 relative">
        <div className="flex items-center gap-8 flex-1">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-surface)] transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1 flex justify-start">
            <div className="relative group flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-[var(--text-dim)] group-focus-within:text-indigo-600 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search everything..."
                value={searchQuery}
                onFocus={() => setShowResults(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-muted)] rounded-xl text-sm placeholder-[var(--text-dim)] focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/30 transition-all text-[var(--text-main)] font-bold"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 bg-white border border-[var(--border-muted)] rounded-lg">
                <Command className="w-2.5 h-2.5 text-[var(--text-dim)]" />
                <span className="text-[10px] font-black text-[var(--text-dim)]">K</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search Results Dropdown (Scoped to search area) */}
        {showResults && searchQuery && (
          <div className="absolute top-full left-10 w-full max-w-md mt-3 p-4 bg-white border border-[var(--border-muted)] rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between mb-4 px-2">
                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Search Results</h4>
                {isSearching && <Loader2 className="w-3 h-3 animate-spin text-indigo-600" />}
              </div>

              <div className="space-y-1 max-h-[400px] overflow-y-auto">
                {searchResults.length === 0 && !isSearching ? (
                  <div className="p-8 text-center">
                    <p className="text-[var(--text-muted)] text-sm font-medium">No results found for "{searchQuery}"</p>
                  </div>
                ) : (
                  searchResults.map((task) => (
                    <Link
                      key={task.id}
                      to="/tasks"
                      onClick={() => setShowResults(false)}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          task.status === 'Completed' ? 'bg-emerald-500' :
                          task.status === 'InProgress' ? 'bg-indigo-600' : 'bg-gray-400'
                        }`} />
                        <div>
                          <p className="text-sm font-black text-black group-hover:text-indigo-600 transition-colors line-clamp-1">{task.title}</p>
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{task.status}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))
                )}
              </div>
          </div>
        )}

        {/* User Section - Pushed to Right */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 border-r border-[var(--border-muted)] pr-6 h-8">
            <NotificationBell />
          </div>

          <div className="flex items-center gap-4 cursor-pointer group">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-black tracking-tight group-hover:text-indigo-600 transition-colors">{user?.name || 'User'}</p>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">{user?.role || 'Member'}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 shadow-sm group-hover:border-indigo-600 group-hover:text-indigo-600 transition-all">
              <User className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
