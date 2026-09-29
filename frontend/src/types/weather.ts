export type PersonaType = 
  | 'health'
  | 'fitness'
  | 'beach'
  | 'traveler'
  | 'parents'
  | 'agriculture'
  | 'commuters'
  | 'event_planners';

export interface NormalizedWeather {
  city: string;
  latitude: number;
  longitude: number;
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  rain_probability: number;
  condition: string;
  condition_code: number;
  uv_index: number | null;
  aqi: number | null;
  pollen_level: string | null;
  sunrise: string | null;
  sunset: string | null;
  tide: string | null;
  wave_height_m: number | null;
  water_temperature: number | null;
  destination_temperature: number | null;
  destination_condition: string | null;
  is_demo: boolean;
  timestamp: string;
}

export interface HourlyItem {
  time: string;
  temperature: number;
  rain_probability: number;
  condition: string;
  uv_index: number | null;
  wind_speed: number;
}

export interface DailyItem {
  date: string;
  day_name: string;
  temp_max: number;
  temp_min: number;
  rain_probability: number;
  condition: string;
  uv_index_max: number | null;
  aqi_avg: number | null;
}

export interface ForecastData {
  city: string;
  latitude: number;
  longitude: number;
  hourly: HourlyItem[];
  daily: DailyItem[];
  is_demo: boolean;
}

export interface RecommendationCardItem {
  type: string;
  value: string;
}

export interface RecommendationData {
  persona: PersonaType;
  headline: string;
  message_key: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  cards: RecommendationCardItem[];
}

export interface WarningDetail {
  severity: 'NORMAL' | 'MODERATE' | 'SEVERE';
  message: string;
  reason: string;
  conditions: string[];
}

export interface WeatherWarningData {
  city: string;
  warning: WarningDetail;
}

export interface SavedLocationItem {
  id: string;
  user_id: string;
  city: string;
  latitude: number;
  longitude: number;
  is_default: boolean;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  default_persona: PersonaType;
  preferred_language: 'en' | 'ta' | 'hi';
  theme: 'dark' | 'light';
}
