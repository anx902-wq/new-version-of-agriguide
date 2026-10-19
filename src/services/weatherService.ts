import { LocationInfo, ProcessedWeatherData } from '../types';

// Approximation of Wet Bulb Temperature using Stull formula for Delta T
function calculateWetBulb(tempC: number, rh: number): number {
  return (
    tempC * Math.atan(0.151977 * Math.pow(rh + 8.313659, 0.5)) +
    Math.atan(tempC + rh) -
    Math.atan(rh - 1.676331) +
    0.00391838 * Math.pow(rh, 1.5) * Math.atan(0.023101 * rh) -
    4.686035
  );
}

export function calculateDeltaT(tempC: number, rh: number): number {
  const wetBulb = calculateWetBulb(tempC, rh);
  const delta = tempC - wetBulb;
  return Math.max(0, Number(delta.toFixed(1)));
}

export async function fetchWeatherData(location: LocationInfo): Promise<ProcessedWeatherData> {
  const { lat, lon } = location;

  const url = `/api/weather-proxy?lat=${lat}&lon=${lon}`;
  let rawData: any;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Proxy failed');
    rawData = await res.json();
  } catch {
    // Fallback direct to Open-Meteo if server proxy is unavailable
    const fallbackUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_gusts_10m,soil_temperature_0cm,soil_temperature_6cm,soil_temperature_18cm,soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm,soil_moisture_9_to_27cm,et0_fao_evapotranspiration,vapour_pressure_deficit&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,et0_fao_evapotranspiration&timezone=auto&forecast_days=7`;
    const res = await fetch(fallbackUrl);
    rawData = await res.json();
  }

  const current = rawData.current;
  const hourly = rawData.hourly;
  const daily = rawData.daily;

  // Derive Delta T
  const deltaT = calculateDeltaT(current.temperature_2m, current.relative_humidity_2m);

  // Evaluate current spraying window
  const windSpeed = current.wind_speed_10m;
  const rainNextHours = hourly.precipitation.slice(0, 4).reduce((a: number, b: number) => a + b, 0);

  let spraySuitability: 'Optimal' | 'Marginal' | 'Unsuitable' = 'Optimal';
  let sprayReason = 'Good conditions: gentle breeze, moderate Delta T, zero rain imminent.';

  if (windSpeed > 15 || rainNextHours > 1.0 || deltaT > 9) {
    spraySuitability = 'Unsuitable';
    if (windSpeed > 15) {
      sprayReason = `High wind (${windSpeed.toFixed(0)} km/h) causes severe pesticide drift risk.`;
    } else if (rainNextHours > 1.0) {
      sprayReason = `Rain forecast (${rainNextHours.toFixed(1)} mm) within next 4 hours will wash spray away.`;
    } else {
      sprayReason = `Delta T is too high (${deltaT}°C); fine droplets will evaporate before reaching leaves.`;
    }
  } else if (windSpeed > 10 || deltaT > 7 || deltaT < 2) {
    spraySuitability = 'Marginal';
    if (deltaT < 2) {
      sprayReason = `Delta T too low (${deltaT}°C) with saturated air; droplets may fail to dry and drip off.`;
    } else if (windSpeed > 10) {
      sprayReason = `Moderate wind (${windSpeed.toFixed(0)} km/h); use coarse drift-reduction nozzles.`;
    } else {
      sprayReason = `Moderate Delta T (${deltaT}°C); spray early morning or late afternoon.`;
    }
  }

  // Calculate optimal spraying hours in next 24h
  const optimalHoursToday: string[] = [];
  for (let i = 0; i < Math.min(24, hourly.time.length); i++) {
    const hTime = new Date(hourly.time[i]);
    const hTemp = hourly.temperature_2m[i];
    const hRh = hourly.relative_humidity_2m[i];
    const hWind = hourly.wind_speed_10m[i];
    const hRain = hourly.precipitation[i];
    const hDelta = calculateDeltaT(hTemp, hRh);

    if (hWind <= 12 && hRain < 0.2 && hDelta >= 2 && hDelta <= 8) {
      const formatted = hTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      optimalHoursToday.push(formatted);
    }
  }

  // Soil moisture analysis
  const surfaceMoisture = hourly.soil_moisture_0_to_1cm?.[0] ?? 0.24;
  const rootMoisture = hourly.soil_moisture_9_to_27cm?.[0] ?? 0.28;

  let soilWaterStatus: 'Saturated' | 'Field Capacity' | 'Adequate' | 'Moisture Stress' | 'Severe Deficit' = 'Adequate';
  let irrigationNeedMm = 0;

  if (rootMoisture > 0.38) {
    soilWaterStatus = 'Saturated';
    irrigationNeedMm = 0;
  } else if (rootMoisture >= 0.28) {
    soilWaterStatus = 'Field Capacity';
    irrigationNeedMm = 0;
  } else if (rootMoisture >= 0.20) {
    soilWaterStatus = 'Adequate';
    irrigationNeedMm = Math.max(0, (0.30 - rootMoisture) * 100);
  } else if (rootMoisture >= 0.14) {
    soilWaterStatus = 'Moisture Stress';
    irrigationNeedMm = Math.max(15, (0.30 - rootMoisture) * 120);
  } else {
    soilWaterStatus = 'Severe Deficit';
    irrigationNeedMm = 35;
  }

  // Dew duration hours (count hours where relative humidity >= 88%)
  let dewDurationHours = 0;
  for (let i = 0; i < 24; i++) {
    if (hourly.relative_humidity_2m[i] >= 88) {
      dewDurationHours++;
    }
  }

  // Heat stress level
  const maxTempToday = daily.tempMax?.[0] ?? current.temperature_2m;
  let heatStressLevel: 'None' | 'Moderate' | 'Severe' = 'None';
  if (maxTempToday >= 38) {
    heatStressLevel = 'Severe';
  } else if (maxTempToday >= 33) {
    heatStressLevel = 'Moderate';
  }

  return {
    location,
    current: {
      temperature: current.temperature_2m,
      apparentTemperature: current.apparent_temperature,
      relativeHumidity: current.relative_humidity_2m,
      dewPoint: hourly.dew_point_2m[0] ?? current.temperature_2m - 5,
      weatherCode: current.weather_code,
      windSpeed: current.wind_speed_10m,
      windGusts: current.wind_gusts_10m,
      windDirection: current.wind_direction_10m,
      precipitation: current.precipitation,
      rain: current.rain,
      cloudCover: current.cloud_cover,
      pressureMsl: current.pressure_msl,
      isDay: current.is_day === 1,
    },
    soil: {
      moistureSurface: surfaceMoisture,
      moistureShallow: hourly.soil_moisture_1_to_3cm?.[0] ?? surfaceMoisture,
      moistureMid: hourly.soil_moisture_3_to_9cm?.[0] ?? rootMoisture,
      moistureRoot: rootMoisture,
      tempSurface: hourly.soil_temperature_0cm?.[0] ?? current.temperature_2m,
      tempShallow: hourly.soil_temperature_6cm?.[0] ?? current.temperature_2m - 1,
      tempDeep: hourly.soil_temperature_18cm?.[0] ?? current.temperature_2m - 2,
    },
    hourly: {
      time: hourly.time.slice(0, 48),
      temperature: hourly.temperature_2m.slice(0, 48),
      relativeHumidity: hourly.relative_humidity_2m.slice(0, 48),
      dewPoint: hourly.dew_point_2m.slice(0, 48),
      precipitationProbability: hourly.precipitation_probability.slice(0, 48),
      precipitation: hourly.precipitation.slice(0, 48),
      weatherCode: hourly.weather_code.slice(0, 48),
      windSpeed: hourly.wind_speed_10m.slice(0, 48),
      windGusts: hourly.wind_gusts_10m.slice(0, 48),
      soilMoistureSurface: hourly.soil_moisture_0_to_1cm?.slice(0, 48) ?? [],
      soilMoistureRoot: hourly.soil_moisture_9_to_27cm?.slice(0, 48) ?? [],
      soilTemp6cm: hourly.soil_temperature_6cm?.slice(0, 48) ?? [],
      et0: hourly.et0_fao_evapotranspiration?.slice(0, 48) ?? [],
    },
    daily: {
      time: daily.time,
      weatherCode: daily.weather_code,
      tempMax: daily.temperature_2m_max,
      tempMin: daily.temperature_2m_min,
      rainSum: daily.precipitation_sum,
      rainProbMax: daily.precipitation_probability_max,
      windSpeedMax: daily.wind_speed_10m_max,
      windGustsMax: daily.wind_gusts_10m_max,
      uvIndexMax: daily.uv_index_max,
      et0: daily.et0_fao_evapotranspiration ?? [],
      sunrise: daily.sunrise,
      sunset: daily.sunset,
    },
    derived: {
      deltaT,
      spraySuitability,
      sprayReason,
      optimalHoursToday,
      soilWaterStatus,
      irrigationNeedMm: Number(irrigationNeedMm.toFixed(1)),
      dewDurationHours,
      heatStressLevel,
    },
  };
}

export async function searchLocations(query: string): Promise<LocationInfo[]> {
  if (!query || query.trim().length < 2) return [];
  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`);
    const data = await res.json();
    if (!data.results) return [];
    return data.results.map((r: any) => ({
      name: r.name,
      region: r.admin1 || r.admin2 || '',
      country: r.country || '',
      lat: r.latitude,
      lon: r.longitude,
      elevation: r.elevation,
    }));
  } catch (err) {
    console.error('Location search error:', err);
    return [];
  }
}

