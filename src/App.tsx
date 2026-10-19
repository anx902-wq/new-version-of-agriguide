import React, { useState, useEffect } from 'react';
import {
  Loader2,
  AlertTriangle,
  RefreshCw,
  WifiOff,
  Sprout,
  ShieldAlert,
  Droplets,
  Wind,
} from 'lucide-react';
import { LocationInfo, ProcessedWeatherData, FarmerPlot, CropProfile } from './types';
import { PRESET_FARM_LOCATIONS } from './data/cropDatabase';
import { fetchWeatherData } from './services/weatherService';
import { Navbar, ActiveTab } from './components/Navbar';
import { WeatherDashboard } from './components/WeatherDashboard';
import { CropStageTracker } from './components/CropStageTracker';
import { CropSuitabilityExplorer } from './components/CropSuitabilityExplorer';
import { PestEarlyWarning } from './components/PestEarlyWarning';
import { CropScanner } from './components/CropScanner';
import { FarmCalculators } from './components/FarmCalculators';
import { AgriChatAssistant } from './components/AgriChatAssistant';
import { LocationModal } from './components/LocationModal';
import { PrintReportModal } from './components/PrintReportModal';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';

const DEFAULT_PLOTS: FarmerPlot[] = [
  {
    id: 'plot-1',
    plotName: 'Main Plot (Maize)',
    cropId: 'maize',
    sowingDate: (() => {
      const d = new Date();
      d.setDate(d.getDate() - 42); // 42 DAS (active vegetative/whorl stage)
      return d.toISOString().split('T')[0];
    })(),
    areaHectares: 1.2,
    irrigationType: 'Furrow / Flood',
    soilType: 'Clay Loam',
    notes: 'Basal DAP applied at sowing; 1st urea top dressing completed at 22 DAS.',
  },
  {
    id: 'plot-2',
    plotName: 'Vegetable Ridge (Tomato)',
    cropId: 'tomato',
    sowingDate: (() => {
      const d = new Date();
      d.setDate(d.getDate() - 32); // 32 DAS (vegetative branching)
      return d.toISOString().split('T')[0];
    })(),
    areaHectares: 0.5,
    irrigationType: 'Drip',
    soilType: 'Sandy Loam',
    notes: 'Staking completed; weekly preventative neem spray schedule.',
  },
];

