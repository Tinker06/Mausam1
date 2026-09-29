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
    <nav className={`sm:hidden fixed bottom-0 inset-x-0 z-40 px-3 py-2 border-t backdrop-blur-lg transition-colors ${
      isDay 
        ? 'bg-white/95 border-slate-200 text-slate-800 shadow-xl' 
        : 'glass-card border-slate-800/90 bg-slate-950/95 text-slate-100'
    }`}>
      <div className="flex items-center justify-around">
        
        {/* Dashboard / Home */}
        <button
          onClick={onGoHome}
          className={`flex flex-col items-center justify-center space-y-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'dashboard'
              ? isDay ? 'text-blue-600 font-bold bg-blue-50' : 'text-cyan-400 font-bold bg-cyan-500/10'
              : isDay ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px] font-medium">{t("nav.dashboard", currentLang)}</span>
        </button>

        {/* Persona Quick Tab */}
        <button
          onClick={onOpenPersona}
          className={`flex flex-col items-center justify-center space-y-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'persona'
              ? isDay ? 'text-blue-600 font-bold bg-blue-50' : 'text-cyan-400 font-bold bg-cyan-500/10'
              : isDay ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserCheck className="h-5 w-5" />
          <span className="text-[10px] font-medium capitalize">{activePersona.split('_')[0]}</span>
        </button>

        {/* Saved Cities */}
        <button
          onClick={onOpenSaved}
          className={`flex flex-col items-center justify-center space-y-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'saved'
              ? isDay ? 'text-blue-600 font-bold bg-blue-50' : 'text-cyan-400 font-bold bg-cyan-500/10'
              : isDay ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bookmark className="h-5 w-5" />
          <span className="text-[10px] font-medium">{t("nav.saved", currentLang)}</span>
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className={`flex flex-col items-center justify-center space-y-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'settings'
              ? isDay ? 'text-blue-600 font-bold bg-blue-50' : 'text-cyan-400 font-bold bg-cyan-500/10'
              : isDay ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <SettingsIcon className="h-5 w-5" />
          <span className="text-[10px] font-medium">{t("nav.settings", currentLang)}</span>
        </button>

      </div>
    </nav>
  );
};
