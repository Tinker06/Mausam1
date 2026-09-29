import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PersonaSelector } from './components/PersonaSelector';
import { WeatherHero } from './components/WeatherHero';
import { PersonaInsightsCard } from './components/PersonaInsightsCard';
import { EnvironmentalMetrics } from './components/EnvironmentalMetrics';
import { ForecastSection } from './components/ForecastSection';
import { AlertsBanner } from './components/AlertsBanner';
import { SavedLocationsModal } from './components/SavedLocationsModal';
import { SettingsModal } from './components/SettingsModal';
import { OnboardingModal } from './components/OnboardingModal';
import { PushNotificationToast } from './components/PushNotificationToast';
import { BottomNavBar } from './components/BottomNavBar';

import { 
  PersonaType, 
  NormalizedWeather, 
  ForecastData, 
  RecommendationData, 
  WeatherWarningData, 
  SavedLocationItem 
} from './types/weather';
import { SupportedLanguage } from './i18n/translations';
import { 
  fetchDashboardData, 
  fetchSavedLocations, 
  addSavedLocation, 
  deleteSavedLocation,
  triggerTestPushNotification 
} from './services/api';

export function App() {
  // User Profile state with localStorage persistence
  const [userName, setUserName] = useState<string>(() => localStorage.getItem('mausam_user_name') || 'Dhiyanesh');
  const [activePersona, setActivePersona] = useState<PersonaType>(() => (localStorage.getItem('mausam_persona') as PersonaType) || 'health');
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(() => (localStorage.getItem('mausam_lang') as SupportedLanguage) || 'en');
  const [currentTheme, setCurrentTheme] = useState<'night' | 'day'>(() => (localStorage.getItem('mausam_theme') as 'night' | 'day') || 'night');

  const [currentCity, setCurrentCity] = useState<string>('Chennai');
  const [loading, setLoading] = useState<boolean>(true);

  const [dashboardData, setDashboardData] = useState<{
    current: NormalizedWeather;
    forecast: ForecastData;
    recommendations: RecommendationData;
    warning: WeatherWarningData;
  } | null>(null);

  const [savedLocations, setSavedLocations] = useState<SavedLocationItem[]>([]);

  // Modals state
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => !localStorage.getItem('mausam_onboarded'));
  const [showPersonaModal, setShowPersonaModal] = useState<boolean>(false);
  const [showSavedModal, setShowSavedModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  // Bottom Nav active tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'persona' | 'saved' | 'settings'>('dashboard');

  // Push notification state
  const [pushToast, setPushToast] = useState<{ message: string; city: string; severity: string } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('mausam_user_name', userName);
    localStorage.setItem('mausam_persona', activePersona);
    localStorage.setItem('mausam_lang', currentLang);
    localStorage.setItem('mausam_theme', currentTheme);
  }, [userName, activePersona, currentLang, currentTheme]);

  // Load Saved Locations
  useEffect(() => {
    fetchSavedLocations().then(setSavedLocations);
  }, []);

  // Load Dashboard Data
  useEffect(() => {
    setLoading(true);
    fetchDashboardData(activePersona, currentCity).then(data => {
      setDashboardData(data);
      setLoading(false);
    });
  }, [currentCity, activePersona]);

  const handleCompleteOnboarding = (user: { name: string; persona: PersonaType; lang: SupportedLanguage; theme: 'night' | 'day' }) => {
    setUserName(user.name);
    setActivePersona(user.persona);
    setCurrentLang(user.lang);
    setCurrentTheme(user.theme);
    localStorage.setItem('mausam_onboarded', 'true');
    setShowOnboarding(false);
  };

  const handleUpdateSettings = (user: { name: string; persona: PersonaType; lang: SupportedLanguage; theme: 'night' | 'day' }) => {
    setUserName(user.name);
    setActivePersona(user.persona);
    setCurrentLang(user.lang);
    setCurrentTheme(user.theme);
  };

  const handleToggleTheme = () => {
    setCurrentTheme(prev => (prev === 'night' ? 'day' : 'night'));
  };

  const handleSelectPersona = (persona: PersonaType) => {
    setActivePersona(persona);
    setShowPersonaModal(false);
    setActiveTab('dashboard');
  };

  const handleAddLocation = async (city: string) => {
    const newLoc = await addSavedLocation(city);
    setSavedLocations(prev => [newLoc, ...prev]);
    setCurrentCity(city);
  };

  const handleDeleteLocation = async (id: string) => {
    await deleteSavedLocation(id);
    setSavedLocations(prev => prev.filter(l => l.id !== id));
  };

  const handleTriggerTestPush = async () => {
    const res = await triggerTestPushNotification(currentCity);
    if (res && res.warning && res.warning.warning) {
      setPushToast({
        message: res.warning.warning.message,
        city: currentCity,
        severity: res.warning.warning.severity
      });
    }
  };

  const isDay = currentTheme === 'day';

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] ${
      isDay
        ? 'bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white'
        : 'bg-[#0B0F19] text-slate-100 selection:bg-cyan-500 selection:text-white'
    }`}>
      
      {/* Header */}
      <Header
        userName={userName}
        currentCity={currentCity}
        activePersona={activePersona}
        currentLang={currentLang}
        currentTheme={currentTheme}
        onSelectPersonaClick={() => { setShowPersonaModal(true); setActiveTab('persona'); }}
        onOpenSavedLocations={() => { setShowSavedModal(true); setActiveTab('saved'); }}
        onOpenSettings={() => { setShowSettingsModal(true); setActiveTab('settings'); }}
        onLanguageChange={setCurrentLang}
        onToggleTheme={handleToggleTheme}
        onOpenProfile={() => setShowOnboarding(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-8 py-5 pb-24 sm:pb-8 space-y-5">
        
        {loading || !dashboardData ? (
          <div className="space-y-5 animate-pulse">
            <div className={`h-16 rounded-2xl ${isDay ? 'bg-slate-200' : 'bg-slate-900/80'}`} />
            <div className={`h-56 rounded-3xl ${isDay ? 'bg-slate-200' : 'bg-slate-900/80'}`} />
            <div className={`h-40 rounded-3xl ${isDay ? 'bg-slate-200' : 'bg-slate-900/80'}`} />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className={`h-28 rounded-2xl ${isDay ? 'bg-slate-200' : 'bg-slate-900/80'}`} />
              <div className={`h-28 rounded-2xl ${isDay ? 'bg-slate-200' : 'bg-slate-900/80'}`} />
              <div className={`h-28 rounded-2xl ${isDay ? 'bg-slate-200' : 'bg-slate-900/80'}`} />
              <div className={`h-28 rounded-2xl ${isDay ? 'bg-slate-200' : 'bg-slate-900/80'}`} />
            </div>
          </div>
        ) : (
          <>
            {/* Weather Warning Alert Banner */}
            <AlertsBanner
              warningData={dashboardData.warning}
              currentLang={currentLang}
              onTriggerTestPush={handleTriggerTestPush}
            />

            {/* Weather Hero Card */}
            <WeatherHero
              weather={dashboardData.current}
              currentLang={currentLang}
              currentTheme={currentTheme}
            />

            {/* Persona Recommendation Insights */}
            <PersonaInsightsCard
              recommendation={dashboardData.recommendations}
              activePersona={activePersona}
              currentLang={currentLang}
              currentTheme={currentTheme}
              onChangePersonaClick={() => { setShowPersonaModal(true); setActiveTab('persona'); }}
            />

            {/* Environmental Metric Cards */}
            <EnvironmentalMetrics
              weather={dashboardData.current}
              currentLang={currentLang}
              currentTheme={currentTheme}
            />

            {/* Forecast Section */}
            <ForecastSection
              forecast={dashboardData.forecast}
              currentLang={currentLang}
              currentTheme={currentTheme}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className={`border-t py-4 text-center text-xs pb-20 sm:pb-4 transition-colors ${
        isDay ? 'bg-white border-slate-200 text-slate-600' : 'border-slate-800/80 bg-slate-950/60 text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>MAUSAM Environmental Platform • User: {userName}</span>
          <span className="font-bold">{currentTheme === 'day' ? 'Day Mode ☀️ (Pure White)' : 'Night Mode 🌙 (Dark Glass)'}</span>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <BottomNavBar
        activeTab={activeTab}
        activePersona={activePersona}
        currentLang={currentLang}
        currentTheme={currentTheme}
        onOpenPersona={() => { setShowPersonaModal(true); setActiveTab('persona'); }}
        onOpenSaved={() => { setShowSavedModal(true); setActiveTab('saved'); }}
        onOpenSettings={() => { setShowSettingsModal(true); setActiveTab('settings'); }}
        onGoHome={() => { setShowPersonaModal(false); setShowSavedModal(false); setShowSettingsModal(false); setActiveTab('dashboard'); }}
      />

      {/* Onboarding Welcome / Profile Modal */}
      {showOnboarding && (
        <OnboardingModal
          initialName={userName}
          initialPersona={activePersona}
          initialLang={currentLang}
          initialTheme={currentTheme}
          onComplete={handleCompleteOnboarding}
        />
      )}

      {/* Persona Selector Modal */}
      {showPersonaModal && (
        <PersonaSelector
          activePersona={activePersona}
          currentLang={currentLang}
          onSelectPersona={handleSelectPersona}
          onClose={() => { setShowPersonaModal(false); setActiveTab('dashboard'); }}
        />
      )}

      {/* Saved Locations Modal */}
      {showSavedModal && (
        <SavedLocationsModal
          locations={savedLocations}
          currentCity={currentCity}
          currentLang={currentLang}
          onSelectCity={setCurrentCity}
          onAddCity={handleAddLocation}
          onDeleteCity={handleDeleteLocation}
          onClose={() => { setShowSavedModal(false); setActiveTab('dashboard'); }}
        />
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal
          userName={userName}
          activePersona={activePersona}
          currentLang={currentLang}
          currentTheme={currentTheme}
          onUpdateSettings={handleUpdateSettings}
          onClose={() => { setShowSettingsModal(false); setActiveTab('dashboard'); }}
        />
      )}

      {/* Push Notification Toast */}
      {pushToast && (
        <PushNotificationToast
          message={pushToast.message}
          city={pushToast.city}
          severity={pushToast.severity}
          onClose={() => setPushToast(null)}
        />
      )}

    </div>
  );
}
