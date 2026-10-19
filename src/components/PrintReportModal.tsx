import React from 'react';
import {
  Printer,
  X,
  Sprout,
  ShieldAlert,
  Droplets,
  Thermometer,
  Wind,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  MapPin,
  Calendar,
  FileText,
  Compass,
} from 'lucide-react';
import { ProcessedWeatherData, FarmerPlot } from '../types';
import { CROP_PROFILES, PEST_DATABASE } from '../data/cropDatabase';
import { evaluateCropSuitability } from '../services/cropSuitabilityService';
import { useLanguage } from '../i18n/LanguageContext';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  weather: ProcessedWeatherData;
  plot: FarmerPlot;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  isOpen,
  onClose,
  weather,
  plot,
}) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  const crop = CROP_PROFILES.find((c) => c.id === plot.cropId) || CROP_PROFILES[0];
  const suitability = evaluateCropSuitability(crop, weather, plot.soilType, plot.irrigationType);

  // Calculate Days After Sowing (DAS)
  const sowingDate = new Date(plot.sowingDate || Date.now());
  const today = new Date();
  const diffTime = Math.max(0, today.getTime() - sowingDate.getTime());
  const das = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Determine active stage
  let currentStageIdx = 0;
  for (let i = 0; i < crop.stages.length; i++) {
    const s = crop.stages[i];
    if (das >= s.startDas && das <= s.endDas) {
      currentStageIdx = i;
      break;
    } else if (das > s.endDas) {
      currentStageIdx = i;
    }
  }
  const currentStage = crop.stages[currentStageIdx] || crop.stages[0];

  // Accumulated GDD estimation
  const meanTemp = (weather.current.temperature + (weather.daily.tempMin?.[0] ?? 18)) / 2;
  const dailyGdd = Math.max(0, meanTemp - crop.baseTemp);
  const estimatedGdd = Math.round(das * dailyGdd);

  // Harvest date projection
  const harvestDate = new Date(sowingDate);
  harvestDate.setDate(harvestDate.getDate() + crop.totalDaysToMaturity);

  // Active pest risks based on microclimate and crop
  const relevantPests = PEST_DATABASE.filter((p) => p.cropsAffected.includes(crop.id));

  const handlePrint = () => {
    window.print();
  };

  const reportId = `AGRI-IND-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(
    today.getDate()
  ).padStart(2, '0')}-${plot.id.replace('plot-', '')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-700 rounded-2xl shadow-2xl overflow-hidden my-auto print:border-none print:shadow-none print:bg-white print:text-black print:max-w-none print:w-full">
        {/* Action Bar (Hidden during printing) */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-950 border-b border-stone-800 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-stone-100 text-sm sm:text-base">
              {t('fieldReportTitle', 'Field Agronomy & Microclimate Intelligence Report')}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-950/60 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>{t('printBtn', 'Print / Save as PDF')}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors"
              title={t('closeBtn', 'Close')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div id="printable-report" className="p-6 sm:p-8 space-y-6 text-stone-100 print:text-black print:p-4 print:space-y-4">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800 print:border-neutral-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-2xl print:bg-emerald-800">
                🌱
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white print:text-black">
                    Agri<span className="text-emerald-400 print:text-emerald-700">Guide</span>
                  </h1>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 print:bg-neutral-100 print:text-neutral-800 print:border-neutral-400">
                    {t('officialReportBadge', 'Indian Smallholder Extension Advisory')}
                  </span>
                </div>
                <p className="text-xs text-stone-400 print:text-neutral-600">
                  {t('fieldReportTitle', 'Field Agronomy & Hyperlocal Microclimate Intelligence Report')}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-stone-400 print:text-neutral-600 font-mono space-y-0.5">
              <div>
                <strong className="text-stone-300 print:text-black">Report ID:</strong> {reportId}
              </div>
              <div>
                <strong className="text-stone-300 print:text-black">Issued:</strong> {today.toLocaleDateString()} {today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div>
                <strong className="text-stone-300 print:text-black">Location:</strong> {weather.location.name}, {weather.location.region || weather.location.country} ({weather.location.lat.toFixed(2)}°N, {weather.location.lon.toFixed(2)}°E)
              </div>
            </div>
          </div>

          {/* Farm & Plot Overview Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-stone-950/70 border border-stone-800 rounded-xl print:bg-neutral-50 print:border-neutral-300 print:text-black">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-500 print:text-neutral-600 block">
                Field Plot
              </span>
              <span className="text-sm font-bold text-white print:text-black">
                {plot.plotName}
              </span>
              <span className="text-[11px] text-stone-400 print:text-neutral-600 block">
                {plot.areaHectares} ha ({(plot.areaHectares * 2.471).toFixed(1)} Acres)
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-stone-500 print:text-neutral-600 block">
                Active Crop
              </span>
              <span className="text-sm font-bold text-emerald-400 print:text-emerald-800 flex items-center gap-1">
                <span>{crop.icon}</span>
                <span>{crop.name}</span>
              </span>
              <span className="text-[11px] italic text-stone-400 print:text-neutral-600 font-serif">
                {crop.scientificName}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-stone-500 print:text-neutral-600 block">
                Sowing &amp; Phenology
              </span>
              <span className="text-sm font-bold text-amber-400 print:text-amber-800">
                {das} DAS (Days)
              </span>
              <span className="text-[11px] text-stone-400 print:text-neutral-600 block">
                Sown: {plot.sowingDate}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-stone-500 print:text-neutral-600 block">
                Soil &amp; Irrigation
              </span>
              <span className="text-sm font-bold text-white print:text-black">
                {plot.soilType}
              </span>
              <span className="text-[11px] text-stone-400 print:text-neutral-600 block">
                {plot.irrigationType}
              </span>
            </div>
          </div>

          {/* Section 1: Live Microclimate & Soil Hydrology */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 print:text-emerald-800 flex items-center gap-1.5 border-b border-stone-800 pb-1 print:border-neutral-300">
              <Thermometer className="w-3.5 h-3.5" />
              <span>{t('weatherSection', 'Live Microclimate & Atmosphere')} &amp; {t('soilSection', 'Soil Moisture Strata')}</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs">
              <div className="p-2.5 bg-stone-950/60 border border-stone-800 rounded-lg print:border-neutral-300 print:bg-white">
                <span className="text-[10px] text-stone-400 print:text-neutral-600 block">Air Temp</span>
                <span className="text-base font-bold text-white print:text-black">{weather.current.temperature.toFixed(1)}°C</span>
                <span className="text-[10px] text-stone-500 block">Feels: {weather.current.apparentTemperature.toFixed(1)}°C</span>
              </div>

              <div className="p-2.5 bg-stone-950/60 border border-stone-800 rounded-lg print:border-neutral-300 print:bg-white">
                <span className="text-[10px] text-stone-400 print:text-neutral-600 block">Relative Humidity</span>
                <span className="text-base font-bold text-white print:text-black">{weather.current.relativeHumidity}%</span>
                <span className="text-[10px] text-stone-500 block">Dew Point: {weather.current.dewPoint.toFixed(1)}°C</span>
              </div>

              <div className="p-2.5 bg-stone-950/60 border border-stone-800 rounded-lg print:border-neutral-300 print:bg-white">
                <span className="text-[10px] text-stone-400 print:text-neutral-600 block">Wind Velocity</span>
                <span className="text-base font-bold text-white print:text-black">{weather.current.windSpeed.toFixed(1)} km/h</span>
                <span className="text-[10px] text-stone-500 block">Gusts: {weather.current.windGusts.toFixed(1)} km/h</span>
              </div>

              <div className="p-2.5 bg-stone-950/60 border border-stone-800 rounded-lg print:border-neutral-300 print:bg-white">
                <span className="text-[10px] text-stone-400 print:text-neutral-600 block">Evapotranspiration</span>
                <span className="text-base font-bold text-white print:text-black">{weather.daily.et0?.[0] ? weather.daily.et0[0].toFixed(1) : '4.2'} mm/d</span>
                <span className="text-[10px] text-stone-500 block">Ref Crop ET₀</span>
              </div>

              <div className="p-2.5 bg-stone-950/60 border border-stone-800 rounded-lg print:border-neutral-300 print:bg-white">
                <span className="text-[10px] text-stone-400 print:text-neutral-600 block">Root Zone Moisture</span>
                <span className="text-base font-bold text-white print:text-black">{(weather.soil.moistureRoot * 100).toFixed(0)}% vol</span>
                <span className="text-[10px] text-emerald-400 print:text-emerald-800 font-bold block">{weather.derived.soilWaterStatus}</span>
              </div>

              <div className="p-2.5 bg-stone-950/60 border border-stone-800 rounded-lg print:border-neutral-300 print:bg-white">
                <span className="text-[10px] text-stone-400 print:text-neutral-600 block">Delta T Index</span>
                <span className="text-base font-bold text-white print:text-black">{weather.derived.deltaT.toFixed(1)}°C</span>
                <span className="text-[10px] text-amber-400 print:text-amber-800 font-bold block">{weather.derived.spraySuitability}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Active Crop Phenology & Nutrient Prescription */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 print:text-emerald-800 flex items-center gap-1.5 border-b border-stone-800 pb-1 print:border-neutral-300">
              <Sprout className="w-3.5 h-3.5" />
              <span>{t('cropSection', 'Active Crop Phenology & Nutrient Status')}</span>
            </h4>
            <div className="p-3 bg-stone-950/60 border border-stone-800 rounded-xl space-y-2 text-xs print:border-neutral-300 print:bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <span className="text-stone-400 print:text-neutral-600">Current Phenological Stage: </span>
                  <strong className="text-white print:text-black">{currentStage.name}</strong>
                  <span className="text-stone-400 print:text-neutral-600 ml-2">({currentStage.startDas}–{currentStage.endDas} DAS)</span>
                </div>
                <div className="font-mono text-stone-300 print:text-neutral-700">
                  Accumulated GDD: <strong>{estimatedGdd} °C-days</strong> (Base: {crop.baseTemp}°C) • Crop Coeff (Kc): <strong>{currentStage.kc}</strong>
                </div>
              </div>

              <p className="text-stone-300 print:text-neutral-800 text-[11px] leading-relaxed">
                {currentStage.description}
              </p>

              <div className="pt-2 border-t border-stone-800/80 print:border-neutral-200 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-amber-400 print:text-amber-800 uppercase block">
                    Immediate Nutrient Focus:
                  </span>
                  <p className="text-stone-300 print:text-neutral-800 text-[11px]">
                    {currentStage.nutrientFocus}
                  </p>
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-emerald-400 print:text-emerald-800 uppercase block">
                    Projected Harvest Window:
                  </span>
                  <p className="text-stone-300 print:text-neutral-800 text-[11px]">
                    {harvestDate.toLocaleDateString()} (~{crop.totalDaysToMaturity - das} days remaining; Total cycle: {crop.growingPeriodRange[0]}–{crop.growingPeriodRange[1]} days)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Knapsack Spray Window & Droplet Safety */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 print:text-emerald-800 flex items-center gap-1.5 border-b border-stone-800 pb-1 print:border-neutral-300">
              <Droplets className="w-3.5 h-3.5" />
              <span>{t('spraySection', 'Knapsack Spray Suitability & Droplet Window')}</span>
            </h4>
            <div className="p-3 bg-stone-950/60 border border-stone-800 rounded-xl space-y-1.5 text-xs print:border-neutral-300 print:bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    weather.derived.spraySuitability === 'Optimal'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 print:text-emerald-800 print:border-emerald-600'
                      : weather.derived.spraySuitability === 'Marginal'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 print:text-amber-800 print:border-amber-600'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40 print:text-rose-800 print:border-rose-600'
                  }`}>
                    {weather.derived.spraySuitability} to Spray
                  </span>
                  <span className="text-stone-300 print:text-neutral-800 font-medium">
                    {weather.derived.sprayReason}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-stone-400 print:text-neutral-600 hidden sm:inline">
                  Delta T: {weather.derived.deltaT.toFixed(1)}°C (Ideal: 2–8°C)
                </span>
              </div>

              <div className="text-[11px] text-stone-400 print:text-neutral-700 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>
                  <strong>Optimal Spray Hours Today: </strong>
                  {weather.derived.optimalHoursToday.length > 0
                    ? weather.derived.optimalHoursToday.join(', ')
                    : 'No ideal window today due to microclimate constraints (wind/humidity/heat). Postpone spraying.'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Pest & Disease Early Warning Intelligence */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-rose-400 print:text-rose-800 flex items-center gap-1.5 border-b border-stone-800 pb-1 print:border-neutral-300">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{t('pestSection', 'Pest & Disease Early Warning Intelligence')}</span>
            </h4>
            <div className="space-y-2">
              {relevantPests.slice(0, 3).map((pest) => (
                <div key={pest.id} className="p-3 bg-stone-950/60 border border-stone-800 rounded-xl text-xs print:border-neutral-300 print:bg-white">
                  <div className="flex items-center justify-between gap-2 pb-1 border-b border-stone-800/60 print:border-neutral-200">
                    <div className="flex items-center gap-2">
                      <strong className="text-white print:text-black font-bold">{pest.name}</strong>
                      <span className="text-[10px] italic text-stone-400 print:text-neutral-600">({pest.scientificName})</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-stone-800 text-stone-300 print:bg-neutral-100 print:text-neutral-700">
                        {pest.type}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 print:text-amber-800 print:border-amber-600">
                      Risk: {pest.severityDefault}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-[11px]">
                    <div>
                      <strong className="text-emerald-400 print:text-emerald-800 block text-[10px] uppercase">
                        Organic IPM Remedy:
                      </strong>
                      <p className="text-stone-300 print:text-neutral-800 leading-snug">
                        {pest.organicControl[0]}
                      </p>
                    </div>
                    <div>
                      <strong className="text-cyan-400 print:text-cyan-800 block text-[10px] uppercase">
                        Chemical Control (15L Backpack Tank):
                      </strong>
                      <p className="text-stone-300 print:text-neutral-800 leading-snug">
                        {pest.chemicalControl[0]} (Pre-harvest interval: {pest.phiDays} days)
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Indian Agro-Ecological Suitability Areas & Belts */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-teal-400 print:text-teal-800 flex items-center gap-1.5 border-b border-stone-800 pb-1 print:border-neutral-300">
              <Compass className="w-3.5 h-3.5" />
              <span>{t('suitabilityTitle', 'Indian Agro-Ecological Suitability Areas & Growing Period')}</span>
            </h4>
            <div className="p-3 bg-stone-950/60 border border-stone-800 rounded-xl space-y-2 text-xs print:border-neutral-300 print:bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                <div>
                  <span className="text-stone-400 print:text-neutral-600">Suitability Index for {weather.location.name}: </span>
                  <strong className="text-emerald-400 print:text-emerald-800 font-mono text-sm">{suitability.overallScore}%</strong>
                  <span className="text-stone-300 print:text-neutral-800 ml-1.5 font-semibold">({suitability.suitabilityClass})</span>
                </div>
                <div className="text-stone-400 print:text-neutral-600">
                  Growing Period: <strong>{crop.growingPeriodRange[0]}–{crop.growingPeriodRange[1]} Days</strong> ({crop.growingPeriodDurationCategory})
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-800/80 print:border-neutral-200 text-[11px]">
                <div>
                  <strong className="text-emerald-400 print:text-emerald-800 block text-[10px] uppercase mb-1">
                    {t('primaryAreasIndia', 'Primary Suitable States in India:')}
                  </strong>
                  <ul className="space-y-0.5 text-stone-300 print:text-neutral-800">
                    {crop.primarySuitabilityAreas.map((area, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span className="text-emerald-400 print:text-emerald-700">✓</span>
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <strong className="text-teal-400 print:text-teal-800 block text-[10px] uppercase mb-1">
                    {t('otherAreasIndia', 'Other Growing Belts in India:')}
                  </strong>
                  <ul className="space-y-0.5 text-stone-300 print:text-neutral-800">
                    {crop.otherSuitabilityAreas.map((area, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span className="text-teal-400 print:text-teal-700">•</span>
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Extension Officer / Farmer Sign-off Line */}
          <div className="pt-6 border-t border-stone-800 print:border-neutral-400 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs text-stone-400 print:text-neutral-700">
            <div>
              <p className="font-semibold text-stone-300 print:text-black">
                {t('signatureField', 'Extension Officer / Farmer Signature:')}
              </p>
              <div className="w-64 h-10 border-b border-stone-700 print:border-black mt-2" />
              <span className="text-[10px] text-stone-500 print:text-neutral-500">
                Authorized Farm Representative / Extension Agronomist
              </span>
            </div>

            <div className="text-right text-[10px] text-stone-500 print:text-neutral-500 font-mono">
              <div>AgriGuide Hyperlocal Decision Support System</div>
              <div>Ground-truth verified with Open-Meteo &amp; ICAR IPM guidelines</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
