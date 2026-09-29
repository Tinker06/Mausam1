import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  UserCheck 
} from 'lucide-react';
import { RecommendationData, PersonaType } from '../types/weather';
import { SupportedLanguage } from '../i18n/translations';
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
  currentTheme = 'night',
  onChangePersonaClick
}) => {
  const isDay = currentTheme === 'day';
  const badge = getSafetyVisualBadge(recommendation.priority);

  return (
    <div className={`rounded-3xl p-5 sm:p-8 border shadow-2xl relative transition-colors duration-300 ${
      isDay 
        ? 'glass-card-day bg-white/90 text-slate-900 border-slate-200 shadow-lg' 
        : 'glass-card text-white border-slate-700/80'
    }`}>
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-2xl border ${isDay ? 'bg-blue-50 border-blue-200' : 'bg-slate-800 border-slate-700'}`}>
            <Sparkles className="h-6 w-6 text-cyan-500" />
          </div>
          <div>
            <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider block">
              {activePersona.replace('_', ' ')} Guidance
            </span>
            <h3 className={`text-lg sm:text-xl font-black tracking-tight flex items-center gap-2 ${isDay ? 'text-slate-900' : 'text-white'}`}>
              <span>{badge.emoji}</span>
              <span>{recommendation.headline}</span>
            </h3>
          </div>
        </div>

        {/* Change Persona Button */}
        <button
          onClick={onChangePersonaClick}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl border text-xs font-extrabold transition-all shadow-md active:scale-95 cursor-pointer self-start sm:self-auto ${
            isDay 
              ? 'bg-blue-600 text-white hover:bg-blue-700 border-blue-700' 
              : 'bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-500/40 text-cyan-300'
          }`}
        >
          <UserCheck className="h-4 w-4" />
          <span>Change Persona</span>
          <ArrowRight className="h-4 w-4" />
        </button>

      </div>

      {/* Visual Safety Box */}
      <div className={`p-4 sm:p-5 rounded-2xl border ${badge.bg} mb-5 flex items-center space-x-4 shadow-sm`}>
        <div className="flex-shrink-0">
          {badge.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-black uppercase tracking-wider">
              {badge.text}
            </span>
          </div>
          <p className={`text-xs sm:text-sm font-bold leading-relaxed ${isDay ? 'text-slate-900' : 'text-slate-100'}`}>
            {recommendation.message}
          </p>
        </div>
      </div>

      {/* Visual Recommendation Cards Grid */}
      {recommendation.cards && recommendation.cards.length > 0 && (
        <div>
          <h4 className={`text-xs font-extrabold uppercase tracking-wider mb-3 flex items-center gap-1.5 ${isDay ? 'text-slate-600' : 'text-slate-400'}`}>
            <span>🎯</span> Visual Metric Actions
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {recommendation.cards.map((card, idx) => {
              const action = getActionVisualIcon(card.type);

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border flex items-center space-x-3 shadow-sm ${
                    isDay ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl border flex-shrink-0 ${isDay ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                    <span className="text-xl block">{action.emoji}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-cyan-600 uppercase tracking-wider block">
                      {card.type.replace('_', ' ')}
                    </span>
                    <span className={`text-xs font-extrabold block mt-0.5 ${isDay ? 'text-slate-900' : 'text-white'}`}>
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
