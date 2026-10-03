import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  User, 
  Plane, 
  HeartPulse, 
  Activity, 
  Waves, 
  Baby, 
  Sprout, 
  Car, 
  Calendar,
  Bell,
  CloudRain,
  Sun,
  Compass,
  CheckSquare,
  Square
} from 'lucide-react';
import { PersonaType } from '../types/weather';
import { SupportedLanguage, t } from '../i18n/translations';
import { getPersonaIcon } from '../utils/visualIcons';

interface ProfileViewProps {
  userName: string;
  activePersona: PersonaType;
  currentLang: SupportedLanguage;
  currentTheme: 'night' | 'day';
  onSavePreferences: (updated: { name: string; persona: PersonaType; alerts: Record<string, boolean> }) => void;
}

const PERSONA_OPTIONS: { key: PersonaType; label: string }[] = [
  { key: 'traveler', label: 'Traveller' },
  { key: 'health', label: 'Health Care & Respiratory' },
  { key: 'fitness', label: 'Outdoor Athlete' },
  { key: 'beach', label: 'Coastal & Watersports' },
  { key: 'parents', label: 'Parents & Kids' },
  { key: 'agriculture', label: 'Farming & Agriculture' },
  { key: 'commuters', label: 'Daily City Commuter' },
  { key: 'event_planners', label: 'Outdoor Event Planner' },
];

