import React, { useState } from 'react';
import {
  Calendar,
  Sprout,
  Plus,
  Volume2,
  VolumeX,
  Droplets,
  Zap,
  ShieldAlert,
  CheckCircle,
  Clock,
  Sparkles,
  Loader2,
  ChevronRight,
  Info,
} from 'lucide-react';
import { FarmerPlot, ProcessedWeatherData, GeminiAdvisoryResult } from '../types';
import { CROP_PROFILES } from '../data/cropDatabase';

interface CropStageTrackerProps {
  plots: FarmerPlot[];
  activePlotId: string;
  onSelectPlot: (plotId: string) => void;
  onAddPlot: (plot: FarmerPlot) => void;
  weather: ProcessedWeatherData;
}

export const CropStageTracker: React.FC<CropStageTrackerProps> = ({
  plots,
  activePlotId,
  onSelectPlot,
  onAddPlot,
  weather,
}) => {
  const [isAddingPlot, setIsAddingPlot] = useState(false);
  const [selectedStageIdx, setSelectedStageIdx] = useState<number | null>(null);

  // New plot form state
  const [newPlotName, setNewPlotName] = useState('Main Field');
  const [newCropId, setNewCropId] = useState('maize');
  const [newSowingDate, setNewSowingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 35);
    return d.toISOString().split('T')[0];
  });
  const [newArea, setNewArea] = useState(1.5);
  const [newIrrigation, setNewIrrigation] = useState<FarmerPlot['irrigationType']>('Furrow / Flood');
  const [newSoil, setNewSoil] = useState<FarmerPlot['soilType']>('Clay Loam');

  // AI advisory state
  const [aiAdvisory, setAiAdvisory] = useState<GeminiAdvisoryResult | null>(null);
  const [isLoadingAdvisory, setIsLoadingAdvisory] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const activePlot = plots.find((p) => p.id === activePlotId) || plots[0];
  const cropProfile = CROP_PROFILES.find((c) => c.id === activePlot?.cropId) || CROP_PROFILES[0];

  // Calculate Days After Sowing (DAS)
  const sowingDate = new Date(activePlot?.sowingDate || Date.now());
  const today = new Date();
  const diffTime = Math.max(0, today.getTime() - sowingDate.getTime());
  const das = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Determine current stage based on DAS
  let currentStageIdx = 0;
  for (let i = 0; i < cropProfile.stages.length; i++) {
    const s = cropProfile.stages[i];
    if (das >= s.startDas && das <= s.endDas) {
      currentStageIdx = i;
      break;
    } else if (das > s.endDas) {
      currentStageIdx = i;
    }
  }

  // Active stage details (either user-selected or auto current)
  const inspectedStage = selectedStageIdx !== null
    ? cropProfile.stages[selectedStageIdx]
    : cropProfile.stages[currentStageIdx];

  // Projected harvest date
  const harvestDate = new Date(sowingDate);
  harvestDate.setDate(harvestDate.getDate() + cropProfile.totalDaysToMaturity);

  // Accumulated GDD estimation
  const meanTemp = (weather.current.temperature + (weather.daily.tempMin?.[0] ?? 18)) / 2;
  const dailyGdd = Math.max(0, meanTemp - cropProfile.baseTemp);
  const estimatedGddAccumulated = Math.round(das * dailyGdd);

  // Overall crop progress %
  const progressPercent = Math.min(100, Math.round((das / cropProfile.totalDaysToMaturity) * 100));

  const handleCreatePlot = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlot: FarmerPlot = {
      id: `plot-${Date.now()}`,
      plotName: newPlotName,
      cropId: newCropId,
      sowingDate: newSowingDate,
      areaHectares: Number(newArea),
      irrigationType: newIrrigation,
      soilType: newSoil,
    };
    onAddPlot(newPlot);
    setIsAddingPlot(false);
  };

  const handleFetchAiAdvisory = async () => {
    setIsLoadingAdvisory(true);
    try {
      const res = await fetch('/api/gemini/agri-advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName: cropProfile.name,
          stage: cropProfile.stages[currentStageIdx].name,
          das,
          gdd: estimatedGddAccumulated,
          weather: {
            temperature: weather.current.temperature,
            apparentTemperature: weather.current.apparentTemperature,
            humidity: weather.current.relativeHumidity,
            dewPoint: weather.current.dewPoint,
            windSpeed: weather.current.windSpeed,
            windGusts: weather.current.windGusts,
            rainSum: weather.daily.rainSum?.[0] ?? 0,
            rainProb: weather.daily.rainProbMax?.[0] ?? 0,
            et0: weather.daily.et0?.[0] ?? 3.5,
          },
          soil: {
            moistureSurface: weather.soil.moistureSurface,
            moistureRoot: weather.soil.moistureRoot,
            tempSurface: weather.soil.tempSurface,
          },
          location: weather.location,
        }),
      });

      if (!res.ok) throw new Error('Advisory request failed');
      const data = await res.json();
      setAiAdvisory(data);
    } catch (err) {
      console.error('Failed to get advisory:', err);
    } finally {
      setIsLoadingAdvisory(false);
    }
  };

  const handleToggleVoicePlayback = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this device/browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const scriptToSpeak =
      aiAdvisory?.audioAdvisoryScript ||
      `Crop advisory for ${cropProfile.name} at ${cropProfile.stages[currentStageIdx].name} stage. Days after sowing: ${das} days. Spraying condition today is ${weather.derived.spraySuitability}. Recommended nutrient action: ${cropProfile.stages[currentStageIdx].nutrientFocus}`;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(scriptToSpeak);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  return (
    <div className="space-y-6">
      {/* Plot Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-md">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider shrink-0 mr-1">
            Farm Plots:
          </span>
          {plots.map((plot) => {
            const isSelected = plot.id === activePlot?.id;
            const profile = CROP_PROFILES.find((c) => c.id === plot.cropId);
            return (
              <button
                key={plot.id}
                onClick={() => {
                  onSelectPlot(plot.id);
                  setSelectedStageIdx(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200 shadow-sm'
                    : 'bg-stone-950/80 hover:bg-stone-800 border-stone-800 text-stone-300'
                }`}
              >
                <span>{profile?.icon || '🌱'}</span>
                <span>{plot.plotName}</span>
                <span className="text-[10px] text-stone-400">({profile?.name.split(' ')[0]})</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setIsAddingPlot(true)}
          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Plot</span>
        </button>
      </div>

      {/* Add Plot Modal */}
      {isAddingPlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-stone-900 border border-stone-700 rounded-2xl p-6 shadow-2xl text-stone-100 space-y-4">
            <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-emerald-400" />
              <span>Register New Crop Plot</span>
            </h3>

            <form onSubmit={handleCreatePlot} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Plot / Field Name</label>
                <input
                  type="text"
                  required
                  value={newPlotName}
                  onChange={(e) => setNewPlotName(e.target.value)}
                  placeholder="e.g. North Acre, Canal Plot, Home Garden"
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Crop Type</label>
                <select
                  value={newCropId}
                  onChange={(e) => setNewCropId(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {CROP_PROFILES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Sowing / Planting Date</label>
                  <input
                    type="date"
                    required
                    value={newSowingDate}
                    onChange={(e) => setNewSowingDate(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">Field Area (Hectares / Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={newArea}
                    onChange={(e) => setNewArea(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Irrigation Method</label>
                  <select
                    value={newIrrigation}
                    onChange={(e) => setNewIrrigation(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Rainfed">Rainfed (Dryland)</option>
                    <option value="Furrow / Flood">Furrow / Flood</option>
                    <option value="Drip">Drip Irrigation</option>
                    <option value="Sprinkler">Sprinkler</option>
                    <option value="Manual Bucket">Manual Bucket / Can</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">Soil Texture</label>
                  <select
                    value={newSoil}
                    onChange={(e) => setNewSoil(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Clay Loam">Clay Loam</option>
                    <option value="Sandy Loam">Sandy Loam</option>
                    <option value="Black Cotton">Black Cotton Soil</option>
                    <option value="Red Laterite">Red Laterite</option>
                    <option value="Silty Clay">Silty Clay</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsAddingPlot(false)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium"
                >
                  Save Plot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Active Plot Phenology Hero */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="text-4xl p-3 bg-stone-950 border border-stone-800 rounded-2xl shadow-inner">
              {cropProfile.icon}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-stone-100">
                  {activePlot.plotName}: {cropProfile.name}
                </h2>
              </div>
              <p className="text-xs text-stone-400 mt-1">
                Sown on {sowingDate.toLocaleDateString([], { dateStyle: 'medium' })} • {activePlot.areaHectares} ha • {activePlot.irrigationType} • {activePlot.soilType}
              </p>
            </div>
          </div>

          {/* Quick Metrics Badges */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
            <div className="p-3 bg-stone-950/70 border border-stone-800 rounded-xl">
              <span className="text-[10px] text-stone-400 block uppercase font-bold">Days After Sowing</span>
              <span className="text-xl font-extrabold text-stone-100 font-mono">{das}</span>
              <span className="text-[10px] text-stone-500 block">of {cropProfile.totalDaysToMaturity} days</span>
            </div>

            <div className="p-3 bg-stone-950/70 border border-stone-800 rounded-xl">
              <span className="text-[10px] text-stone-400 block uppercase font-bold">GDD Accumulated</span>
              <span className="text-xl font-extrabold text-amber-400 font-mono">{estimatedGddAccumulated}</span>
              <span className="text-[10px] text-stone-500 block">Base: {cropProfile.baseTemp}°C</span>
            </div>

            <div className="p-3 bg-stone-950/70 border border-stone-800 rounded-xl">
              <span className="text-[10px] text-stone-400 block uppercase font-bold">Target Harvest</span>
              <span className="text-sm font-bold text-emerald-400 block mt-1">
                {harvestDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}
              </span>
              <span className="text-[10px] text-stone-500 block">
                in {Math.max(0, cropProfile.totalDaysToMaturity - das)} days
              </span>
            </div>
          </div>
        </div>

        {/* Growth Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-stone-300">
            <span>Overall Phenological Progression:</span>
            <span className="font-mono font-bold text-emerald-400">{progressPercent}% complete</span>
          </div>
          <div className="w-full h-3 bg-stone-950 rounded-full overflow-hidden border border-stone-800 flex">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-700 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Horizontal Phenological Stage Timeline */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
            <span>Phenological Stages (Click any stage to inspect requirements):</span>
            <span className="text-[11px] text-emerald-400/90 font-mono">
              Current: Stage {currentStageIdx + 1} of {cropProfile.stages.length}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {cropProfile.stages.map((stage, idx) => {
              const isCurrent = idx === currentStageIdx;
              const isSelected = selectedStageIdx === idx;
              const isPassed = das > stage.endDas;

              return (
                <button
                  key={stage.id}
                  onClick={() => setSelectedStageIdx(idx)}
                  className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-emerald-950/60 border-emerald-500 shadow-lg ring-1 ring-emerald-500/40 text-stone-100'
                      : isSelected
                      ? 'bg-stone-800 border-stone-600 text-stone-200'
                      : isPassed
                      ? 'bg-stone-950/40 border-stone-800 text-stone-400'
                      : 'bg-stone-950/80 border-stone-800/80 text-stone-500'
                  }`}
                >
                  {isCurrent && (
                    <span className="absolute -top-2 right-2 px-1.5 py-0.2 bg-emerald-500 text-stone-950 text-[9px] font-black uppercase rounded-full tracking-wider animate-pulse">
                      Active
                    </span>
                  )}
                  <div>
                    <span className="text-[10px] font-mono text-stone-400 block">
                      Stage {idx + 1} • {stage.startDas}-{stage.endDas} DAS
                    </span>
                    <h4 className="text-xs font-bold mt-1 text-stone-200 line-clamp-2">
                      {stage.name}
                    </h4>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[10px]">
                    <span className="text-stone-400">GDD: {stage.gddRequired}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      stage.waterNeeds === 'Critical' ? 'bg-rose-500/20 text-rose-300' :
                      stage.waterNeeds === 'High' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-stone-800 text-stone-400'
                    }`}>
                      {stage.waterNeeds} Water
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Stage Directive Card */}
        <div className="p-5 rounded-xl bg-stone-950 border border-stone-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 rounded-md">
                  Stage Insight
                </span>
                <h3 className="text-base font-bold text-stone-100">{inspectedStage.name}</h3>
              </div>
              <p className="text-xs text-stone-400 mt-1">{inspectedStage.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400">Crop Coeff (Kc):</span>
              <span className="px-2 py-0.5 bg-stone-900 border border-stone-700 text-emerald-400 font-mono text-xs font-bold rounded">
                {inspectedStage.kc}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Nutrient timing */}
            <div className="p-3 bg-stone-900/60 border border-stone-800 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <Zap className="w-4 h-4" />
                <span>Nutrient / Fertilizer Timing</span>
              </div>
              <p className="text-stone-300 leading-relaxed">{inspectedStage.nutrientFocus}</p>
            </div>

            {/* Water sensitivity */}
            <div className="p-3 bg-stone-900/60 border border-stone-800 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
                <Droplets className="w-4 h-4" />
                <span>Water Sensitivity &amp; Irrigation</span>
              </div>
              <p className="text-stone-300 leading-relaxed">
                Sensitivity is <strong className="text-stone-100">{inspectedStage.waterNeeds}</strong>.
                {inspectedStage.waterNeeds === 'Critical'
                  ? ' Moisture stress during this phase causes irreversible yield loss.'
                  : ' Maintain regular soil moisture without waterlogging.'}
              </p>
            </div>

            {/* Daily scouting checklist */}
            <div className="p-3 bg-stone-900/60 border border-stone-800 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle className="w-4 h-4" />
                <span>Daily Smallholder Scouting Checklist</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-stone-300">
                {inspectedStage.scoutingChecklist.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* AI Daily Crop Bulletin Section */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-stone-950 via-stone-950 to-emerald-950/30 border border-stone-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-stone-100">
                  Daily Hyperlocal Agronomy Bulletin (AI-Powered)
                </h3>
              </div>
              <p className="text-xs text-stone-400">
                Synchronized with live microclimate, soil water levels, and {cropProfile.name} phenology
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleVoicePlayback}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                  isPlayingAudio
                    ? 'bg-amber-600 text-white border-amber-500 shadow-md animate-pulse'
                    : 'bg-stone-800 hover:bg-stone-750 text-stone-200 border-stone-700'
                }`}
                title="Listen to advisory"
              >
                {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                <span>{isPlayingAudio ? 'Stop Voice' : 'Listen to Bulletin'}</span>
              </button>

              <button
                onClick={handleFetchAiAdvisory}
                disabled={isLoadingAdvisory}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                {isLoadingAdvisory ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>{isLoadingAdvisory ? 'Analyzing Microclimate...' : 'Refresh AI Bulletin'}</span>
              </button>
            </div>
          </div>

          {/* Bulletin Content */}
          {aiAdvisory ? (
            <div className="space-y-4 pt-2 border-t border-stone-800 text-xs">
              <div className="p-3 bg-stone-900 border border-stone-700/80 rounded-xl">
                <h4 className="font-bold text-stone-100 text-sm">{aiAdvisory.summaryTitle}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                  <div className="p-2 bg-stone-950 rounded-lg border border-stone-800">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">Spraying Suitability</span>
                    <span className="font-bold text-emerald-400">{aiAdvisory.todayWorkability.spraying}</span>
                    <p className="text-[11px] text-stone-400 mt-0.5">{aiAdvisory.todayWorkability.sprayingReason}</p>
                    <span className="text-[10px] font-mono text-emerald-300 block mt-1">
                      Window: {aiAdvisory.todayWorkability.optimalSprayWindow}
                    </span>
                  </div>

                  <div className="p-2 bg-stone-950 rounded-lg border border-stone-800">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">Irrigation Need</span>
                    <span className="font-bold text-blue-400">{aiAdvisory.todayWorkability.irrigation}</span>
                    <p className="text-[11px] text-stone-400 mt-0.5">{aiAdvisory.todayWorkability.irrigationAdvice}</p>
                  </div>

                  <div className="p-2 bg-stone-950 rounded-lg border border-stone-800">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">Field Workability</span>
                    <span className="font-bold text-amber-400">{aiAdvisory.todayWorkability.fieldWork}</span>
                    <p className="text-[11px] text-stone-400 mt-0.5">{aiAdvisory.todayWorkability.fieldWorkReason}</p>
                  </div>
                </div>
              </div>

              {/* Stage Nutrient Insight */}
              <div className="p-3 bg-stone-900/80 border border-stone-800 rounded-xl space-y-1">
                <span className="text-amber-400 font-bold block">Stage Nutrient Directive:</span>
                <p className="text-stone-300 leading-relaxed">{aiAdvisory.stageNutrientInsight}</p>
              </div>

              {/* Key Advice Bullets */}
              <div className="space-y-1">
                <span className="text-stone-400 font-semibold uppercase text-[10px] tracking-wider">
                  Top Field Actions for Today:
                </span>
                <ul className="space-y-1.5">
                  {aiAdvisory.keyAdviceBullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2 p-2 bg-stone-900/60 rounded-lg border border-stone-800/80">
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-stone-200">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-stone-950/70 border border-stone-800/80 rounded-xl flex items-center justify-between text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Click &ldquo;Refresh AI Bulletin&rdquo; to compute customized stage-by-stage agronomic actions based on today&rsquo;s live {weather.location.name} microclimate.
                </span>
              </div>
              <button
                onClick={handleFetchAiAdvisory}
                className="px-3 py-1 bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 rounded-lg font-medium transition-all shrink-0"
              >
                Generate Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
