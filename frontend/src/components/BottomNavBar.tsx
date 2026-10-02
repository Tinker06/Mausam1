import React from 'react';
import { 
  Home, 
  UserCheck, 
  Bookmark, 
  Settings as SettingsIcon 
} from 'lucide-react';
import { SupportedLanguage, t } from '../i18n/translations';
import { PersonaType } from '../types/weather';

interface BottomNavBarProps {
  activeTab: 'dashboard' | 'persona' | 'saved' | 'settings';
  activePersona: PersonaType;
  currentLang: SupportedLanguage;
  currentTheme: 'night' | 'day';
  onOpenPersona: () => void;
  onOpenSaved: () => void;
  onOpenSettings: () => void;
  onGoHome: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  activePersona,
  currentLang,
  currentTheme,
  onOpenPersona,
  onOpenSaved,
  onOpenSettings,
  onGoHome
}) => {
  const isDay = currentTheme === 'day';

  return (
    <nav className={`sm:hidden fixed bottom-0 inset-x-0 z-40 px-2 py-1.5 border-t backdrop-blur-lg transition-colors ${
      isDay 
        ? 'bg-[#B9D8E1]/95 border-[#8CB8C6] text-[#0C181D]' 
        : 'bg-[#0F2129]/95 border-[#447F98]/50 text-white'
    }`}>
      <div className="flex items-center justify-around">
        
        {/* Dashboard / Home */}
        <button
          onClick={onGoHome}
          className={`flex flex-col items-center justify-center space-y-0.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'dashboard'
              ? 'text-[#447F98] font-bold bg-[#D6EBF3]/40'
              : isDay ? 'text-[#2A5364]' : 'text-[#B9D8E1] hover:text-white'
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px] font-medium">{t("nav.dashboard", currentLang)}</span>
        </button>

        {/* Persona Quick Tab */}
        <button
          onClick={onOpenPersona}
          className={`flex flex-col items-center justify-center space-y-0.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'persona'
              ? 'text-[#447F98] font-bold bg-[#D6EBF3]/40'
              : isDay ? 'text-[#2A5364]' : 'text-[#B9D8E1] hover:text-white'
          }`}
        >
          <UserCheck className="h-5 w-5" />
          <span className="text-[10px] font-medium capitalize">{activePersona.split('_')[0]}</span>
        </button>

        {/* Saved Cities */}
        <button
          onClick={onOpenSaved}
          className={`flex flex-col items-center justify-center space-y-0.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'saved'
              ? 'text-[#447F98] font-bold bg-[#D6EBF3]/40'
              : isDay ? 'text-[#2A5364]' : 'text-[#B9D8E1] hover:text-white'
          }`}
        >
          <Bookmark className="h-5 w-5" />
          <span className="text-[10px] font-medium">{t("nav.saved", currentLang)}</span>
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className={`flex flex-col items-center justify-center space-y-0.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'text-[#447F98] font-bold bg-[#D6EBF3]/40'
              : isDay ? 'text-[#2A5364]' : 'text-[#B9D8E1] hover:text-white'
          }`}
        >
          <SettingsIcon className="h-5 w-5" />
          <span className="text-[10px] font-medium">{t("nav.settings", currentLang)}</span>
        </button>

      </div>
    </nav>
  );
};
