import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Bug,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ProcessedWeatherData, FarmerPlot, PestDisease } from '../types';
import { PEST_DATABASE, CROP_PROFILES } from '../data/cropDatabase';

interface PestEarlyWarningProps {
  weather: ProcessedWeatherData;
  plots: FarmerPlot[];
  onNavigateToScanner?: () => void;
  onNavigateToCalculator?: () => void;
}

export const PestEarlyWarning: React.FC<PestEarlyWarningProps> = ({
  weather,
  plots,
  onNavigateToScanner,
  onNavigateToCalculator,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'farm_crops' | 'high_risk' | 'fungal' | 'insect'>('farm_crops');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPestId, setExpandedPestId] = useState<string | null>(null);

  const activeCropIds = Array.from(new Set(plots.map((p) => p.cropId)));
  const currentTemp = weather.current.temperature;
  const currentRh = weather.current.relativeHumidity;
  const dewDuration = weather.derived.dewDurationHours;
  const recentRain = weather.current.rain + (weather.daily.rainSum?.[0] ?? 0);

  // Compute microclimate risk level for each pest
  const scoredPests = PEST_DATABASE.map((pest) => {
    let riskScore = 0; // 0 to 100

    // Temperature match
    const [minT, maxT] = pest.tempRange;
    if (currentTemp >= minT && currentTemp <= maxT) {
      riskScore += 35;
    } else if (currentTemp >= minT - 3 && currentTemp <= maxT + 3) {
      riskScore += 15;
    }

    // Humidity threshold match
    if (pest.type === 'Fungal') {
      if (currentRh >= pest.humidityThreshold) {
        riskScore += 35;
      } else if (currentRh >= pest.humidityThreshold - 10) {
        riskScore += 20;
      }
      // Dew duration multiplier for fungal spores
      if (dewDuration >= 6) {
        riskScore += 20;
      }
      if (recentRain > 1.0 && pest.rainSensitivity === 'Favors Wet') {
        riskScore += 10;
      }
    } else {
      // Insect or Mite
      if (pest.rainSensitivity === 'Favors Dry' && recentRain < 0.5) {
        riskScore += 25;
      }
      if (currentRh >= pest.humidityThreshold) {
        riskScore += 20;
      }
      if (currentTemp >= 24 && currentTemp <= 32) {
        riskScore += 15; // fast insect reproductive cycle
      }
    }

    // Crop match bonus
    const affectsFarmerPlot = pest.cropsAffected.some((c) => activeCropIds.includes(c));
    if (affectsFarmerPlot) {
      riskScore += 10;
    }

    let dynamicRisk: 'Severe' | 'High' | 'Moderate' | 'Low' = 'Low';
    if (riskScore >= 75) dynamicRisk = 'Severe';
    else if (riskScore >= 55) dynamicRisk = 'High';
    else if (riskScore >= 35) dynamicRisk = 'Moderate';

    // Generate specific microclimate trigger explanation
    let microclimateReason = '';
    if (pest.type === 'Fungal') {
      if (dewDuration >= 6 || currentRh >= 85) {
        microclimateReason = `High dew duration (${dewDuration} hrs) and relative humidity (${Math.round(currentRh)}%) provide water film necessary for fungal spore germination.`;
      } else {
        microclimateReason = `Current temperatures (${Math.round(currentTemp)}°C) fall within the pathogen's active proliferation range.`;
      }
    } else {
      if (pest.rainSensitivity === 'Favors Dry' && recentRain < 0.5) {
        microclimateReason = `Dry warm spell (${Math.round(currentTemp)}°C, no rain) accelerates nymph hatching and flight activity.`;
      } else {
        microclimateReason = `Moderate humidity and warm day temperatures favor rapid generational multiplication.`;
      }
    }

    return {
      ...pest,
      riskScore,
      dynamicRisk,
      microclimateReason,
      affectsFarmerPlot,
    };
  });

  // Filter pests
  const filteredPests = scoredPests.filter((pest) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        pest.name.toLowerCase().includes(q) ||
        pest.scientificName.toLowerCase().includes(q) ||
        pest.cropsAffected.some((c) => c.toLowerCase().includes(q)) ||
        pest.symptoms.some((s) => s.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (filterType === 'farm_crops') {
      return pest.affectsFarmerPlot;
    }
    if (filterType === 'high_risk') {
      return pest.dynamicRisk === 'High' || pest.dynamicRisk === 'Severe';
    }
    if (filterType === 'fungal') {
      return pest.type === 'Fungal';
    }
    if (filterType === 'insect') {
      return pest.type === 'Insect' || pest.type === 'Mite';
    }
    return true;
  });

  // Sort: Severe > High > Moderate > Low
  const riskWeights = { Severe: 4, High: 3, Moderate: 2, Low: 1 };
  filteredPests.sort((a, b) => riskWeights[b.dynamicRisk] - riskWeights[a.dynamicRisk] || b.riskScore - a.riskScore);

  const riskBadgeStyles = {
    Severe: 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-rose-950/50',
    High: 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-amber-950/50',
    Moderate: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
    Low: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
  };

  return (
    <div className="space-y-6">
      {/* Hero Overview */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-stone-100">
              Hyperlocal Pest &amp; Disease Early Warning System
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Predictive biological matrix analyzing current microclimate (temp, dew hours, humidity) against pest outbreak thresholds
          </p>
        </div>

        {onNavigateToScanner && (
          <button
            onClick={onNavigateToScanner}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 shadow-sm shrink-0 self-start md:self-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>Open AI Leaf Scanner</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-md">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pest, disease, symptom, or crop..."
            className="w-full pl-9 pr-4 py-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-stone-500"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <button
            onClick={() => setFilterType('farm_crops')}
            className={`px-3 py-1.5 rounded-xl font-medium border transition-all shrink-0 ${
              filterType === 'farm_crops'
                ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200 shadow-sm'
                : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            My Farm Crops ({activeCropIds.length})
          </button>
          <button
            onClick={() => setFilterType('high_risk')}
            className={`px-3 py-1.5 rounded-xl font-medium border transition-all shrink-0 ${
              filterType === 'high_risk'
                ? 'bg-rose-600/30 border-rose-500 text-rose-200 shadow-sm'
                : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            High &amp; Severe Risk
          </button>
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl font-medium border transition-all shrink-0 ${
              filterType === 'all'
                ? 'bg-stone-800 border-stone-600 text-stone-100 shadow-sm'
                : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            All Pests ({PEST_DATABASE.length})
          </button>
          <button
            onClick={() => setFilterType('fungal')}
            className={`px-3 py-1.5 rounded-xl font-medium border transition-all shrink-0 ${
              filterType === 'fungal'
                ? 'bg-cyan-600/30 border-cyan-500 text-cyan-200 shadow-sm'
                : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            Fungal
          </button>
          <button
            onClick={() => setFilterType('insect')}
            className={`px-3 py-1.5 rounded-xl font-medium border transition-all shrink-0 ${
              filterType === 'insect'
                ? 'bg-amber-600/30 border-amber-500 text-amber-200 shadow-sm'
                : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            Insects &amp; Mites
          </button>
        </div>
      </div>

      {/* Pest Cards List */}
      <div className="space-y-4">
        {filteredPests.length === 0 ? (
          <div className="p-8 text-center bg-stone-900 border border-stone-800 rounded-2xl text-stone-400 space-y-2">
            <Bug className="w-8 h-8 text-stone-600 mx-auto" />
            <p className="text-sm font-medium">No pests or diseases matched your filter criteria.</p>
            <p className="text-xs text-stone-500">Try switching to &ldquo;All Pests&rdquo; or clearing your search query.</p>
          </div>
        ) : (
          filteredPests.map((pest) => {
            const isExpanded = expandedPestId === pest.id;
            const badgeClass = riskBadgeStyles[pest.dynamicRisk];

            return (
              <div
                key={pest.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  pest.dynamicRisk === 'Severe'
                    ? 'bg-gradient-to-r from-stone-900 via-stone-900 to-rose-950/20 border-rose-800/40'
                    : pest.dynamicRisk === 'High'
                    ? 'bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/20 border-amber-800/40'
                    : 'bg-stone-900 border-stone-800'
                }`}
              >
                {/* Header row */}
                <div
                  onClick={() => setExpandedPestId(isExpanded ? null : pest.id)}
                  className="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none hover:bg-stone-850/50"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-200">
                      <Bug className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-stone-100">{pest.name}</h3>
                        <span className="text-xs italic text-stone-400 font-serif">
                          ({pest.scientificName})
                        </span>
                        {pest.affectsFarmerPlot && (
                          <span className="px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md font-medium">
                            Affects Your Plots
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-stone-400">
                        <span>Type: <strong className="text-stone-300">{pest.type}</strong></span>
                        <span>•</span>
                        <span>Crops: {pest.cropsAffected.map(c => c.toUpperCase()).join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badgeClass}`}>
                      {pest.dynamicRisk} Risk ({pest.riskScore}%)
                    </span>
                    <button className="text-stone-400 hover:text-stone-200">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Microclimate Reason Pill */}
                <div className="px-5 pb-3">
                  <div className="p-2.5 rounded-xl bg-stone-950/80 border border-stone-800/80 text-xs text-stone-300 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-300">Why now? </strong>
                      <span>{pest.microclimateReason}</span>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-stone-800 space-y-4 text-xs">
                    {/* Symptoms */}
                    <div>
                      <h4 className="font-semibold text-stone-200 uppercase tracking-wider text-[11px] mb-1.5">
                        Symptoms &amp; Field Identification:
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-stone-300">
                        {pest.symptoms.map((s, idx) => (
                          <li key={idx} className="flex items-start gap-2 p-2 bg-stone-950/50 rounded-lg border border-stone-800/60">
                            <span className="text-emerald-400 shrink-0">•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Scouting Advice */}
                    <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800">
                      <strong className="text-emerald-400 block mb-0.5">Field Scouting Protocol:</strong>
                      <p className="text-stone-300">{pest.scoutingAdvice}</p>
                    </div>

                    {/* Integrated Pest Management (Organic vs Chemical) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Organic Low-Cost Remedies */}
                      <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-2">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                          <CheckCircle className="w-4 h-4" />
                          <span>Smallholder Low-Cost Organic Remedies (IPM)</span>
                        </div>
                        <ul className="space-y-1.5 text-stone-200">
                          {pest.organicControl.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-emerald-400 font-bold">✓</span>
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Chemical Emergency Options */}
                      <div className="p-4 bg-stone-950 border border-stone-800 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">
                            Chemical IPM Emergency Option
                          </span>
                          <span className="text-[10px] font-mono text-stone-400">
                            Pre-Harvest Interval (PHI): <strong className="text-amber-300">{pest.phiDays} days</strong>
                          </span>
                        </div>
                        <ul className="space-y-1.5 text-stone-300">
                          {pest.chemicalControl.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-amber-400">⚡</span>
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                        <p className="text-[10px] text-stone-500 mt-2 italic">
                          Always wear mask &amp; gloves; avoid spraying during active honeybee foraging hours (10 AM - 3 PM).
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
