import { CropProfile, CropSuitabilityEvaluation, ProcessedWeatherData, FarmerPlot } from '../types';

export function evaluateCropSuitability(
  crop: CropProfile,
  weather: ProcessedWeatherData,
  plotSoilType: FarmerPlot['soilType'] = 'Clay Loam',
  plotIrrigation: FarmerPlot['irrigationType'] = 'Rainfed'
): CropSuitabilityEvaluation {
  const currentTemp = weather.current.temperature;
  const avgTemp7d =
    weather.daily.tempMax.slice(0, 7).reduce((a, b) => a + b, 0) / 7 +
    weather.daily.tempMin.slice(0, 7).reduce((a, b) => a + b, 0) / 14;

  const [minOptTemp, maxOptTemp] = crop.optimalTempRange;
  const isIrrigated = plotIrrigation !== 'Rainfed';
  const rootMoisture = weather.soil.moistureRoot;

  // 1. Thermal Fit (0 - 30)
  let thermalScore = 0;
  let thermalStatus: 'Optimal' | 'Acceptable' | 'Stress' = 'Optimal';
  let thermalDetail = '';

  if (avgTemp7d >= minOptTemp && avgTemp7d <= maxOptTemp) {
    thermalScore = 30;
    thermalStatus = 'Optimal';
    thermalDetail = `Average temp (${avgTemp7d.toFixed(1)}°C) matches ideal growth range (${minOptTemp}°–${maxOptTemp}°C).`;
  } else if (avgTemp7d >= crop.baseTemp && avgTemp7d <= maxOptTemp + 4) {
    thermalScore = 20;
    thermalStatus = 'Acceptable';
    if (avgTemp7d < minOptTemp) {
      thermalDetail = `Slightly cool (${avgTemp7d.toFixed(1)}°C); growth rate may slow but safe from frost.`;
    } else {
      thermalDetail = `Warm spell (${avgTemp7d.toFixed(1)}°C); maintain canopy hydration to prevent heat stress.`;
    }
  } else {
    thermalScore = 8;
    thermalStatus = 'Stress';
    if (avgTemp7d < crop.baseTemp) {
      thermalDetail = `Temperature (${avgTemp7d.toFixed(1)}°C) is below base threshold (${crop.baseTemp}°C). Severe chill/dormancy risk.`;
    } else {
      thermalDetail = `Excessive heat (${avgTemp7d.toFixed(1)}°C); pollination failure or flower drop probable.`;
    }
  }

  // 2. Moisture / Hydrological Fit (0 - 30)
  let moistureScore = 0;
  let moistureStatus: 'Optimal' | 'Adequate' | 'Deficit / Needs Irrigation' | 'Waterlogged' = 'Adequate';
  let moistureDetail = '';

  const isDroughtTolerant = crop.droughtTolerance === 'High' || crop.droughtTolerance === 'Extreme';

  if (rootMoisture > 0.38) {
    // Waterlogged
    if (crop.id === 'rice') {
      moistureScore = 30;
      moistureStatus = 'Optimal';
      moistureDetail = 'Saturated flooded soil provides ideal anaerobic conditions for lowland paddy.';
    } else if (crop.id === 'cassava' || crop.id === 'potato') {
      moistureScore = 10;
      moistureStatus = 'Waterlogged';
      moistureDetail = 'Heavy waterlogging risk: tubers subject to rapid asphyxiation and bacterial soft rot.';
    } else {
      moistureScore = 15;
      moistureStatus = 'Waterlogged';
      moistureDetail = 'Soil near saturation. Ensure raised field furrows to prevent root hypoxia.';
    }
  } else if (rootMoisture >= 0.22 && rootMoisture <= 0.38) {
    moistureScore = 28;
    moistureStatus = 'Optimal';
    moistureDetail = `Soil moisture (${(rootMoisture * 100).toFixed(0)}%) in active root zone is in sweet spot.`;
  } else {
    // Dry / Deficit
    if (isIrrigated) {
      moistureScore = 26;
      moistureStatus = 'Adequate';
      moistureDetail = `Soil dry (${(rootMoisture * 100).toFixed(0)}%), but farm has ${plotIrrigation} to maintain regular watering.`;
    } else if (isDroughtTolerant) {
      moistureScore = 22;
      moistureStatus = 'Adequate';
      moistureDetail = `Subsoil moisture is low, but ${crop.name} has ${crop.droughtTolerance.toLowerCase()} drought tolerance.`;
    } else {
      moistureScore = 9;
      moistureStatus = 'Deficit / Needs Irrigation';
      moistureDetail = `Moisture deficit (${(rootMoisture * 100).toFixed(0)}% vol). High yield loss risk under rainfed conditions without supplementary water.`;
    }
  }

  // 3. Soil Compatibility (0 - 25)
  let soilScore = 0;
  let soilStatus: 'Ideal' | 'Compatible' | 'Sub-optimal' = 'Compatible';
  let soilDetail = '';

  const soilMatches = crop.suitableSoils.includes(plotSoilType);
  if (soilMatches) {
    soilScore = 25;
    soilStatus = 'Ideal';
    soilDetail = `${plotSoilType} is an ideal soil match for ${crop.name}'s root structure.`;
  } else {
    // Special checks
    if ((crop.id === 'groundnut' || crop.id === 'potato') && plotSoilType === 'Black Cotton') {
      soilScore = 10;
      soilStatus = 'Sub-optimal';
      soilDetail = 'Heavy clay / Black Cotton soil sticks to tubers/pods and cracks, impeding peg entry and harvesting.';
    } else if (crop.id === 'rice' && plotSoilType === 'Sandy Loam') {
      soilScore = 12;
      soilStatus = 'Sub-optimal';
      soilDetail = 'Sandy loam loses water too rapidly through deep percolation for flooded paddy.';
    } else {
      soilScore = 18;
      soilStatus = 'Compatible';
      soilDetail = `${plotSoilType} is acceptable with proper organic matter and drainage management.`;
    }
  }

  // 4. Season & Growing Period Fit (0 - 15)
  const currentMonthIdx = new Date().getMonth(); // 0 to 11
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentMonthName = monthNames[currentMonthIdx];

  let seasonScore = 12;
  let seasonStatus: 'In Window' | 'Upcoming Window' | 'Off-Season' = 'In Window';
  let seasonDetail = `Growing period: ${crop.growingPeriodRange[0]}–${crop.growingPeriodRange[1]} days (${crop.growingPeriodDurationCategory}).`;

  // Check if current month is in any of the planting windows
  const isDirectMatch = crop.plantingSeasonWindows.some((w) =>
    w.months.toLowerCase().includes(currentMonthName.toLowerCase())
  );

  if (isDirectMatch) {
    seasonScore = 15;
    seasonStatus = 'In Window';
    seasonDetail += ` Currently in active sowing window (${currentMonthName}) for optimal yield.`;
  } else {
    seasonScore = 10;
    seasonStatus = 'Upcoming Window';
    seasonDetail += ` Check regional planting calendar windows (${crop.plantingSeasonWindows.map(w => w.months).join(', ')}).`;
  }

  // Overall Score & Classification
  const totalScore = Math.min(100, Math.round(thermalScore + moistureScore + soilScore + seasonScore));

  let suitabilityClass: CropSuitabilityEvaluation['suitabilityClass'] = 'Suitable';
  if (totalScore >= 84) suitabilityClass = 'Highly Suitable';
  else if (totalScore >= 68) suitabilityClass = 'Suitable';
  else if (totalScore >= 50) suitabilityClass = 'Moderately Suitable';
  else suitabilityClass = 'Marginal / High Risk';

  // Identify primary limiting factor
  let keyLimitingFactor: string | null = null;
  if (thermalStatus === 'Stress') {
    keyLimitingFactor = `Unfavorable temperatures (${avgTemp7d.toFixed(1)}°C outside ${minOptTemp}°–${maxOptTemp}°C range)`;
  } else if (moistureStatus === 'Deficit / Needs Irrigation') {
    keyLimitingFactor = 'Insufficient root-zone moisture under rainfed regime';
  } else if (moistureStatus === 'Waterlogged' && crop.id !== 'rice') {
    keyLimitingFactor = 'High root-zone saturation causing tuber/root rot risk';
  } else if (soilStatus === 'Sub-optimal') {
    keyLimitingFactor = `Soil type (${plotSoilType}) not ideal for this crop architecture`;
  }

  // Generate actionable advisory note
  let advisoryNote = '';
  if (suitabilityClass === 'Highly Suitable') {
    advisoryNote = `Outstanding microclimate and soil alignment in ${weather.location.name}. Ideal time to sow or expand acreage.`;
  } else if (suitabilityClass === 'Suitable') {
    advisoryNote = `Favorable conditions for profitable cultivation. Standard agronomic practices and timely weeding recommended.`;
  } else if (suitabilityClass === 'Moderately Suitable') {
    advisoryNote = `Can be grown successfully if ${keyLimitingFactor ? keyLimitingFactor.toLowerCase() : 'limiting factor'} is managed via furrow ridges or irrigation.`;
  } else {
    advisoryNote = `Cultivation carries significant risk under current microclimate. Consider more resilient alternative crops like Sorghum, Pearl Millet, or Cassava.`;
  }

  return {
    crop,
    overallScore: totalScore,
    suitabilityClass,
    thermalFit: { score: thermalScore, status: thermalStatus, detail: thermalDetail },
    moistureFit: { score: moistureScore, status: moistureStatus, detail: moistureDetail },
    soilFit: { score: soilScore, status: soilStatus, detail: soilDetail },
    seasonFit: { score: seasonScore, status: seasonStatus, detail: seasonDetail },
    keyLimitingFactor,
    advisoryNote,
  };
}
