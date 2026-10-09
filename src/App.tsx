/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Instagram, 
  Video, 
  Layers, 
  Car, 
  Users, 
  MapPin, 
  DollarSign, 
  Euro, 
  Calculator,
  TrendingUp,
  Hash,
  Eye,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Film,
  Zap,
  Check
} from 'lucide-react';
import { 
  calculateInstagramValues, 
  calculateTikTokValue, 
  calculatePack,
  calculateAutoFormulation,
  AutoFormulationPreset,
  AutoFormulationResult
} from './lib/calculator';
import { TRACK_NAMES } from './lib/tracks';

export default function App() {
  // Section 1: Instagram Inputs
  const [igFollowers, setIgFollowers] = useState<number>(0);
  const [igEngagement, setIgEngagement] = useState<number>(0);

  // Section 1: TikTok Inputs
  const [ttFollowers, setTtFollowers] = useState<number>(0);
  const [ttViews, setTtViews] = useState<number>(0);
  const [ttEngagement, setTtEngagement] = useState<number>(0);

  // Section 2: Quantities
  const [qtyStories, setQtyStories] = useState<number>(0);
  const [qtyPost, setQtyPost] = useState<number>(0);
  const [qtyReel, setQtyReel] = useState<number>(0);
  const [qtyTikTok, setQtyTikTok] = useState<number>(0);

  // Auto-formulation state
  const [autoProspect, setAutoProspect] = useState<AutoFormulationResult | null>(null);
  const [activePreset, setActivePreset] = useState<AutoFormulationPreset>('balanced');
  const [autoNotice, setAutoNotice] = useState<string | null>(null);
  const [isManuallyAdjusted, setIsManuallyAdjusted] = useState<boolean>(false);

  // Section 3: Pack Converter
  const [selectedTrack, setSelectedTrack] = useState<string>(TRACK_NAMES[0]);
  const [numGuests, setNumGuests] = useState<number>(0);
  const [factor, setFactor] = useState<number>(4);

  // Calculations
  const igValues = useMemo(() => calculateInstagramValues(igFollowers, igEngagement), [igFollowers, igEngagement]);
  const ttValue = useMemo(() => calculateTikTokValue(ttFollowers, ttViews, ttEngagement), [ttFollowers, ttViews, ttEngagement]);

  const totalEur = useMemo(() => {
    return (qtyStories * igValues.stories) + 
           (qtyPost * igValues.post) + 
           (qtyReel * igValues.reel) + 
           (qtyTikTok * ttValue);
  }, [qtyStories, qtyPost, qtyReel, qtyTikTok, igValues, ttValue]);

  const packResults = useMemo(() => calculatePack(totalEur, selectedTrack, numGuests, factor), [totalEur, selectedTrack, numGuests, factor]);

  const formatCurrency = (val: number) => {
    return val.toLocaleString("it-IT", { 
      style: "currency", 
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  };

  // Formulazione automatica
  const handleAutoFormulate = (preset: AutoFormulationPreset = activePreset) => {
    if (igFollowers <= 0 && ttFollowers <= 0) {
      setAutoNotice("Inserisci prima i dati di Instagram o TikTok nella Sezione 01 per elaborare la formulazione automatica.");
      return;
    }

    setAutoNotice(null);
    setActivePreset(preset);
    const result = calculateAutoFormulation(
      igFollowers,
      igEngagement,
      igValues,
      ttFollowers,
      ttViews,
      ttEngagement,
      ttValue,
      preset
    );

    setQtyStories(result.stories);
    setQtyPost(result.post);
    setQtyReel(result.reel);
    setQtyTikTok(result.tiktok);
    setAutoProspect(result);
    setIsManuallyAdjusted(false);
  };

  const handleResetQuantities = () => {
    setQtyStories(0);
    setQtyPost(0);
    setQtyReel(0);
    setQtyTikTok(0);
    setAutoProspect(null);
    setIsManuallyAdjusted(false);
    setAutoNotice(null);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans p-4 md:p-8 relative overflow-x-hidden">
      {/* Checkered Flag Decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-checkered opacity-10 pointer-events-none -mr-12 -mt-12 transform rotate-12" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#2A2A2A] pb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white flex items-center gap-3 uppercase italic">
              <Car className="text-[#FF2D2D] w-10 h-10" />
              We Can Race <span className="text-[#FFD000]">Calculator</span>
            </h1>
            <p className="text-slate-100 mt-2 font-bold tracking-wide">PERFORMANCE CONTENT VALUATION & TRACK CONVERTER</p>
          </div>
          <div className="bg-[#1E1E1E] p-6 rounded-xl shadow-2xl border border-[#333333] flex items-center gap-6 group hover:border-[#FF2D2D] transition-colors duration-300">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-200 uppercase tracking-[0.2em]">Valore Totale</span>
              <span className="text-4xl font-black text-[#FFD000] drop-shadow-[0_0_10px_rgba(255,208,0,0.3)]">
                {formatCurrency(totalEur)}
              </span>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Section 1: Valori Contenuti */}
          <div className="lg:col-span-8 space-y-10">
            <section id="valori-contenuti" className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-[#FF2D2D]" />
                <h2 className="text-2xl font-black uppercase tracking-tight italic">01. Valori Contenuti</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Instagram Card */}
                <div className="bg-[#1E1E1E] rounded-xl shadow-xl border border-[#333333] overflow-hidden group hover:border-[#FF2D2D]/50 transition-all duration-300">
                  <div className="bg-gradient-to-r from-[#FF2D2D] to-[#FFD000] p-1" />
                  <div className="p-6 space-y-6">
                    <div className="flex items-center gap-2 text-white mb-4">
                      <Instagram className="w-5 h-5 text-[#FFD000]" />
                      <span className="font-black uppercase tracking-widest text-sm">Instagram</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-200 uppercase tracking-widest">Followers</label>
                        <input 
                          type="number" 
                          value={igFollowers || ''} 
                          onChange={(e) => setIgFollowers(Math.max(0, Number(e.target.value)))}
                          placeholder="0"
                          className="w-full bg-[#121212] border border-[#333333] rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-[#FF2D2D] focus:border-[#FF2D2D] outline-none transition-all font-bold placeholder:text-slate-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-200 uppercase tracking-widest">Engagement %</label>
                        <input 
                          type="number" 
                          step="0.1"
                          value={igEngagement || ''} 
                          onChange={(e) => setIgEngagement(Math.max(0, Number(e.target.value)))}
                          placeholder="0"
                          className="w-full bg-[#121212] border border-[#333333] rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-[#FF2D2D] focus:border-[#FF2D2D] outline-none transition-all font-bold placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <div className="pt-6 border-t border-[#333333] space-y-3">
                      <div className="flex items-center justify-between p-4 bg-[#121212] rounded-lg border border-transparent hover:border-[#333333] transition-colors">
                        <span className="text-xs font-bold text-slate-100 uppercase tracking-widest">Stories</span>
                        <span className="text-xl font-black text-white">{formatCurrency(igValues.stories)}</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-[#121212] rounded-lg border border-transparent hover:border-[#333333] transition-colors">
                        <span className="text-xs font-bold text-slate-100 uppercase tracking-widest">Post</span>
                        <span className="text-xl font-black text-white">{formatCurrency(igValues.post)}</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-[#121212] rounded-lg border border-transparent hover:border-[#333333] transition-colors">
                        <span className="text-xs font-bold text-slate-100 uppercase tracking-widest">Reel</span>
                        <span className="text-xl font-black text-white">{formatCurrency(igValues.reel)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TikTok Card */}
                <div className="bg-[#1E1E1E] rounded-xl shadow-xl border border-[#333333] overflow-hidden group hover:border-[#FFD000]/50 transition-all duration-300">
                  <div className="bg-white p-1" />
                  <div className="p-6 space-y-6">
                    <div className="flex items-center gap-2 text-white mb-4">
                      <Video className="w-5 h-5 text-[#FFD000]" />
                      <span className="font-black uppercase tracking-widest text-sm">TikTok</span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-200 uppercase tracking-widest">Followers</label>
                        <input 
                          type="number" 
                          value={ttFollowers || ''} 
                          onChange={(e) => setTtFollowers(Math.max(0, Number(e.target.value)))}
                          placeholder="0"
                          className="w-full bg-[#121212] border border-[#333333] rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-[#FFD000] focus:border-[#FFD000] outline-none transition-all font-bold placeholder:text-slate-400"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-200 uppercase tracking-widest">Media Views</label>
                          <input 
                            type="number" 
                            value={ttViews || ''} 
                            onChange={(e) => setTtViews(Math.max(0, Number(e.target.value)))}
                            placeholder="0"
                            className="w-full bg-[#121212] border border-[#333333] rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-[#FFD000] focus:border-[#FFD000] outline-none transition-all font-bold placeholder:text-slate-400"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-200 uppercase tracking-widest">Engagement %</label>
                          <input 
                            type="number" 
                            step="0.1"
                            value={ttEngagement || ''} 
                            onChange={(e) => setTtEngagement(Math.max(0, Number(e.target.value)))}
                            placeholder="0"
                            className="w-full bg-[#121212] border border-[#333333] rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-[#FFD000] focus:border-[#FFD000] outline-none transition-all font-bold placeholder:text-slate-400"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-[#333333]">
                      <div className="flex items-center justify-between p-4 bg-[#121212] rounded-lg border border-transparent hover:border-[#333333] transition-colors">
                        <span className="text-xs font-bold text-slate-100 uppercase tracking-widest">Valore TikTok</span>
                        <span className="text-xl font-black text-white">{formatCurrency(ttValue)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Composizione Contenuti */}
            <section id="composizione" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-[#FFD000]" />
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight italic">02. Configurazione Contenuti</h2>
                    <p className="text-xs text-slate-200 font-medium">Definisci i deliverable o calcola il mix ottimale</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAutoFormulate(activePreset)}
                    className="group relative px-4 py-2.5 bg-gradient-to-r from-[#FF2D2D] via-[#FF5500] to-[#FFD000] text-black font-black text-xs uppercase tracking-wider rounded-lg shadow-lg hover:shadow-[0_0_20px_rgba(255,45,45,0.45)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-[#FFD000]/40"
                  >
                    <Sparkles className="w-4 h-4 fill-black text-black animate-pulse" />
                    <span>Formulazione Automatica</span>
                  </button>

                  {(qtyStories > 0 || qtyPost > 0 || qtyReel > 0 || qtyTikTok > 0) && (
                    <button
                      onClick={handleResetQuantities}
                      title="Azzera contenuti"
                      className="p-2.5 bg-[#141414] hover:bg-[#222222] border border-[#333333] hover:border-slate-400 text-slate-200 hover:text-white rounded-lg transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Alert notice if no metrics present */}
              {autoNotice && (
                <div className="p-4 bg-amber-950/70 border border-amber-500/60 rounded-xl flex items-center justify-between gap-3 text-amber-100 text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[#FFD000] shrink-0" />
                    <span>{autoNotice}</span>
                  </div>
                  <button 
                    onClick={() => setAutoNotice(null)} 
                    className="text-amber-300 hover:text-white underline text-[11px] cursor-pointer"
                  >
                    Chiudi
                  </button>
                </div>
              )}

              {/* Prospetto Strategico Panel (quando formulazione automatica attiva) */}
              {autoProspect && (
                <div className="bg-gradient-to-b from-[#222222] to-[#1A1A1A] rounded-xl shadow-2xl border-2 border-[#FFD000]/40 overflow-hidden relative transition-all">
                  <div className="bg-[#121212] px-6 py-4 border-b border-[#333333] flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD000] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF2D2D]"></span>
                      </span>
                      <div>
                        <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#FFD000] flex items-center gap-2">
                          Prospetto Strategico Consigliato
                        </span>
                        <p className="text-xs text-slate-200 font-medium">Calcolato in base al valore dell'influencer</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase px-3 py-1 bg-[#121212] border border-[#FF2D2D]/60 text-white rounded-full">
                        {autoProspect.influencerTier}
                      </span>
                      {isManuallyAdjusted && (
                        <span className="text-[10px] font-bold uppercase px-2.5 py-1 bg-amber-500/20 border border-amber-500/50 text-amber-300 rounded-full">
                          Personalizzato a mano
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Strategy presets switch */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Variante Strategia:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {(['balanced', 'video_focus', 'essential'] as AutoFormulationPreset[]).map((presetKey) => {
                          const labels: Record<AutoFormulationPreset, string> = {
                            balanced: '🏎️ Bilanciato (Event Day)',
                            video_focus: '📹 Focus Video & Reach',
                            essential: '⚡ Pack Essenziale'
                          };
                          const isCurrent = activePreset === presetKey;
                          return (
                            <button
                              key={presetKey}
                              onClick={() => handleAutoFormulate(presetKey)}
                              className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all text-left flex items-center justify-between cursor-pointer ${
                                isCurrent
                                  ? 'bg-[#FF2D2D]/20 border-[#FF2D2D] text-white shadow-[0_0_12px_rgba(255,45,45,0.25)]'
                                  : 'bg-[#141414] border-[#333333] text-slate-200 hover:text-white hover:border-slate-500'
                              }`}
                            >
                              <span>{labels[presetKey]}</span>
                              {isCurrent && <Check className="w-3.5 h-3.5 text-[#FFD000]" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Breakdown cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      {/* Stories */}
                      <div className="bg-[#141414] border border-[#333333] rounded-lg p-3.5 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">Stories</span>
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-[#FF2D2D]/20 text-[#FF2D2D] rounded">Priorità Alta</span>
                        </div>
                        <div className="text-2xl font-black text-white">{autoProspect.stories} <span className="text-xs text-slate-400 font-bold">storie</span></div>
                        <p className="text-[11px] text-slate-300 leading-tight">Sequenza cronaca evento in pista (facili da produrre)</p>
                      </div>

                      {/* Reel */}
                      <div className="bg-[#141414] border border-[#333333] rounded-lg p-3.5 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">Reel</span>
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-[#FFD000]/20 text-[#FFD000] rounded">Hero Content</span>
                        </div>
                        <div className="text-2xl font-black text-white">{autoProspect.reel} <span className="text-xs text-slate-400 font-bold">video</span></div>
                        <p className="text-[11px] text-slate-300 leading-tight">Massima visibilità virale della supercar</p>
                      </div>

                      {/* Post */}
                      <div className="bg-[#141414] border border-[#333333] rounded-lg p-3.5 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">Post Feed</span>
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-slate-800 text-slate-300 rounded">Statico</span>
                        </div>
                        <div className="text-2xl font-black text-white">{autoProspect.post} <span className="text-xs text-slate-400 font-bold">post</span></div>
                        <p className="text-[11px] text-slate-300 leading-tight">
                          {autoProspect.post > 0 ? 'Foto/carosello permanente' : 'Non richiesto (priorità video e stories)'}
                        </p>
                      </div>

                      {/* TikTok */}
                      <div className="bg-[#141414] border border-[#333333] rounded-lg p-3.5 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">TikTok</span>
                          {autoProspect.tikTokStatus === 'included' ? (
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded">Incluso</span>
                          ) : (
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-slate-800 text-slate-400 rounded">Escluso</span>
                          )}
                        </div>
                        <div className="text-2xl font-black text-white">{autoProspect.tiktok} <span className="text-xs text-slate-400 font-bold">video</span></div>
                        <p className="text-[11px] text-slate-300 leading-tight">
                          {autoProspect.tikTokStatus === 'included' 
                            ? 'Ottimi risultati video rilevati' 
                            : autoProspect.tikTokStatus === 'excluded_low_metrics'
                              ? 'Escluso: metriche sotto soglia'
                              : 'Account TikTok non configurato'}
                        </p>
                      </div>
                    </div>

                    {/* Strategic Rationale note */}
                    <div className="p-4 bg-[#141414] border border-[#333333] rounded-lg space-y-2">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#FFD000]">
                        <Zap className="w-3.5 h-3.5 text-[#FFD000]" />
                        <span>Logica di Formulazione</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-normal">
                        {autoProspect.rationale}
                      </p>
                      <p className="text-xs text-slate-300 font-normal border-t border-[#262626] pt-2">
                        {autoProspect.tikTokReason}
                      </p>
                    </div>

                    {isManuallyAdjusted && (
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-amber-300 font-semibold flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-amber-400" />
                          Hai modificato manualmente i valori rispetto al prospetto calcolato.
                        </span>
                        <button
                          onClick={() => handleAutoFormulate(activePreset)}
                          className="text-[#FFD000] hover:text-white underline font-bold cursor-pointer"
                        >
                          Ripristina proposta automatica
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Form Input Quantities */}
              <div className="bg-[#1E1E1E] rounded-xl shadow-xl border border-[#333333] p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-300">
                    Quantitativi Contenuti {autoProspect && !isManuallyAdjusted ? '(Calcolati automaticamente)' : '(Modificabili a mano)'}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-200 uppercase tracking-widest flex items-center justify-between">
                      <span>Stories Qty</span>
                      {autoProspect && autoProspect.stories > 0 && (
                        <span className="text-[9px] text-[#FF2D2D] font-black tracking-normal">Consigliate {autoProspect.stories}</span>
                      )}
                    </label>
                    <input 
                      type="number" 
                      value={qtyStories || ''} 
                      onChange={(e) => {
                        setQtyStories(Math.max(0, Math.floor(Number(e.target.value))));
                        if (autoProspect) setIsManuallyAdjusted(true);
                      }}
                      placeholder="0"
                      className="w-full bg-[#121212] border border-[#333333] rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-[#FF2D2D] outline-none font-bold"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-200 uppercase tracking-widest flex items-center justify-between">
                      <span>Post Qty</span>
                      {autoProspect && (
                        <span className="text-[9px] text-slate-400 font-black tracking-normal">Consigliati {autoProspect.post}</span>
                      )}
                    </label>
                    <input 
                      type="number" 
                      value={qtyPost || ''} 
                      onChange={(e) => {
                        setQtyPost(Math.max(0, Math.floor(Number(e.target.value))));
                        if (autoProspect) setIsManuallyAdjusted(true);
                      }}
                      placeholder="0"
                      className="w-full bg-[#121212] border border-[#333333] rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-[#FF2D2D] outline-none font-bold"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-200 uppercase tracking-widest flex items-center justify-between">
                      <span>Reel Qty</span>
                      {autoProspect && autoProspect.reel > 0 && (
                        <span className="text-[9px] text-[#FFD000] font-black tracking-normal">Consigliati {autoProspect.reel}</span>
                      )}
                    </label>
                    <input 
                      type="number" 
                      value={qtyReel || ''} 
                      onChange={(e) => {
                        setQtyReel(Math.max(0, Math.floor(Number(e.target.value))));
                        if (autoProspect) setIsManuallyAdjusted(true);
                      }}
                      placeholder="0"
                      className="w-full bg-[#121212] border border-[#333333] rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-[#FF2D2D] outline-none font-bold"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-200 uppercase tracking-widest flex items-center justify-between">
                      <span>TikTok Qty</span>
                      {autoProspect && (
                        <span className="text-[9px] text-emerald-400 font-black tracking-normal">Consigliati {autoProspect.tiktok}</span>
                      )}
                    </label>
                    <input 
                      type="number" 
                      value={qtyTikTok || ''} 
                      onChange={(e) => {
                        setQtyTikTok(Math.max(0, Math.floor(Number(e.target.value))));
                        if (autoProspect) setIsManuallyAdjusted(true);
                      }}
                      placeholder="0"
                      className="w-full bg-[#121212] border border-[#333333] rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-[#FF2D2D] outline-none font-bold"
                    />
                  </div>
                </div>
                
                <div className="mt-10 p-8 bg-[#121212] rounded-xl border border-[#333333] flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-[#FFD000] transition-all duration-500">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-[#FFD000] rounded-lg text-black">
                      <Calculator className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black uppercase italic text-white">Riepilogo Asset</h3>
                      <p className="text-xs text-slate-200 font-bold tracking-widest">VALUTAZIONE TOTALE IN EURO</p>
                    </div>
                  </div>
                  <div className="text-5xl font-black text-[#FFD000] drop-shadow-[0_0_15px_rgba(255,208,0,0.2)]">
                    {formatCurrency(totalEur)}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Section 3: Convertitore Pack (Sidebar on Large) */}
          <div className="lg:col-span-4">
            <section id="convertitore-pack" className="sticky top-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-[#FF2D2D]" />
                <h2 className="text-2xl font-black uppercase tracking-tight italic">03. Track Converter</h2>
              </div>
              
              <div className="bg-[#1E1E1E] rounded-xl shadow-2xl border border-[#333333] overflow-hidden">
                <div className="bg-[#FF2D2D] p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-checkered opacity-10 -mr-8 -mt-8" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Budget Experience</span>
                      <Euro className="w-5 h-5 opacity-80" />
                    </div>
                    <div className="text-5xl font-black drop-shadow-lg">{formatCurrency(totalEur)}</div>
                  </div>
                </div>
                
                <div className="p-8 space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-200 uppercase tracking-widest flex items-center gap-2">
                      <Layers className="w-3 h-3 text-[#FF2D2D]" /> Strategia
                    </label>
                    <select 
                      value={factor}
                      onChange={(e) => setFactor(Number(e.target.value))}
                      className="w-full bg-[#121212] border border-[#333333] rounded-lg px-4 py-4 text-white focus:ring-1 focus:ring-[#FF2D2D] outline-none appearance-none cursor-pointer font-bold"
                    >
                      <option value={4}>Verticalizzato</option>
                      <option value={5}>Target adiacente</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-200 uppercase tracking-widest flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-[#FF2D2D]" /> Circuito
                    </label>
                    <select 
                      value={selectedTrack}
                      onChange={(e) => setSelectedTrack(e.target.value)}
                      className="w-full bg-[#121212] border border-[#333333] rounded-lg px-4 py-4 text-white focus:ring-1 focus:ring-[#FF2D2D] outline-none appearance-none cursor-pointer font-bold"
                    >
                      {TRACK_NAMES.map(track => (
                        <option key={track} value={track}>{track}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-200 uppercase tracking-widest flex items-center gap-2">
                      <Users className="w-3 h-3 text-[#FF2D2D]" /> Ospiti Extra
                    </label>
                    <input 
                      type="number" 
                      value={numGuests || ''} 
                      onChange={(e) => setNumGuests(Math.max(0, Math.floor(Number(e.target.value))))}
                      placeholder="0"
                      className="w-full bg-[#121212] border border-[#333333] rounded-lg px-4 py-4 text-white focus:ring-1 focus:ring-[#FF2D2D] outline-none font-bold"
                    />
                  </div>

                  <div className="space-y-4 pt-6 border-t border-[#333333]">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                      <span className="text-slate-200">Base Pista</span>
                      <span className="text-white">{formatCurrency(packResults.trackBasePrice)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                      <span className="text-slate-200">Costo Ospiti</span>
                      <span className="text-white">{formatCurrency(packResults.guestsCost)}</span>
                    </div>
                    <div className="flex justify-between items-center p-5 bg-[#121212] rounded-lg border border-[#333333]">
                      <span className="text-xs font-black text-slate-200 uppercase tracking-widest">Pack Unitario</span>
                      <span className="text-xl font-black text-[#FFD000]">{formatCurrency(packResults.packUnitCost)}</span>
                    </div>
                  </div>

                  <div className="pt-8">
                    <div className="bg-gradient-to-br from-[#1E1E1E] to-[#121212] border border-[#333333] rounded-xl p-8 text-center space-y-4 relative group hover:border-[#FF2D2D] transition-all duration-500">
                      <div className="absolute inset-0 bg-[#FF2D2D]/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                      <span className="text-[10px] font-black text-[#FF2D2D] uppercase tracking-[0.4em] block">Giri Totali Disponibili</span>
                      <div className="text-8xl font-black text-white leading-none drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                        {packResults.laps}
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-px w-8 bg-[#333333]" />
                        <span className="text-[10px] font-bold text-slate-200 uppercase tracking-widest">Race Mode Active</span>
                        <div className="h-px w-8 bg-[#333333]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-20 pt-10 border-t border-[#2A2A2A] text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-px bg-[#2A2A2A]" />
            <Car className="w-6 h-6 text-[#FF2D2D]" />
            <div className="w-12 h-px bg-[#2A2A2A]" />
          </div>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">&copy; 2026 We Can Race &bull; Motorsport Experience</p>
        </footer>
      </div>
    </div>
  );
}
