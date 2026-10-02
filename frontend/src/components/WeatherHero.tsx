import React from 'react';
import { 
  Droplets, 
  Wind, 
  CloudRain, 
  Sunrise, 
  Activity,
  Sparkles
} from 'lucide-react';
import { NormalizedWeather } from '../types/weather';
import { SupportedLanguage, t } from '../i18n/translations';
import { getWeatherVisualIcon } from '../utils/visualIcons';

interface WeatherHeroProps {
  weather: NormalizedWeather;
  currentLang: SupportedLanguage;
  currentTheme?: 'night' | 'day';
}

export const WeatherHero: React.FC<WeatherHeroProps> = ({ weather, currentLang, currentTheme = 'night' }) => {
  const isDay = currentTheme === 'day';

  return (
    <div className={`rounded-2xl sm:rounded-3xl p-3 sm:p-8 border shadow-xl relative overflow-hidden transition-colors duration-300 ${
      isDay 
        ? 'bg-[#B9D8E1]/90 border-[#8CB8C6] text-[#0C181D] shadow-md' 
        : 'bg-[#0F2129]/95 border-[#447F98]/50 text-white shadow-2xl'
    }`}>
      
      {/* Ambient background glow */}
      <div className={`absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl pointer-events-none ${isDay ? 'bg-[#447F98]/20' : 'bg-[#629BB5]/15'}`} />
      <div className={`absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-3xl pointer-events-none ${isDay ? 'bg-[#629BB5]/20' : 'bg-[#447F98]/20'}`} />

      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-3 sm:mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className={`text-2xl sm:text-4xl font-black tracking-tight ${isDay ? 'text-[#0C181D]' : 'text-white'}`}>
              {weather.city}
            </h2>
            {weather.is_demo ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Demo
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-[#447F98]/20 text-[#D6EBF3] border border-[#447F98]/40 flex items-center gap-1">
                <Activity className="h-3 w-3" /> Live
              </span>
            )}
          </div>
          <p className={`text-[11px] sm:text-xs font-medium mt-0.5 ${isDay ? 'text-[#2A5364]' : 'text-[#B9D8E1]'}`}>
            Updated {new Date(weather.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Visual Weather Condition Badge */}
        <div className={`px-2.5 py-1 sm:px-4 sm:py-2 rounded-2xl border flex items-center space-x-1.5 shadow-sm ${
          isDay ? 'bg-[#D6EBF3] border-[#8CB8C6] text-[#152A33]' : 'bg-[#152A33] border-[#447F98]/60 text-[#D6EBF3]'
        }`}>
          {getWeatherVisualIcon(weather.condition, "h-4 w-4 sm:h-5 sm:w-5")}
          <span className="text-xs sm:text-sm font-extrabold">{weather.condition}</span>
        </div>
      </div>

      {/* Hero Temperature Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 items-center">
        
        {/* Left Side: Giant Temp */}
        <div className={`flex items-center justify-between sm:justify-start space-x-3 sm:space-x-6 p-3 sm:p-4 rounded-2xl border shadow-md ${
          isDay ? 'bg-[#D6EBF3]/90 border-[#8CB8C6]' : 'bg-[#152A33]/80 border-[#447F98]/60'
        }`}>
          <div className={`flex items-center justify-center p-2 sm:p-3 rounded-2xl border ${
            isDay ? 'bg-[#EAEFF2] border-[#B9D8E1]' : 'bg-[#1F3E4B] border-[#447F98]/60'
          }`}>
            {getWeatherVisualIcon(weather.condition, "h-10 w-10 sm:h-16 sm:w-16 text-[#447F98]")}
          </div>

          <div>
            <div className="flex items-baseline space-x-1.5 sm:space-x-2">
              <span className={`text-4xl sm:text-7xl font-black tracking-tighter ${isDay ? 'text-[#0C181D]' : 'text-white'}`}>
                {Math.round(weather.temperature)}°
              </span>
              <span className="text-lg sm:text-2xl font-bold text-[#447F98]">C</span>
            </div>
            <p className={`text-xs font-bold mt-0.5 flex items-center gap-1 ${isDay ? 'text-[#2A5364]' : 'text-[#B9D8E1]'}`}>
              <span>{t("metrics.feels_like", currentLang)}:</span>
              <span className="text-[#629BB5] text-xs sm:text-sm font-extrabold">{Math.round(weather.feels_like)}°C</span>
            </p>
          </div>
        </div>

        {/* Right Side: Visual Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          
          <div className={`p-2.5 sm:p-3 rounded-2xl border flex flex-col justify-between ${
            isDay ? 'bg-[#D6EBF3]/90 border-[#8CB8C6]' : 'bg-[#152A33]/80 border-[#447F98]/60'
          }`}>
            <div className={`flex items-center justify-between text-xs font-bold ${isDay ? 'text-[#152A33]' : 'text-[#D6EBF3]'}`}>
              <span className="flex items-center gap-1">
                <CloudRain className="h-3.5 w-3.5 text-[#447F98]" /> {t("metrics.rain", currentLang)}
              </span>
              <span>{weather.rain_probability}%</span>
            </div>
            <div className="w-full bg-[#8CB8C6]/30 h-2 rounded-full overflow-hidden mt-1.5">
              <div 
                className="bg-[#447F98] h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, weather.rain_probability)}%` }}
              />
            </div>
          </div>

          <div className={`p-2.5 sm:p-3 rounded-2xl border flex flex-col justify-between ${
            isDay ? 'bg-[#D6EBF3]/90 border-[#8CB8C6]' : 'bg-[#152A33]/80 border-[#447F98]/60'
          }`}>
            <div className={`flex items-center justify-between text-xs font-bold ${isDay ? 'text-[#152A33]' : 'text-[#D6EBF3]'}`}>
              <span className="flex items-center gap-1">
                <Wind className="h-3.5 w-3.5 text-[#629BB5]" /> {t("metrics.wind", currentLang)}
              </span>
              <span>{weather.wind_speed} km/h</span>
            </div>
            <div className="w-full bg-[#8CB8C6]/30 h-2 rounded-full overflow-hidden mt-1.5">
              <div 
                className="bg-[#629BB5] h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (weather.wind_speed / 50) * 100)}%` }}
              />
            </div>
          </div>

          <div className={`p-2.5 sm:p-3 rounded-2xl border flex flex-col justify-between ${
            isDay ? 'bg-[#D6EBF3]/90 border-[#8CB8C6]' : 'bg-[#152A33]/80 border-[#447F98]/60'
          }`}>
            <div className={`flex items-center justify-between text-xs font-bold ${isDay ? 'text-[#152A33]' : 'text-[#D6EBF3]'}`}>
              <span className="flex items-center gap-1">
                <Droplets className="h-3.5 w-3.5 text-[#447F98]" /> {t("metrics.humidity", currentLang)}
              </span>
              <span>{weather.humidity}%</span>
            </div>
            <div className="w-full bg-[#8CB8C6]/30 h-2 rounded-full overflow-hidden mt-1.5">
              <div 
                className="bg-[#447F98] h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, weather.humidity)}%` }}
              />
            </div>
          </div>

          <div className={`p-2.5 sm:p-3 rounded-2xl border flex flex-col justify-between ${
            isDay ? 'bg-[#D6EBF3]/90 border-[#8CB8C6]' : 'bg-[#152A33]/80 border-[#447F98]/60'
          }`}>
            <div className={`flex items-center justify-between text-xs font-bold ${isDay ? 'text-[#152A33]' : 'text-[#D6EBF3]'}`}>
              <span className="flex items-center gap-1">
                <Sunrise className="h-3.5 w-3.5 text-amber-400" /> {t("metrics.sunrise", currentLang)}
              </span>
              <span>{weather.sunrise || "06:04"}</span>
            </div>
            <div className="w-full bg-[#8CB8C6]/30 h-2 rounded-full overflow-hidden mt-1.5">
              <div className="bg-amber-400 h-full rounded-full w-3/4" />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
