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
import { getWeatherVisualIcon, getWeatherEmoji } from '../utils/visualIcons';

interface WeatherHeroProps {
  weather: NormalizedWeather;
  currentLang: SupportedLanguage;
  currentTheme?: 'night' | 'day';
}

export const WeatherHero: React.FC<WeatherHeroProps> = ({ weather, currentLang, currentTheme = 'night' }) => {
  const isDay = currentTheme === 'day';
  const emoji = getWeatherEmoji(weather.condition);

  return (
    <div className={`rounded-3xl p-5 sm:p-8 border shadow-2xl relative overflow-hidden transition-colors duration-300 ${
      isDay 
        ? 'glass-card-day bg-gradient-to-br from-blue-50 via-cyan-50 to-amber-50 text-slate-900 border-cyan-200' 
        : 'glass-card bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-slate-950 text-white border-slate-700/80'
    }`}>
      
      {/* Ambient background glow */}
      <div className={`absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl pointer-events-none ${isDay ? 'bg-amber-300/30' : 'bg-cyan-500/10'}`} />
      <div className={`absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-3xl pointer-events-none ${isDay ? 'bg-cyan-300/30' : 'bg-blue-600/10'}`} />

      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className={`text-2xl sm:text-4xl font-black tracking-tight ${isDay ? 'text-slate-900' : 'text-white'}`}>
              {weather.city}
            </h2>
            {weather.is_demo ? (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-600 border border-amber-500/30 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" /> Demo
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 flex items-center gap-1">
                <Activity className="h-3.5 w-3.5" /> Live
              </span>
            )}
          </div>
          <p className={`text-xs font-medium mt-0.5 ${isDay ? 'text-slate-600' : 'text-slate-400'}`}>
            Updated {new Date(weather.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Visual Weather Condition Badge */}
        <div className={`px-4 py-2 rounded-2xl border flex items-center space-x-2 shadow-sm ${
          isDay ? 'bg-white border-cyan-300 text-slate-900' : 'bg-slate-800/90 border-cyan-500/40 text-cyan-300'
        }`}>
          <span className="text-2xl">{emoji}</span>
          <span className="text-sm font-extrabold">{weather.condition}</span>
        </div>
      </div>

      {/* Hero Temperature Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        
        {/* Left Side: Giant Temp */}
        <div className={`flex items-center justify-between sm:justify-start space-x-6 p-4 rounded-2xl border ${
          isDay ? 'bg-white/80 border-slate-200 shadow-sm' : 'bg-slate-950/40 border-slate-800/80'
        }`}>
          <div className={`flex items-center justify-center p-3 rounded-2xl border ${
            isDay ? 'bg-cyan-100 border-cyan-200' : 'bg-cyan-500/10 border-cyan-500/30'
          }`}>
            {getWeatherVisualIcon(weather.condition, "h-16 w-16")}
          </div>

          <div>
            <div className="flex items-baseline space-x-2">
              <span className={`text-6xl sm:text-7xl font-black tracking-tighter ${isDay ? 'text-slate-900' : 'text-white'}`}>
                {Math.round(weather.temperature)}°
              </span>
              <span className="text-2xl font-bold text-cyan-600">C</span>
            </div>
            <p className={`text-xs font-bold mt-1 flex items-center gap-1 ${isDay ? 'text-slate-700' : 'text-slate-300'}`}>
              <span>{t("metrics.feels_like", currentLang)}:</span>
              <span className="text-cyan-600 text-sm font-extrabold">{Math.round(weather.feels_like)}°C</span>
            </p>
          </div>
        </div>

        {/* Right Side: Visual Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          
          <div className={`p-3 rounded-2xl border flex flex-col justify-between ${
            isDay ? 'bg-white/90 border-slate-200' : 'bg-slate-950/70 border-slate-800'
          }`}>
            <div className="flex items-center justify-between text-xs font-bold text-blue-600">
              <span className="flex items-center gap-1">
                <CloudRain className="h-4 w-4" /> 🌧️ Rain
              </span>
              <span>{weather.rain_probability}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
              <div 
                className="bg-blue-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, weather.rain_probability)}%` }}
              />
            </div>
          </div>

          <div className={`p-3 rounded-2xl border flex flex-col justify-between ${
            isDay ? 'bg-white/90 border-slate-200' : 'bg-slate-950/70 border-slate-800'
          }`}>
            <div className="flex items-center justify-between text-xs font-bold text-cyan-700">
              <span className="flex items-center gap-1">
                <Wind className="h-4 w-4" /> 💨 Wind
              </span>
              <span>{weather.wind_speed} km/h</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
              <div 
                className="bg-cyan-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (weather.wind_speed / 50) * 100)}%` }}
              />
            </div>
          </div>

          <div className={`p-3 rounded-2xl border flex flex-col justify-between ${
            isDay ? 'bg-white/90 border-slate-200' : 'bg-slate-950/70 border-slate-800'
          }`}>
            <div className="flex items-center justify-between text-xs font-bold text-emerald-600">
              <span className="flex items-center gap-1">
                <Droplets className="h-4 w-4" /> 💧 Humidity
              </span>
              <span>{weather.humidity}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, weather.humidity)}%` }}
              />
            </div>
          </div>

          <div className={`p-3 rounded-2xl border flex flex-col justify-between ${
            isDay ? 'bg-white/90 border-slate-200' : 'bg-slate-950/70 border-slate-800'
          }`}>
            <div className="flex items-center justify-between text-xs font-bold text-amber-600">
              <span className="flex items-center gap-1">
                <Sunrise className="h-4 w-4" /> 🌅 Sunrise
              </span>
              <span>{weather.sunrise || "06:04"}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
              <div className="bg-amber-500 h-full rounded-full w-3/4" />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
