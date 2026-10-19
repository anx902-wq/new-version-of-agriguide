import React, { useState } from 'react';
import {
  Thermometer,
  Droplets,
  Wind,
  CloudRain,
  Sun,
  AlertTriangle,
  Clock,
  Sparkles,
  Layers,
  Activity,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Compass,
} from 'lucide-react';
import { ProcessedWeatherData } from '../types';
import { getWeatherCodeMeta } from '../services/weatherService';

interface WeatherDashboardProps {
  weather: ProcessedWeatherData;
  onOpenLocationModal: () => void;
  onNavigateToCalculator?: () => void;
}

export const WeatherDashboard: React.FC<WeatherDashboardProps> = ({
  weather,
  onOpenLocationModal,
  onNavigateToCalculator,
}) => {
  const [chartMode, setChartMode] = useState<'temp_dew' | 'rain_rh' | 'soil_strata' | 'spray_wind'>('temp_dew');
  const [hoveredHourIdx, setHoveredHourIdx] = useState<number | null>(null);
  const [showDeltaTInfo, setShowDeltaTInfo] = useState(false);

  const { current, soil, hourly, daily, derived, location } = weather;
  const weatherMeta = getWeatherCodeMeta(current.weatherCode);

  // Status colors for spray suitability
  const sprayBadgeColors = {
    Optimal: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
    Marginal: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
    Unsuitable: 'bg-rose-500/20 text-rose-300 border-rose-500/50',
  }[derived.spraySuitability];

  // Soil water status colors
  const soilStatusColors = {
    'Saturated': 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    'Field Capacity': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    'Adequate': 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    'Moisture Stress': 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    'Severe Deficit': 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  }[derived.soilWaterStatus];

  // 48-hour slice for charts
  const hoursCount = 24;
  const hoursTimes = hourly.time.slice(0, hoursCount);

  // SVG Chart Dimensions
  const svgWidth = 800;
  const svgHeight = 220;
  const padding = { top: 20, right: 30, bottom: 35, left: 45 };
  const chartW = svgWidth - padding.left - padding.right;
  const chartH = svgHeight - padding.top - padding.bottom;

  // Chart data extraction based on chartMode
  let series1: number[] = [];
  let series2: number[] = [];
  let s1Label = '';
  let s2Label = '';
  let s1Unit = '';
  let s2Unit = '';
  let s1Color = '#10b981';
  let s2Color = '#06b6d4';

  if (chartMode === 'temp_dew') {
    series1 = hourly.temperature.slice(0, hoursCount);
    series2 = hourly.dewPoint.slice(0, hoursCount);
    s1Label = 'Air Temperature';
    s2Label = 'Dew Point';
    s1Unit = '°C';
    s2Unit = '°C';
    s1Color = '#f59e0b';
    s2Color = '#3b82f6';
  } else if (chartMode === 'rain_rh') {
    series1 = hourly.precipitation.slice(0, hoursCount);
    series2 = hourly.relativeHumidity.slice(0, hoursCount);
    s1Label = 'Precipitation';
    s2Label = 'Relative Humidity';
    s1Unit = 'mm';
    s2Unit = '%';
    s1Color = '#38bdf8';
    s2Color = '#818cf8';
  } else if (chartMode === 'soil_strata') {
    series1 = hourly.soilMoistureSurface.slice(0, hoursCount).map(v => Math.round(v * 100));
    series2 = hourly.soilMoistureRoot.slice(0, hoursCount).map(v => Math.round(v * 100));
    s1Label = 'Surface Moisture (0-1cm)';
    s2Label = 'Root Zone Moisture (9-27cm)';
    s1Unit = '%';
    s2Unit = '%';
    s1Color = '#d97706';
    s2Color = '#10b981';
  } else {
    // spray_wind
    series1 = hourly.windSpeed.slice(0, hoursCount);
    series2 = hourly.time.slice(0, hoursCount).map((_, i) =>
      Math.max(0, hourly.temperature[i] - hourly.dewPoint[i])
    );
    s1Label = 'Wind Speed';
    s2Label = 'Delta T (Vapor Deficit)';
    s1Unit = 'km/h';
    s2Unit = '°C';
    s1Color = '#06b6d4';
    s2Color = '#f43f5e';
  }

  // Min and max for scaling
  const allVals = [...series1, ...series2];
  const minVal = Math.min(0, ...allVals);
  const maxVal = Math.max(10, Math.ceil(Math.max(...allVals) * 1.15));

  const getX = (idx: number) => padding.left + (idx / (hoursCount - 1)) * chartW;
  const getY = (val: number) => padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;

  const points1 = series1.map((v, i) => `${getX(i)},${getY(v)}`).join(' ');
  const points2 = series2.map((v, i) => `${getX(i)},${getY(v)}`).join(' ');
  const area1 = `${points1} ${getX(hoursCount - 1)},${getY(minVal)} ${getX(0)},${getY(minVal)}`;

  return (
    <div className="space-y-6">
      {/* Top Banner: Location & Microclimate Quick Stats */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-stone-900 via-stone-900 to-emerald-950/40 border border-stone-800 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                Hyperlocal Microclimate
              </span>
              <span className="text-xs text-stone-400">
                Lat: {location.lat.toFixed(2)}°, Lon: {location.lon.toFixed(2)}°
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-100 tracking-tight">
              {location.name}
              {location.region ? `, ${location.region}` : ''}
            </h1>
            <p className="text-sm text-stone-400">
              {weatherMeta.condition} • High-precision smallholder agronomic model
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLocationModal}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded-xl text-xs font-semibold border border-stone-700 transition-all flex items-center gap-2 shadow-sm"
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Change Farm Location</span>
            </button>
          </div>
        </div>

        {/* Primary Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-6">
          {/* Temperature */}
          <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800/80">
            <div className="flex items-center justify-between text-stone-400 text-xs">
              <span>Temperature</span>
              <Thermometer className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-stone-100">
              {Math.round(current.temperature)}°C
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">
              Feels like {Math.round(current.apparentTemperature)}°C
            </div>
          </div>

          {/* Relative Humidity */}
          <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800/80">
            <div className="flex items-center justify-between text-stone-400 text-xs">
              <span>Rel. Humidity</span>
              <Droplets className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-stone-100">
              {Math.round(current.relativeHumidity)}%
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">
              Dew point: {Math.round(current.dewPoint)}°C
            </div>
          </div>

          {/* Wind & Gusts */}
          <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800/80">
            <div className="flex items-center justify-between text-stone-400 text-xs">
              <span>Wind Speed</span>
              <Wind className="w-4 h-4 text-teal-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-stone-100">
              {Math.round(current.windSpeed)} <span className="text-xs font-normal text-stone-400">km/h</span>
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">
              Gusts: {Math.round(current.windGusts)} km/h
            </div>
          </div>

          {/* Rainfall / Precipitation */}
          <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800/80">
            <div className="flex items-center justify-between text-stone-400 text-xs">
              <span>Rain Today</span>
              <CloudRain className="w-4 h-4 text-blue-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-stone-100">
              {(daily.rainSum?.[0] ?? current.precipitation).toFixed(1)} <span className="text-xs font-normal text-stone-400">mm</span>
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">
              Probability: {daily.rainProbMax?.[0] ?? 0}%
            </div>
          </div>

          {/* Evapotranspiration (ET0) */}
          <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800/80">
            <div className="flex items-center justify-between text-stone-400 text-xs">
              <span>Water Loss (ET₀)</span>
              <Sun className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-stone-100">
              {(daily.et0?.[0] ?? 3.8).toFixed(1)} <span className="text-xs font-normal text-stone-400">mm/d</span>
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">
              UV Index: {Math.round(daily.uvIndexMax?.[0] ?? 6)}
            </div>
          </div>

          {/* Dew & Leaf Wetness */}
          <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800/80">
            <div className="flex items-center justify-between text-stone-400 text-xs">
              <span>Dew Duration</span>
              <Activity className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-stone-100">
              {derived.dewDurationHours} <span className="text-xs font-normal text-stone-400">hrs</span>
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">
              {derived.dewDurationHours > 6 ? 'High spore risk' : 'Low spore risk'}
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Spray Window Advisor & Soil Moisture Strata */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spray Window & Delta T Card */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-100 text-base">Knapsack Spraying Window</h3>
                  <p className="text-xs text-stone-400">Microclimate droplet survival & drift advisor</p>
                </div>
              </div>
              <button
                onClick={() => setShowDeltaTInfo(!showDeltaTInfo)}
                className="text-stone-400 hover:text-stone-200 transition-colors"
                title="What is Delta T?"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>

            {/* Delta T explanation drawer */}
            {showDeltaTInfo && (
              <div className="mt-4 p-3 bg-stone-950/90 border border-stone-700 rounded-xl text-xs text-stone-300 space-y-1">
                <p className="font-semibold text-emerald-400">Understanding Delta T (ΔT):</p>
                <p>
                  Delta T is the difference between dry bulb (air) and wet bulb temperature. It indicates evaporation rate:
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-stone-400 text-[11px]">
                  <li><strong className="text-emerald-300">2°C to 8°C (Optimal):</strong> Droplets survive without evaporating or running off.</li>
                  <li><strong className="text-amber-300">&lt; 2°C (Too Humid):</strong> Droplets stay wet too long; pesticide runs off foliage.</li>
                  <li><strong className="text-rose-300">&gt; 8°C (Too Dry):</strong> Rapid droplet evaporation causes high off-target drift.</li>
                </ul>
              </div>
            )}

            {/* Current Status Badge */}
            <div className="mt-5 p-4 rounded-xl bg-stone-950/60 border border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-stone-400">Current Field Status:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${sprayBadgeColors}`}>
                  {derived.spraySuitability === 'Optimal' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {derived.spraySuitability === 'Marginal' && <AlertTriangle className="w-3.5 h-3.5" />}
                  {derived.spraySuitability === 'Unsuitable' && <XCircle className="w-3.5 h-3.5" />}
                  {derived.spraySuitability} to Spray
                </span>
              </div>

              {/* Delta T Meter */}
              <div>
                <div className="flex justify-between text-xs text-stone-300 mb-1">
                  <span>Delta T: <strong className="text-emerald-400 font-mono">{derived.deltaT}°C</strong></span>
                  <span>Wind: <strong className="text-teal-400 font-mono">{current.windSpeed.toFixed(0)} km/h</strong></span>
                </div>
                <div className="w-full h-2.5 bg-stone-800 rounded-full overflow-hidden flex">
                  <div className="h-full bg-blue-500/80 w-[15%]" title="<2°C Runoff risk" />
                  <div className="h-full bg-emerald-500 w-[45%]" title="2-8°C Optimal zone" />
                  <div className="h-full bg-amber-500 w-[20%]" title="8-10°C Marginal" />
                  <div className="h-full bg-rose-500 w-[20%]" title=">10°C High evaporation" />
                </div>
                <div className="flex justify-between text-[10px] text-stone-500 mt-1 font-mono">
                  <span>0°C</span>
                  <span className="text-emerald-400">2°C</span>
                  <span className="text-emerald-400">8°C</span>
                  <span>14°C</span>
                </div>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed">
                {derived.sprayReason}
              </p>
            </div>

            {/* Today's Recommended Windows */}
            <div className="mt-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-400 mb-2">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Optimal Spray Hours Today:</span>
              </div>
              {derived.optimalHoursToday.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {derived.optimalHoursToday.slice(0, 8).map((timeStr, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-mono font-medium"
                    >
                      {timeStr}
                    </span>
                  ))}
                  {derived.optimalHoursToday.length > 8 && (
                    <span className="px-2 py-1 text-xs text-stone-500">
                      +{derived.optimalHoursToday.length - 8} more
                    </span>
                  )}
                </div>
              ) : (
                <div className="p-2.5 bg-amber-950/40 border border-amber-800/40 rounded-xl text-xs text-amber-300">
                  No safe spray window in the next 12 hours due to high wind gusts or rain probability. Postpone spraying to prevent chemical wash-off.
                </div>
              )}
            </div>
          </div>

          {onNavigateToCalculator && (
            <div className="mt-5 pt-4 border-t border-stone-800">
              <button
                onClick={onNavigateToCalculator}
                className="w-full py-2 bg-stone-800 hover:bg-stone-750 text-emerald-400 text-xs font-semibold rounded-xl border border-stone-700 transition-colors flex items-center justify-center gap-2"
              >
                <span>Calculate Backpack Spray Dilution & Dosage</span>
                <span>→</span>
              </button>
            </div>
          )}
        </div>

        {/* Soil Moisture Stratum & Hydrology */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-100 text-base">Soil Moisture Strata & Root Zone</h3>
                  <p className="text-xs text-stone-400">4-depth volumetric water & root temperature</p>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${soilStatusColors}`}>
                {derived.soilWaterStatus}
              </span>
            </div>

            {/* Depth cross-section */}
            <div className="mt-5 space-y-2.5">
              {/* 0-1cm Surface */}
              <div className="p-2.5 bg-stone-950/60 border border-stone-800 rounded-xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-200">Surface Crust (0-1 cm)</span>
                    <span className="text-[10px] text-stone-500">Germination & Seeding zone</span>
                  </div>
                  <div className="w-44 h-2 bg-stone-800 rounded-full overflow-hidden mt-1.5">
                    <div
                      className="h-full bg-amber-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, soil.moistureSurface * 220)}%` }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-stone-100">
                    {(soil.moistureSurface * 100).toFixed(1)}% <span className="text-[10px] text-stone-500">vol</span>
                  </span>
                  <div className="text-[10px] text-stone-400">{soil.tempSurface.toFixed(1)}°C</div>
                </div>
              </div>

              {/* 1-3cm Shallow */}
              <div className="p-2.5 bg-stone-950/60 border border-stone-800 rounded-xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-200">Shallow Soil (1-3 cm)</span>
                    <span className="text-[10px] text-stone-500">Seed furrow moisture</span>
                  </div>
                  <div className="w-44 h-2 bg-stone-800 rounded-full overflow-hidden mt-1.5">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, soil.moistureShallow * 220)}%` }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-stone-100">
                    {(soil.moistureShallow * 100).toFixed(1)}% <span className="text-[10px] text-stone-500">vol</span>
                  </span>
                  <div className="text-[10px] text-stone-400">{soil.tempShallow.toFixed(1)}°C</div>
                </div>
              </div>

              {/* 3-9cm Mid */}
              <div className="p-2.5 bg-stone-950/60 border border-stone-800 rounded-xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-200">Sub-surface (3-9 cm)</span>
                    <span className="text-[10px] text-stone-500">Fertilizer placement layer</span>
                  </div>
                  <div className="w-44 h-2 bg-stone-800 rounded-full overflow-hidden mt-1.5">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, soil.moistureMid * 220)}%` }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-stone-100">
                    {(soil.moistureMid * 100).toFixed(1)}% <span className="text-[10px] text-stone-500">vol</span>
                  </span>
                  <div className="text-[10px] text-stone-400">{soil.tempShallow.toFixed(1)}°C</div>
                </div>
              </div>

              {/* 9-27cm Root Zone */}
              <div className="p-2.5 bg-stone-950/60 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-300">Active Root Zone (9-27 cm)</span>
                    <span className="text-[10px] text-emerald-400/80">Primary uptake</span>
                  </div>
                  <div className="w-44 h-2 bg-stone-800 rounded-full overflow-hidden mt-1.5">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, soil.moistureRoot * 220)}%` }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-300">
                    {(soil.moistureRoot * 100).toFixed(1)}% <span className="text-[10px] text-stone-400">vol</span>
                  </span>
                  <div className="text-[10px] text-stone-400">{soil.tempDeep.toFixed(1)}°C</div>
                </div>
              </div>
            </div>

            {/* Irrigation requirement calculation */}
            <div className="mt-4 p-3 bg-stone-950/80 border border-stone-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-400">Recommended Irrigation:</span>
                <p className="text-xs font-bold text-stone-200 mt-0.5">
                  {derived.irrigationNeedMm > 0
                    ? `Apply ~${derived.irrigationNeedMm} mm (~${Math.round(derived.irrigationNeedMm * 10)} m³/ha)`
                    : 'Moisture sufficient — No irrigation needed today'}
                </p>
              </div>
              <div className="text-right text-[11px] text-stone-400">
                Soil Temp (6cm): <strong className="text-stone-200">{soil.tempShallow.toFixed(1)}°C</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Microclimate Trend Chart */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-bold text-stone-100 text-base">24-Hour Microclimate Dynamics</h3>
            <p className="text-xs text-stone-400">High-resolution hourly trends for agronomic decision making</p>
          </div>

          {/* Toggle buttons */}
          <div className="flex flex-wrap items-center gap-1.5 bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs">
            <button
              onClick={() => setChartMode('temp_dew')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                chartMode === 'temp_dew'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Temp &amp; Dew Point
            </button>
            <button
              onClick={() => setChartMode('rain_rh')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                chartMode === 'rain_rh'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Rain &amp; Humidity
            </button>
            <button
              onClick={() => setChartMode('soil_strata')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                chartMode === 'soil_strata'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Soil Moisture %
            </button>
            <button
              onClick={() => setChartMode('spray_wind')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                chartMode === 'spray_wind'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Wind &amp; Delta T
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mb-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s1Color }} />
            <span className="text-stone-300 font-medium">{s1Label} ({s1Unit})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s2Color }} />
            <span className="text-stone-300 font-medium">{s2Label} ({s2Unit})</span>
          </div>
          {hoveredHourIdx !== null && (
            <div className="ml-auto font-mono text-stone-200">
              {new Date(hoursTimes[hoveredHourIdx]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}:
              {' '}<span style={{ color: s1Color }}>{series1[hoveredHourIdx]} {s1Unit}</span>,
              {' '}<span style={{ color: s2Color }}>{series2[hoveredHourIdx]} {s2Unit}</span>
            </div>
          )}
        </div>

        {/* SVG Responsive Container */}
        <div className="relative w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto min-w-[600px] select-none"
            onMouseLeave={() => setHoveredHourIdx(null)}
          >
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s1Color} stopOpacity="0.25" />
                <stop offset="100%" stopColor={s1Color} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid horizontal lines */}
            {[0, 0.25, 0.5, 0.75, 1.0].map((frac, idx) => {
              const y = padding.top + chartH * (1 - frac);
              const val = minVal + frac * (maxVal - minVal);
              return (
                <g key={idx}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={svgWidth - padding.right}
                    y2={y}
                    stroke="#292524"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={padding.left - 8}
                    y={y + 4}
                    textAnchor="end"
                    fill="#78716c"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {Math.round(val)}
                  </text>
                </g>
              );
            })}

            {/* X Axis Time Labels */}
            {hoursTimes.map((t, idx) => {
              if (idx % 3 !== 0) return null;
              const x = getX(idx);
              const dateObj = new Date(t);
              const hourLabel = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return (
                <text
                  key={idx}
                  x={x}
                  y={svgHeight - 10}
                  textAnchor="middle"
                  fill="#a8a29e"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {hourLabel}
                </text>
              );
            })}

            {/* Area fill for series 1 */}
            <polygon points={area1} fill="url(#chartGradient)" />

            {/* Line for series 1 */}
            <polyline
              points={points1}
              fill="none"
              stroke={s1Color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Line for series 2 */}
            <polyline
              points={points2}
              fill="none"
              stroke={s2Color}
              strokeWidth="2"
              strokeDasharray={chartMode === 'rain_rh' ? '5 3' : 'none'}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive hover columns */}
            {hoursTimes.map((_, idx) => {
              const x = getX(idx);
              const isHovered = hoveredHourIdx === idx;
              return (
                <g
                  key={idx}
                  onMouseEnter={() => setHoveredHourIdx(idx)}
                  className="cursor-pointer"
                >
                  <rect
                    x={x - chartW / (hoursCount * 2)}
                    y={padding.top}
                    width={chartW / hoursCount}
                    height={chartH}
                    fill="transparent"
                  />
                  {isHovered && (
                    <>
                      <line
                        x1={x}
                        y1={padding.top}
                        x2={x}
                        y2={padding.top + chartH}
                        stroke="#f5f5f4"
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                      />
                      <circle cx={x} cy={getY(series1[idx])} r="4" fill={s1Color} stroke="#ffffff" strokeWidth="2" />
                      <circle cx={x} cy={getY(series2[idx])} r="4" fill={s2Color} stroke="#ffffff" strokeWidth="2" />
                    </>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* 7-Day Smallholder Agronomic Outlook */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-stone-100 text-base">7-Day Agronomic Forecast &amp; Spray Outlook</h3>
            <p className="text-xs text-stone-400">Microclimate planning for spraying, irrigation, and field workability</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {daily.time.slice(0, 7).map((dayTime, idx) => {
            const date = new Date(dayTime);
            const isToday = idx === 0;
            const dayName = isToday ? 'Today' : date.toLocaleDateString([], { weekday: 'short' });
            const dateFormatted = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
            const dayMeta = getWeatherCodeMeta(daily.weatherCode[idx]);
            const rainSum = daily.rainSum[idx] ?? 0;
            const rainProb = daily.rainProbMax[idx] ?? 0;
            const windMax = Math.round(daily.windSpeedMax[idx] ?? 0);
            const tempMax = Math.round(daily.tempMax[idx]);
            const tempMin = Math.round(daily.tempMin[idx]);

            // Daily spray score
            const isSpraySafe = windMax < 14 && rainSum < 1.0 && rainProb < 35;

            return (
              <div
                key={dayTime}
                className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                  isToday
                    ? 'bg-emerald-950/30 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/20'
                    : 'bg-stone-950/60 border-stone-800/80 hover:border-stone-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isToday ? 'text-emerald-400' : 'text-stone-300'}`}>
                      {dayName}
                    </span>
                    <span className="text-[10px] text-stone-500">{dateFormatted}</span>
                  </div>

                  <div className="mt-2 text-stone-400 text-xs truncate" title={dayMeta.label}>
                    {dayMeta.label}
                  </div>

                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-base font-extrabold text-stone-100">{tempMax}°</span>
                    <span className="text-xs text-stone-500">{tempMin}°</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-stone-800/80 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-stone-400">
                    <span className="flex items-center gap-1">
                      <CloudRain className="w-3 h-3 text-blue-400" />
                      <span>{rainSum.toFixed(1)}mm</span>
                    </span>
                    <span className="font-mono text-[10px] text-blue-300">{rainProb}%</span>
                  </div>

                  <div className="flex items-center justify-between text-stone-400">
                    <span className="flex items-center gap-1">
                      <Wind className="w-3 h-3 text-teal-400" />
                      <span>{windMax}kph</span>
                    </span>
                    <span className="text-[10px] font-mono text-amber-300">
                      UV {Math.round(daily.uvIndexMax[idx] ?? 5)}
                    </span>
                  </div>

                  <div className="mt-2 text-center">
                    <span
                      className={`inline-block w-full py-0.5 rounded text-[10px] font-bold ${
                        isSpraySafe
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                          : 'bg-stone-800 text-stone-400'
                      }`}
                    >
                      {isSpraySafe ? 'Spray Good' : 'Spray Risky'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
