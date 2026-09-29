import React from 'react';
import { 
  Wind, 
  Sun, 
  Flower2, 
  Waves
} from 'lucide-react';
import { NormalizedWeather } from '../types/weather';
import { SupportedLanguage, t } from '../i18n/translations';

interface EnvironmentalMetricsProps {
  weather: NormalizedWeather;
  currentLang: SupportedLanguage;
  currentTheme?: 'night' | 'day';
}

export const EnvironmentalMetrics: React.FC<EnvironmentalMetricsProps> = ({ weather, currentLang, currentTheme = 'night' }) => {
  const isDay = currentTheme === 'day';
  const aqi = weather.aqi ?? 65;
  const uv = weather.uv_index ?? 6.2;
  const pollen = weather.pollen_level ?? 'moderate';
  const wave = weather.wave_height_m ?? 1.2;

  const getAqiVisual = (val: number) => {
    if (val <= 50) return { label: '🟢 Good Air', emoji: '🫁 🍃', color: 'text-emerald-600', bg: 'bg-emerald-500' };
    if (val <= 100) return { label: '🟡 Moderate Air', emoji: '🫁 🌫️', color: 'text-amber-600', bg: 'bg-amber-500' };
    if (val <= 150) return { label: '🟧 Unhealthy Sensitive', emoji: '😷 ⚠️', color: 'text-orange-600', bg: 'bg-orange-500' };
    return { label: '🔴 Mask Required', emoji: '🚨 😷', color: 'text-rose-600', bg: 'bg-rose-500' };
  };

  const getUvVisual = (val: number) => {
    if (val < 3) return { label: '🟢 Safe Rays', emoji: '☀️ 😊', color: 'text-emerald-600' };
    if (val < 6) return { label: '🟡 Wear Cap', emoji: '🧢 🕶️', color: 'text-amber-600' };
    if (val < 8) return { label: '🟧 Sunscreen SPF 50', emoji: '🧴 🕶️', color: 'text-orange-600' };
    return { label: '🔴 Intense Solar Rays', emoji: '🚨 🧴', color: 'text-rose-600' };
  };

  const aqiVis = getAqiVisual(aqi);
  const uvVis = getUvVisual(uv);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* 1. Air Quality Index (AQI) Visual Card */}
      <div className={`rounded-3xl p-5 border flex flex-col justify-between shadow-lg transition-colors ${
        isDay ? 'glass-card-day bg-white border-slate-200 text-slate-900' : 'glass-card border-slate-700/80 text-white'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`p-2.5 rounded-2xl border ${isDay ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'}`}>
              <Wind className="h-6 w-6" />
            </div>
            <div>
              <span className={`text-xs font-black block ${isDay ? 'text-slate-900' : 'text-white'}`}>
                {t("metrics.aqi", currentLang)}
              </span>
              <span className="text-[10px] text-slate-400 font-bold">Air Breathing Score</span>
            </div>
          </div>
          <span className="text-xl">{aqiVis.emoji.split(' ')[0]}</span>
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-1">
            <span className={`text-3xl font-black ${isDay ? 'text-slate-900' : 'text-white'}`}>{aqi}</span>
            <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${aqiVis.color} ${isDay ? 'bg-slate-100 border border-slate-200' : 'bg-slate-950 border border-slate-800'}`}>
              {aqiVis.label}
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mt-1">
            <div 
              className={`h-full ${aqiVis.bg} transition-all duration-500`} 
              style={{ width: `${Math.min(100, (aqi / 300) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. UV Solar Index Visual Card */}
      <div className={`rounded-3xl p-5 border flex flex-col justify-between shadow-lg transition-colors ${
        isDay ? 'glass-card-day bg-white border-slate-200 text-slate-900' : 'glass-card border-slate-700/80 text-white'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`p-2.5 rounded-2xl border ${isDay ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
              <Sun className="h-6 w-6" />
            </div>
            <div>
              <span className={`text-xs font-black block ${isDay ? 'text-slate-900' : 'text-white'}`}>
                {t("metrics.uv", currentLang)}
              </span>
              <span className="text-[10px] text-slate-400 font-bold">Sun Rays Level</span>
            </div>
          </div>
          <span className="text-xl">{uvVis.emoji.split(' ')[0]}</span>
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-1">
            <span className={`text-3xl font-black ${isDay ? 'text-slate-900' : 'text-white'}`}>{uv}</span>
            <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${uvVis.color} ${isDay ? 'bg-slate-100 border border-slate-200' : 'bg-slate-950 border border-slate-800'}`}>
              {uvVis.label}
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mt-1">
            <div 
              className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 transition-all duration-500" 
              style={{ width: `${Math.min(100, (uv / 12) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Pollen Level Visual Card */}
      <div className={`rounded-3xl p-5 border flex flex-col justify-between shadow-lg transition-colors ${
        isDay ? 'glass-card-day bg-white border-slate-200 text-slate-900' : 'glass-card border-slate-700/80 text-white'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`p-2.5 rounded-2xl border ${isDay ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'}`}>
              <Flower2 className="h-6 w-6" />
            </div>
            <div>
              <span className={`text-xs font-black block ${isDay ? 'text-slate-900' : 'text-white'}`}>
                {t("metrics.pollen", currentLang)}
              </span>
              <span className="text-[10px] text-slate-400 font-bold">Allergy Flower Dust</span>
            </div>
          </div>
          <span className="text-xl">🌸</span>
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-1">
            <span className={`text-2xl font-black capitalize ${isDay ? 'text-slate-900' : 'text-white'}`}>{pollen}</span>
            <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${isDay ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-950 text-rose-300 border border-slate-800'}`}>
              {pollen === 'high' ? '🔴 High Risk' : '🟢 Low Risk'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-bold mt-1">
            {pollen === 'high' ? 'Asthma mask advisory' : 'Clear outdoor air'}
          </p>
        </div>
      </div>

      {/* 4. Beach Waves Visual Card */}
      <div className={`rounded-3xl p-5 border flex flex-col justify-between shadow-lg transition-colors ${
        isDay ? 'glass-card-day bg-white border-slate-200 text-slate-900' : 'glass-card border-slate-700/80 text-white'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`p-2.5 rounded-2xl border ${isDay ? 'bg-cyan-50 text-cyan-700 border-cyan-200' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'}`}>
              <Waves className="h-6 w-6" />
            </div>
            <div>
              <span className={`text-xs font-black block ${isDay ? 'text-slate-900' : 'text-white'}`}>
                {t("metrics.marine", currentLang)}
              </span>
              <span className="text-[10px] text-slate-400 font-bold">Ocean Waves</span>
            </div>
          </div>
          <span className="text-xl">🏖️</span>
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-1">
            <span className={`text-3xl font-black ${isDay ? 'text-slate-900' : 'text-white'}`}>{wave}m</span>
            <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${isDay ? 'bg-cyan-50 text-cyan-800 border border-cyan-200' : 'bg-slate-950 text-cyan-300 border border-slate-800'}`}>
              {wave > 2.0 ? '🚨 Rough Sea' : '🟢 Swim Safe'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-bold mt-1">
            Wave swell forecast
          </p>
        </div>
      </div>

    </div>
  );
};