export const ProfileView: React.FC<ProfileViewProps> = ({
  userName,
  activePersona,
  currentLang,
  currentTheme,
  onSavePreferences,
}) => {
  const isDay = currentTheme === 'day';

  const [name, setName] = useState(userName);
  const [persona, setPersona] = useState<PersonaType>(activePersona);

  // Weather alerts state
  const [alerts, setAlerts] = useState<Record<string, boolean>>({
    severe: true,
    rain: true,
    morning: false,
    travel: true,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleAlert = (key: string) => {
    setAlerts(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePreferences({
      name: name.trim() || 'User',
      persona,
      alerts
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const currentPersonaObj = PERSONA_OPTIONS.find(p => p.key === persona) || PERSONA_OPTIONS[0];

  return (
    <div className="w-full space-y-3 sm:space-y-6 animate-fadeIn">
      {/* Header Tag & Titles */}
      <div className="space-y-1">
        <div className={`inline-flex items-center space-x-1.5 text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full ${
          isDay ? 'text-[#152A33] bg-[#B9D8E1]' : 'text-[#D6EBF3] bg-[#152A33] border border-[#447F98]/50'
        }`}>
          <span>{t("nav.profile", currentLang)}</span>
        </div>
        
        <h1 className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${isDay ? 'text-[#0C181D]' : 'text-white'}`}>
          {t("profile.header_title", currentLang)}
        </h1>
        
        <p className={`text-xs sm:text-base font-medium ${isDay ? 'text-[#2A5364]' : 'text-[#B9D8E1]'}`}>
          {t("profile.header_desc", currentLang)}
        </p>
      </div>

      {/* Main Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 items-start">
        
        {/* LEFT CARD: Your Profile */}
        <div className={`p-3.5 sm:p-7 rounded-2xl sm:rounded-[2.5rem] ${
          isDay ? 'bg-[#B9D8E1]/90 border border-[#8CB8C6] text-[#0C181D]' : 'bg-[#0F2129]/95 border border-[#447F98]/50 text-white shadow-xl'
        }`}>
          <h2 className={`text-lg sm:text-xl font-bold mb-3 sm:mb-5 ${isDay ? 'text-[#0C181D]' : 'text-white'}`}>
            {t("profile.title", currentLang)}
          </h2>

          <form onSubmit={handleSave} className="space-y-3 sm:space-y-5">
            {/* Field 1: Name */}
            <div className="space-y-1">
              <label className={`block text-xs font-bold ${isDay ? 'text-[#152A33]' : 'text-[#B9D8E1]'}`}>
                {t("profile.name_label", currentLang)}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dhiya"
                className={`w-full px-3.5 py-2 sm:px-4 sm:py-3 rounded-2xl text-sm font-semibold transition-all outline-none ${
                  isDay 
                    ? 'bg-[#D6EBF3] focus:bg-white text-[#0C181D] border border-[#8CB8C6]' 
                    : 'bg-[#152A33] focus:bg-[#1F3E4B] text-white border border-[#447F98]/60'
                }`}
              />
            </div>

            {/* Field 2: What best describes you? */}
            <div className="space-y-1">
              <label className={`block text-xs font-bold ${isDay ? 'text-[#152A33]' : 'text-[#B9D8E1]'}`}>
                {t("profile.role_label", currentLang)}
              </label>
              <div className="relative">
                <select
                  value={persona}
                  onChange={(e) => setPersona(e.target.value as PersonaType)}
                  className={`w-full px-3.5 py-2 sm:px-4 sm:py-3 rounded-2xl text-sm font-semibold appearance-none cursor-pointer outline-none transition-all ${
                    isDay 
                      ? 'bg-[#D6EBF3] focus:bg-white text-[#0C181D] border border-[#8CB8C6]' 
                      : 'bg-[#152A33] focus:bg-[#1F3E4B] text-white border border-[#447F98]/60'
                  }`}
                >
                  {PERSONA_OPTIONS.map(opt => (
                    <option key={opt.key} value={opt.key} className={isDay ? "bg-white text-[#0C181D]" : "bg-[#0C181D] text-white"}>
                      {t(`persona.${opt.key}`, currentLang) || opt.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-[#447F98]">
                  ▼
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-1 sm:pt-2">
              <button
                type="submit"
                className="w-full py-3 px-6 rounded-full font-bold text-sm transition-all shadow-md active:scale-98 flex items-center justify-center space-x-2 bg-[#447F98] hover:bg-[#629BB5] text-white cursor-pointer"
              >
                {savedSuccess ? (
                  <>
                    <Check className="h-4 w-4 text-[#D6EBF3]" />
                    <span>{t("profile.saved_success", currentLang)}</span>
                  </>
                ) : (
                  <span>{t("profile.save_button", currentLang)}</span>
                )}
              </button>
            </div>

            {/* Profile Role Status Badge Card */}
            <div className={`mt-3 p-3 sm:p-4 rounded-2xl border transition-all ${
              isDay ? 'bg-[#D6EBF3] border-[#8CB8C6] text-[#0C181D]' : 'bg-[#152A33]/80 border-[#447F98]/60 text-slate-200'
            }`}>
              <div className="flex items-center space-x-2 font-bold text-sm">
                {getPersonaIcon(persona, "h-5 w-5 text-[#447F98]")}
                <span>{t(`persona.${persona}`, currentLang) || currentPersonaObj.label}</span>
              </div>
              <p className={`text-xs mt-1 font-medium ${isDay ? 'text-[#2A5364]' : 'text-[#B9D8E1]'}`}>
                {t("profile.role_footer", currentLang)}
              </p>
            </div>

          </form>
        </div>

        {/* RIGHT CARD: Your Weather Alerts */}
        <div className={`p-3.5 sm:p-7 rounded-2xl sm:rounded-[2.5rem] ${
          isDay ? 'bg-[#B9D8E1]/90 border border-[#8CB8C6] text-[#0C181D]' : 'bg-[#0F2129]/95 border border-[#447F98]/50 text-white shadow-xl'
        }`}>
          <h2 className={`text-lg sm:text-xl font-bold ${isDay ? 'text-[#0C181D]' : 'text-white'}`}>
            {t("profile.alerts_title", currentLang)}
          </h2>
          <p className={`text-xs font-medium mb-4 ${isDay ? 'text-[#2A5364]' : 'text-[#B9D8E1]'}`}>
            {t("profile.alerts_desc", currentLang)}
          </p>

          <div className="space-y-2.5 sm:space-y-4">
            {[
              { id: 'severe', key: 'profile.alert_severe' },
              { id: 'rain', key: 'profile.alert_rain' },
              { id: 'morning', key: 'profile.alert_morning' },
              { id: 'travel', key: 'profile.alert_travel' },
            ].map(item => {
              const isChecked = !!alerts[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleAlert(item.id)}
                  className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                    isDay
                      ? isChecked ? 'bg-[#D6EBF3] border-[#447F98]' : 'bg-[#EAEFF2]/60 border-[#B9D8E1]'
                      : isChecked ? 'bg-[#152A33] border-[#447F98]' : 'bg-[#0C181D]/60 border-[#447F98]/30 hover:bg-[#152A33]'
                  }`}
                >
                  <span className={`text-xs sm:text-sm font-semibold ${isDay ? 'text-[#0C181D]' : 'text-white'}`}>
                    {t(item.key, currentLang)}
                  </span>
                  
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                    isChecked
                      ? 'bg-[#447F98] border-[#447F98] text-white'
                      : isDay ? 'border-[#8CB8C6] bg-white' : 'border-[#447F98] bg-[#0F2129]'
                  }`}>
                    {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>

          <p className={`text-[11px] font-medium mt-4 ${isDay ? 'text-[#2A5364]' : 'text-[#B9D8E1]'}`}>
            {t("profile.alerts_delivery", currentLang)}
          </p>

        </div>

      </div>
    </div>
  );
};
