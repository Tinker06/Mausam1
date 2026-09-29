import React, { useState } from 'react';
import { X, Search, Bookmark, MapPin, Trash2, Plus, Check } from 'lucide-react';
import { SavedLocationItem } from '../types/weather';
import { SupportedLanguage, t } from '../i18n/translations';

interface SavedLocationsModalProps {
  locations: SavedLocationItem[];
  currentCity: string;
  currentLang: SupportedLanguage;
  onSelectCity: (city: string) => void;
  onAddCity: (city: string) => void;
  onDeleteCity: (id: string) => void;
  onClose: () => void;
}

export const SavedLocationsModal: React.FC<SavedLocationsModalProps> = ({
  locations,
  currentCity,
  currentLang,
  onSelectCity,
  onAddCity,
  onDeleteCity,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    onAddCity(searchQuery.trim());
    setSearchQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-card rounded-3xl p-6 border border-slate-700 w-full max-w-lg shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-cyan-400" />
            {t("saved.title", currentLang)}
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Bar & Add */}
        <form onSubmit={handleAdd} className="flex items-center space-x-2 mb-6">
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("saved.placeholder", currentLang)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center gap-1 transition-all"
          >
            <Plus className="h-4 w-4" /> {t("saved.add", currentLang)}
          </button>
        </form>

        {/* City List */}
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {locations.map((loc) => {
            const isCurrent = loc.city.toLowerCase() === currentCity.toLowerCase();
            return (
              <div
                key={loc.id}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-slate-800/90 border-cyan-400 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div 
                  onClick={() => { onSelectCity(loc.city); onClose(); }}
                  className="flex items-center space-x-3 cursor-pointer flex-1"
                >
                  <MapPin className={`h-4 w-4 ${isCurrent ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      {loc.city}
                      {loc.is_default && (
                        <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-semibold">
                          Default
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-slate-400">Lat {loc.latitude}°, Lon {loc.longitude}°</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {isCurrent ? (
                    <span className="p-1.5 rounded-full bg-cyan-500/20 text-cyan-400">
                      <Check className="h-4 w-4" />
                    </span>
                  ) : (
                    <button
                      onClick={() => onDeleteCity(loc.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
