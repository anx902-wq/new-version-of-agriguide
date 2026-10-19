import React, { useState } from 'react';
import { MapPin, Search, Navigation, X, Check, Loader2, Globe } from 'lucide-react';
import { LocationInfo } from '../types';
import { PRESET_FARM_LOCATIONS } from '../data/cropDatabase';
import { searchLocations } from '../services/weatherService';
import { useLanguage } from '../i18n/LanguageContext';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: LocationInfo;
  onSelectLocation: (loc: LocationInfo) => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
}) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setGeoError(null);
    try {
      const results = await searchLocations(searchQuery);
      setSearchResults(results);
      if (results.length === 0) {
        setGeoError('No locations found. Try a nearby district or larger town name.');
      }
    } catch {
      setGeoError('Search failed. Please check network connection.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        try {
          // Reverse geocode via Open-Meteo search or fallback
          const revRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${lat.toFixed(2)},${lon.toFixed(2)}&count=1&language=en`
          );
          const revData = await revRes.json();
          const placeName = revData.results?.[0]?.name || 'My Farm Coordinates';
          const newLoc: LocationInfo = {
            name: placeName,
            region: revData.results?.[0]?.admin1 || 'Local Area',
            country: revData.results?.[0]?.country || 'Detected GPS',
            lat,
            lon,
          };
          onSelectLocation(newLoc);
          onClose();
        } catch {
          onSelectLocation({
            name: `Farm at ${lat.toFixed(3)}°, ${lon.toFixed(3)}°`,
            country: 'GPS Location',
            lat,
            lon,
          });
          onClose();
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        setGeoError(
          err.code === 1
            ? 'Location permission denied. Please allow GPS access or search your village below.'
            : 'Could not acquire precise GPS signal. Please select a preset or search.'
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-700/80 rounded-2xl shadow-2xl overflow-hidden text-stone-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/60">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-stone-100">{t('changeLocation', 'Set Farm Microclimate Location')}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* GPS Button */}
          <button
            onClick={handleUseGPS}
            disabled={isLocating}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 rounded-xl font-medium transition-all group shadow-sm"
          >
            {isLocating ? (
              <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
            ) : (
              <Navigation className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            )}
            <span>{isLocating ? 'Detecting Farm Coordinates...' : t('detectGps', 'Detect My Exact GPS Field Location')}</span>
          </button>

          {geoError && (
            <div className="p-3 text-xs bg-red-950/60 border border-red-800/80 text-red-200 rounded-lg">
              {geoError}
            </div>
          )}

          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="text-xs font-medium text-stone-400">
              Or Search Village, District, or Region:
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Ludhiana, Eldoret, Nashik, Fresno, Can Tho..."
                className="w-full pl-10 pr-24 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-stone-500"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5" />
              <button
                type="submit"
                disabled={isSearching}
                className="absolute right-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-colors"
              >
                {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Search'}
              </button>
            </div>
          </form>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Search Results</span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {searchResults.map((loc, idx) => (
                  <button
                    key={`${loc.lat}-${loc.lon}-${idx}`}
                    onClick={() => {
                      onSelectLocation(loc);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 bg-stone-950/80 hover:bg-stone-800 border border-stone-800 hover:border-emerald-500/50 rounded-xl text-left transition-all"
                  >
                    <div>
                      <p className="text-sm font-medium text-stone-200">{loc.name}</p>
                      <p className="text-xs text-stone-400">
                        {loc.region ? `${loc.region}, ` : ''}{loc.country} • Lat: {loc.lat.toFixed(2)}°, Lon: {loc.lon.toFixed(2)}°
                      </p>
                    </div>
                    <MapPin className="w-4 h-4 text-emerald-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Preset Smallholder Agrarian Hubs */}
          <div className="space-y-2 pt-2 border-t border-stone-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-400 uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Major Agricultural Belts in India</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_FARM_LOCATIONS.map((preset) => {
                const isSelected =
                  Math.abs(preset.lat - currentLocation.lat) < 0.1 &&
                  Math.abs(preset.lon - currentLocation.lon) < 0.1;
                return (
                  <button
                    key={preset.name}
                    onClick={() => {
                      onSelectLocation({
                        name: preset.name,
                        region: preset.region,
                        country: preset.country,
                        lat: preset.lat,
                        lon: preset.lon,
                      });
                      onClose();
                    }}
                    className={`flex items-start justify-between p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200'
                        : 'bg-stone-950/50 hover:bg-stone-800/80 border-stone-800 text-stone-300'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-stone-100">{preset.name}</p>
                      <p className="text-[11px] text-stone-400">{preset.region}, {preset.country}</p>
                      <p className="text-[10px] text-emerald-400/90 mt-1 font-mono">
                        {preset.majorCrops.slice(0, 3).join(', ')}
                      </p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
