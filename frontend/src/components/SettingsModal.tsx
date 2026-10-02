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
import { getPersonaIcon } from '../utils/visualIcons';

interface SettingsModalProps {
  userName: string;
  activePersona: PersonaType;
  currentLang: SupportedLanguage;
  currentTheme: 'night' | 'day';
  onUpdateSettings: (user: { name: string; persona: PersonaType; lang: SupportedLanguage; theme: 'night' | 'day' }) => void;
  onClose: () => void;
}

const ROLES: { key: PersonaType; title: string }[] = [
  { key: 'health', title: 'Health & Respiratory' },
  { key: 'fitness', title: 'Outdoor Fitness' },
  { key: 'beach', title: 'Beach & Marine' },
  { key: 'traveler', title: 'Traveler & Transit' },
  { key: 'parents', title: 'Parents & Kids' },
  { key: 'agriculture', title: 'Agriculture & Farming' },
  { key: 'commuters', title: 'City Commuter' },
  { key: 'event_planners', title: 'Event Planner' },
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#060D10]/85 backdrop-blur-md overflow-y-auto">
      <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-[#447F98]/50 w-full max-w-lg shadow-2xl relative text-white my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-[#447F98]" />
            {t("nav.settings", lang)}
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full bg-[#152A33] cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 sm:space-y-5 max-h-[70vh] overflow-y-auto pr-1">
          
          {/* 1. Name */}
          <div>
            <label className="text-xs font-bold text-[#B9D8E1] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <User className="h-4 w-4 text-[#447F98]" /> {t("settings.user_name", lang)}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#152A33] border border-[#447F98]/60 rounded-xl px-3.5 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-[#629BB5]"
            />
          </div>

          {/* 2. Display Mode: Day Mode vs Night Mode */}
          <div>
            <label className="text-xs font-bold text-[#B9D8E1] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sun className="h-4 w-4 text-amber-400" /> {t("settings.display_mode", lang)}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTheme('day')}
                className={`p-3 rounded-xl border flex items-center justify-center space-x-2 font-bold text-xs transition-all cursor-pointer ${
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
                className={`p-3 rounded-xl border flex items-center justify-center space-x-2 font-bold text-xs transition-all cursor-pointer ${
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

          {/* 3. Role / Persona Selection */}
          <div>
            <label className="text-xs font-bold text-[#B9D8E1] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <UserCheck className="h-4 w-4 text-[#447F98]" /> {t("settings.change_role", lang)}
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
              {ROLES.map(({ key, title }) => {
                const isSelected = persona === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPersona(key)}
                    className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#447F98] border-[#629BB5] text-white'
                        : 'bg-[#152A33] border-[#1F3E4B] text-[#B9D8E1] hover:bg-[#1F3E4B]'
                    }`}
                  >
                    {getPersonaIcon(key, "h-4 w-4 flex-shrink-0 text-white")}
                    <span className="truncate">{t(`persona.${key}`, lang) || title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Language Preference */}
          <div>
            <label className="text-xs font-bold text-[#B9D8E1] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-[#447F98]" /> {t("settings.language", lang)}
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
                  className={`py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    lang === item.code
                      ? 'bg-[#447F98] border-[#629BB5] text-white'
                      : 'bg-[#152A33] border-[#1F3E4B] text-[#B9D8E1] hover:bg-[#1F3E4B]'
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
          className="w-full mt-6 py-3 rounded-xl bg-[#447F98] hover:bg-[#629BB5] text-white font-black text-sm flex items-center justify-center space-x-1.5 transition-all shadow-lg cursor-pointer"
        >
          <Check className="h-4 w-4 text-[#D6EBF3]" />
          <span>{t("settings.save_btn", lang)}</span>
        </button>

      </div>
    </div>
  );
};
