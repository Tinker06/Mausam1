import React from 'react';
import { 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  CloudSnow, 
  CloudFog,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Umbrella,
  Shirt,
  Glasses,
  Droplets,
  HeartPulse,
  Activity,
  Waves,
  Plane,
  Baby,
  Sprout,
  Car,
  Calendar
} from 'lucide-react';

export function getWeatherVisualIcon(condition: string, sizeClass: string = "h-12 w-12"): React.ReactNode {
  const condLower = (condition || "").toLowerCase();
  if (condLower.includes("thunder") || condLower.includes("lightning") || condLower.includes("storm")) {
    return <CloudLightning className={`${sizeClass} text-amber-400 animate-pulse`} />;
  }
  if (condLower.includes("rain") || condLower.includes("drizzle") || condLower.includes("shower")) {
    return <CloudRain className={`${sizeClass} text-blue-400`} />;
  }
  if (condLower.includes("snow") || condLower.includes("ice") || condLower.includes("hail")) {
    return <CloudSnow className={`${sizeClass} text-cyan-200`} />;
  }
  if (condLower.includes("fog") || condLower.includes("haze") || condLower.includes("mist")) {
    return <CloudFog className={`${sizeClass} text-slate-400`} />;
  }
  if (condLower.includes("cloud") || condLower.includes("overcast")) {
    return <CloudSun className={`${sizeClass} text-cyan-300`} />;
  }
  return <Sun className={`${sizeClass} text-amber-400 animate-spin-slow`} />;
}

export function getWeatherEmoji(condition: string): string {
  const condLower = (condition || "").toLowerCase();
  if (condLower.includes("thunder")) return "⛈️";
  if (condLower.includes("rain") || condLower.includes("drizzle")) return "🌧️";
  if (condLower.includes("snow")) return "❄️";
  if (condLower.includes("fog") || condLower.includes("haze")) return "🌫️";
  if (condLower.includes("cloud")) return "⛅";
  return "☀️";
}

export function getSafetyVisualBadge(priority: 'low' | 'medium' | 'high'): {
  icon: React.ReactNode;
  bg: string;
  text: string;
} {
  switch (priority) {
    case 'high':
      return {
        icon: <XCircle className="h-7 w-7 text-rose-400" />,
        bg: 'bg-rose-500/20 border-rose-500/50 text-rose-300',
        text: 'STAY CAUTIOUS / INDOORS',
      };
    case 'medium':
      return {
        icon: <AlertTriangle className="h-7 w-7 text-amber-400" />,
        bg: 'bg-amber-500/20 border-amber-500/50 text-amber-300',
        text: 'TAKE PRECAUTIONS',
      };
    default:
      return {
        icon: <CheckCircle2 className="h-7 w-7 text-emerald-400" />,
        bg: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300',
        text: 'SAFE & OUTDOOR READY',
      };
  }
}

export function getActionVisualIcon(type: string): { icon: React.ReactNode; label: string } {
  const tLower = (type || "").toLowerCase();
  if (tLower.includes("rain") || tLower.includes("gear") || tLower.includes("precipitation")) {
    return { icon: <Umbrella className="h-5 w-5 text-blue-400" />, label: "Umbrella Needed" };
  }
  if (tLower.includes("clothing") || tLower.includes("wear") || tLower.includes("heat")) {
    return { icon: <Shirt className="h-5 w-5 text-cyan-400" />, label: "Light Clothes" };
  }
  if (tLower.includes("uv") || tLower.includes("sun")) {
    return { icon: <Glasses className="h-5 w-5 text-amber-400" />, label: "Sunglasses & SPF" };
  }
  if (tLower.includes("water") || tLower.includes("hydration") || tLower.includes("drink")) {
    return { icon: <Droplets className="h-5 w-5 text-emerald-400" />, label: "Drink Water" };
  }
  return { icon: <Activity className="h-5 w-5 text-purple-400" />, label: "Activity Metric" };
}

export function getPersonaIcon(key: string, className: string = "h-5 w-5"): React.ReactNode {
  switch (key) {
    case 'health':
      return <HeartPulse className={`${className} text-emerald-400`} />;
    case 'fitness':
      return <Activity className={`${className} text-amber-400`} />;
    case 'beach':
      return <Waves className={`${className} text-cyan-400`} />;
    case 'traveler':
      return <Plane className={`${className} text-indigo-400`} />;
    case 'parents':
      return <Baby className={`${className} text-pink-400`} />;
    case 'agriculture':
      return <Sprout className={`${className} text-green-400`} />;
    case 'commuters':
      return <Car className={`${className} text-yellow-400`} />;
    case 'event_planners':
      return <Calendar className={`${className} text-purple-400`} />;
    default:
      return <HeartPulse className={`${className} text-emerald-400`} />;
  }
}
