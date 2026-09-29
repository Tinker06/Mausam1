import React from 'react';
import { 
  SunMedium, 
  MapPin, 
  UserCheck, 
  Globe, 
  Bookmark, 
  Settings as SettingsIcon,
  Sun,
  Moon,
  User
} from 'lucide-react';
import { SupportedLanguage, t } from '../i18n/translations';
import { PersonaType } from '../types/weather';

interface HeaderProps {
  userName: string;
  currentCity: string;
  activePersona: PersonaType;
  currentLang: SupportedLanguage;
  currentTheme: 'night' | 'day';
  onSelectPersonaClick: () => void;
  onOpenSavedLocations: () => void;
  onOpenSettings: () => void;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onToggleTheme: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userName,
  currentCity,
  activePersona,
  currentLang,
  currentTheme,
  onSelectPersonaClick,
  onOpenSavedLocations,
  onOpenSettings,
  onLanguageChange,
  onToggleTheme,
  onOpenProfile
}) => {
  const isDay = currentTheme === 'day';

  return (
    <header className={`sticky top-0 z-40 w-full border-b px-3 sm:px-8 py-2.5 transition-colors duration-300 ${
      isDay 
        ? 'glass-card-day border-slate-200 bg-white/90 text-slate-900 shadow-md' 
        : 'glass-card border-slate-800/80 bg-slate-950/80 text-white'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={onOpenProfile}>
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 flex-shrink-0">
            <SunMedium className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div>
            <h1 className={`text-base sm:text-xl font-extrabold tracking-tight flex items-center gap-1.5 ${isDay ? 'text-slate-900' : 'text-white'}`}>
              {t("app.title", currentLang)}
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium hidden sm:inline ${
                isDay ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              }`}>
                v1.0
              </span>
            </h1>
            <p className={`text-[10px] font-bold flex items-center gap-1 ${isDay ? 'text-blue-600' : 'text-cyan-300'}`}>
              <User className="h-3 w-3" /> {userName}
            </p>
          </div>
        </div>

        {/* Location Selector Button */}
        <button
          onClick={onOpenSavedLocations}
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
            isDay 
              ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800' 
              : 'bg-slate-800/90 hover:bg-slate-700/80 border-slate-700 text-slate-200'
          }`}
        >
          <MapPin className="h-3.5 w-3.5 text-cyan-500" />
          <span className="max-w-[90px] sm:max-w-[180px] truncate">{currentCity}</span>
        </button>

        {/* Action Controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5">
          
          {/* Day Mode ☀️ vs Night Mode 🌙 Quick Toggle */}
          <button
            onClick={onToggleTheme}
            title={isDay ? "Switch to Night Mode 🌙" : "Switch to Day Mode ☀️"}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-black transition-all ${
              isDay
                ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-sm'
                : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
            }`}
          >
            {isDay ? (
              <>
                <Sun className="h-4 w-4 text-amber-600" />
                <span>Day Mode ☀️</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-cyan-400" />
                <span>Night Mode 🌙</span>
              </>
            )}
          </button>

          {/* Active Persona Pill */}
          <button
            onClick={onSelectPersonaClick}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
              isDay
                ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                : 'bg-gradient-to-r from-blue-600/30 to-cyan-500/30 hover:from-blue-600/40 hover:to-cyan-500/40 border-cyan-500/40 text-cyan-300'
            }`}
          >
            <UserCheck className="h-3.5 w-3.5 text-cyan-500" />
            <span className="capitalize">{activePersona.replace('_', ' ')}</span>
          </button>

          {/* Language Switcher */}
          <div className={`relative flex items-center border rounded-xl px-1.5 py-1 ${
            isDay ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-slate-800/80 border-slate-700 text-slate-200'
          }`}>
            <Globe className="h-3.5 w-3.5 text-slate-400 mr-1 hidden sm:inline" />
            <select
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
              className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="en" className={isDay ? "bg-white text-slate-900" : "bg-slate-900 text-white"}>EN</option>
              <option value="ta" className={isDay ? "bg-white text-slate-900" : "bg-slate-900 text-white"}>TA (தமிழ்)</option>
              <option value="hi" className={isDay ? "bg-white text-slate-900" : "bg-slate-900 text-white"}>HI (हिंदी)</option>
            </select>
          </div>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            title={t("nav.settings", currentLang)}
            className={`p-2 rounded-xl border transition-colors hidden sm:flex ${
              isDay ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
          >
            <SettingsIcon className="h-4 w-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
