import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Check, 
  ArrowRight, 
  Sun, 
  CloudRain, 
  Wind, 
  Flame, 
  Luggage, 
  Activity,
  ArrowRightLeft,
  Sparkles
} from 'lucide-react';
import { PersonaType, NormalizedWeather } from '../types/weather';
import { SupportedLanguage, t } from '../i18n/translations';

interface PersonalViewProps {
  currentCity: string;
  activePersona: PersonaType;
  currentLang: SupportedLanguage;
  currentTheme: 'night' | 'day';
  weather: NormalizedWeather | null;
  onUpdatePersona: (persona: PersonaType) => void;
  onSelectCity: (city: string) => void;
}

const ACTIVITIES = [
  'City walking',
  'Outdoor event',
  'Hiking & Trekking',
  'Beach & Watersports',
  'Sightseeing',
  'Daily Commute'
];

export const PersonalView: React.FC<PersonalViewProps> = ({
  currentCity,
  activePersona,
  currentLang,
  currentTheme,
  weather,
  onUpdatePersona,
  onSelectCity
}) => {
  const isDay = currentTheme === 'day';

  const [startCity, setStartCity] = useState(currentCity);
  const [destCity, setDestCity] = useState('Bengaluru');
  const [travelDate, setTravelDate] = useState('2026-10-05');
  const [mainActivity, setMainActivity] = useState('City walking');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    if (startCity.trim()) {
      onSelectCity(startCity);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const tempCurrent = weather ? Math.round(weather.temperature) : 32;
  const tempDest = 22;

  return (
    <div className="w-full space-y-4 sm:space-y-6 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="space-y-1">
        <div className={`inline-flex items-center space-x-1.5 text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full ${
          isDay ? 'text-[#152A33] bg-[#B9D8E1]' : 'text-[#D6EBF3] bg-[#152A33] border border-[#447F98]/50'
        }`}>
          <span>{t("personal.tag", currentLang)}</span>
        </div>
        
        <h1 className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${isDay ? 'text-[#0C181D]' : 'text-white'}`}>
          {t("personal.title", currentLang)}
        </h1>
        
        <p className={`text-xs sm:text-base font-medium ${isDay ? 'text-[#2A5364]' : 'text-[#B9D8E1]'}`}>
          {t("personal.desc", currentLang)}
        </p>
      </div>

      {/* Main Grid: Form + Weather Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 items-start">
        
        {/* CARD 1: Places, timings & preferences */}
        <div className={`p-3.5 sm:p-7 rounded-2xl sm:rounded-[2.5rem] ${
          isDay ? 'bg-[#B9D8E1]/90 border border-[#8CB8C6] text-[#0C181D]' : 'bg-[#0F2129]/95 border border-[#447F98]/50 text-white shadow-xl'
        }`}>
          <h2 className={`text-lg sm:text-xl font-bold mb-3 ${isDay ? 'text-[#0C181D]' : 'text-white'}`}>
            {t("personal.form_title", currentLang)}
          </h2>

          <form onSubmit={handleSavePersonal} className="space-y-3">
            
            {/* Persona Role Picker */}
            <div className="space-y-1">
              <label className={`block text-xs font-bold ${isDay ? 'text-[#152A33]' : 'text-[#B9D8E1]'}`}>
                {t("personal.personalize_label", currentLang)}
              </label>
              <select
                value={activePersona}
                onChange={(e) => onUpdatePersona(e.target.value as PersonaType)}
                className={`w-full px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl text-sm font-semibold cursor-pointer outline-none transition-all ${
                  isDay 
                    ? 'bg-[#D6EBF3] focus:bg-white text-[#0C181D] border border-[#8CB8C6]' 
                    : 'bg-[#152A33] focus:bg-[#1F3E4B] text-white border border-[#447F98]/60'
                }`}
              >
                <option value="traveler">{t("persona.traveler", currentLang)}</option>
                <option value="health">{t("persona.health", currentLang)}</option>
                <option value="fitness">{t("persona.fitness", currentLang)}</option>
                <option value="beach">{t("persona.beach", currentLang)}</option>
                <option value="parents">{t("persona.parents", currentLang)}</option>
                <option value="agriculture">{t("persona.agriculture", currentLang)}</option>
                <option value="commuters">{t("persona.commuters", currentLang)}</option>
                <option value="event_planners">{t("persona.event_planners", currentLang)}</option>
              </select>
            </div>

            {/* Starting & Destination City Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className={`block text-xs font-bold ${isDay ? 'text-[#152A33]' : 'text-[#B9D8E1]'}`}>
                  {t("personal.start_city", currentLang)}
                </label>
                <input
                  type="text"
                  value={startCity}
                  onChange={(e) => setStartCity(e.target.value)}
                  placeholder="Enter starting city"
                  className={`w-full px-3 py-2 rounded-2xl text-sm font-semibold outline-none transition-all ${
                    isDay 
                      ? 'bg-[#D6EBF3] focus:bg-white text-[#0C181D] border border-[#8CB8C6]' 
                      : 'bg-[#152A33] focus:bg-[#1F3E4B] text-white border border-[#447F98]/60'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className={`block text-xs font-bold ${isDay ? 'text-[#152A33]' : 'text-[#B9D8E1]'}`}>
                  {t("personal.dest_city", currentLang)}
                </label>
                <input
                  type="text"
                  value={destCity}
                  onChange={(e) => setDestCity(e.target.value)}
                  placeholder="Enter destination city"
                  className={`w-full px-3 py-2 rounded-2xl text-sm font-semibold outline-none transition-all ${
                    isDay 
                      ? 'bg-[#D6EBF3] focus:bg-white text-[#0C181D] border border-[#8CB8C6]' 
                      : 'bg-[#152A33] focus:bg-[#1F3E4B] text-white border border-[#447F98]/60'
                  }`}
                />
              </div>
            </div>

            {/* Travel Date & Main Activity Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className={`block text-xs font-bold ${isDay ? 'text-[#152A33]' : 'text-[#B9D8E1]'}`}>
                  {t("personal.travel_date", currentLang)}
                </label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className={`w-full px-3 py-2 rounded-2xl text-sm font-semibold outline-none transition-all ${
                    isDay 
                      ? 'bg-[#D6EBF3] focus:bg-white text-[#0C181D] border border-[#8CB8C6]' 
                      : 'bg-[#152A33] focus:bg-[#1F3E4B] text-white border border-[#447F98]/60'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className={`block text-xs font-bold ${isDay ? 'text-[#152A33]' : 'text-[#B9D8E1]'}`}>
                  {t("personal.main_activity", currentLang)}
                </label>
                <select
                  value={mainActivity}
                  onChange={(e) => setMainActivity(e.target.value)}
                  className={`w-full px-3 py-2 rounded-2xl text-sm font-semibold cursor-pointer outline-none transition-all ${
                    isDay 
                      ? 'bg-[#D6EBF3] focus:bg-white text-[#0C181D] border border-[#8CB8C6]' 
                      : 'bg-[#152A33] focus:bg-[#1F3E4B] text-white border border-[#447F98]/60'
                  }`}
                >
                  {ACTIVITIES.map(act => (
                    <option key={act} value={act} className={isDay ? "bg-white text-[#0C181D]" : "bg-[#0C181D] text-white"}>
                      {act}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                className="w-full py-3 px-6 rounded-full font-bold text-sm transition-all shadow-md active:scale-98 flex items-center justify-center space-x-2 bg-[#447F98] hover:bg-[#629BB5] text-white cursor-pointer"
              >
                {savedSuccess ? (
                  <>
                    <Check className="h-4 w-4 text-[#D6EBF3]" />
                    <span>{t("personal.saved_msg", currentLang)}</span>
                  </>
                ) : (
                  <span>{t("personal.save_btn", currentLang)}</span>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* CARD 2: Weather preview for your saved place */}
        <div className={`p-3.5 sm:p-7 rounded-2xl sm:rounded-[2.5rem] ${
          isDay ? 'bg-[#B9D8E1]/90 border border-[#8CB8C6] text-[#0C181D]' : 'bg-[#0F2129]/95 border border-[#447F98]/50 text-white shadow-xl'
        }`}>
          <h2 className={`text-lg sm:text-xl font-bold ${isDay ? 'text-[#0C181D]' : 'text-white'}`}>
            {t("personal.preview_title", currentLang)}
          </h2>
          <p className={`text-xs font-medium mb-4 ${isDay ? 'text-[#2A5364]' : 'text-[#B9D8E1]'}`}>
            {startCity} • {t("personal.travel_date_label", currentLang)} {travelDate}
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Temp Box */}
            <div className={`p-3 sm:p-4 rounded-2xl border ${
              isDay ? 'bg-[#D6EBF3] border-[#8CB8C6]' : 'bg-[#152A33]/80 border-[#447F98]/50'
            }`}>
              <span className={`text-2xl sm:text-3xl font-black block ${isDay ? 'text-[#0C181D]' : 'text-white'}`}>
                {tempCurrent}°C
              </span>
              <span className={`text-xs font-bold block mt-0.5 ${isDay ? 'text-[#2A5364]' : 'text-[#B9D8E1]'}`}>
                {t("personal.mostly_sunny", currentLang)}
              </span>
            </div>

            {/* Rain Box */}
            <div className={`p-3 sm:p-4 rounded-2xl border ${
              isDay ? 'bg-[#D6EBF3] border-[#8CB8C6]' : 'bg-[#152A33]/80 border-[#447F98]/50'
            }`}>
              <span className={`text-2xl sm:text-3xl font-black block ${isDay ? 'text-[#0C181D]' : 'text-white'}`}>
                20%
              </span>
              <span className={`text-xs font-bold block mt-0.5 ${isDay ? 'text-[#2A5364]' : 'text-[#B9D8E1]'}`}>
                {t("personal.rain_prob", currentLang)}
              </span>
            </div>

            {/* Wind Box */}
            <div className={`p-3 sm:p-4 rounded-2xl border ${
              isDay ? 'bg-[#D6EBF3] border-[#8CB8C6]' : 'bg-[#152A33]/80 border-[#447F98]/50'
            }`}>
              <span className={`text-2xl sm:text-3xl font-black block ${isDay ? 'text-[#0C181D]' : 'text-white'}`}>
                18 <span className="text-xs sm:text-sm">km/h</span>
              </span>
              <span className={`text-xs font-bold block mt-0.5 ${isDay ? 'text-[#2A5364]' : 'text-[#B9D8E1]'}`}>
                {t("personal.wind_speed", currentLang)}
              </span>
            </div>

            {/* UV Index Box */}
            <div className={`p-3 sm:p-4 rounded-2xl border ${
              isDay ? 'bg-[#D6EBF3] border-[#8CB8C6]' : 'bg-[#152A33]/80 border-[#447F98]/50'
            }`}>
              <span className={`text-2xl sm:text-3xl font-black block ${isDay ? 'text-[#0C181D]' : 'text-white'}`}>
                7 <span className="text-xs sm:text-sm font-bold text-amber-400">High</span>
              </span>
              <span className={`text-xs font-bold block mt-0.5 ${isDay ? 'text-[#2A5364]' : 'text-[#B9D8E1]'}`}>
                {t("personal.air_uv", currentLang)}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* CARD 3: Compare your travel weather */}
      <div className={`p-3.5 sm:p-7 rounded-2xl sm:rounded-[2.5rem] ${
        isDay ? 'bg-[#B9D8E1]/90 border border-[#8CB8C6] text-[#0C181D]' : 'bg-[#0F2129]/95 border border-[#447F98]/50 text-white shadow-xl'
      }`}>
        <h2 className={`text-lg sm:text-xl font-bold mb-1 ${isDay ? 'text-[#0C181D]' : 'text-white'}`}>
          {t("personal.compare_title", currentLang)}
        </h2>
        <p className={`text-xs font-medium mb-4 ${isDay ? 'text-[#2A5364]' : 'text-[#B9D8E1]'}`}>
          {t("personal.compare_desc", currentLang)}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* Starting City */}
          <div className={`p-4 rounded-2xl border ${
            isDay ? 'bg-[#D6EBF3] border-[#8CB8C6]' : 'bg-[#152A33]/80 border-[#447F98]/50'
          }`}>
            <span className="text-xs font-bold text-[#447F98] uppercase tracking-wider block">
              {t("personal.start_tag", currentLang)}
            </span>
            <h3 className={`text-lg sm:text-xl font-extrabold mt-0.5 ${isDay ? 'text-[#0C181D]' : 'text-white'}`}>
              {startCity.toUpperCase()}
            </h3>
            <div className="flex items-baseline space-x-2 mt-1.5">
              <span className={`text-3xl sm:text-4xl font-black ${isDay ? 'text-[#0C181D]' : 'text-white'}`}>
                {tempCurrent}°
              </span>
              <span className={`text-xs font-bold ${isDay ? 'text-[#2A5364]' : 'text-[#B9D8E1]'}`}>
                {t("personal.mostly_sunny", currentLang)}
              </span>
            </div>
          </div>

          {/* Destination City */}
          <div className={`p-4 rounded-2xl border ${
            isDay ? 'bg-[#D6EBF3] border-[#8CB8C6]' : 'bg-[#152A33]/80 border-[#447F98]/50'
          }`}>
            <span className="text-xs font-bold text-[#447F98] uppercase tracking-wider block">
              {t("personal.dest_tag", currentLang)}
            </span>
            <h3 className={`text-lg sm:text-xl font-extrabold mt-0.5 ${isDay ? 'text-[#0C181D]' : 'text-white'}`}>
              {destCity.toUpperCase()}
            </h3>
            <div className="flex items-baseline space-x-2 mt-1.5">
              <span className={`text-3xl sm:text-4xl font-black ${isDay ? 'text-[#0C181D]' : 'text-white'}`}>
                {tempDest}°
              </span>
              <span className={`text-xs font-bold ${isDay ? 'text-[#2A5364]' : 'text-[#B9D8E1]'}`}>
                {t("personal.partly_cloudy", currentLang)}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* CARD 4: Personal Recommendations List */}
      <div className={`p-3.5 sm:p-7 rounded-2xl sm:rounded-[2.5rem] ${
        isDay ? 'bg-[#B9D8E1]/90 border border-[#8CB8C6] text-[#0C181D]' : 'bg-[#0F2129]/95 border border-[#447F98]/50 text-white shadow-xl'
      }`}>
        <h2 className={`text-lg sm:text-xl font-bold mb-3 ${isDay ? 'text-[#0C181D]' : 'text-white'}`}>
          {t("personal.rec_title", currentLang)}
        </h2>

        <div className="space-y-2.5">
          {[
            { title: t("personal.rec1_title", currentLang), desc: t("personal.rec1_desc", currentLang) },
            { title: t("personal.rec2_title", currentLang), desc: t("personal.rec2_desc", currentLang) },
            { title: t("personal.rec3_title", currentLang), desc: t("personal.rec3_desc", currentLang) }
          ].map((rec, i) => (
            <div 
              key={i}
              className={`p-3 sm:p-4 rounded-2xl border ${
                isDay ? 'bg-[#D6EBF3] border-[#8CB8C6] text-[#0C181D]' : 'bg-[#152A33]/80 border-[#447F98]/40 text-slate-200'
              }`}
            >
              <h4 className="font-bold text-xs sm:text-sm text-[#447F98]">{rec.title}</h4>
              <p className={`text-xs mt-0.5 font-medium ${isDay ? 'text-[#2A5364]' : 'text-[#B9D8E1]'}`}>{rec.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
