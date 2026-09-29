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
import { SupportedLanguage } from '../i18n/translations';

interface OnboardingModalProps {
  initialName?: string;
  initialPersona?: PersonaType;
  initialLang?: SupportedLanguage;
  initialTheme?: 'night' | 'day';
  onComplete: (user: { name: string; persona: PersonaType; lang: SupportedLanguage; theme: 'night' | 'day' }) => void;
}

const ROLES: { key: PersonaType; title: string; emoji: string; icon: React.ReactNode }[] = [
  { key: 'health', title: 'Health & Respiratory Care', emoji: '🫀', icon: <HeartPulse className="h-5 w-5 text-emerald-400" /> },
  { key: 'fitness', title: 'Outdoor Athlete & Workout', emoji: '🏃', icon: <Activity className="h-5 w-5 text-amber-400" /> },
  { key: 'beach', title: 'Beach & Coastal Watersports', emoji: '🏖️', icon: <Waves className="h-5 w-5 text-cyan-400" /> },
  { key: 'traveler', title: 'Traveler & Commuter', emoji: '✈️', icon: <Plane className="h-5 w-5 text-indigo-400" /> },
  { key: 'parents', title: 'Parents & Kids Outdoor Care', emoji: '👶', icon: <Baby className="h-5 w-5 text-pink-400" /> },
  { key: 'agriculture', title: 'Agriculture & Farming', emoji: '🌾', icon: <Sprout className="h-5 w-5 text-green-400" /> },
  { key: 'commuters', title: 'City Daily Commuter', emoji: '🚗', icon: <Car className="h-5 w-5 text-yellow-400" /> },
  { key: 'event_planners', title: 'Event & Outdoor Planner', emoji: '⛺', icon: <Calendar className="h-5 w-5 text-purple-400" /> },
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg overflow-y-auto animate-fadeIn">
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl w-full max-w-xl my-auto text-white relative">
        
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-cyan-500/20 animate-bounce">
            <SunMedium className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span>🌤️</span> Welcome to MAUSAM
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
            Personalize your weather experience in 3 simple visual steps
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 1. Name Input */}
          <div>
            <label className="text-xs font-black text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <User className="h-4 w-4" /> 👤 1. What is your Name?
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name (e.g. Dhiyanesh)"
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white font-semibold focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          {/* 2. Language Selector */}
          <div>
            <label className="text-xs font-black text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Globe className="h-4 w-4" /> 🌐 2. Choose Your App Language
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { code: 'en', label: 'English 🇺🇸' },
                { code: 'ta', label: 'தமிழ் 🇮🇳' },
                { code: 'hi', label: 'हिंदी 🇮🇳' }
              ].map(item => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setLang(item.code as SupportedLanguage)}
                  className={`py-3 rounded-xl border text-xs font-extrabold transition-all ${
                    lang === item.code
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 ring-2 ring-cyan-500/30'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Role / Persona Selection */}
          <div>
            <label className="text-xs font-black text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" /> 🎯 3. Select Your Daily Role / Persona
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {ROLES.map(({ key, title, emoji, icon }) => {
                const isSelected = persona === key;
                return (
                  <div
                    key={key}
                    onClick={() => setPersona(key)}
                    className={`cursor-pointer p-3 rounded-xl border flex items-center space-x-3 transition-all ${
                      isSelected
                        ? 'bg-slate-800 border-cyan-400 text-cyan-300 ring-2 ring-cyan-500/30'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <span className="text-xl">{emoji}</span>
                    <span className="text-xs font-bold leading-tight">{title}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Day Mode ☀️ vs Night Mode 🌙 */}
          <div>
            <label className="text-xs font-black text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sun className="h-4 w-4" /> 🌓 4. Select Display Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTheme('day')}
                className={`p-3.5 rounded-2xl border flex items-center justify-center space-x-2 font-extrabold text-xs transition-all ${
                  theme === 'day'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-400/40 shadow-lg'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <Sun className="h-5 w-5 text-amber-500" />
                <span>Day Mode ☀️</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('night')}
                className={`p-3.5 rounded-2xl border flex items-center justify-center space-x-2 font-extrabold text-xs transition-all ${
                  theme === 'night'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <Moon className="h-5 w-5 text-cyan-400" />
                <span>Night Mode 🌙</span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-base flex items-center justify-center space-x-2 shadow-xl shadow-cyan-500/20 active:scale-98 transition-all"
          >
            <span>Start Exploring MAUSAM</span>
            <ArrowRight className="h-5 w-5" />
          </button>

        </form>

      </div>
    </div>
  );
};
