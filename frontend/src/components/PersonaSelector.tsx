import React from 'react';
import { 
  HeartPulse, 
  Activity, 
  Waves, 
  Plane, 
  Baby, 
  Sprout, 
  Car, 
  Calendar,
  CheckCircle2,
  X,
  UserCheck
} from 'lucide-react';
import { PersonaType } from '../types/weather';
import { SupportedLanguage, t } from '../i18n/translations';

interface PersonaSelectorProps {
  activePersona: PersonaType;
  currentLang: SupportedLanguage;
  onSelectPersona: (persona: PersonaType) => void;
  onClose: () => void;
}

const PERSONA_CONFIG: { 
  key: PersonaType; 
  icon: React.ReactNode; 
  emoji: string;
  color: string;
  visualTag: string;
}[] = [
  { key: 'health', icon: <HeartPulse className="h-8 w-8" />, emoji: '🫀 🏥', color: 'from-emerald-500 to-teal-600', visualTag: '🟢 AQI & Pollen' },
  { key: 'fitness', icon: <Activity className="h-8 w-8" />, emoji: '🏃 🚴', color: 'from-orange-500 to-amber-600', visualTag: '🟢 Workout Time' },
  { key: 'beach', icon: <Waves className="h-8 w-8" />, emoji: '🏖️ 🌊', color: 'from-cyan-500 to-blue-600', visualTag: '🌊 Sea & Swell' },
  { key: 'traveler', icon: <Plane className="h-8 w-8" />, emoji: '✈️ 🧳', color: 'from-indigo-500 to-purple-600', visualTag: '✈️ Travel & Road' },
  { key: 'parents', icon: <Baby className="h-8 w-8" />, emoji: '👶 🛝', color: 'from-rose-500 to-pink-600', visualTag: '🧸 Kids Playtime' },
  { key: 'agriculture', icon: <Sprout className="h-8 w-8" />, emoji: '🌾 🚜', color: 'from-green-500 to-emerald-700', visualTag: '🌱 Crops & Rain' },
  { key: 'commuters', icon: <Car className="h-8 w-8" />, emoji: '🚗 🛵', color: 'from-yellow-500 to-amber-700', visualTag: '🚗 Road & Rain' },
  { key: 'event_planners', icon: <Calendar className="h-8 w-8" />, emoji: '⛺ 🎪', color: 'from-violet-500 to-purple-700', visualTag: '🎪 Tent & Wind' },
];

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  activePersona,
  currentLang,
  onSelectPersona,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="glass-card rounded-3xl p-5 sm:p-8 border border-slate-700/80 shadow-2xl relative w-full max-w-4xl my-auto">
        
        {/* Close Modal Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/90 border border-slate-700 transition-colors"
          title="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-extrabold uppercase tracking-wider mb-1">
            <UserCheck className="h-4 w-4" />
            <span>Select Your Lifestyle Visual Persona</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>🎯</span> {t("persona.title", currentLang)}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tap your lifestyle icon to get instant visual weather recommendations
          </p>
        </div>

        {/* 8 Hyper-Visual Persona Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 max-h-[65vh] overflow-y-auto pr-1">
          {PERSONA_CONFIG.map(({ key, icon, emoji, color, visualTag }) => {
            const isSelected = activePersona === key;
            const title = t(`persona.${key}`, currentLang);

            return (
              <div
                key={key}
                onClick={() => onSelectPersona(key)}
                className={`cursor-pointer rounded-2xl p-4 transition-all duration-200 relative border flex flex-col justify-between items-center text-center ${
                  isSelected 
                    ? 'bg-slate-800/95 border-cyan-400/90 shadow-xl shadow-cyan-500/20 ring-2 ring-cyan-500/40 transform scale-[1.02]' 
                    : 'bg-slate-900/80 border-slate-800 hover:bg-slate-800/70 hover:border-slate-700'
                }`}
              >
                {isSelected && (
                  <CheckCircle2 className="h-5 w-5 text-cyan-400 absolute top-3 right-3" />
                )}
                
                {/* Visual Emojis Header */}
                <span className="text-2xl mb-1">{emoji}</span>

                {/* Big Icon Circle */}
                <div className={`h-14 w-14 rounded-2xl bg-gradient-to-tr ${color} flex items-center justify-center text-white mb-2 shadow-lg`}>
                  {icon}
                </div>

                <div className="w-full">
                  <h3 className="text-xs sm:text-sm font-extrabold text-white mb-1">
                    {title}
                  </h3>
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950 text-cyan-300 border border-slate-800">
                    {visualTag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
