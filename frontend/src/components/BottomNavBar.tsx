import React from 'react';
import { 
  Home, 
  UserCheck, 
  User, 
  Bookmark, 
  Settings as SettingsIcon 
} from 'lucide-react';
import { SupportedLanguage, t } from '../i18n/translations';
import { PersonaType } from '../types/weather';

interface BottomNavBarProps {
  activeTab: 'home' | 'personal' | 'profile' | 'saved' | 'settings';
  activePersona: PersonaType;
  currentLang: SupportedLanguage;
  currentTheme: 'night' | 'day';
  onGoHome: () => void;
  onGoPersonal: () => void;
  onGoProfile: () => void;
  onOpenSaved: () => void;
  onOpenSettings: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  activePersona,
  currentLang,
  currentTheme,
  onGoHome,
  onGoPersonal,
  onGoProfile,
  onOpenSaved,
  onOpenSettings
}) => {
  const isDay = currentTheme === 'day';

  return (
    <nav className={`sm:hidden fixed bottom-0 inset-x-0 z-40 px-1 py-1 border-t backdrop-blur-lg transition-colors ${
      isDay 
        ? 'bg-[#B9D8E1]/95 border-[#8CB8C6] text-[#0C181D]' 
        : 'bg-[#0F2129]/95 border-[#447F98]/50 text-white'
    }`}>
      <div className="flex items-center justify-around">
        
        {/* Home */}
        <button
          onClick={onGoHome}
          className={`flex flex-col items-center justify-center space-y-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'home'
              ? 'text-[#447F98] font-bold bg-[#D6EBF3]/40'
              : isDay ? 'text-[#2A5364]' : 'text-[#B9D8E1] hover:text-white'
          }`}
        >
          <Home className="h-4.5 w-4.5" />
          <span className="text-[10px] font-bold">{t("nav.home", currentLang)}</span>
        </button>

        {/* Personal */}
        <button
          onClick={onGoPersonal}
          className={`flex flex-col items-center justify-center space-y-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'personal'
              ? 'text-[#447F98] font-bold bg-[#D6EBF3]/40'
              : isDay ? 'text-[#2A5364]' : 'text-[#B9D8E1] hover:text-white'
          }`}
        >
          <UserCheck className="h-4.5 w-4.5" />
          <span className="text-[10px] font-bold">{t("nav.personal", currentLang)}</span>
        </button>

        {/* Profile */}
        <button
          onClick={onGoProfile}
          className={`flex flex-col items-center justify-center space-y-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'text-[#447F98] font-bold bg-[#D6EBF3]/40'
              : isDay ? 'text-[#2A5364]' : 'text-[#B9D8E1] hover:text-white'
          }`}
        >
          <User className="h-4.5 w-4.5" />
          <span className="text-[10px] font-bold">{t("nav.profile", currentLang)}</span>
        </button>

        {/* Saved Cities */}
        <button
          onClick={onOpenSaved}
          className={`flex flex-col items-center justify-center space-y-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'saved'
              ? 'text-[#447F98] font-bold bg-[#D6EBF3]/40'
              : isDay ? 'text-[#2A5364]' : 'text-[#B9D8E1] hover:text-white'
          }`}
        >
          <Bookmark className="h-4.5 w-4.5" />
          <span className="text-[10px] font-bold">{t("nav.saved", currentLang)}</span>
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className={`flex flex-col items-center justify-center space-y-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'text-[#447F98] font-bold bg-[#D6EBF3]/40'
              : isDay ? 'text-[#2A5364]' : 'text-[#B9D8E1] hover:text-white'
          }`}
        >
          <SettingsIcon className="h-4.5 w-4.5" />
          <span className="text-[10px] font-bold">{t("nav.settings", currentLang)}</span>
        </button>

      </div>
    </nav>
  );
};
