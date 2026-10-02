import React, { useState } from 'react';
import { 
  SunMedium, 
  User, 
  Globe, 
  ArrowRight, 
  Sparkles,
  HeartPulse,
  Activity,
  Waves,
  Plane,
  Baby,
  Sprout,
  Car,
  Calendar,
  Sun,
  Moon
} from 'lucide-react';
import { PersonaType } from '../types/weather';
import { SupportedLanguage, t } from '../i18n/translations';

interface OnboardingModalProps {
  initialName?: string;
  initialPersona?: PersonaType;
  initialLang?: SupportedLanguage;
  initialTheme?: 'night' | 'day';
  onComplete: (user: { name: string; persona: PersonaType; lang: SupportedLanguage; theme: 'night' | 'day' }) => void;
}

const ROLES: { key: PersonaType; titleKey: string; icon: React.ReactNode }[] = [
  { key: 'health', titleKey: 'persona.health', icon: <HeartPulse className="h-5 w-5 text-emerald-400" /> },
  { key: 'fitness', titleKey: 'persona.fitness', icon: <Activity className="h-5 w-5 text-amber-400" /> },
  { key: 'beach', titleKey: 'persona.beach', icon: <Waves className="h-5 w-5 text-cyan-400" /> },
  { key: 'traveler', titleKey: 'persona.traveler', icon: <Plane className="h-5 w-5 text-indigo-400" /> },
  { key: 'parents', titleKey: 'persona.parents', icon: <Baby className="h-5 w-5 text-pink-400" /> },
  { key: 'agriculture', titleKey: 'persona.agriculture', icon: <Sprout className="h-5 w-5 text-green-400" /> },
  { key: 'commuters', titleKey: 'persona.commuters', icon: <Car className="h-5 w-5 text-yellow-400" /> },
  { key: 'event_planners', titleKey: 'persona.event_planners', icon: <Calendar className="h-5 w-5 text-purple-400" /> },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  initialName = '',
  initialPersona = 'health',
  initialLang = 'en',
  initialTheme = 'night',
  onComplete
}) => {
  const [name, setName] = useState(initialName);
  const [persona, setPersona] = useState<PersonaType>(initialPersona);
  const [lang, setLang] = useState<SupportedLanguage>(initialLang);
  const [theme, setTheme] = useState<'night' | 'day'>(initialTheme);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      name: name.trim() || 'Weather Traveler',
      persona,
      lang,
      theme
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#060D10]/90 backdrop-blur-lg overflow-y-auto animate-fadeIn">
      <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-[#447F98]/50 shadow-2xl w-full max-w-xl my-auto text-white relative">
        
        {/* Header Branding with IMD Logo */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="h-16 w-16 rounded-2xl bg-[#152A33] border border-[#447F98]/60 flex items-center justify-center mx-auto mb-2.5 shadow-lg p-2">
            <img src="/logo.png" alt="IMD Logo" className="h-full w-full object-contain" />
          </div>
          <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            {t("onboarding.welcome", lang)}
          </h2>
          <p className="text-xs sm:text-sm text-[#B9D8E1] font-medium mt-1">
            {t("onboarding.subtitle", lang)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          
          {/* 1. Name Input */}
          <div>
            <label className="text-xs font-black text-[#D6EBF3] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <User className="h-4 w-4 text-[#447F98]" /> {t("onboarding.step1", lang)}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-[#152A33] border border-[#447F98]/60 rounded-2xl px-4 py-2.5 sm:py-3 text-sm text-white font-semibold focus:outline-none focus:border-[#629BB5]"
            />
          </div>

          {/* 2. Language Selector */}
          <div>
            <label className="text-xs font-black text-[#D6EBF3] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-[#447F98]" /> {t("onboarding.step2", lang)}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { code: 'en', label: 'English' },
                { code: 'ta', label: 'தமிழ்' },
                { code: 'hi', label: 'हिंदी' }
              ].map(item => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setLang(item.code as SupportedLanguage)}
                  className={`py-2.5 sm:py-3 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                    lang === item.code
                      ? 'bg-[#447F98] border-[#629BB5] text-white ring-2 ring-[#447F98]/30'
                      : 'bg-[#152A33] border-[#1F3E4B] text-[#B9D8E1] hover:bg-[#1F3E4B]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Role / Persona Selection */}
          <div>
            <label className="text-xs font-black text-[#D6EBF3] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-[#447F98]" /> {t("onboarding.step3", lang)}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {ROLES.map(({ key, titleKey, icon }) => {
                const isSelected = persona === key;
                return (
                  <div
                    key={key}
                    onClick={() => setPersona(key)}
                    className={`cursor-pointer p-2.5 sm:p-3 rounded-xl border flex items-center space-x-3 transition-all ${
                      isSelected
                        ? 'bg-[#447F98] border-[#629BB5] text-white ring-2 ring-[#447F98]/30'
                        : 'bg-[#152A33]/80 border-[#1F3E4B] text-[#B9D8E1] hover:bg-[#1F3E4B]'
                    }`}
                  >
                    {icon}
                    <span className="text-xs font-bold leading-tight">{t(titleKey, lang)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Display Mode */}
          <div>
            <label className="text-xs font-black text-[#D6EBF3] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sun className="h-4 w-4 text-amber-400" /> {t("onboarding.step4", lang)}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTheme('day')}
                className={`p-3 rounded-2xl border flex items-center justify-center space-x-2 font-extrabold text-xs transition-all cursor-pointer ${
                  theme === 'day'
                    ? 'bg-[#447F98] text-white border-[#629BB5] ring-2 ring-[#447F98]/40 shadow-lg'
                    : 'bg-[#152A33] text-[#B9D8E1] border-[#1F3E4B] hover:bg-[#1F3E4B]'
                }`}
              >
                <Sun className="h-4 w-4 text-amber-300" />
                <span>{t("settings.day_mode", lang)}</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('night')}
                className={`p-3 rounded-2xl border flex items-center justify-center space-x-2 font-extrabold text-xs transition-all cursor-pointer ${
                  theme === 'night'
                    ? 'bg-[#447F98] text-white border-[#629BB5] ring-2 ring-[#447F98]/40 shadow-lg'
                    : 'bg-[#152A33] text-[#B9D8E1] border-[#1F3E4B] hover:bg-[#1F3E4B]'
                }`}
              >
                <Moon className="h-4 w-4 text-[#D6EBF3]" />
                <span>{t("settings.night_mode", lang)}</span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 sm:py-4 rounded-2xl bg-[#447F98] hover:bg-[#629BB5] text-white font-black text-sm sm:text-base flex items-center justify-center space-x-2 shadow-xl active:scale-98 transition-all cursor-pointer"
          >
            <span>{t("onboarding.start_btn", lang)}</span>
            <ArrowRight className="h-5 w-5" />
          </button>

        </form>

      </div>
    </div>
  );
};
