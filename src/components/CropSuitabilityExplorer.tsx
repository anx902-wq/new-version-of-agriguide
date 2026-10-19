import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Droplets,
  Thermometer,
  Layers,
  Calendar,
  Globe,
  ArrowRight,
  Filter,
  Search,
  Plus,
  Info,
  ChevronRight,
  X,
  Sparkles,
} from 'lucide-react';
import { CropProfile, CropSuitabilityEvaluation, ProcessedWeatherData, FarmerPlot } from '../types';
import { CROP_PROFILES } from '../data/cropDatabase';
import { evaluateCropSuitability } from '../services/cropSuitabilityService';
import { useLanguage } from '../i18n/LanguageContext';

interface CropSuitabilityExplorerProps {
  weather: ProcessedWeatherData;
  plots: FarmerPlot[];
  activePlotId: string;
  onPlantCropInPlot: (crop: CropProfile) => void;
}

export const CropSuitabilityExplorer: React.FC<CropSuitabilityExplorerProps> = ({
  weather,
  plots,
  activePlotId,
  onPlantCropInPlot,
}) => {
  const { t } = useLanguage();
  const activePlot = plots.find((p) => p.id === activePlotId) || plots[0];

  // User-selectable simulation parameters
  const [evalSoilType, setEvalSoilType] = useState<FarmerPlot['soilType']>(activePlot?.soilType || 'Clay Loam');
  const [evalIrrigation, setEvalIrrigation] = useState<FarmerPlot['irrigationType']>(activePlot?.irrigationType || 'Rainfed');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [durationFilter, setDurationFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCropModal, setSelectedCropModal] = useState<CropSuitabilityEvaluation | null>(null);

  // Compute suitability evaluations for all crops
  const evaluatedCrops: CropSuitabilityEvaluation[] = CROP_PROFILES.map((crop) =>
    evaluateCropSuitability(crop, weather, evalSoilType, evalIrrigation)
  );

  // Sort descending by overall score
  evaluatedCrops.sort((a, b) => b.overallScore - a.overallScore);

  // Filter crops
  const filteredCrops = evaluatedCrops.filter((item) => {
    const { crop } = item;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        crop.name.toLowerCase().includes(q) ||
        crop.scientificName.toLowerCase().includes(q) ||
        crop.category.toLowerCase().includes(q) ||
        crop.primarySuitabilityAreas.some((a) => a.toLowerCase().includes(q)) ||
        crop.otherSuitabilityAreas.some((a) => a.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Category filter
    if (categoryFilter !== 'all' && crop.category !== categoryFilter) {
      return false;
    }

    // Duration filter
    if (durationFilter !== 'all' && crop.growingPeriodDurationCategory !== durationFilter) {
      return false;
    }

    return true;
  });

  const getScoreBadgeClass = (score: number) => {
    if (score >= 84) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50';
    if (score >= 68) return 'bg-teal-500/20 text-teal-300 border-teal-500/50';
    if (score >= 50) return 'bg-amber-500/20 text-amber-300 border-amber-500/50';
    return 'bg-rose-500/20 text-rose-300 border-rose-500/50';
  };

  const getDroughtBadgeClass = (level: CropProfile['droughtTolerance']) => {
    switch (level) {
      case 'Extreme':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'High':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Moderate':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Low':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Overview */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-stone-100">
                {t('suitabilityTitle', 'AgriGuide Crop Suitability & Growing Period Advisor')}
              </h2>
            </div>
            <p className="text-xs text-stone-400 mt-1 max-w-3xl">
              {t('suitabilitySubtitle', 'Evaluates biological thermal thresholds, root-zone water availability, soil compatibility, and regional Indian suitability areas for smallholder crops.')}
            </p>
          </div>

          {/* Quick Simulation Toggles */}
          <div className="flex flex-wrap items-center gap-2 p-2 bg-stone-950 border border-stone-800 rounded-xl text-xs">
            <div>
              <span className="text-[10px] text-stone-500 uppercase block font-bold">Soil Type</span>
              <select
                value={evalSoilType}
                onChange={(e) => setEvalSoilType(e.target.value as any)}
                className="bg-transparent text-emerald-400 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="Clay Loam" className="bg-stone-900 text-stone-100">Clay Loam</option>
                <option value="Sandy Loam" className="bg-stone-900 text-stone-100">Sandy Loam</option>
                <option value="Black Cotton" className="bg-stone-900 text-stone-100">Black Cotton</option>
                <option value="Red Laterite" className="bg-stone-900 text-stone-100">Red Laterite</option>
                <option value="Silty Clay" className="bg-stone-900 text-stone-100">Silty Clay</option>
              </select>
            </div>

            <div className="w-[1px] h-6 bg-stone-800" />

            <div>
              <span className="text-[10px] text-stone-500 uppercase block font-bold">Regime</span>
              <select
                value={evalIrrigation}
                onChange={(e) => setEvalIrrigation(e.target.value as any)}
                className="bg-transparent text-emerald-400 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="Rainfed" className="bg-stone-900 text-stone-100">Rainfed (Dryland)</option>
                <option value="Drip" className="bg-stone-900 text-stone-100">Drip Irrigated</option>
                <option value="Furrow / Flood" className="bg-stone-900 text-stone-100">Furrow / Flood</option>
                <option value="Sprinkler" className="bg-stone-900 text-stone-100">Sprinkler</option>
              </select>
            </div>
          </div>
        </div>

        {/* Highlight Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-stone-800/80 text-xs">
          <div className="p-2.5 bg-stone-950/60 rounded-xl border border-stone-800">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Location</span>
            <span className="font-bold text-stone-200 truncate block mt-0.5">{weather.location.name}</span>
            <span className="text-[10px] text-stone-500">{weather.location.country}</span>
          </div>

          <div className="p-2.5 bg-stone-950/60 rounded-xl border border-stone-800">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">7-Day Mean Temp</span>
            <span className="font-bold text-amber-400 text-base font-mono block mt-0.5">
              {((weather.current.temperature + (weather.daily.tempMax[0] || 25)) / 2).toFixed(1)}°C
            </span>
            <span className="text-[10px] text-stone-500">Thermal basis</span>
          </div>

          <div className="p-2.5 bg-stone-950/60 rounded-xl border border-stone-800">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Root-Zone Water</span>
            <span className="font-bold text-teal-400 text-base font-mono block mt-0.5">
              {(weather.soil.moistureRoot * 100).toFixed(0)}% vol
            </span>
            <span className="text-[10px] text-stone-500">{weather.derived.soilWaterStatus}</span>
          </div>

          <div className="p-2.5 bg-stone-950/60 rounded-xl border border-stone-800">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Top Match</span>
            <span className="font-bold text-emerald-400 text-base block mt-0.5">
              {evaluatedCrops[0]?.crop.name.split(' ')[0]} ({evaluatedCrops[0]?.overallScore}%)
            </span>
            <span className="text-[10px] text-stone-500">{evaluatedCrops[0]?.suitabilityClass}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-md">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search crop, scientific name, or region..."
            className="w-full pl-9 pr-4 py-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-stone-500"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Category */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {['all', 'Cereal', 'Legume', 'Vegetable', 'Cash Crop', 'Tuber', 'Oilseed'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1.5 rounded-xl font-medium border transition-all shrink-0 ${
                  categoryFilter === cat
                    ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200 shadow-sm'
                    : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                {cat === 'all' ? 'All Types' : cat}
              </button>
            ))}
          </div>

          {/* Duration */}
          <select
            value={durationFilter}
            onChange={(e) => setDurationFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-200 text-xs focus:outline-none"
          >
            <option value="all">All Growing Durations</option>
            <option value="Short (<90d)">Short (&lt;90 days)</option>
            <option value="Medium (90-120d)">Medium (90-120 days)</option>
            <option value="Long (>120d)">Long (&gt;120 days)</option>
          </select>
        </div>
      </div>

      {/* Crop Suitability Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCrops.map((evalItem) => {
          const { crop, overallScore, suitabilityClass, keyLimitingFactor, thermalFit, moistureFit } = evalItem;
          const scoreClass = getScoreBadgeClass(overallScore);
          const droughtClass = getDroughtBadgeClass(crop.droughtTolerance);

          return (
            <div
              key={crop.id}
              className="bg-stone-900 border border-stone-800 hover:border-emerald-500/50 rounded-2xl p-5 shadow-md flex flex-col justify-between transition-all group hover:shadow-xl"
            >
              <div>
                {/* Header: Icon, Name & Score */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 bg-stone-950 border border-stone-800 rounded-xl group-hover:scale-105 transition-transform">
                      {crop.icon}
                    </span>
                    <div>
                      <h3 className="font-bold text-stone-100 text-base leading-snug">
                        {crop.name}
                      </h3>
                      <p className="text-[11px] italic text-stone-400 font-serif">
                        {crop.scientificName}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`px-2.5 py-1 rounded-xl text-xs font-black border font-mono ${scoreClass}`}>
                      {overallScore}%
                    </span>
                    <span className="text-[10px] text-stone-400 block mt-1 font-medium">
                      {suitabilityClass}
                    </span>
                  </div>
                </div>

                {/* Key Agronomic Traits */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                  <div className="p-2 bg-stone-950/70 rounded-xl border border-stone-800/80">
                    <span className="text-[10px] text-stone-500 uppercase font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>Growing Period</span>
                    </span>
                    <span className="font-bold text-stone-200 mt-0.5 block">
                      {crop.growingPeriodRange[0]}–{crop.growingPeriodRange[1]} Days
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {crop.growingPeriodDurationCategory}
                    </span>
                  </div>

                  <div className="p-2 bg-stone-950/70 rounded-xl border border-stone-800/80">
                    <span className="text-[10px] text-stone-500 uppercase font-bold flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-blue-400" />
                      <span>Water Demand</span>
                    </span>
                    <span className="font-bold text-stone-200 mt-0.5 block">
                      {crop.waterRequirementMm[0]}–{crop.waterRequirementMm[1]} mm
                    </span>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold inline-block mt-0.5 border ${droughtClass}`}>
                      {crop.droughtTolerance} Drought Tol.
                    </span>
                  </div>
                </div>

                {/* Microclimate Fit Breakdown Pills */}
                <div className="mt-3 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-stone-300">
                    <span className="flex items-center gap-1 text-stone-400">
                      <Thermometer className="w-3 h-3 text-amber-400" />
                      <span>Thermal Fit:</span>
                    </span>
                    <span className="font-medium text-stone-200">{thermalFit.status} ({crop.optimalTempRange[0]}°–{crop.optimalTempRange[1]}°C)</span>
                  </div>

                  <div className="flex items-center justify-between text-stone-300">
                    <span className="flex items-center gap-1 text-stone-400">
                      <Layers className="w-3 h-3 text-emerald-400" />
                      <span>Soil Compatibility:</span>
                    </span>
                    <span className="font-medium text-stone-200">
                      {crop.suitableSoils.includes(evalSoilType) ? 'Ideal Match' : 'Manageable'}
                    </span>
                  </div>
                </div>

                {/* Primary Suitability Areas Preview */}
                <div className="mt-3 p-2.5 bg-stone-950/80 rounded-xl border border-stone-800/80 text-[11px]">
                  <div className="flex items-center gap-1 text-stone-400 mb-1">
                    <Globe className="w-3 h-3 text-emerald-400" />
                    <span className="font-semibold text-stone-300 uppercase text-[10px]">{t('primaryAreasIndia', 'Primary Suitable States in India:')}</span>
                  </div>
                  <p className="text-stone-400 line-clamp-2">
                    {crop.primarySuitabilityAreas.slice(0, 2).join(' • ')}
                  </p>
                </div>

                {/* Limiting factor notice if any */}
                {keyLimitingFactor && (
                  <div className="mt-2 text-[11px] text-amber-400/90 flex items-start gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>Watch: {keyLimitingFactor}</span>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedCropModal(evalItem)}
                  className="px-3 py-1.5 text-xs text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-750 rounded-xl font-medium transition-colors flex items-center gap-1"
                >
                  <span>{t('inspectSuitability', 'Inspect Suitability')}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onPlantCropInPlot(crop)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 shadow-sm"
                  title="Add to your farm plots"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t('plantInPlot', 'Plant in Plot')}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comprehensive Suitability & Growing Period Inspection Modal */}
      {selectedCropModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-700/80 rounded-2xl shadow-2xl overflow-hidden text-stone-100 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/80">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 bg-stone-900 border border-stone-800 rounded-xl">
                  {selectedCropModal.crop.icon}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-stone-100">
                      {selectedCropModal.crop.name}
                    </h3>
                    <span className={`px-2 py-0.5 text-xs font-mono font-bold rounded-lg border ${getScoreBadgeClass(selectedCropModal.overallScore)}`}>
                      {selectedCropModal.overallScore}% Suitability
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 italic font-serif">
                    {selectedCropModal.crop.scientificName} • {selectedCropModal.crop.category}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCropModal(null)}
                className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scroll Content */}
            <div className="p-6 space-y-5 overflow-y-auto text-xs">
              {/* Advisory note */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-stone-950 to-stone-950 border border-emerald-500/40 space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
                  AgriGuide Agronomic Evaluation for {weather.location.name}
                </span>
                <p className="text-sm font-semibold text-stone-100 leading-relaxed">
                  {selectedCropModal.advisoryNote}
                </p>
              </div>

              {/* Four Factor Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Thermal */}
                <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400 flex items-center gap-1.5">
                      <Thermometer className="w-4 h-4" />
                      <span>Thermal Fit</span>
                    </span>
                    <span className="font-mono font-bold text-stone-300">
                      {selectedCropModal.thermalFit.score}/30 pts
                    </span>
                  </div>
                  <p className="text-stone-300 text-[11px] leading-relaxed">
                    {selectedCropModal.thermalFit.detail}
                  </p>
                  <span className="text-[10px] text-stone-500 block">
                    Base Temp: {selectedCropModal.crop.baseTemp}°C • Opt: {selectedCropModal.crop.optimalTempRange[0]}°–{selectedCropModal.crop.optimalTempRange[1]}°C
                  </span>
                </div>

                {/* Moisture */}
                <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-400 flex items-center gap-1.5">
                      <Droplets className="w-4 h-4" />
                      <span>Water &amp; Moisture Fit</span>
                    </span>
                    <span className="font-mono font-bold text-stone-300">
                      {selectedCropModal.moistureFit.score}/30 pts
                    </span>
                  </div>
                  <p className="text-stone-300 text-[11px] leading-relaxed">
                    {selectedCropModal.moistureFit.detail}
                  </p>
                  <span className="text-[10px] text-stone-500 block">
                    Total seasonal demand: {selectedCropModal.crop.waterRequirementMm[0]}–{selectedCropModal.crop.waterRequirementMm[1]} mm
                  </span>
                </div>

                {/* Soil */}
                <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <Layers className="w-4 h-4" />
                      <span>Soil Compatibility</span>
                    </span>
                    <span className="font-mono font-bold text-stone-300">
                      {selectedCropModal.soilFit.score}/25 pts
                    </span>
                  </div>
                  <p className="text-stone-300 text-[11px] leading-relaxed">
                    {selectedCropModal.soilFit.detail}
                  </p>
                  <span className="text-[10px] text-stone-500 block">
                    Ideal soils: {selectedCropModal.crop.suitableSoils.join(', ')} • pH: {selectedCropModal.crop.soilPhRange[0]}–{selectedCropModal.crop.soilPhRange[1]}
                  </span>
                </div>

                {/* Growing Period & Seasons */}
                <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-teal-400 flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>Growing Duration</span>
                    </span>
                    <span className="font-mono font-bold text-stone-300">
                      {selectedCropModal.seasonFit.score}/15 pts
                    </span>
                  </div>
                  <p className="text-stone-300 text-[11px] leading-relaxed">
                    {selectedCropModal.seasonFit.detail}
                  </p>
                  <span className="text-[10px] text-stone-500 block">
                    Days to harvest: {selectedCropModal.crop.growingPeriodRange[0]}–{selectedCropModal.crop.growingPeriodRange[1]} days • Expected yield: {selectedCropModal.crop.yieldExpectation}
                  </span>
                </div>
              </div>

              {/* Regional Planting Season Windows */}
              <div className="space-y-2">
                <span className="text-stone-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>Optimal Planting Windows &amp; Regional Calendar:</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedCropModal.crop.plantingSeasonWindows.map((window, idx) => (
                    <div key={idx} className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-400">{window.seasonName}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          {window.months}
                        </span>
                      </div>
                      <p className="text-stone-400 text-[10px]">{window.agroEcologicalZone}</p>
                      <p className="text-stone-300 text-[11px] leading-relaxed">{window.notes}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Primary Suitability Areas and Other Suitable Zones in India */}
              <div className="space-y-2">
                <span className="text-stone-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>Agro-Ecological Suitability Areas &amp; Growing Belts in India:</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-stone-950 rounded-xl border border-stone-800">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">
                      {t('primaryAreasIndia', 'Primary Suitable States in India:')}
                    </span>
                    <ul className="space-y-1 text-stone-300">
                      {selectedCropModal.crop.primarySuitabilityAreas.map((area, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-400">✓</span>
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-stone-950 rounded-xl border border-stone-800">
                    <span className="text-[10px] uppercase font-bold text-teal-400 block mb-1">
                      {t('otherAreasIndia', 'Other Growing Belts in India:')}
                    </span>
                    <ul className="space-y-1 text-stone-300">
                      {selectedCropModal.crop.otherSuitabilityAreas.map((area, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-teal-400">•</span>
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="px-6 py-4 border-t border-stone-800 bg-stone-950/80 flex items-center justify-between">
              <button
                onClick={() => setSelectedCropModal(null)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl font-medium"
              >
                Close
              </button>

              <button
                onClick={() => {
                  onPlantCropInPlot(selectedCropModal.crop);
                  setSelectedCropModal(null);
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/60"
              >
                <Plus className="w-4 h-4" />
                <span>Add {selectedCropModal.crop.name} to My Farm Plots</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
