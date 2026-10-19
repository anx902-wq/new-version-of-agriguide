import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  Loader2,
  AlertOctagon,
  CheckCircle2,
  Volume2,
  VolumeX,
  FileText,
  RotateCcw,
  ShieldCheck,
  Bug,
  HelpCircle,
} from 'lucide-react';
import { CropDiagnosisResult, ProcessedWeatherData, FarmerPlot } from '../types';
import { CROP_PROFILES } from '../data/cropDatabase';

interface CropScannerProps {
  weather: ProcessedWeatherData;
  plots: FarmerPlot[];
  activePlotId: string;
}

// Preset diseased leaf samples for instant testing
const SAMPLE_DISEASE_CASES = [
  {
    id: 'sample-faw',
    title: 'Maize: Fall Armyworm Damage',
    crop: 'maize',
    symptom: 'Ragged holes in leaf whorl, yellowish sawdust frass inside funnel, skeletonized leaves',
    imgUrl: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'sample-lateblight',
    title: 'Tomato: Late Blight Lesions',
    crop: 'tomato',
    symptom: 'Water-soaked dark brown expanding lesions, white delicate mildew on leaf undersides, wilting',
    imgUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23d9a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'sample-blast',
    title: 'Rice: Blast Spindle Spots',
    crop: 'rice',
    symptom: 'Spindle-shaped diamond lesions with gray-ash centers and dark reddish margins on leaf blades',
    imgUrl: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'sample-whitefly',
    title: 'Cotton: Whitefly & Leaf Curl',
    crop: 'cotton',
    symptom: 'Upward leaf curling, thick veins, sticky honeydew with black sooty mold, tiny white flying bugs',
    imgUrl: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=600&q=80',
  },
];

