import React, { useState } from 'react';
import {
  CloudSun,
  Sprout,
  ShieldAlert,
  Camera,
  Calculator,
  MessageSquare,
  MapPin,
  AlertTriangle,
  Compass,
  CheckCircle2,
  Printer,
  Globe,
  ChevronDown,
} from 'lucide-react';
import { LocationInfo, ProcessedWeatherData, FarmerPlot } from '../types';
import { CROP_PROFILES } from '../data/cropDatabase';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageCode } from '../i18n/translations';

export type ActiveTab = 'weather' | 'crop_growth' | 'suitability' | 'pest_warnings' | 'scanner' | 'calculators' | 'chat';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  location: LocationInfo;
  onOpenLocationModal: () => void;
  onOpenPrintModal: () => void;
  weather?: ProcessedWeatherData;
  plots: FarmerPlot[];
  activePlotId: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  location,
  onOpenLocationModal,
  onOpenPrintModal,
  weather,
  plots,
  activePlotId,
}) => {
  const { language, setLanguage, languages, t, currentLanguageMeta } = useLanguage();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const activePlot = plots.find((p) => p.id === activePlotId) || plots[0];
  const cropProfile = CROP_PROFILES.find((c) => c.id === activePlot?.cropId);

  const tabs: Array<{ id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }> = [
    {
      id: 'weather',
      label: t('tabWeather', 'Weather & Soil'),
      icon: <CloudSun className="w-4 h-4" />,
    },
    {
      id: 'crop_growth',
      label: t('tabCropGrowth', 'Crop Growth & Stages'),
      icon: <Sprout className="w-4 h-4" />,
    },
    {
      id: 'suitability',
      label: t('tabSuitability', 'Crop Suitability & Seasons'),
      icon: <Compass className="w-4 h-4" />,
    },
    {
      id: 'pest_warnings',
      label: t('tabPestWarnings', 'Pest Early Warning'),
      icon: <ShieldAlert className="w-4 h-4" />,
      badge: weather?.derived.dewDurationHours && weather.derived.dewDurationHours >= 6 ? 'Alert' : undefined,
    },
    {
      id: 'scanner',
      label: t('tabScanner', 'AI Leaf Scanner'),
      icon: <Camera className="w-4 h-4" />,
    },
    {
      id: 'calculators',
      label: t('tabCalculators', 'Spray & Calculators'),
      icon: <Calculator className="w-4 h-4" />,
    },
    {
      id: 'chat',
      label: t('tabChat', 'AI Agronomist'),
      icon: <MessageSquare className="w-4 h-4" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-md border-b border-stone-800 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top brand & status row */}
        <div className="flex items-center justify-between py-3 gap-2">
          {/* Logo & App title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-stone-950 shadow-md shadow-emerald-950/50">
              <Sprout className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-stone-100 text-lg tracking-tight">
                  Agri<span className="text-emerald-400">Guide</span>
                </span>
                <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono rounded font-bold uppercase tracking-wider border border-emerald-500/30 hidden xs:inline-block">
                  {t('tagline', 'Smallholder Shield')}
                </span>
              </div>
              <p className="text-[11px] text-stone-400 hidden lg:block">
                {t('appSubtitle', 'Hyperlocal Weather, Crop Growth Insights, Suitability & Pest Early Warnings')}
              </p>
            </div>
          </div>

          {/* Quick status chips & action buttons */}
          <div className="flex items-center gap-2">
            {/* Spray condition pill */}
            {weather && (
              <div
                className={`hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                  weather.derived.spraySuitability === 'Optimal'
                    ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                    : weather.derived.spraySuitability === 'Marginal'
                    ? 'bg-amber-950/50 border-amber-500/40 text-amber-300'
                    : 'bg-rose-950/50 border-rose-500/40 text-rose-300'
                }`}
                title={weather.derived.sprayReason}
              >
                {weather.derived.spraySuitability === 'Optimal' ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5" />
                )}
                <span>
                  {weather.derived.spraySuitability === 'Optimal'
                    ? t('sprayOptimal', 'Optimal to Spray')
                    : weather.derived.spraySuitability === 'Marginal'
                    ? t('sprayMarginal', 'Marginal')
                    : t('sprayUnsuitable', 'Unsuitable')}
                </span>
              </div>
            )}

            {/* Farm Location Button */}
            <button
              onClick={onOpenLocationModal}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-850 border border-stone-800 hover:border-emerald-500/50 text-stone-200 transition-all text-xs font-medium shadow-sm group"
              title={t('changeLocation', 'Change Farm Location')}
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
              <span className="font-bold text-stone-100 max-w-[90px] sm:max-w-[140px] truncate block">
                {location.name}
              </span>
              <Compass className="w-3 h-3 text-stone-500 group-hover:text-emerald-400 ml-0.5 hidden sm:inline" />
            </button>

            {/* Print Field Report Button */}
            <button
              onClick={onOpenPrintModal}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all text-xs font-bold shadow-md shadow-emerald-950/50"
              title={t('printReport', 'Print Field Report')}
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('printReport', 'Print Report')}</span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-850 border border-stone-800 text-stone-200 transition-all text-xs font-semibold"
                title="Select Indian Language"
              >
                <span className="text-sm">{currentLanguageMeta.flag}</span>
                <span className="hidden md:inline">{currentLanguageMeta.nativeName}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {isLangMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsLangMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-44 bg-stone-900 border border-stone-700/80 rounded-xl shadow-2xl py-1.5 z-40 animate-fade-in text-xs">
                    <div className="px-3 py-1 border-b border-stone-800 text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1.5">
                      <Globe className="w-3 h-3 text-emerald-400" />
                      <span>Languages / भाषा</span>
                    </div>
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-stone-800 transition-colors ${
                          language === l.code
                            ? 'text-emerald-400 font-bold bg-emerald-950/30'
                            : 'text-stone-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{l.flag}</span>
                          <span>{l.nativeName}</span>
                        </div>
                        <span className="text-[10px] text-stone-500 font-mono">
                          {l.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <nav className="flex items-center gap-1 overflow-x-auto py-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none border-t border-stone-850">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.2 bg-rose-500 text-white text-[9px] font-black rounded-full uppercase animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
