export interface LocationInfo {
  name: string;
  region?: string;
  country: string;
  lat: number;
  lon: number;
  elevation?: number;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  dewPoint: number;
  weatherCode: number;
  windSpeed: number;
  windGusts: number;
  windDirection: number;
  precipitation: number;
  rain: number;
  cloudCover: number;
  pressureMsl: number;
  isDay: boolean;
}

export interface SoilConditions {
  moistureSurface: number; // 0-1cm (m³/m³)
  moistureShallow: number; // 1-3cm
  moistureMid: number;     // 3-9cm
  moistureRoot: number;    // 9-27cm
  tempSurface: number;     // 0cm (°C)
  tempShallow: number;     // 6cm
  tempDeep: number;        // 18cm
}

export interface HourlyForecast {
  time: string[];
  temperature: number[];
  relativeHumidity: number[];
  dewPoint: number[];
  precipitationProbability: number[];
  precipitation: number[];
  weatherCode: number[];
  windSpeed: number[];
  windGusts: number[];
  soilMoistureSurface: number[];
  soilMoistureRoot: number[];
  soilTemp6cm: number[];
  et0: number[];
}

export interface DailyForecast {
  time: string[];
  weatherCode: number[];
  tempMax: number[];
  tempMin: number[];
  rainSum: number[];
  rainProbMax: number[];
  windSpeedMax: number[];
  windGustsMax: number[];
  uvIndexMax: number[];
  et0: number[];
  sunrise: string[];
  sunset: string[];
}

export interface ProcessedWeatherData {
  location: LocationInfo;
  current: CurrentWeather;
  soil: SoilConditions;
  hourly: HourlyForecast;
  daily: DailyForecast;
  derived: {
    deltaT: number;
    spraySuitability: 'Optimal' | 'Marginal' | 'Unsuitable';
    sprayReason: string;
    optimalHoursToday: string[];
    soilWaterStatus: 'Saturated' | 'Field Capacity' | 'Adequate' | 'Moisture Stress' | 'Severe Deficit';
    irrigationNeedMm: number;
    dewDurationHours: number;
    heatStressLevel: 'None' | 'Moderate' | 'Severe';
  };
}

export interface CropStage {
  id: string;
  name: string;
  description: string;
  startDas: number;
  endDas: number;
  gddRequired: number;
  waterNeeds: 'Low' | 'Medium' | 'High' | 'Critical';
  kc: number; // Crop coefficient
  nutrientFocus: string;
  pestRisks: string[];
  scoutingChecklist: string[];
}

export interface PestDisease {
  id: string;
  name: string;
  scientificName: string;
  type: 'Insect' | 'Fungal' | 'Bacterial' | 'Viral' | 'Mite' | 'Nutrient';
  cropsAffected: string[];
  tempRange: [number, number]; // min, max °C
  humidityThreshold: number;   // min % humidity for spore / hatch
  rainSensitivity: 'Favors Wet' | 'Favors Dry' | 'Any';
  vulnerableStages: string[];
  severityDefault: 'Low' | 'Moderate' | 'High' | 'Severe';
  symptoms: string[];
  organicControl: string[];
  chemicalControl: string[];
  phiDays: number; // Pre-harvest interval
  scoutingAdvice: string;
}

export interface PlantingSeasonWindow {
  seasonName: string; // e.g. "Kharif (Monsoon)", "Rabi (Winter)", "Long Rains", "Spring"
  months: string;     // e.g. "June - July"
  agroEcologicalZone: string; // e.g. "Tropical Plains", "Semi-arid highlands"
  notes: string;
}

export interface CropProfile {
  id: string;
  name: string;
  scientificName: string;
  category: 'Cereal' | 'Legume' | 'Vegetable' | 'Cash Crop' | 'Tuber' | 'Oilseed';
  icon: string;
  baseTemp: number; // Base temp for GDD (°C)
  optimalTempRange: [number, number];
  totalDaysToMaturity: number;
  growingPeriodRange: [number, number]; // Min - Max days
  growingPeriodDurationCategory: 'Short (<90d)' | 'Medium (90-120d)' | 'Long (>120d)';
  waterRequirementMm: [number, number]; // Total seasonal mm water needed
  droughtTolerance: 'Low' | 'Moderate' | 'High' | 'Extreme';
  suitableSoils: Array<'Clay Loam' | 'Sandy Loam' | 'Silty Clay' | 'Red Laterite' | 'Black Cotton'>;
  soilPhRange: [number, number];
  optimalElevationM: [number, number];
  primarySuitabilityAreas: string[]; // Primary agro-ecological zones
  otherSuitabilityAreas: string[];   // Secondary global/regional suitable hubs
  plantingSeasonWindows: PlantingSeasonWindow[];
  yieldExpectation: string;
  stages: CropStage[];
  commonPests: PestDisease[];
}

export interface CropSuitabilityEvaluation {
  crop: CropProfile;
  overallScore: number; // 0 - 100
  suitabilityClass: 'Highly Suitable' | 'Suitable' | 'Moderately Suitable' | 'Marginal / High Risk';
  thermalFit: {
    score: number;
    status: 'Optimal' | 'Acceptable' | 'Stress';
    detail: string;
  };
  moistureFit: {
    score: number;
    status: 'Optimal' | 'Adequate' | 'Deficit / Needs Irrigation' | 'Waterlogged';
    detail: string;
  };
  soilFit: {
    score: number;
    status: 'Ideal' | 'Compatible' | 'Sub-optimal';
    detail: string;
  };
  seasonFit: {
    score: number;
    status: 'In Window' | 'Upcoming Window' | 'Off-Season';
    detail: string;
  };
  keyLimitingFactor: string | null;
  advisoryNote: string;
}

export interface FarmerPlot {
  id: string;
  plotName: string;
  cropId: string;
  sowingDate: string; // YYYY-MM-DD
  areaHectares: number;
  irrigationType: 'Rainfed' | 'Furrow / Flood' | 'Drip' | 'Sprinkler' | 'Manual Bucket';
  soilType: 'Clay Loam' | 'Sandy Loam' | 'Silty Clay' | 'Red Laterite' | 'Black Cotton';
  notes?: string;
}

export interface CropDiagnosisResult {
  pestOrDisease: string;
  category: string;
  confidenceScore: number;
  confidence: 'High' | 'Medium' | 'Tentative';
  severity: 'Low' | 'Moderate' | 'Severe' | 'Critical';
  symptomsObserved: string[];
  microclimateTrigger: string;
  immediateAction: string;
  organicRemedies: string[];
  chemicalRemedies: string[];
  preventiveMeasures: string[];
  sprayGuidance: string;
  audioSummary: string;
}

export interface GeminiAdvisoryResult {
  summaryTitle: string;
  todayWorkability: {
    spraying: 'Good' | 'Marginal' | 'Do Not Spray';
    sprayingReason: string;
    optimalSprayWindow: string;
    irrigation: 'Recommended' | 'Adequate - Postpone' | 'Waterlogged Risk';
    irrigationAdvice: string;
    fieldWork: 'Favorable' | 'Challenging' | 'Postpone';
    fieldWorkReason: string;
  };
  stageNutrientInsight: string;
  pestVulnerabilityWarnings: Array<{
    pestOrDisease: string;
    riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
    whyNow: string;
    scoutingTip: string;
    immediateAction: string;
  }>;
  keyAdviceBullets: string[];
  audioAdvisoryScript: string;
}
