import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ message, type = 'success', duration = 3000 }) => {
    const id = Date.now() + Math.random().toString(36).slice(2, 6);
    const newToast = { id, message, type, duration };

    setToasts((prev) => [...prev.slice(-3), newToast]); // Keep at most 4 toasts stacked

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Floating Glassmorphic Toast Container */}
      <div className="fixed top-20 right-4 sm:right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto transform transition-all duration-300 ease-out animate-toastSlideIn flex items-center justify-between gap-3 p-4 rounded-2xl bg-white/90 dark:bg-[#151E28]/95 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-hidden relative group"
            role="alert"
          >
            {/* Ambient Accent Indicator */}
            <div
              className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                toast.type === 'heart'
                  ? 'bg-gradient-to-b from-rose-500 to-pink-500'
                  : toast.type === 'cart'
                  ? 'bg-gradient-to-b from-[#16806A] to-emerald-400'
                  : toast.type === 'error'
                  ? 'bg-gradient-to-b from-red-500 to-rose-600'
                  : 'bg-gradient-to-b from-emerald-500 to-teal-400'
              }`}
            />

            <div className="flex items-center gap-3 pl-1.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
                  toast.type === 'heart'
                    ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 animate-heartBurst'
                    : toast.type === 'cart'
                    ? 'bg-emerald-100 dark:bg-emerald-500/20 text-[#16806A] dark:text-emerald-400 animate-bounce'
                    : toast.type === 'error'
                    ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'
                    : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {toast.type === 'heart' ? '❤️' : toast.type === 'cart' ? '🛒' : toast.type === 'error' ? '⚠️' : '✓'}
              </div>

              <div>
                <p className="text-xs sm:text-sm font-bold text-[#1F2E29] dark:text-slate-100 leading-snug">
                  {toast.message}
                </p>
                <span className="text-[10px] text-[#1F2E29]/50 dark:text-slate-400 font-medium">
                  abracart notification
                </span>
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="w-6 h-6 rounded-lg text-[#1F2E29]/40 hover:text-[#1F2E29] dark:text-slate-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center transition-colors text-xs cursor-pointer"
              title="Close"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;
