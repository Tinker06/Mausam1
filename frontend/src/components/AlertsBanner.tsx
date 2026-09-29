import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, BellRing } from 'lucide-react';
import { WeatherWarningData } from '../types/weather';
import { SupportedLanguage, t } from '../i18n/translations';

interface AlertsBannerProps {
  warningData: WeatherWarningData;
  currentLang: SupportedLanguage;
  onTriggerTestPush: () => void;
}

export const AlertsBanner: React.FC<AlertsBannerProps> = ({
  warningData,
  currentLang,
  onTriggerTestPush
}) => {
  const warning = warningData.warning;
  if (!warning || warning.severity === 'NORMAL') {
    return (
      <div className="glass-card rounded-2xl p-4 border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <CheckCircle className="h-5 w-5 text-emerald-400" />
          <div>
            <h4 className="text-sm font-bold text-emerald-300">
              {t("alert.severity.normal", currentLang)} - {warningData.city}
            </h4>
            <p className="text-xs text-slate-400">
              No active meteorological severe warnings or flood advisories.
            </p>
          </div>
        </div>

        <button
          onClick={onTriggerTestPush}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-cyan-300 flex items-center gap-1.5 transition-all"
        >
          <BellRing className="h-3.5 w-3.5 text-cyan-400" />
          <span>{t("alert.trigger_test", currentLang)}</span>
        </button>
      </div>
    );
  }

  const isSevere = warning.severity === 'SEVERE';

  return (
    <div className={`rounded-2xl p-5 border shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
      isSevere 
        ? 'bg-rose-950/80 border-rose-500/60 text-rose-200 animate-pulse' 
        : 'bg-amber-950/70 border-amber-500/50 text-amber-200'
    }`}>
      <div className="flex items-start space-x-3">
        {isSevere ? (
          <ShieldAlert className="h-6 w-6 text-rose-400 flex-shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="h-6 w-6 text-amber-400 flex-shrink-0 mt-0.5" />
        )}
        <div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
              isSevere ? 'bg-rose-500 text-white' : 'bg-amber-500 text-slate-950'
            }`}>
              {warning.severity}
            </span>
            <h4 className="text-sm font-bold text-white">
              {warning.message}
            </h4>
          </div>
          <p className="text-xs text-slate-300 mt-1 font-medium">
            Reason: {warning.reason}
          </p>
          {warning.conditions && warning.conditions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {warning.conditions.map((c, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-slate-900/90 text-[11px] font-semibold text-slate-200 border border-slate-700">
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onTriggerTestPush}
        className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-cyan-300 flex items-center gap-1.5 transition-all self-end md:self-auto"
      >
        <BellRing className="h-4 w-4 text-cyan-400" />
        <span>{t("alert.trigger_test", currentLang)}</span>
      </button>
    </div>
  );
};
