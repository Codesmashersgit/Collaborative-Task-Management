import { useSocket } from '../../hooks/useSocket';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';

export const ConnectionStatus = () => {
  const { isConnected, isConnecting } = useSocket();

  if (isConnecting) {
    return (
      <div className="fixed bottom-6 right-6 flex items-center gap-3 px-4 py-2.5 rounded-xl border border-white/5 bg-[#101014]/80 backdrop-blur-md text-zinc-500 z-[60] shadow-2xl">
        <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
        <span className="text-[10px] font-bold uppercase tracking-wider leading-none">
          Syncing...
        </span>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 flex items-center gap-3 px-4 py-2.5 rounded-xl border backdrop-blur-md transition-all duration-300 z-[60] shadow-2xl ${
      isConnected 
        ? 'bg-[#101014]/80 border-white/5 text-emerald-400' 
        : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
    }`}>
      <div className="relative flex items-center justify-center">
        {isConnected ? (
          <Wifi className="w-4 h-4" />
        ) : (
          <WifiOff className="w-4 h-4 animate-pulse" />
        )}
        {isConnected && (
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        )}
      </div>
      <div className="flex flex-col">
         <span className="text-[10px] font-bold uppercase tracking-wider leading-none">
            {isConnected ? 'Connected' : 'Offline'}
         </span>
      </div>
    </div>
  );
};

export default ConnectionStatus;