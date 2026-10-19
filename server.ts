import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '30mb' }));

// Initialize GoogleGenAI SDK on server side only
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Crop diagnosis endpoint (Vision + Symptom Description)
app.post('/api/gemini/diagnose', async (req, res) => {
  try {
    const { imageBase64, mimeType, cropName, symptoms, stage, locationName, weatherSummary } = req.body;

    const parts: Array<{ text?: string; inlineData?: { data: string; mimeType: string } }> = [];

    if (imageBase64) {
      parts.push({
        inlineData: {
          data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
          mimeType: mimeType || 'image/jpeg',
        },
      });
    }

    const promptText = `
You are an expert tropical and temperate agricultural extension scientist specializing in smallholder farming systems, Integrated Pest Management (IPM), plant pathology, and entomology.
Evaluate this crop problem carefully.

Crop: ${cropName || 'Unspecified Crop'}
Current Growth Stage: ${stage || 'Unknown stage'}
Location: ${locationName || 'Local farm'}
Recent Weather Context: ${weatherSummary || 'Humid microclimate with seasonal temperatures'}
Farmer Observed Symptoms: ${symptoms || 'Visual inspection requested from image'}

Provide a strict JSON response (no markdown fences, just JSON) with the following structure:
{
  "pestOrDisease": "Common name (Scientific name)",
  "category": "Fungal Disease" | "Bacterial Disease" | "Viral Disease" | "Insect Pest" | "Mite/Nematode" | "Nutrient Deficiency" | "Abiotic / Weather Stress" | "Healthy",
  "confidenceScore": number (0 to 100),
  "confidence": "High" | "Medium" | "Tentative",
  "severity": "Low" | "Moderate" | "Severe" | "Critical",
  "symptomsObserved": ["symptom 1", "symptom 2"],
  "microclimateTrigger": "Explanation of how current humidity, temperature, or moisture facilitated this",
  "immediateAction": "Single high-priority action farmer must take in next 24-48 hours",
  "organicRemedies": [
    "Practical low-cost organic remedy suitable for smallholder farmers (e.g. 5% Neem seed kernel extract, wood ash, cow dung slurry, trichoderma, pheromone/sticky traps, manual rogueing)"
  ],
  "chemicalRemedies": [
    "Targeted chemical active ingredient (e.g., Mancozeb, Chlorantraniliprole, Copper oxychloride) with dosage per 15L knapsack tank and pre-harvest interval (PHI)"
  ],
  "preventiveMeasures": [
    "Long-term cultural prevention (crop rotation, spacing, resistant varieties, ditch drainage)"
  ],
  "sprayGuidance": "Safety notes regarding wind, rainfastness, personal protective gear (cloth mask, gloves)",
  "audioSummary": "A concise, encouraging 3-sentence summary in simple spoken English that an extension worker would say out loud to a farmer in their field."
}
`;

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error('Diagnosis error:', error);
    res.status(500).json({
      error: 'Failed to diagnose crop condition',
      details: error.message,
    });
  }
});

