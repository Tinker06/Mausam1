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
      <div className="glass-card rounded-2xl p-3 sm:p-4 border border-[#447F98]/40 bg-[#152A33]/80 flex items-center justify-between gap-3 shadow-lg text-white">
        <div className="flex items-center space-x-2.5">
          <CheckCircle className="h-5 w-5 text-[#B9D8E1]" />
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#D6EBF3]">
              {t("alert.severity.normal", currentLang)} - {warningData.city}
            </h4>
            <p className="text-[11px] sm:text-xs text-[#B9D8E1]">
              {t("alert.no_severe", currentLang)}
            </p>
          </div>
        </div>

        <button
          onClick={onTriggerTestPush}
          className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#447F98] hover:bg-[#629BB5] border border-[#447F98]/40 text-xs font-bold text-white flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer flex-shrink-0"
        >
          <BellRing className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#D6EBF3]" />
          <span>{t("alert.trigger_test", currentLang)}</span>
        </button>
      </div>
    );
  }

  const isSevere = warning.severity === 'SEVERE';

  return (
    <div className={`rounded-2xl p-3.5 sm:p-5 border shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
      isSevere 
        ? 'bg-rose-950/90 border-rose-500/60 text-rose-200 animate-pulse' 
        : 'bg-[#152A33]/90 border-[#447F98]/60 text-[#D6EBF3]'
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
            <h4 className="text-xs sm:text-sm font-bold text-white">
              {warning.message}
            </h4>
          </div>
          <p className="text-[11px] sm:text-xs text-[#B9D8E1] mt-1 font-medium">
            {t("alert.reason", currentLang)} {warning.reason}
          </p>
          {warning.conditions && warning.conditions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {warning.conditions.map((c, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-[#1F3E4B] text-[11px] font-semibold text-[#D6EBF3] border border-[#447F98]/50">
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onTriggerTestPush}
        className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#447F98] hover:bg-[#629BB5] border border-[#447F98]/40 text-xs font-bold text-white flex items-center gap-1.5 transition-all self-end md:self-auto shadow-md active:scale-95 cursor-pointer"
      >
        <BellRing className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#D6EBF3]" />
        <span>{t("alert.trigger_test", currentLang)}</span>
      </button>
    </div>
  );
};
