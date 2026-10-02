import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { CloudSun, CloudRain, Calendar, Clock } from 'lucide-react';
import { ForecastData } from '../types/weather';
import { SupportedLanguage, t } from '../i18n/translations';

interface ForecastSectionProps {
  forecast: ForecastData;
  currentLang: SupportedLanguage;
  currentTheme?: 'night' | 'day';
}

export const ForecastSection: React.FC<ForecastSectionProps> = ({ forecast, currentLang, currentTheme = 'night' }) => {
  const isDay = currentTheme === 'day';
  const chartData = forecast.hourly.map(item => ({
    time: item.time,
    temp: item.temperature,
    rain: item.rain_probability
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5 sm:gap-6">
      
      {/* 24-Hour Interactive Graph */}
      <div className={`lg:col-span-2 rounded-2xl sm:rounded-3xl p-3 sm:p-6 border shadow-2xl flex flex-col justify-between transition-colors ${
        isDay ? 'bg-[#D6EBF3]/90 border-[#8CB8C6] text-[#0C181D]' : 'bg-[#0F2129]/95 border-[#447F98]/50 text-white'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-base sm:text-lg font-bold tracking-tight flex items-center gap-2 ${isDay ? 'text-[#0C181D]' : 'text-white'}`}>
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-[#447F98]" />
            {t("forecast.hourly", currentLang)}
          </h3>
          <span className={`text-[10px] sm:text-xs font-medium ${isDay ? 'text-[#2A5364]' : 'text-[#B9D8E1]'}`}>Temp (°C) & Rain (%)</span>
        </div>

        <div className="h-56 sm:h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#447F98" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#447F98" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#629BB5" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#629BB5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDay ? "#8CB8C6" : "#1F3E4B"} />
              <XAxis dataKey="time" stroke={isDay ? "#2A5364" : "#B9D8E1"} fontSize={10} tickLine={false} />
              <YAxis stroke={isDay ? "#2A5364" : "#B9D8E1"} fontSize={10} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDay ? '#D6EBF3' : '#0F2129', 
                  borderColor: isDay ? '#8CB8C6' : '#447F98', 
                  borderRadius: '12px',
                  color: isDay ? '#0C181D' : '#F8FAFC',
                  fontSize: '11px',
                  boxShadow: '0 10px 15px -3px rgba(68, 127, 152, 0.2)'
                }}
              />
              <Area type="monotone" dataKey="temp" stroke="#447F98" strokeWidth={3} fillOpacity={1} fill="url(#tempGradient)" name="Temp (°C)" />
              <Area type="monotone" dataKey="rain" stroke="#629BB5" strokeWidth={2} fillOpacity={1} fill="url(#rainGradient)" name="Rain Prob (%)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 7-Day Multi-Day List */}
      <div className={`rounded-2xl sm:rounded-3xl p-3 sm:p-6 border shadow-2xl flex flex-col justify-between transition-colors ${
        isDay ? 'bg-[#D6EBF3]/90 border-[#8CB8C6] text-[#0C181D]' : 'bg-[#0F2129]/95 border-[#447F98]/50 text-white'
      }`}>
        <h3 className={`text-base sm:text-lg font-bold tracking-tight mb-3 flex items-center gap-2 ${isDay ? 'text-[#0C181D]' : 'text-white'}`}>
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-[#629BB5]" />
          {t("forecast.daily", currentLang)}
        </h3>

        <div className="space-y-2 overflow-y-auto max-h-[260px] pr-1">
          {forecast.daily.map((day, idx) => (
            <div 
              key={idx}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors ${
                isDay ? 'bg-[#EAEFF2] border-[#B9D8E1] text-[#0C181D]' : 'bg-[#152A33]/80 border-[#447F98]/40 text-white'
              }`}
            >
              <div className="flex items-center space-x-2 sm:space-x-3">
                <span className={`text-xs font-bold w-9 sm:w-10 ${isDay ? 'text-[#0C181D]' : 'text-white'}`}>{day.day_name}</span>
                <div className="flex items-center space-x-1 text-xs">
                  <CloudSun className="h-3.5 w-3.5 text-[#447F98]" />
                  <span className={`truncate max-w-[75px] text-[11px] font-semibold ${isDay ? 'text-[#2A5364]' : 'text-[#B9D8E1]'}`}>{day.condition}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-3 text-xs font-bold">
                <span className="text-[#447F98] flex items-center gap-0.5 text-[11px]">
                  <CloudRain className="h-3 w-3" /> {day.rain_probability}%
                </span>
                <div className="flex items-center space-x-1">
                  <span className={isDay ? "text-[#0C181D]" : "text-white"}>{Math.round(day.temp_max)}°</span>
                  <span className="text-slate-400">/</span>
                  <span className={isDay ? "text-[#2A5364]" : "text-[#B9D8E1]"}>{Math.round(day.temp_min)}°</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