// Hyperlocal agronomic advisory generator
app.post('/api/gemini/agri-advisory', async (req, res) => {
  try {
    const { cropName, stage, das, gdd, weather, soil, location, language = 'en' } = req.body;

    const promptText = `
You are a senior agronomist generating a daily hyper-local crop and pest advisory for a smallholder farmer.

Location: ${location?.name || 'Local Farm'} (${location?.lat?.toFixed(2)}°, ${location?.lon?.toFixed(2)}°)
Crop: ${cropName}
Days After Sowing (DAS): ${das} days
Accumulated GDD: ${gdd || 'N/A'} °C-days
Growth Stage: ${stage}

Current Weather & Microclimate:
- Temperature: ${weather?.temperature}°C (Feels like ${weather?.apparentTemperature}°C)
- Relative Humidity: ${weather?.humidity}%
- Dew Point: ${weather?.dewPoint}°C
- Wind Speed: ${weather?.windSpeed} km/h (Gusts: ${weather?.windGusts} km/h)
- 24h Precipitation Forecast: ${weather?.rainSum} mm (Rain probability: ${weather?.rainProb}%)
- Reference ET₀ (Evapotranspiration): ${weather?.et0 || 3.5} mm/day

Soil Conditions:
- Soil Moisture (0-7cm): ${soil?.moistureSurface || 0.24} m³/m³
- Root-zone Moisture (7-28cm): ${soil?.moistureRoot || 0.28} m³/m³
- Soil Temperature (6cm): ${soil?.tempSurface || 22}°C

Language requested: ${language}

Generate a structured JSON response (no markdown backticks, just raw JSON) with:
{
  "summaryTitle": "Catchy, actionable headline for today",
  "todayWorkability": {
    "spraying": "Good" | "Marginal" | "Do Not Spray",
    "sprayingReason": "Specific reason based on wind speed and rain probability",
    "optimalSprayWindow": "e.g., 06:30 - 09:30 AM before winds pick up",
    "irrigation": "Recommended" | "Adequate - Postpone" | "Waterlogged Risk",
    "irrigationAdvice": "Specific volume or hours of pump/furrow run given soil moisture and ET₀",
    "fieldWork": "Favorable" | "Challenging" | "Postpone",
    "fieldWorkReason": "Soil trafficability and weather"
  },
  "stageNutrientInsight": "Exact nutrient/fertilizer timing for ${cropName} at ${stage} stage (e.g. split urea application, micronutrient zinc/boron spray, or avoid nitrogen now)",
  "pestVulnerabilityWarnings": [
    {
      "pestOrDisease": "Pest or disease name",
      "riskLevel": "Low" | "Moderate" | "High" | "Severe",
      "whyNow": "Microclimate reason (e.g., high humidity above 80% + dew duration triggers spore germination)",
      "scoutingTip": "Where on the plant to check today (e.g., underside of lower leaves, central whorl, soil line)",
      "immediateAction": "Low-cost preventive measure or organic spray"
    }
  ],
  "keyAdviceBullets": [
    "Point 1: immediate priority",
    "Point 2: nutrient or water management",
    "Point 3: pest/disease prevention"
  ],
  "audioAdvisoryScript": "A warm, clear 3-4 sentence message written to be read aloud to the farmer over mobile speaker or radio broadcast in ${language}."
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error('Advisory generation error:', error);
    res.status(500).json({
      error: 'Failed to generate agricultural advisory',
      details: error.message,
    });
  }
});

// Agri Extension Chat
app.post('/api/gemini/agri-chat', async (req, res) => {
  try {
    const { messages, context } = req.body;

    const systemInstruction = `
You are AgriGuide Extension Specialist, a friendly, pragmatic agronomist assisting smallholder farmers.
You specialize in low-cost solutions, organic pest control (IPM), soil health, irrigation efficiency, and weather resilience.
Always keep recommendations:
1. Practical and affordable for smallholder farmers (avoid recommending multi-thousand dollar sensors or unobtainable industrial machinery).
2. Quantified: Give dosages (e.g., "30-40ml of Neem oil per 15-liter knapsack sprayer with 5g soap detergent").
3. Direct and clear with safety warnings (e.g., masks, waiting periods before harvesting).
Context: ${JSON.stringify(context || {})}
`;

    // Format chat history
    const contents = (messages || []).map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
      },
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Failed to generate response',
      details: error.message,
    });
  }
});

// Proxy Open-Meteo with caching and high-resolution parameters if needed
app.get('/api/weather-proxy', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_gusts_10m,soil_temperature_0cm,soil_temperature_6cm,soil_temperature_18cm,soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm,soil_moisture_9_to_27cm,et0_fao_evapotranspiration,vapour_pressure_deficit&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,et0_fao_evapotranspiration&timezone=auto&forecast_days=7`;

    const response = await fetch(weatherUrl);
    if (!response.ok) {
      throw new Error(`Open-Meteo returned status ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error('Weather proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch weather data', details: error.message });
  }
});

// Setup Vite middleware in dev or static files in production
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`AgriGuide server running on http://0.0.0.0:${PORT}`);
});
