import React, { useEffect } from 'react';
import { BellRing, X, ShieldAlert } from 'lucide-react';

interface PushNotificationToastProps {
  message: string;
  city: string;
  severity: string;
  onClose: () => void;
}

export const PushNotificationToast: React.FC<PushNotificationToastProps> = ({
  message,
  city,
  severity,
  onClose
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 6000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full glass-card p-4 rounded-2xl border border-rose-500/50 bg-rose-950/90 text-white shadow-2xl animate-bounce">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-xl bg-rose-500 text-white">
            <BellRing className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-rose-500 text-white uppercase">
                FCM Push Alert
              </span>
              <span className="text-xs font-bold text-slate-300">{city}</span>
            </div>
            <p className="text-xs font-semibold text-rose-100 mt-1 leading-snug">
              {message}
            </p>
          </div>
        </div>

        <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
