import { Loader2, Radio } from 'lucide-react';

export const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0c10] space-y-8">
      <div className="relative">
        <div className="w-24 h-24 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center animate-pulse">
           <Radio className="w-10 h-10 text-indigo-500" />
        </div>
        <div className="absolute inset-0 border-4 border-transparent border-t-indigo-500 rounded-3xl animate-spin" />
      </div>
      <div className="text-center space-y-2">
         <h2 className="text-xl font-black text-white tracking-[0.4em] uppercase animate-pulse">Synchronizing</h2>
         <p className="text-[10px] text-indigo-300/30 font-black uppercase tracking-[0.2em]">Establishing secure neural link...</p>
      </div>
    </div>
  );
};
export default LoadingSpinner;