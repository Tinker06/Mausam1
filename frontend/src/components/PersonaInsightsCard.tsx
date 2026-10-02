import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  UserCheck 
} from 'lucide-react';
import { RecommendationData, PersonaType } from '../types/weather';
import { SupportedLanguage, t } from '../i18n/translations';
import { getSafetyVisualBadge, getActionVisualIcon } from '../utils/visualIcons';

interface PersonaInsightsCardProps {
  recommendation: RecommendationData;
  activePersona: PersonaType;
  currentLang: SupportedLanguage;
  currentTheme?: 'night' | 'day';
  onChangePersonaClick: () => void;
}

export const PersonaInsightsCard: React.FC<PersonaInsightsCardProps> = ({
  recommendation,
  activePersona,
  currentLang,
  currentTheme = 'night',
  onChangePersonaClick
}) => {
  const isDay = currentTheme === 'day';
  const badge = getSafetyVisualBadge(recommendation.priority);

  return (
    <div className={`rounded-2xl sm:rounded-3xl p-3 sm:p-8 border shadow-xl relative transition-colors duration-300 ${
      isDay 
        ? 'bg-[#B9D8E1]/90 border-[#8CB8C6] text-[#0C181D] shadow-md' 
        : 'bg-[#0F2129]/95 border-[#447F98]/50 text-white shadow-xl'
    }`}>
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 mb-3 sm:mb-5">
        
        <div className="flex items-center space-x-2.5">
          <div className={`p-2 sm:p-3 rounded-2xl border ${
            isDay ? 'bg-[#D6EBF3] border-[#8CB8C6]' : 'bg-[#152A33] border-[#447F98]/60'
          }`}>
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-[#447F98]" />
          </div>
          <div>
            <span className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider block ${
              isDay ? 'text-[#2A5364]' : 'text-[#B9D8E1]'
            }`}>
              {t(`persona.${activePersona}`, currentLang) || activePersona.replace('_', ' ')}
            </span>
            <h3 className={`text-base sm:text-xl font-black tracking-tight ${isDay ? 'text-[#0C181D]' : 'text-white'}`}>
              {recommendation.headline}
            </h3>
          </div>
        </div>

        {/* Change Persona Button */}
        <button
          onClick={onChangePersonaClick}
          className="flex items-center space-x-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-extrabold transition-all shadow-md active:scale-95 cursor-pointer self-start sm:self-auto bg-[#447F98] hover:bg-[#629BB5] text-white border border-[#447F98]/40"
        >
          <UserCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span>{t("settings.change_role", currentLang)}</span>
          <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>

      </div>

      {/* Visual Safety Box */}
      <div className={`p-3 sm:p-5 rounded-2xl border ${badge.bg} mb-3 sm:mb-5 flex items-center space-x-3 shadow-sm`}>
        <div className="flex-shrink-0">
          {badge.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-0.5">
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider">
              {badge.text}
            </span>
          </div>
          <p className={`text-xs sm:text-sm font-bold leading-relaxed ${isDay ? 'text-[#0C181D]' : 'text-slate-100'}`}>
            {recommendation.message}
          </p>
        </div>
      </div>

      {/* Visual Recommendation Cards Grid */}
      {recommendation.cards && recommendation.cards.length > 0 && (
        <div>
          <h4 className={`text-[11px] sm:text-xs font-extrabold uppercase tracking-wider mb-2 ${
            isDay ? 'text-[#2A5364]' : 'text-[#B9D8E1]'
          }`}>
            Metric Actions
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            {recommendation.cards.map((card, idx) => {
              const action = getActionVisualIcon(card.type);

              return (
                <div
                  key={idx}
                  className={`p-2.5 sm:p-4 rounded-2xl border flex items-center space-x-2.5 shadow-sm ${
                    isDay ? 'bg-[#D6EBF3]/90 border-[#8CB8C6]' : 'bg-[#152A33]/80 border-[#447F98]/60'
                  }`}
                >
                  <div className={`p-1.5 sm:p-2 rounded-xl border flex-shrink-0 ${
                    isDay ? 'bg-[#EAEFF2] border-[#B9D8E1]' : 'bg-[#1F3E4B] border-[#447F98]/60'
                  }`}>
                    {action.icon}
                  </div>
                  <div>
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider block ${
                      isDay ? 'text-[#2A5364]' : 'text-[#B9D8E1]'
                    }`}>
                      {card.type.replace('_', ' ')}
                    </span>
                    <span className={`text-xs font-extrabold block mt-0.5 ${isDay ? 'text-[#0C181D]' : 'text-white'}`}>
                      {card.value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
