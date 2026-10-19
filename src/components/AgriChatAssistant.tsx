import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  Volume2,
  VolumeX,
  RotateCcw,
  MessageSquare,
} from 'lucide-react';
import { ProcessedWeatherData, FarmerPlot } from '../types';
import { CROP_PROFILES } from '../data/cropDatabase';

interface AgriChatAssistantProps {
  weather: ProcessedWeatherData;
  plots: FarmerPlot[];
  activePlotId: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  'How do I prepare 5% Neem Seed Kernel Extract (NSKE) for Fall Armyworm?',
  'Can I spray pesticide if rain is forecast in 3 hours?',
  'Why are bottom leaves of my tomato showing concentric brown rings?',
  'What is the best low-cost remedy for whiteflies in cotton?',
  'How do I calculate urea split dosage for 40-day maize?',
];

export const AgriChatAssistant: React.FC<AgriChatAssistantProps> = ({
  weather,
  plots,
  activePlotId,
}) => {
  const activePlot = plots.find((p) => p.id === activePlotId) || plots[0];
  const cropProfile = CROP_PROFILES.find((c) => c.id === activePlot?.cropId);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `Namaste / Hello! I am your AgriGuide AI Agronomist Extension Specialist. I'm monitoring the microclimate in ${weather.location.name} (Temp: ${Math.round(weather.current.temperature)}°C, RH: ${Math.round(weather.current.relativeHumidity)}%, Wind: ${Math.round(weather.current.windSpeed)} km/h). How can I assist your ${cropProfile?.name || 'crop'} field today?`,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsSending(true);

    try {
      const chatHistory = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const contextPayload = {
        farmLocation: weather.location,
        activeCrop: cropProfile?.name,
        weather: {
          temp: weather.current.temperature,
          humidity: weather.current.relativeHumidity,
          dewPoint: weather.current.dewPoint,
          windSpeed: weather.current.windSpeed,
          rain: weather.current.rain,
          soilWaterStatus: weather.derived.soilWaterStatus,
          spraySuitability: weather.derived.spraySuitability,
        },
      };

      const res = await fetch('/api/gemini/agri-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatHistory,
          context: contextPayload,
        }),
      });

      if (!res.ok) throw new Error('Chat failed');
      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-reply`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-err`,
          role: 'assistant',
          content: 'Sorry, I had trouble reaching the agronomy service. Please check your internet connection or try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleToggleSpeak = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (currentlySpeakingId === msgId) {
      window.speechSynthesis.cancel();
      setCurrentlySpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onend = () => setCurrentlySpeakingId(null);
    utterance.onerror = () => setCurrentlySpeakingId(null);
    window.speechSynthesis.speak(utterance);
    setCurrentlySpeakingId(msgId);
  };

  const handleResetChat = () => {
    window.speechSynthesis?.cancel();
    setCurrentlySpeakingId(null);
    setMessages([
      {
        id: 'init-fresh',
        role: 'assistant',
        content: `Chat reset. Ask me anything about pest control, weather windows, tank mixing, or fertilizer timing for ${cropProfile?.name || 'your farm'}!`,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl shadow-xl flex flex-col h-[750px] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-stone-800 bg-stone-950/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-stone-100 text-sm sm:text-base flex items-center gap-2">
              <span>AgriSense Extension Specialist</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h3>
            <p className="text-xs text-stone-400">
              Live context: {weather.location.name} • {cropProfile?.name} • Delta T: {weather.derived.deltaT}°C
            </p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg text-xs flex items-center gap-1 transition-colors"
          title="Reset conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const isSpeaking = currentlySpeakingId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs sm:text-sm ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-sm space-y-2 ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-stone-950/90 border border-stone-800 text-stone-200 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>

                {!isUser && (
                  <div className="flex items-center justify-between pt-1 border-t border-stone-800/60 text-[10px] text-stone-400">
                    <span>AI Agronomy Model</span>
                    <button
                      onClick={() => handleToggleSpeak(msg.id, msg.content)}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
                        isSpeaking
                          ? 'bg-amber-500/20 text-amber-300 font-bold'
                          : 'hover:text-stone-200 hover:bg-stone-800'
                      }`}
                    >
                      {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-emerald-400" />}
                      <span>{isSpeaking ? 'Stop' : 'Read Aloud'}</span>
                    </button>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-full bg-stone-800 border border-stone-700 text-stone-300 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isSending && (
          <div className="flex gap-3 text-xs text-stone-400 items-center">
            <div className="w-7 h-7 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 bg-stone-950 border border-stone-800 rounded-2xl flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              <span>Agronomist reviewing crop &amp; weather parameters...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="px-4 py-2 bg-stone-950/60 border-t border-stone-800/80 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
        <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span>Quick Ask:</span>
        </span>
        {SUGGESTED_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-emerald-500/40 text-stone-300 hover:text-stone-100 text-xs shrink-0 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 sm:p-4 bg-stone-950 border-t border-stone-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Ask anything about pests, fertilizers, spray timing for ${cropProfile?.name || 'crops'}...`}
          className="flex-1 px-4 py-2.5 bg-stone-900 border border-stone-700 rounded-xl text-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-stone-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isSending}
          className="p-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl transition-all shadow-md shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