// Convert Open-Meteo weather code to human readable description & icon
export function getWeatherCodeMeta(code: number): { label: string; icon: string; condition: string } {
  switch (code) {
    case 0:
      return { label: 'Clear Sky', icon: 'Sun', condition: 'Sunny & Dry' };
    case 1:
      return { label: 'Mainly Clear', icon: 'SunDim', condition: 'Mostly Sunny' };
    case 2:
      return { label: 'Partly Cloudy', icon: 'CloudSun', condition: 'Partial Cloud' };
    case 3:
      return { label: 'Overcast', icon: 'Cloud', condition: 'Overcast' };
    case 45:
    case 48:
      return { label: 'Fog / Mist', icon: 'CloudFog', condition: 'Foggy (High humidity)' };
    case 51:
    case 53:
    case 55:
      return { label: 'Drizzle', icon: 'CloudDrizzle', condition: 'Light Drizzle' };
    case 61:
    case 63:
    case 65:
      return { label: 'Rain', icon: 'CloudRain', condition: 'Rain Showers' };
    case 71:
    case 73:
    case 75:
      return { label: 'Snow', icon: 'CloudSnow', condition: 'Snowfall' };
    case 80:
    case 81:
    case 82:
      return { label: 'Heavy Showers', icon: 'CloudRain', condition: 'Heavy Downpour' };
    case 95:
    case 96:
    case 99:
      return { label: 'Thunderstorm', icon: 'CloudLightning', condition: 'Thunderstorm with Gusts' };
    default:
      return { label: 'Variable', icon: 'CloudSun', condition: 'Scattered Cloud' };
  }
}
