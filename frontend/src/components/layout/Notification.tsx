import { useState } from 'react';
import { Bell, CheckCheck, Inbox, CheckCircle2, MoreHorizontal, ArrowRight, Zap } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotification';
import { formatRelativeTime } from '../../utils/date';

export const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-xl transition-all duration-200 group border ${
          isOpen 
            ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]' 
            : 'text-zinc-500 hover:text-white bg-white/5 border-white/5 hover:border-white/10'
        }`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#09090b]">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#101014] border border-white/5 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <Inbox className="w-4 h-4 text-zinc-500" />
                <h3 className="font-bold text-white text-sm">Notifications</h3>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={() => {
                    markAllAsRead();
                    setIsOpen(false);
                  }}
                  className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-wider transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Content */}
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {!notifications || notifications.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6 text-zinc-800" />
                  </div>
                  <p className="text-zinc-500 text-xs font-medium">All caught up!</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 transition-all duration-200 relative group cursor-pointer ${
                        !notification.read ? 'bg-indigo-600/[0.03] hover:bg-indigo-600/[0.06]' : 'hover:bg-white/[0.02]'
                      }`}
                      onClick={() => {
                        if (!notification.read) {
                          markAsRead(notification.id);
                        }
                      }}
                    >
                      <div className="flex gap-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                            !notification.read ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-zinc-500/5 border-white/5 text-zinc-600'
                        }`}>
                           <Zap className="w-4 h-4" />
                        </div>
                        
                        <div className="flex-1 min-w-0 space-y-1">
                          <p className={`text-xs leading-relaxed ${!notification.read ? 'text-white font-bold' : 'text-zinc-500 font-medium'}`}>
                            {notification.message}
                          </p>
                          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">
                            {formatRelativeTime(notification.createdAt)}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1 shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-white/5 bg-white/[0.02]">
                <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2">
                   View All Notifications <ArrowRight className="w-3.5 h-3.5" />
                </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default NotificationBell;