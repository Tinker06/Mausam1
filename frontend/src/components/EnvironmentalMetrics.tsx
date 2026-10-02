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
    if (val <= 50) return { label: 'Good Air', color: 'text-emerald-400', bg: 'bg-emerald-500' };
    if (val <= 100) return { label: 'Moderate Air', color: 'text-amber-400', bg: 'bg-amber-500' };
    if (val <= 150) return { label: 'Unhealthy Sensitive', color: 'text-orange-400', bg: 'bg-orange-500' };
    return { label: 'Mask Required', color: 'text-rose-400', bg: 'bg-rose-500' };
  };

  const getUvVisual = (val: number) => {
    if (val < 3) return { label: 'Safe Rays', color: 'text-emerald-400' };
    if (val < 6) return { label: 'Wear Cap', color: 'text-amber-400' };
    if (val < 8) return { label: 'Sunscreen SPF 50', color: 'text-orange-400' };
    return { label: 'Intense Solar Rays', color: 'text-rose-400' };
  };

  const aqiVis = getAqiVisual(aqi);
  const uvVis = getUvVisual(uv);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
      
      {/* 1. Air Quality Index (AQI) Visual Card */}
      <div className={`rounded-2xl sm:rounded-3xl p-3 sm:p-5 border flex flex-col justify-between shadow-lg transition-colors ${
        isDay ? 'bg-[#D6EBF3]/90 border-[#8CB8C6] text-[#0C181D]' : 'bg-[#0F2129]/95 border-[#447F98]/50 text-white'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <div className={`p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl border ${
              isDay ? 'bg-[#EAEFF2] text-[#447F98] border-[#B9D8E1]' : 'bg-[#1F3E4B] text-[#B9D8E1] border-[#447F98]/50'
            }`}>
              <Wind className="h-4 w-4 sm:h-6 sm:w-6" />
            </div>
            <div>
              <span className={`text-[11px] sm:text-xs font-black block ${isDay ? 'text-[#0C181D]' : 'text-white'}`}>
                {t("metrics.aqi", currentLang)}
              </span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1 gap-0.5">
            <span className={`text-xl sm:text-3xl font-black ${isDay ? 'text-[#0C181D]' : 'text-white'}`}>{aqi}</span>
            <span className={`text-[10px] sm:text-xs font-black px-1.5 py-0.5 rounded-full self-start sm:self-auto ${aqiVis.color} ${
              isDay ? 'bg-[#EAEFF2] border border-[#B9D8E1]' : 'bg-[#152A33] border border-[#447F98]/40'
            }`}>
              {aqiVis.label}
            </span>
          </div>
          <div className="w-full bg-[#8CB8C6]/30 h-2 rounded-full overflow-hidden mt-1">
            <div 
              className={`h-full ${aqiVis.bg} transition-all duration-500`} 
              style={{ width: `${Math.min(100, (aqi / 300) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. UV Solar Index Visual Card */}
      <div className={`rounded-2xl sm:rounded-3xl p-3 sm:p-5 border flex flex-col justify-between shadow-lg transition-colors ${
        isDay ? 'bg-[#D6EBF3]/90 border-[#8CB8C6] text-[#0C181D]' : 'bg-[#0F2129]/95 border-[#447F98]/50 text-white'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <div className={`p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl border ${
              isDay ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
            }`}>
              <Sun className="h-4 w-4 sm:h-6 sm:w-6" />
            </div>
            <div>
              <span className={`text-[11px] sm:text-xs font-black block ${isDay ? 'text-[#0C181D]' : 'text-white'}`}>
                {t("metrics.uv", currentLang)}
              </span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1 gap-0.5">
            <span className={`text-xl sm:text-3xl font-black ${isDay ? 'text-[#0C181D]' : 'text-white'}`}>{uv}</span>
            <span className={`text-[10px] sm:text-xs font-black px-1.5 py-0.5 rounded-full self-start sm:self-auto ${uvVis.color} ${
              isDay ? 'bg-[#EAEFF2] border border-[#B9D8E1]' : 'bg-[#152A33] border border-[#447F98]/40'
            }`}>
              {uvVis.label}
            </span>
          </div>
          <div className="w-full bg-[#8CB8C6]/30 h-2 rounded-full overflow-hidden mt-1">
            <div 
              className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 transition-all duration-500" 
              style={{ width: `${Math.min(100, (uv / 12) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Pollen Level Visual Card */}
      <div className={`rounded-2xl sm:rounded-3xl p-3 sm:p-5 border flex flex-col justify-between shadow-lg transition-colors ${
        isDay ? 'bg-[#D6EBF3]/90 border-[#8CB8C6] text-[#0C181D]' : 'bg-[#0F2129]/95 border-[#447F98]/50 text-white'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <div className={`p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl border ${
              isDay ? 'bg-[#EAEFF2] text-rose-600 border-[#B9D8E1]' : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
            }`}>
              <Flower2 className="h-4 w-4 sm:h-6 sm:w-6" />
            </div>
            <div>
              <span className={`text-[11px] sm:text-xs font-black block ${isDay ? 'text-[#0C181D]' : 'text-white'}`}>
                {t("metrics.pollen", currentLang)}
              </span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1 gap-0.5">
            <span className={`text-lg sm:text-2xl font-black capitalize ${isDay ? 'text-[#0C181D]' : 'text-white'}`}>{pollen}</span>
            <span className={`text-[10px] sm:text-xs font-extrabold px-1.5 py-0.5 rounded-full self-start sm:self-auto ${
              isDay ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-[#152A33] text-rose-300 border border-[#447F98]/40'
            }`}>
              {pollen === 'high' ? 'High Risk' : 'Low Risk'}
            </span>
          </div>
          <p className={`text-[10px] sm:text-[11px] font-bold mt-1 ${isDay ? 'text-[#2A5364]' : 'text-[#B9D8E1]'}`}>
            {pollen === 'high' ? 'Asthma mask advisory' : 'Clear outdoor air'}
          </p>
        </div>
      </div>

      {/* 4. Beach Waves Visual Card */}
      <div className={`rounded-2xl sm:rounded-3xl p-3 sm:p-5 border flex flex-col justify-between shadow-lg transition-colors ${
        isDay ? 'bg-[#D6EBF3]/90 border-[#8CB8C6] text-[#0C181D]' : 'bg-[#0F2129]/95 border-[#447F98]/50 text-white'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <div className={`p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl border ${
              isDay ? 'bg-[#EAEFF2] text-[#447F98] border-[#B9D8E1]' : 'bg-[#1F3E4B] text-[#629BB5] border-[#447F98]/50'
            }`}>
              <Waves className="h-4 w-4 sm:h-6 sm:w-6" />
            </div>
            <div>
              <span className={`text-[11px] sm:text-xs font-black block ${isDay ? 'text-[#0C181D]' : 'text-white'}`}>
                {t("metrics.marine", currentLang)}
              </span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1 gap-0.5">
            <span className={`text-xl sm:text-3xl font-black ${isDay ? 'text-[#0C181D]' : 'text-white'}`}>{wave}m</span>
            <span className={`text-[10px] sm:text-xs font-extrabold px-1.5 py-0.5 rounded-full self-start sm:self-auto ${
              isDay ? 'bg-[#EAEFF2] text-[#2A5364] border border-[#B9D8E1]' : 'bg-[#152A33] text-[#D6EBF3] border border-[#447F98]/40'
            }`}>
              {wave > 2.0 ? 'Rough Sea' : 'Swim Safe'}
            </span>
          </div>
          <p className={`text-[10px] sm:text-[11px] font-bold mt-1 ${isDay ? 'text-[#2A5364]' : 'text-[#B9D8E1]'}`}>
            Wave swell forecast
          </p>
        </div>
      </div>

    </div>
  );
};
