import React, { useState } from 'react';
import { 
  X, 
  Settings as SettingsIcon, 
  Globe, 
  Bell, 
  User, 
  Sun, 
  Moon, 
  UserCheck, 
  Flame, 
  Check 
} from 'lucide-react';
import { SupportedLanguage, t } from '../i18n/translations';
import { PersonaType } from '../types/weather';

interface SettingsModalProps {
  userName: string;
  activePersona: PersonaType;
  currentLang: SupportedLanguage;
  currentTheme: 'night' | 'day';
  onUpdateSettings: (user: { name: string; persona: PersonaType; lang: SupportedLanguage; theme: 'night' | 'day' }) => void;
  onClose: () => void;
}

const ROLES: { key: PersonaType; title: string; emoji: string }[] = [
  { key: 'health', title: 'Health & Respiratory', emoji: '🫀' },
  { key: 'fitness', title: 'Outdoor Fitness', emoji: '🏃' },
  { key: 'beach', title: 'Beach & Marine', emoji: '🏖️' },
  { key: 'traveler', title: 'Traveler & Transit', emoji: '✈️' },
  { key: 'parents', title: 'Parents & Kids', emoji: '👶' },
  { key: 'agriculture', title: 'Agriculture & Farming', emoji: '🌾' },
  { key: 'commuters', title: 'City Commuter', emoji: '🚗' },
  { key: 'event_planners', title: 'Event Planner', emoji: '⛺' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  userName,
  activePersona,
  currentLang,
  currentTheme,
  onUpdateSettings,
  onClose
}) => {
  const [name, setName] = useState(userName);
  const [persona, setPersona] = useState<PersonaType>(activePersona);
  const [lang, setLang] = useState<SupportedLanguage>(currentLang);
  const [theme, setTheme] = useState<'night' | 'day'>(currentTheme);

  const handleSave = () => {
    onUpdateSettings({
      name: name.trim() || 'User',
      persona,
      lang,
      theme
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-700 w-full max-w-lg shadow-2xl relative text-white my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-cyan-400" />
            {t("nav.settings", currentLang)}
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
          
          {/* 1. Name */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <User className="h-4 w-4 text-cyan-400" /> User Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* 2. Display Mode: Day Mode ☀️ vs Night Mode 🌙 */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sun className="h-4 w-4 text-amber-400" /> Display Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTheme('day')}
                className={`p-3 rounded-xl border flex items-center justify-center space-x-2 font-bold text-xs transition-all ${
                  theme === 'day'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-400/40 shadow-lg'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <Sun className="h-4 w-4 text-amber-500" />
                <span>Day Mode ☀️</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('night')}
                className={`p-3 rounded-xl border flex items-center justify-center space-x-2 font-bold text-xs transition-all ${
                  theme === 'night'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <Moon className="h-4 w-4 text-cyan-400" />
                <span>Night Mode 🌙</span>
              </button>
            </div>
          </div>

          {/* 3. Role / Persona Selection */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <UserCheck className="h-4 w-4 text-cyan-400" /> Change Role / Persona
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
              {ROLES.map(({ key, title, emoji }) => {
                const isSelected = persona === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPersona(key)}
                    className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-slate-800 border-cyan-400 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <span>{emoji}</span>
                    <span className="truncate">{title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Language Preference */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-cyan-400" /> {t("settings.language", currentLang)}
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
                  className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                    lang === item.code
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full mt-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm flex items-center justify-center space-x-1.5 transition-all shadow-lg"
        >
          <Check className="h-4 w-4" />
          <span>Save Settings</span>
        </button>

      </div>
    </div>
  );
};