export const CropScanner: React.FC<CropScannerProps> = ({ weather, plots, activePlotId }) => {
  const activePlot = plots.find((p) => p.id === activePlotId) || plots[0];
  const [selectedCrop, setSelectedCrop] = useState<string>(activePlot?.cropId || 'maize');
  const [symptomsText, setSymptomsText] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<CropDiagnosisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (JPG, PNG, or WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result as string);
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: typeof SAMPLE_DISEASE_CASES[0]) => {
    setSelectedCrop(sample.crop);
    setSymptomsText(sample.symptom);
    setPreviewImage(sample.imgUrl);
    setDiagnosis(null);
    setErrorMsg(null);
  };

  const handleRunDiagnosis = async () => {
    if (!previewImage && !symptomsText.trim()) {
      setErrorMsg('Please snap/upload a leaf photo or describe symptoms observed in your field.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);
    setDiagnosis(null);

    try {
      const cropMeta = CROP_PROFILES.find((c) => c.id === selectedCrop);
      const res = await fetch('/api/gemini/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: previewImage?.startsWith('data:') ? previewImage : undefined,
          cropName: cropMeta?.name || selectedCrop,
          symptoms: symptomsText,
          stage: 'Active vegetative to reproductive stage',
          locationName: weather.location.name,
          weatherSummary: `Temp: ${weather.current.temperature}°C, RH: ${weather.current.relativeHumidity}%, Rain: ${weather.current.rain}mm, Dew duration: ${weather.derived.dewDurationHours} hrs`,
        }),
      });

      if (!res.ok) {
        throw new Error('Server returned an error diagnosing crop condition.');
      }

      const result: CropDiagnosisResult = await res.json();
      setDiagnosis(result);
    } catch (err: any) {
      console.error('Diagnosis failed:', err);
      setErrorMsg('Could not complete diagnosis. Please verify your connection or try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleToggleVoicePlayback = () => {
    if (!diagnosis) return;
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this device/browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const speechText =
      diagnosis.audioSummary ||
      `Diagnosis is ${diagnosis.pestOrDisease}. Severity is ${diagnosis.severity}. Immediate action: ${diagnosis.immediateAction}. Recommended organic remedy: ${diagnosis.organicRemedies[0] || 'Apply 5% neem extract'}.`;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 0.95;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const severityBadgeClass = {
    Low: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    Moderate: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    Severe: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    Critical: 'bg-red-600/30 text-red-200 border-red-500 shadow-md animate-pulse',
  }[diagnosis?.severity || 'Moderate'];

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-stone-100">
            AI Crop Leaf &amp; Pest Vision Scanner
          </h2>
        </div>
        <p className="text-xs text-stone-400 mt-1">
          Instant multi-modal diagnosis powered by Gemini Vision &amp; smallholder Integrated Pest Management (IPM) agronomy
        </p>

        {/* Preset Sample Quick-Pick Chips */}
        <div className="mt-4 pt-3 border-t border-stone-800">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-2">
            Or test with real smallholder field sample cases:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {SAMPLE_DISEASE_CASES.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className="p-2.5 rounded-xl bg-stone-950/80 hover:bg-stone-800 border border-stone-800 hover:border-emerald-500/40 text-left transition-all group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {CROP_PROFILES.find((c) => c.id === sample.crop)?.icon || '🌿'}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-stone-200 truncate group-hover:text-emerald-300">
                      {sample.title}
                    </p>
                    <p className="text-[10px] text-stone-500 truncate">{sample.symptom}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Grid: Camera / Image & Symptom Description */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Photo Upload & Preview */}
        <div className="lg:col-span-5 bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-300">Leaf / Stem / Bug Photo</span>
              {previewImage && (
                <button
                  onClick={() => setPreviewImage(null)}
                  className="text-[11px] text-stone-400 hover:text-stone-200 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              capture="environment"
              className="hidden"
            />

            {previewImage ? (
              <div className="relative rounded-xl overflow-hidden border border-stone-700 aspect-video sm:aspect-square bg-stone-950 flex items-center justify-center">
                <img
                  src={previewImage}
                  alt="Crop preview"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/75 hover:bg-black text-stone-200 text-xs font-medium rounded-lg backdrop-blur-sm transition-all border border-stone-700"
                >
                  Change Photo
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-stone-700 hover:border-emerald-500/60 rounded-xl p-8 text-center cursor-pointer bg-stone-950/40 hover:bg-stone-950 transition-all flex flex-col items-center justify-center aspect-video sm:aspect-square"
              >
                <div className="p-3 bg-stone-900 rounded-full border border-stone-800 text-emerald-400 mb-3">
                  <Camera className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-stone-200">Tap to Snap Photo with Camera</p>
                <p className="text-[11px] text-stone-400 mt-1">or click to browse from gallery</p>
                <span className="mt-3 px-2.5 py-1 text-[10px] font-mono text-stone-500 bg-stone-900 rounded-md">
                  Supports JPG, PNG, WebP
                </span>
              </div>
            )}
          </div>

          <p className="text-[11px] text-stone-500 mt-4 italic">
            Tip: Photograph leaves in morning shade; include both green tissue and infected edges.
          </p>
        </div>

        {/* Right column: Crop Selection & Symptom Details */}
        <div className="lg:col-span-7 bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-md flex flex-col justify-between space-y-4">
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-400 font-semibold mb-1.5">Selected Crop</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CROP_PROFILES.slice(0, 8).map((crop) => (
                  <button
                    key={crop.id}
                    type="button"
                    onClick={() => setSelectedCrop(crop.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                      selectedCrop === crop.id
                        ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200 shadow-sm'
                        : 'bg-stone-950 border-stone-800 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <span className="text-lg">{crop.icon}</span>
                    <span className="font-semibold truncate">{crop.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-stone-400 font-semibold mb-1.5">
                Describe Observed Symptoms in Field (Optional if photo attached):
              </label>
              <textarea
                rows={3}
                value={symptomsText}
                onChange={(e) => setSymptomsText(e.target.value)}
                placeholder="e.g. Yellow concentric rings on lower leaves, powdery white coating on leaf undersides, chewed whorl with yellow frass..."
                className="w-full p-3 bg-stone-950 border border-stone-700 rounded-xl text-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-stone-500"
              />
            </div>

            {/* Microclimate context notice */}
            <div className="p-3 bg-stone-950/70 border border-stone-800 rounded-xl text-[11px] text-stone-400 flex items-center justify-between">
              <div>
                Microclimate context: <strong className="text-stone-200">{weather.location.name}</strong> •
                Temp: {weather.current.temperature.toFixed(0)}°C • RH: {weather.current.relativeHumidity.toFixed(0)}% • Dew: {weather.derived.dewDurationHours}h
              </div>
              <span className="text-emerald-400 text-[10px] font-mono">Auto-Attached</span>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-xs text-red-200">
              {errorMsg}
            </div>
          )}

          <button
            onClick={handleRunDiagnosis}
            disabled={isAnalyzing}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI Agronomist Diagnosing Pathogen...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Real-Time AI Diagnosis</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Diagnosis Results Card */}
      {diagnosis && (
        <div className="bg-stone-900 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {diagnosis.category}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${severityBadgeClass}`}>
                  {diagnosis.severity} Severity
                </span>
                <span className="text-xs font-mono text-stone-400">
                  Confidence: <strong className="text-stone-200">{diagnosis.confidenceScore}% ({diagnosis.confidence})</strong>
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-stone-100 mt-2">
                {diagnosis.pestOrDisease}
              </h3>
            </div>

            <button
              onClick={handleToggleVoicePlayback}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 self-start sm:self-auto ${
                isPlayingAudio
                  ? 'bg-amber-600 text-white border-amber-500 shadow-md animate-pulse'
                  : 'bg-stone-800 hover:bg-stone-750 text-stone-200 border-stone-700'
              }`}
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              <span>{isPlayingAudio ? 'Stop Reading' : 'Listen to Diagnosis'}</span>
            </button>
          </div>

          {/* Immediate Action Alert Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 to-stone-950 border border-emerald-500/50 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                Immediate Action (Next 24-48 Hours):
              </span>
              <p className="text-sm font-semibold text-stone-100 mt-0.5">
                {diagnosis.immediateAction}
              </p>
            </div>
          </div>

          {/* Microclimate trigger insight */}
          <div className="p-3 bg-stone-950/70 border border-stone-800 rounded-xl text-xs text-stone-300">
            <strong className="text-amber-400">Microclimate Trigger: </strong>
            <span>{diagnosis.microclimateTrigger}</span>
          </div>

          {/* Solutions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Low cost organic IPM */}
            <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-2">
              <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Smallholder Organic Remedies (IPM)</span>
              </span>
              <ul className="space-y-1.5 text-stone-200">
                {diagnosis.organicRemedies.map((remedy, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span className="leading-relaxed">{remedy}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Targeted chemical options */}
            <div className="p-4 bg-stone-950 border border-stone-800 rounded-xl space-y-2">
              <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Targeted Chemical Options (Knapsack Dilution)</span>
              </span>
              <ul className="space-y-1.5 text-stone-300">
                {diagnosis.chemicalRemedies.map((chem, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400">⚡</span>
                    <span className="leading-relaxed">{chem}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 text-[11px] text-stone-400 border-t border-stone-800">
                <strong className="text-stone-300">Safe Spraying: </strong>
                {diagnosis.sprayGuidance}
              </div>
            </div>
          </div>

          {/* Cultural & Preventive Measures */}
          {diagnosis.preventiveMeasures?.length > 0 && (
            <div className="p-4 bg-stone-950/60 border border-stone-800 rounded-xl text-xs space-y-2">
              <span className="text-stone-400 font-semibold uppercase tracking-wider text-[11px]">
                Long-Term Cultural Prevention:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-300">
                {diagnosis.preventiveMeasures.map((prev, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400">•</span>
                    <span>{prev}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
