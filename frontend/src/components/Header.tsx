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
  activeTab: 'home' | 'personal' | 'profile';
  onTabChange: (tab: 'home' | 'personal' | 'profile') => void;
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
  activeTab,
  onTabChange,
  onOpenSavedLocations,
  onOpenSettings,
  onLanguageChange,
  onToggleTheme,
  onOpenProfile
}) => {
  const isDay = currentTheme === 'day';
  const userInitial = userName.trim() ? userName.trim().charAt(0).toUpperCase() : 'P';

  return (
    <header className={`sticky top-0 z-40 w-full border-b px-1.5 sm:px-8 py-2 transition-colors duration-300 ${
      isDay 
        ? 'bg-[#D6EBF3]/95 border-[#B9D8E1] text-[#152A33] backdrop-blur-md' 
        : 'bg-[#0F2129]/95 border-[#447F98]/40 text-[#D6EBF3] backdrop-blur-md'
    }`}>
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-6">
        
        {/* Brand Logo & Name */}
        <div 
          className="flex items-center space-x-2 cursor-pointer group" 
          onClick={() => onTabChange('home')}
        >
          <img 
            src="/logo.png" 
            alt="India Meteorological Department" 
            className="h-9 sm:h-11 w-auto object-contain group-hover:scale-105 transition-transform" 
          />
          <div>
            <h1 className={`text-sm sm:text-xl font-black tracking-tight flex items-center gap-1 ${
              isDay ? 'text-[#152A33]' : 'text-white'
            }`}>
              {t("app.title", currentLang)}
            </h1>
          </div>
        </div>

        {/* Center Pill Navigation Tabs (Home, Personal, Profile) */}
        <nav className="hidden md:flex items-center space-x-2 p-1 rounded-full bg-[#152A33]/30 border border-[#447F98]/40">
          <button
            onClick={() => onTabChange('home')}
            className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'home'
                ? 'bg-[#447F98] text-white shadow-sm'
                : isDay
                  ? 'text-[#2A5364] hover:text-[#0C181D]'
                  : 'text-[#B9D8E1] hover:text-white'
            }`}
          >
            <span>{t("nav.home", currentLang)}</span>
          </button>

          <button
            onClick={() => onTabChange('personal')}
            className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'personal'
                ? 'bg-[#447F98] text-white shadow-sm'
                : isDay
                  ? 'text-[#2A5364] hover:text-[#0C181D]'
                  : 'text-[#B9D8E1] hover:text-white'
            }`}
          >
            <span>{t("nav.personal", currentLang)}</span>
          </button>

          <button
            onClick={() => onTabChange('profile')}
            className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#447F98] text-white shadow-sm'
                : isDay
                  ? 'text-[#2A5364] hover:text-[#0C181D]'
                  : 'text-[#B9D8E1] hover:text-white'
            }`}
          >
            <span>{t("nav.profile", currentLang)}</span>
          </button>
        </nav>

        {/* Right Controls: Location, Language, Nightmode, User Badge */}
        <div className="flex items-center space-x-1.5 sm:space-x-3">
          
          {/* Location Selector Button */}
          <button
            onClick={onOpenSavedLocations}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${
              isDay 
                ? 'bg-[#EAEFF2] hover:bg-white border-[#B9D8E1] text-[#152A33]' 
                : 'bg-[#152A33] hover:bg-[#1F3E4B] border-[#447F98]/50 text-[#D6EBF3]'
            }`}
          >
            <MapPin className="h-3.5 w-3.5 text-[#629BB5]" />
            <span className="max-w-[70px] sm:max-w-[140px] truncate">{currentCity}</span>
          </button>

          {/* Language Switcher Dropdown */}
          <div className={`flex items-center border rounded-full px-2 py-1 ${
            isDay 
              ? 'bg-[#EAEFF2] border-[#B9D8E1] text-[#152A33]' 
              : 'bg-[#152A33] border-[#447F98]/50 text-[#D6EBF3]'
          }`}>
            <Globe className="h-3.5 w-3.5 text-[#629BB5] mr-1 hidden sm:inline" />
            <select
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
              className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer"
            >
              <option value="en" className={isDay ? "bg-white text-[#152A33]" : "bg-[#0C181D] text-white"}>English</option>
              <option value="ta" className={isDay ? "bg-white text-[#152A33]" : "bg-[#0C181D] text-white"}>தமிழ்</option>
              <option value="hi" className={isDay ? "bg-white text-[#152A33]" : "bg-[#0C181D] text-white"}>हिंदी</option>
            </select>
          </div>

          {/* Display Mode Toggle */}
          <button
            onClick={onToggleTheme}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${
              isDay
                ? 'bg-[#EAEFF2] text-[#152A33] border-[#B9D8E1] hover:bg-white'
                : 'bg-[#1F3E4B] text-[#D6EBF3] border-[#447F98]/60'
            }`}
          >
            {isDay ? (
              <>
                <Moon className="h-3.5 w-3.5 text-[#447F98]" />
                <span className="hidden sm:inline">{t("settings.night_mode", currentLang)}</span>
              </>
            ) : (
              <>
                <Sun className="h-3.5 w-3.5 text-amber-300" />
                <span className="hidden sm:inline">{t("settings.day_mode", currentLang)}</span>
              </>
            )}
          </button>

          {/* User Profile Initial Badge Circle */}
          <button
            onClick={() => onTabChange('profile')}
            title={`Logged in as ${userName}`}
            className="h-8 w-8 rounded-full bg-[#447F98] hover:bg-[#629BB5] text-white font-black text-xs flex items-center justify-center shadow-md transition-transform hover:scale-105 cursor-pointer"
          >
            {userInitial}
          </button>

        </div>

      </div>
    </header>
  );
};
