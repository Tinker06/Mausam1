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
import { ProfileView } from './components/ProfileView';
import { PersonalView } from './components/PersonalView';

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
  const [userName, setUserName] = useState<string>(() => localStorage.getItem('mausam_user_name') || 'Dhiya');
  const [activePersona, setActivePersona] = useState<PersonaType>(() => (localStorage.getItem('mausam_persona') as PersonaType) || 'traveler');
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(() => (localStorage.getItem('mausam_lang') as SupportedLanguage) || 'en');
  const [currentTheme, setCurrentTheme] = useState<'night' | 'day'>(() => (localStorage.getItem('mausam_theme') as 'night' | 'day') || 'day');

  const [currentCity, setCurrentCity] = useState<string>('Chennai');
  const [loading, setLoading] = useState<boolean>(true);

  // Nav tab state ('home' | 'personal' | 'profile')
  const [headerNavTab, setHeaderNavTab] = useState<'home' | 'personal' | 'profile'>('home');

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

  // Bottom Nav active tab ('home' | 'personal' | 'profile' | 'saved' | 'settings')
  const [activeTab, setActiveTab] = useState<'home' | 'personal' | 'profile' | 'saved' | 'settings'>('home');

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
    setHeaderNavTab('home');
    setActiveTab('home');
  };

  const handleSaveProfilePreferences = (updated: { name: string; persona: PersonaType; alerts: Record<string, boolean> }) => {
    setUserName(updated.name);
    setActivePersona(updated.persona);
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
    setHeaderNavTab('home');
    setActiveTab('home');
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
        ? 'bg-[#D6EBF3] text-[#0C181D] selection:bg-[#447F98] selection:text-white'
        : 'bg-[#060D10] text-[#D6EBF3] selection:bg-[#629BB5] selection:text-white'
    }`}>
      
      {/* Header */}
      <Header
        userName={userName}
        currentCity={currentCity}
        activePersona={activePersona}
        currentLang={currentLang}
        currentTheme={currentTheme}
        activeTab={headerNavTab}
        onTabChange={(tab) => {
          setHeaderNavTab(tab);
          setActiveTab(tab as any);
        }}
        onOpenSavedLocations={() => { setShowSavedModal(true); setActiveTab('saved'); }}
        onOpenSettings={() => { setShowSettingsModal(true); setActiveTab('settings'); }}
        onLanguageChange={setCurrentLang}
        onToggleTheme={handleToggleTheme}
        onOpenProfile={() => { setHeaderNavTab('profile'); setActiveTab('profile'); }}
      />

      {/* Main Container - Full Mobile Fill */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-1 sm:px-6 py-2 sm:py-6 pb-20 sm:pb-10 space-y-2.5 sm:space-y-6">
        
        {headerNavTab === 'profile' ? (
          <ProfileView
            userName={userName}
            activePersona={activePersona}
            currentLang={currentLang}
            currentTheme={currentTheme}
            onSavePreferences={handleSaveProfilePreferences}
          />
        ) : headerNavTab === 'personal' ? (
          <PersonalView
            currentCity={currentCity}
            activePersona={activePersona}
            currentLang={currentLang}
            currentTheme={currentTheme}
            weather={dashboardData ? dashboardData.current : null}
            onUpdatePersona={setActivePersona}
            onSelectCity={setCurrentCity}
          />
        ) : loading || !dashboardData ? (
          <div className="space-y-4 animate-pulse">
            <div className={`h-16 rounded-2xl ${isDay ? 'bg-[#B9D8E1]' : 'bg-[#152A33]'}`} />
            <div className={`h-56 rounded-3xl ${isDay ? 'bg-[#B9D8E1]' : 'bg-[#152A33]'}`} />
            <div className={`h-40 rounded-3xl ${isDay ? 'bg-[#B9D8E1]' : 'bg-[#152A33]'}`} />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className={`h-28 rounded-2xl ${isDay ? 'bg-[#B9D8E1]' : 'bg-[#152A33]'}`} />
              <div className={`h-28 rounded-2xl ${isDay ? 'bg-[#B9D8E1]' : 'bg-[#152A33]'}`} />
              <div className={`h-28 rounded-2xl ${isDay ? 'bg-[#B9D8E1]' : 'bg-[#152A33]'}`} />
              <div className={`h-28 rounded-2xl ${isDay ? 'bg-[#B9D8E1]' : 'bg-[#152A33]'}`} />
            </div>
          </div>
        ) : (
          <>
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
              onChangePersonaClick={() => setShowPersonaModal(true)}
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

            {/* Weather Warning Alert Banner - Positioned at bottom of dashboard page */}
            <div className="pt-1">
              <AlertsBanner
                warningData={dashboardData.warning}
                currentLang={currentLang}
                onTriggerTestPush={handleTriggerTestPush}
              />
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className={`border-t py-4 text-center text-xs pb-20 sm:pb-4 transition-colors ${
        isDay 
          ? 'bg-[#B9D8E1] border-[#8CB8C6] text-[#152A33]' 
          : 'bg-[#0C181D] border-[#447F98]/40 text-[#D6EBF3]'
      }`}>
        <div className="max-w-7xl mx-auto px-2 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="IMD Logo" className="h-5 w-auto object-contain" />
            <span>MAUSAM Environmental Platform • User: {userName}</span>
          </div>
          <span className="font-bold text-[#447F98]">IMD Turquoise Palette</span>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <BottomNavBar
        activeTab={activeTab}
        activePersona={activePersona}
        currentLang={currentLang}
        currentTheme={currentTheme}
        onGoHome={() => { setHeaderNavTab('home'); setActiveTab('home'); }}
        onGoPersonal={() => { setHeaderNavTab('personal'); setActiveTab('personal'); }}
        onGoProfile={() => { setHeaderNavTab('profile'); setActiveTab('profile'); }}
        onOpenSaved={() => { setShowSavedModal(true); setActiveTab('saved'); }}
        onOpenSettings={() => { setShowSettingsModal(true); setActiveTab('settings'); }}
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
          onClose={() => setShowPersonaModal(false)}
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
          onClose={() => setShowSavedModal(false)}
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
          onClose={() => setShowSettingsModal(false)}
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
