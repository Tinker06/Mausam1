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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* 24-Hour Interactive Graph */}
      <div className={`lg:col-span-2 rounded-3xl p-6 border shadow-2xl flex flex-col justify-between transition-colors ${
        isDay ? 'glass-card-day bg-white border-slate-200 text-slate-900' : 'glass-card border-slate-700/80 text-white'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-bold tracking-tight flex items-center gap-2 ${isDay ? 'text-slate-900' : 'text-white'}`}>
            <Clock className="h-5 w-5 text-cyan-500" />
            {t("forecast.hourly", currentLang)}
          </h3>
          <span className="text-xs font-medium text-slate-500">Temperature (°C) & Rain Prob (%)</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284C7" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#0284C7" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDay ? "#E2E8F0" : "#1E293B"} />
              <XAxis dataKey="time" stroke={isDay ? "#64748B" : "#94A3B8"} fontSize={11} tickLine={false} />
              <YAxis stroke={isDay ? "#64748B" : "#94A3B8"} fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDay ? '#FFFFFF' : '#0F172A', 
                  borderColor: isDay ? '#CBD5E1' : '#334155', 
                  borderRadius: '12px',
                  color: isDay ? '#0F172A' : '#F8FAFC',
                  fontSize: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                }}
              />
              <Area type="monotone" dataKey="temp" stroke="#0284C7" strokeWidth={3} fillOpacity={1} fill="url(#tempGradient)" name="Temp (°C)" />
              <Area type="monotone" dataKey="rain" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#rainGradient)" name="Rain Prob (%)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 7-Day Multi-Day List */}
      <div className={`rounded-3xl p-6 border shadow-2xl flex flex-col justify-between transition-colors ${
        isDay ? 'glass-card-day bg-white border-slate-200 text-slate-900' : 'glass-card border-slate-700/80 text-white'
      }`}>
        <h3 className={`text-lg font-bold tracking-tight mb-4 flex items-center gap-2 ${isDay ? 'text-slate-900' : 'text-white'}`}>
          <Calendar className="h-5 w-5 text-indigo-500" />
          {t("forecast.daily", currentLang)}
        </h3>

        <div className="space-y-3 overflow-y-auto max-h-[280px] pr-1">
          {forecast.daily.map((day, idx) => (
            <div 
              key={idx}
              className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                isDay ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950/60 border-slate-800 text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={`text-xs font-bold w-10 ${isDay ? 'text-slate-900' : 'text-white'}`}>{day.day_name}</span>
                <div className="flex items-center space-x-1.5 text-xs">
                  <CloudSun className="h-4 w-4 text-cyan-500" />
                  <span className={`truncate max-w-[80px] text-[11px] font-semibold ${isDay ? 'text-slate-700' : 'text-slate-300'}`}>{day.condition}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-xs font-bold">
                <span className="text-blue-600 flex items-center gap-0.5 text-[11px]">
                  <CloudRain className="h-3 w-3" /> {day.rain_probability}%
                </span>
                <div className="flex items-center space-x-1">
                  <span className={isDay ? "text-slate-900" : "text-white"}>{Math.round(day.temp_max)}°</span>
                  <span className="text-slate-400">/</span>
                  <span className="text-slate-500">{Math.round(day.temp_min)}°</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