function AgriGuideInner() {
  const { t } = useLanguage();

  // Location state
  const [currentLocation, setCurrentLocation] = useState<LocationInfo>(() => {
    try {
      const saved = localStorage.getItem('agriguide_location') || localStorage.getItem('kisansense_location');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return PRESET_FARM_LOCATIONS[0]; // Ludhiana
  });

  // Farmer plots state
  const [plots, setPlots] = useState<FarmerPlot[]>(() => {
    try {
      const saved = localStorage.getItem('agriguide_plots') || localStorage.getItem('kisansense_plots');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_PLOTS;
  });

  const [activePlotId, setActivePlotId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('agriguide_active_plot') || localStorage.getItem('kisansense_active_plot');
      if (saved) return saved;
    } catch {
      // ignore
    }
    return 'plot-1';
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('weather');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Weather data & status
  const [weather, setWeather] = useState<ProcessedWeatherData | null>(() => {
    try {
      const cached =
        localStorage.getItem(`agriguide_weather_${currentLocation.lat.toFixed(2)}_${currentLocation.lon.toFixed(2)}`) ||
        localStorage.getItem(`kisansense_weather_${currentLocation.lat.toFixed(2)}_${currentLocation.lon.toFixed(2)}`);
      if (cached) return JSON.parse(cached);
    } catch {
      // ignore
    }
    return null;
  });
  const [isLoadingWeather, setIsLoadingWeather] = useState(!weather);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('agriguide_location', JSON.stringify(currentLocation));
  }, [currentLocation]);

  useEffect(() => {
    localStorage.setItem('agriguide_plots', JSON.stringify(plots));
  }, [plots]);

  useEffect(() => {
    localStorage.setItem('agriguide_active_plot', activePlotId);
  }, [activePlotId]);

  // Online / offline detector
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch live weather
  const loadWeather = async (loc = currentLocation) => {
    setIsLoadingWeather(true);
    setWeatherError(null);
    try {
      const data = await fetchWeatherData(loc);
      setWeather(data);
      try {
        localStorage.setItem(`agriguide_weather_${loc.lat.toFixed(2)}_${loc.lon.toFixed(2)}`, JSON.stringify(data));
      } catch {
        // quota exceeded or private mode
      }
    } catch (err: any) {
      console.error('Failed to load weather:', err);
      setWeatherError('Could not refresh live satellite weather. Using cached microclimate data.');
    } finally {
      setIsLoadingWeather(false);
    }
  };

  useEffect(() => {
    loadWeather(currentLocation);
  }, [currentLocation.lat, currentLocation.lon]);

  const handleAddPlot = (newPlot: FarmerPlot) => {
    setPlots((prev) => [...prev, newPlot]);
    setActivePlotId(newPlot.id);
  };

  const handlePlantCropInPlot = (crop: CropProfile) => {
    const newPlot: FarmerPlot = {
      id: `plot-${Date.now()}`,
      plotName: `${crop.name.split(' ')[0]} Field`,
      cropId: crop.id,
      sowingDate: new Date().toISOString().split('T')[0],
      areaHectares: 1.0,
      irrigationType: 'Furrow / Flood',
      soilType: 'Clay Loam',
      notes: `Planted based on AgriGuide Suitability recommendation on ${new Date().toLocaleDateString()}`,
    };
    setPlots((prev) => [...prev, newPlot]);
    setActivePlotId(newPlot.id);
    setActiveTab('crop_growth');
  };

  const activePlot = plots.find((p) => p.id === activePlotId) || plots[0];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-stone-950">
      {/* Offline or Weather Warning Banner */}
      {!isOnline && (
        <div className="bg-amber-600/90 text-stone-950 text-xs font-bold py-1.5 px-4 text-center flex items-center justify-center gap-2 print:hidden">
          <WifiOff className="w-4 h-4" />
          <span>Offline Field Mode Active: Showing cached microclimate &amp; Indian agronomy database</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        location={currentLocation}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
        weather={weather || undefined}
        plots={plots}
        activePlotId={activePlotId}
      />

      {/* Main App Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {isLoadingWeather && !weather ? (
          <div className="h-96 flex flex-col items-center justify-center text-center space-y-3">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            <p className="text-sm font-semibold text-stone-200">
              AgriGuide: Fetching Hyperlocal Microclimate &amp; Soil Strata for {currentLocation.name}...
            </p>
            <p className="text-xs text-stone-500">
              Retrieving Open-Meteo 4-depth soil moisture, reference ET₀, and atmospheric vapor pressure deficit
            </p>
          </div>
        ) : weather ? (
          <>
            {/* Dew Spore Alert Ticker if risk high */}
            {weather.derived.dewDurationHours >= 6 && (
              <div className="p-3 bg-gradient-to-r from-amber-950/70 via-stone-900 to-rose-950/70 border border-amber-600/50 rounded-2xl flex items-center justify-between text-xs text-amber-200 shadow-md print:hidden">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <strong className="text-amber-300">Prolonged Leaf Wetness Detected: </strong>
                    <span>{weather.derived.dewDurationHours} continuous hours of dew/humidity &gt;88%. High risk of fungal sporulation (Blight, Blast, Rust). Check the Pest Warning tab.</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('pest_warnings')}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-lg shrink-0 transition-colors hidden sm:block text-[11px]"
                >
                  View Risks
                </button>
              </div>
            )}

            {/* Tab Views */}
            {activeTab === 'weather' && (
              <WeatherDashboard
                weather={weather}
                onOpenLocationModal={() => setIsLocationModalOpen(true)}
                onNavigateToCalculator={() => setActiveTab('calculators')}
              />
            )}

            {activeTab === 'crop_growth' && (
              <CropStageTracker
                plots={plots}
                activePlotId={activePlotId}
                onSelectPlot={setActivePlotId}
                onAddPlot={handleAddPlot}
                weather={weather}
              />
            )}

            {activeTab === 'suitability' && (
              <CropSuitabilityExplorer
                weather={weather}
                plots={plots}
                activePlotId={activePlotId}
                onPlantCropInPlot={handlePlantCropInPlot}
              />
            )}

            {activeTab === 'pest_warnings' && (
              <PestEarlyWarning
                weather={weather}
                plots={plots}
                onNavigateToScanner={() => setActiveTab('scanner')}
                onNavigateToCalculator={() => setActiveTab('calculators')}
              />
            )}

            {activeTab === 'scanner' && (
              <CropScanner
                weather={weather}
                plots={plots}
                activePlotId={activePlotId}
              />
            )}

            {activeTab === 'calculators' && (
              <FarmCalculators
                weather={weather}
                plots={plots}
                activePlotId={activePlotId}
              />
            )}

            {activeTab === 'chat' && (
              <AgriChatAssistant
                weather={weather}
                plots={plots}
                activePlotId={activePlotId}
              />
            )}
          </>
        ) : (
          <div className="p-8 text-center bg-stone-900 border border-stone-800 rounded-2xl space-y-3">
            <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
            <h3 className="text-base font-bold text-stone-100">Weather Data Temporarily Unavailable</h3>
            <p className="text-xs text-stone-400">{weatherError || 'Please check your internet connection.'}</p>
            <button
              onClick={() => loadWeather()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Connection</span>
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-800/80 bg-stone-950 py-4 text-center text-xs text-stone-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-stone-400">AgriGuide</span>
            <span>— {t('appSubtitle', 'Hyperlocal Weather, Crop Growth Insights, Suitability & Pest Early Warnings')}</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-stone-500">
            <span>India Agro-Climatic Intelligence</span>
            <span>•</span>
            <span>Open-Meteo High-Resolution Model</span>
            <span>•</span>
            <span>Gemini Vision Agronomy</span>
          </div>
        </div>
      </footer>

      {/* Location Picker Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={currentLocation}
        onSelectLocation={(loc) => {
          setCurrentLocation(loc);
        }}
      />

      {/* Printable Field Agronomy Report Modal */}
      {weather && activePlot && (
        <PrintReportModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          weather={weather}
          plot={activePlot}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AgriGuideInner />
    </LanguageProvider>
  );
}
