import React, { useState } from 'react';
import {
  Calculator,
  Droplets,
  Zap,
  HelpCircle,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  Layers,
} from 'lucide-react';
import { ProcessedWeatherData, FarmerPlot } from '../types';
import { CROP_PROFILES } from '../data/cropDatabase';

interface FarmCalculatorsProps {
  weather: ProcessedWeatherData;
  plots: FarmerPlot[];
  activePlotId: string;
}

export const FarmCalculators: React.FC<FarmCalculatorsProps> = ({
  weather,
  plots,
  activePlotId,
}) => {
  const activePlot = plots.find((p) => p.id === activePlotId) || plots[0];

  // 1. Sprayer Calculator State
  const [tankCapacity, setTankCapacity] = useState<number>(15); // 15L standard knapsack
  const [plotArea, setPlotArea] = useState<number>(activePlot?.areaHectares || 1.0);
  const [areaUnit, setAreaUnit] = useState<'acres' | 'hectares'>('acres');
  const [doseMode, setDoseMode] = useState<'per_liter' | 'per_area'>('per_liter');
  const [dosePerLiter, setDosePerLiter] = useState<number>(2.0); // e.g. 2 ml/L
  const [dosePerArea, setDosePerArea] = useState<number>(250); // e.g. 250 ml/acre
  const [waterRatePerArea, setWaterRatePerArea] = useState<number>(150); // e.g. 150 L water per acre

  // 2. GDD Thermal Time Calculator State
  const [selectedCropId, setSelectedCropId] = useState<string>(activePlot?.cropId || 'maize');
  const cropProfile = CROP_PROFILES.find((c) => c.id === selectedCropId) || CROP_PROFILES[0];
  const [customBaseTemp, setCustomBaseTemp] = useState<number>(cropProfile.baseTemp);
  const [tMax, setTMax] = useState<number>(Math.round(weather.daily.tempMax?.[0] ?? 28));
  const [tMin, setTMin] = useState<number>(Math.round(weather.daily.tempMin?.[0] ?? 18));

  // 3. Pump Runtime Calculator State
  const [pumpHp, setPumpHp] = useState<number>(3); // 3 HP pump
  const [flowRateLitersPerHour, setFlowRateLitersPerHour] = useState<number>(18000); // 18,000 L/hr
  const [targetDeficitMm, setTargetDeficitMm] = useState<number>(weather.derived.irrigationNeedMm || 15);

  // Computations for Sprayer
  const normalizedAreaAcres = areaUnit === 'hectares' ? plotArea * 2.471 : plotArea;
  let totalWaterVolumeL = 0;
  let chemicalPerTank = 0;
  let totalChemical = 0;
  let numberOfTanks = 0;

  if (doseMode === 'per_liter') {
    totalWaterVolumeL = normalizedAreaAcres * waterRatePerArea;
    chemicalPerTank = tankCapacity * dosePerLiter;
    numberOfTanks = Math.ceil(totalWaterVolumeL / tankCapacity);
    totalChemical = totalWaterVolumeL * dosePerLiter;
  } else {
    totalWaterVolumeL = normalizedAreaAcres * waterRatePerArea;
    numberOfTanks = Math.ceil(totalWaterVolumeL / tankCapacity);
    totalChemical = normalizedAreaAcres * dosePerArea;
    chemicalPerTank = Number((totalChemical / Math.max(1, numberOfTanks)).toFixed(1));
  }

  // Computations for GDD
  const meanTemp = (tMax + tMin) / 2;
  const calculatedDailyGdd = Math.max(0, meanTemp - customBaseTemp);

  // Computations for Pump Runtime
  // 1 mm irrigation on 1 hectare = 10,000 Liters
  // 1 mm irrigation on 1 acre = ~4,047 Liters
  const totalWaterNeededLiters = targetDeficitMm * (normalizedAreaAcres * 4047);
  const pumpRuntimeHours = totalWaterNeededLiters / Math.max(1, flowRateLitersPerHour);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-stone-100">
            Smallholder Agronomic Calculators
          </h2>
        </div>
        <p className="text-xs text-stone-400 mt-1">
          Precision knapsack spraying dilution, growing degree days (GDD), and pump runtime planners
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Knapsack Sprayer Dosage Calculator */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-md flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-800">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-stone-100 text-base">Knapsack Sprayer Dilution Calculator</h3>
                <p className="text-xs text-stone-400">Avoid crop phytotoxicity and chemical waste</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-stone-400 font-semibold mb-1">Backpack Tank Capacity</label>
                <select
                  value={tankCapacity}
                  onChange={(e) => setTankCapacity(Number(e.target.value))}
                  className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value={15}>15 Liters (Standard)</option>
                  <option value={16}>16 Liters</option>
                  <option value={20}>20 Liters</option>
                  <option value={10}>10 Liters</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-400 font-semibold mb-1">Field Area Size</label>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={plotArea}
                    onChange={(e) => setPlotArea(Number(e.target.value))}
                    className="w-2/3 p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <select
                    value={areaUnit}
                    onChange={(e) => setAreaUnit(e.target.value as any)}
                    className="w-1/3 p-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="acres">Acres</option>
                    <option value="hectares">Ha</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Dose Mode Switch */}
            <div className="space-y-1.5 text-xs">
              <label className="block text-stone-400 font-semibold">Recommended Dose Format on Label:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDoseMode('per_liter')}
                  className={`p-2 rounded-xl border text-xs font-medium transition-all ${
                    doseMode === 'per_liter'
                      ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200'
                      : 'bg-stone-950 border-stone-800 text-stone-400'
                  }`}
                >
                  Dose per Liter of Water (ml/L or g/L)
                </button>
                <button
                  type="button"
                  onClick={() => setDoseMode('per_area')}
                  className={`p-2 rounded-xl border text-xs font-medium transition-all ${
                    doseMode === 'per_area'
                      ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200'
                      : 'bg-stone-950 border-stone-800 text-stone-400'
                  }`}
                >
                  Dose per Acre / Hectare (ml/ha or g/ha)
                </button>
              </div>
            </div>

            {/* Dose input */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              {doseMode === 'per_liter' ? (
                <div>
                  <label className="block text-stone-400 font-semibold mb-1">Dose per Liter (ml or g)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={dosePerLiter}
                    onChange={(e) => setDosePerLiter(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-stone-400 font-semibold mb-1">Dose per {areaUnit === 'hectares' ? 'Hectare' : 'Acre'}</label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    value={dosePerArea}
                    onChange={(e) => setDosePerArea(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-stone-400 font-semibold mb-1">Water Volume (Liters / Acre)</label>
                <input
                  type="number"
                  step="10"
                  value={waterRatePerArea}
                  onChange={(e) => setWaterRatePerArea(Number(e.target.value))}
                  className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Sprayer Output Result Box */}
            <div className="p-4 bg-emerald-950/20 border border-emerald-500/40 rounded-xl space-y-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                Calculated Tank Dosage:
              </span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 bg-stone-950/80 rounded-lg border border-stone-800">
                  <span className="text-[10px] text-stone-400 block uppercase">Per Tank Fill</span>
                  <span className="text-lg font-black text-emerald-300 font-mono">
                    {chemicalPerTank} <span className="text-xs font-normal">ml/g</span>
                  </span>
                </div>

                <div className="p-2.5 bg-stone-950/80 rounded-lg border border-stone-800">
                  <span className="text-[10px] text-stone-400 block uppercase">Number of Tanks</span>
                  <span className="text-lg font-black text-stone-100 font-mono">
                    {numberOfTanks} <span className="text-xs font-normal">fills</span>
                  </span>
                </div>

                <div className="p-2.5 bg-stone-950/80 rounded-lg border border-stone-800">
                  <span className="text-[10px] text-stone-400 block uppercase">Total Chemical</span>
                  <span className="text-lg font-black text-amber-300 font-mono">
                    {Math.round(totalChemical)} <span className="text-xs font-normal">ml/g</span>
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-stone-300 leading-relaxed pt-1">
                👉 Pre-dissolve <strong className="text-emerald-300">{chemicalPerTank} ml/g</strong> in a small 2-liter bucket of water first, then pour through the knapsack strainer into the half-filled tank. Top up with clean water.
              </p>
            </div>
          </div>
        </div>

        {/* GDD Thermal Time & Heat Units Calculator */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-md flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-800">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-stone-100 text-base">Growing Degree Days (GDD) Simulator</h3>
                <p className="text-xs text-stone-400">Track biological plant development and heat accumulation</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-stone-400 font-semibold mb-1">Select Crop</label>
                <select
                  value={selectedCropId}
                  onChange={(e) => {
                    setSelectedCropId(e.target.value);
                    const c = CROP_PROFILES.find((p) => p.id === e.target.value);
                    if (c) setCustomBaseTemp(c.baseTemp);
                  }}
                  className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {CROP_PROFILES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-400 font-semibold mb-1">Base Temp (T-base °C)</label>
                <input
                  type="number"
                  step="0.5"
                  value={customBaseTemp}
                  onChange={(e) => setCustomBaseTemp(Number(e.target.value))}
                  className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-stone-400 font-semibold mb-1">Max Temp (T-max °C)</label>
                <input
                  type="number"
                  value={tMax}
                  onChange={(e) => setTMax(Number(e.target.value))}
                  className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-stone-400 font-semibold mb-1">Min Temp (T-min °C)</label>
                <input
                  type="number"
                  value={tMin}
                  onChange={(e) => setTMin(Number(e.target.value))}
                  className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* GDD Result */}
            <div className="p-4 bg-amber-950/20 border border-amber-500/40 rounded-xl space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                Calculated Daily Heat Units:
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-extrabold text-amber-300 font-mono">
                    {calculatedDailyGdd.toFixed(1)}
                  </span>
                  <span className="text-xs text-stone-400 ml-1.5">°C-days per day</span>
                </div>

                <div className="text-right text-[11px] text-stone-400">
                  Mean Temp: <strong className="text-stone-200">{meanTemp.toFixed(1)}°C</strong>
                </div>
              </div>
              <p className="text-[11px] text-stone-300">
                Formula: Max(0, (Tmax + Tmin) / 2 - Tbase). Accumulating {calculatedDailyGdd.toFixed(1)} GDD today pushes {cropProfile.name} closer to its next phenological milestone.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Soil Water Balance & Pump Runtime Calculator */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-md space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-stone-800">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-stone-100 text-base">Irrigation Pump Runtime &amp; Water Balance</h3>
            <p className="text-xs text-stone-400">
              Calculate exact pump operating hours based on root-zone deficit and motor flow rate
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-stone-400 font-semibold mb-1">Target Deficit to Replenish (mm)</label>
            <input
              type="number"
              step="1"
              value={targetDeficitMm}
              onChange={(e) => setTargetDeficitMm(Number(e.target.value))}
              className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span className="text-[10px] text-stone-500 mt-1 block">
              Current farm soil deficit: ~{weather.derived.irrigationNeedMm} mm
            </span>
          </div>

          <div>
            <label className="block text-stone-400 font-semibold mb-1">Pump Motor Capacity (HP)</label>
            <select
              value={pumpHp}
              onChange={(e) => {
                const hp = Number(e.target.value);
                setPumpHp(hp);
                setFlowRateLitersPerHour(hp * 6000); // approx 6,000 L/hr per HP
              }}
              className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value={1}>1.0 HP (~6,000 L/hr)</option>
              <option value={2}>2.0 HP (~12,000 L/hr)</option>
              <option value={3}>3.0 HP (~18,000 L/hr)</option>
              <option value={5}>5.0 HP (~30,000 L/hr)</option>
              <option value={7.5}>7.5 HP (~45,000 L/hr)</option>
            </select>
          </div>

          <div>
            <label className="block text-stone-400 font-semibold mb-1">Discharge Rate (Liters / Hour)</label>
            <input
              type="number"
              step="1000"
              value={flowRateLitersPerHour}
              onChange={(e) => setFlowRateLitersPerHour(Number(e.target.value))}
              className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="p-4 bg-stone-950 border border-stone-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div>
            <span className="text-stone-400 block">Total Water Volume to Deliver:</span>
            <span className="text-lg font-bold text-blue-400 font-mono">
              {Math.round(totalWaterNeededLiters).toLocaleString()} Liters ({Math.round(totalWaterNeededLiters / 1000)} m³)
            </span>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-stone-400 block">Recommended Pump Runtime:</span>
            <span className="text-xl font-black text-emerald-400 font-mono">
              {pumpRuntimeHours < 1
                ? `${Math.round(pumpRuntimeHours * 60)} minutes`
                : `${Math.floor(pumpRuntimeHours)} hrs ${Math.round((pumpRuntimeHours % 1) * 60)} mins`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
