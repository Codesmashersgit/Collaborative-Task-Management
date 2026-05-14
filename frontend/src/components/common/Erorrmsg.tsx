import { AlertCircle, RefreshCw, XCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <div className="bg-white p-12 lg:p-16 text-center max-w-xl mx-auto border border-red-100 rounded-[3rem] shadow-[0_40px_80px_-16px_rgba(255,0,0,0.05)] animate-in zoom-in-95 slide-in-from-bottom-8 duration-700 group overflow-hidden relative">
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-red-400 via-red-600 to-red-400" />
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-50 blur-[50px] pointer-events-none group-hover:scale-150 transition-transform duration-1000 opacity-60" />
      
      <div className="w-24 h-24 rounded-[2rem] bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-red-50 group-hover:rotate-12 transition-all duration-700">
        <XCircle className="w-12 h-12 text-red-600 animate-pulse" />
      </div>
      
      <div className="space-y-4 mb-12">
        <h3 className="text-4xl font-extrabold text-slate-900 font-heading tracking-tighter leading-tight uppercase">Signal Rejection</h3>
        <p className="text-slate-500 font-medium text-lg leading-relaxed px-6 max-w-md mx-auto">{message}</p>
        <div className="flex items-center justify-center gap-2 text-[10px] font-black text-red-600 uppercase tracking-[0.3em] opacity-60">
           <AlertCircle className="w-3.5 h-3.5" /> Sector Grid Error
        </div>
      </div>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="w-full flex items-center justify-center gap-4 py-5 bg-red-600 hover:bg-red-700 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-[0.98] shadow-2xl shadow-red-200 group/btn"
        >
          <RefreshCw className="w-5 h-5 group-hover/btn:rotate-180 transition-transform duration-700 ease-in-out" />
          Relaunch Sector Scan
        </button>
      )}
      
      <div className="mt-8 text-center">
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-40">Tactical Diagnostics System Active</p>
      </div>
    </div>
  );
};

export default ErrorMessage;