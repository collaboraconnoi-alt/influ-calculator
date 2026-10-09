/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useMemo, type ReactNode } from "react";
import {
  Instagram,
  Video,
  MapPin,
  Sparkles,
  RotateCcw,
  Check,
  ArrowUpRight,
  ArrowRight,
  Flag,
  ChevronDown,
  AlertCircle,
  Layers,
  Users,
} from "lucide-react";
import {
  calculateInstagramValues,
  calculateTikTokValue,
  calculatePack,
  calculateAutoFormulation,
  type AutoFormulationPreset,
  type AutoFormulationResult,
} from "./lib/calculator";
import { TRACK_NAMES } from "./lib/tracks";

function NumberField({
  id,
  label,
  value,
  onChange,
  suffix,
  decimal = false,
  hint,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  decimal?: boolean;
  hint?: string;
}) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {hint && <span className="field-hint">{hint}</span>}
      </label>
      <div className="input-shell">
        <input
          id={id}
          type="number"
          min="0"
          step={decimal ? "0.1" : "1"}
          inputMode={decimal ? "decimal" : "numeric"}
          value={value || ""}
          placeholder="0"
          onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
        />
        {suffix && (
          <span className="input-suffix" aria-hidden="true">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
function SectionHeading({
  number,
  title,
  description,
  action,
}: {
  number: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div className="section-heading-main">
        <span className="step-number">{number}</span>
        <div>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

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
  const [autoProspect, setAutoProspect] =
    useState<AutoFormulationResult | null>(null);
  const [activePreset, setActivePreset] =
    useState<AutoFormulationPreset>("balanced");
  const [autoNotice, setAutoNotice] = useState<string | null>(null);
  const [isManuallyAdjusted, setIsManuallyAdjusted] = useState<boolean>(false);

  // Section 3: Pack Converter
  const [selectedTrack, setSelectedTrack] = useState<string>(TRACK_NAMES[0]);
  const [numGuests, setNumGuests] = useState<number>(0);
  const [factor, setFactor] = useState<number>(4);

  // Calculations
  const igValues = useMemo(
    () => calculateInstagramValues(igFollowers, igEngagement),
    [igFollowers, igEngagement],
  );
  const ttValue = useMemo(
    () => calculateTikTokValue(ttFollowers, ttViews, ttEngagement),
    [ttFollowers, ttViews, ttEngagement],
  );

  const totalEur = useMemo(() => {
    return (
      qtyStories * igValues.stories +
      qtyPost * igValues.post +
      qtyReel * igValues.reel +
      qtyTikTok * ttValue
    );
  }, [qtyStories, qtyPost, qtyReel, qtyTikTok, igValues, ttValue]);

  const packResults = useMemo(
    () => calculatePack(totalEur, selectedTrack, numGuests, factor),
    [totalEur, selectedTrack, numGuests, factor],
  );

  const formatCurrency = (val: number) => {
    return val.toLocaleString("it-IT", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  // Formulazione automatica
  const handleAutoFormulate = (
    preset: AutoFormulationPreset = activePreset,
  ) => {
    if (igFollowers <= 0 && ttFollowers <= 0) {
      setAutoNotice(
        "Inserisci prima i dati di Instagram o TikTok nella Sezione 01 per elaborare la formulazione automatica.",
      );
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
      preset,
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

  const contentCount = qtyStories + qtyPost + qtyReel + qtyTikTok;
  const quantities = [
    {
      key: "stories",
      label: "Stories",
      value: qtyStories,
      set: setQtyStories,
      unit: igValues.stories,
      recommended: autoProspect?.stories,
    },
    {
      key: "post",
      label: "Post",
      value: qtyPost,
      set: setQtyPost,
      unit: igValues.post,
      recommended: autoProspect?.post,
    },
    {
      key: "reel",
      label: "Reel",
      value: qtyReel,
      set: setQtyReel,
      unit: igValues.reel,
      recommended: autoProspect?.reel,
    },
    {
      key: "tiktok",
      label: "TikTok",
      value: qtyTikTok,
      set: setQtyTikTok,
      unit: ttValue,
      recommended: autoProspect?.tiktok,
    },
  ];

  return (
    <div className="app">
      <div className="brand-strip">
        <div className="container strip-inner">
          <span>WE CAN RACE</span>
          <span>CREATOR & COLLABORAZIONI</span>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <a
            className="brand-link"
            href="https://wecanrace.it/"
            target="_blank"
            rel="noreferrer"
            aria-label="We Can Race, apri il sito"
          >
            <img src="/wcr-logo.png" alt="WCR" width="100" height="42" />
          </a>
          <span className="header-divider" aria-hidden="true" />
          <span className="tool-label">Influencer Calculator</span>
          <a
            className="site-link"
            href="https://wecanrace.it/"
            target="_blank"
            rel="noreferrer"
          >
            Vai al sito WCR <ArrowUpRight size={16} />
          </a>
        </div>
      </header>
      <main className="container main-content">
        <div className="intro">
          <div>
            <p className="eyebrow">
              <span /> DAL CONTENUTO ALLA PISTA
            </p>
            <h1>
              IL VALORE DEL CREATOR.
              <br />
              <span>L’EMOZIONE DELLA PISTA.</span>
            </h1>
            <p className="intro-description">
              Valuta i contenuti, costruisci la collaborazione e configura
              l’esperienza We Can Race.
            </p>
          </div>
          <div className="intro-mark" aria-hidden="true">
            <Flag size={32} strokeWidth={1.4} />
            <span>
              CREATOR
              <br />
              MEETS TRACK.
            </span>
          </div>
        </div>
        <nav className="workflow-nav" aria-label="Sezioni del calcolatore">
          <a href="#valori-contenuti">
            <span>01</span> Metriche creator <ArrowRight size={14} />
          </a>
          <a href="#composizione">
            <span>02</span> Mix contenuti <ArrowRight size={14} />
          </a>
          <a href="#convertitore-pack">
            <span>03</span> Esperienza in pista <Flag size={14} />
          </a>
        </nav>
        <div className="calculator-layout">
          <div className="workspace">
            <section id="valori-contenuti">
              <SectionHeading
                number="01"
                title="Valori contenuti"
                description="Inserisci le metriche dei canali del creator."
              />
              <div className="platform-grid">
                <div className="panel platform-card">
                  <div className="platform-heading">
                    <span className="platform-icon instagram-icon">
                      <Instagram size={21} />
                    </span>
                    <div>
                      <h3>Instagram</h3>
                      <p>Stories, post e reel</p>
                    </div>
                    <span className="channel-label">IG</span>
                  </div>
                  <div className="metrics-grid">
                    <NumberField
                      id="ig-followers"
                      label="Follower"
                      value={igFollowers}
                      onChange={setIgFollowers}
                    />
                    <NumberField
                      id="ig-engagement"
                      label="Engagement"
                      value={igEngagement}
                      onChange={setIgEngagement}
                      suffix="%"
                      decimal
                    />
                  </div>
                  <div className="valuations">
                    <span className="small-label">VALORE PER CONTENUTO</span>
                    {[
                      ["Stories", igValues.stories],
                      ["Post", igValues.post],
                      ["Reel", igValues.reel],
                    ].map(([name, val]) => (
                      <div className="valuation-row" key={name}>
                        <span>{name}</span>
                        <strong>{formatCurrency(Number(val))}</strong>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="panel platform-card">
                  <div className="platform-heading">
                    <span className="platform-icon tiktok-icon">
                      <Video size={21} />
                    </span>
                    <div>
                      <h3>TikTok</h3>
                      <p>Performance video</p>
                    </div>
                    <span className="channel-label">TT</span>
                  </div>
                  <NumberField
                    id="tt-followers"
                    label="Follower"
                    value={ttFollowers}
                    onChange={setTtFollowers}
                  />
                  <div className="metrics-grid tt-metrics">
                    <NumberField
                      id="tt-views"
                      label="Visualizzazioni medie"
                      value={ttViews}
                      onChange={setTtViews}
                    />
                    <NumberField
                      id="tt-engagement"
                      label="Engagement"
                      value={ttEngagement}
                      onChange={setTtEngagement}
                      suffix="%"
                      decimal
                    />
                  </div>
                  <div className="valuations">
                    <span className="small-label">VALORE PER CONTENUTO</span>
                    <div className="valuation-row">
                      <span>Video TikTok</span>
                      <strong>{formatCurrency(ttValue)}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section id="composizione">
              <SectionHeading
                number="02"
                title="Configurazione contenuti"
                description="Definisci le quantità o genera una proposta automatica."
              />
              <div className="panel composition-panel">
                <div className="composition-toolbar">
                  <div>
                    <span className="small-label">
                      IL MIX DELLA COLLABORAZIONE
                    </span>
                    <p>Scegli i contenuti da realizzare.</p>
                  </div>
                  <div className="toolbar-actions">
                    <button
                      className="button button-yellow"
                      onClick={() => handleAutoFormulate(activePreset)}
                    >
                      <Sparkles size={16} /> Formulazione automatica
                    </button>
                    {contentCount > 0 && (
                      <button
                        className="icon-button"
                        onClick={handleResetQuantities}
                        aria-label="Azzera contenuti"
                        title="Azzera contenuti"
                      >
                        <RotateCcw size={17} />
                      </button>
                    )}
                  </div>
                </div>
                {autoNotice && (
                  <div className="notice" role="alert">
                    <AlertCircle size={18} />
                    <p>{autoNotice}</p>
                    <button onClick={() => setAutoNotice(null)}>Chiudi</button>
                  </div>
                )}
                {autoProspect && (
                  <div className="auto-proposal">
                    <div className="proposal-heading">
                      <span>
                        <Check size={16} /> Proposta automatica
                      </span>
                      <span className="tier-badge">
                        {autoProspect.influencerTier}
                      </span>
                    </div>
                    <div
                      className="preset-options"
                      role="group"
                      aria-label="Variante della proposta"
                    >
                      {(
                        [
                          "balanced",
                          "video_focus",
                          "essential",
                        ] as AutoFormulationPreset[]
                      ).map((key) => (
                        <button
                          key={key}
                          aria-pressed={activePreset === key}
                          className={
                            activePreset === key ? "preset active" : "preset"
                          }
                          onClick={() => handleAutoFormulate(key)}
                        >
                          {
                            {
                              balanced: "Bilanciato · Event Day",
                              video_focus: "Focus Video & Reach",
                              essential: "Pack essenziale",
                            }[key]
                          }
                          {activePreset === key && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                    <div className="recommended-grid">
                      {quantities.map((item) => (
                        <div key={item.key}>
                          <span>{item.label}</span>
                          <strong>{item.recommended}</strong>
                          <small>
                            {item.key === "stories"
                              ? "Copertura live"
                              : item.key === "reel"
                                ? "Contenuto principale"
                                : item.key === "post"
                                  ? autoProspect.post
                                    ? "Foto / carosello"
                                    : "Non richiesto"
                                  : autoProspect.tikTokStatus === "included"
                                    ? "Incluso nel mix"
                                    : "Escluso dal mix"}
                          </small>
                        </div>
                      ))}
                    </div>
                    <details className="proposal-details">
                      <summary>
                        Logica di formulazione <ChevronDown size={15} />
                      </summary>
                      <p>{autoProspect.rationale}</p>
                      <p>{autoProspect.tikTokReason}</p>
                    </details>
                    {isManuallyAdjusted && (
                      <div className="manual-notice">
                        <span>Quantità personalizzate a mano.</span>
                        <button
                          onClick={() => handleAutoFormulate(activePreset)}
                        >
                          Ripristina proposta
                        </button>
                      </div>
                    )}
                  </div>
                )}
                <div className="quantity-grid">
                  {quantities.map((item) => (
                    <NumberField
                      key={item.key}
                      id={"qty-" + item.key}
                      label={item.label}
                      value={item.value}
                      onChange={(value) => {
                        item.set(Math.floor(value));
                        if (autoProspect) setIsManuallyAdjusted(true);
                      }}
                      hint={
                        autoProspect
                          ? "Proposta: " + item.recommended
                          : undefined
                      }
                    />
                  ))}
                </div>
                <div className="content-breakdown">
                  {quantities.map((item) => (
                    <div
                      className={
                        item.value > 0
                          ? "breakdown-item selected"
                          : "breakdown-item"
                      }
                      key={item.key}
                    >
                      <span>
                        {item.value} × {item.label}
                      </span>
                      <strong>{formatCurrency(item.value * item.unit)}</strong>
                    </div>
                  ))}
                </div>
                <div className="total-banner">
                  <div>
                    <span className="small-label">VALORE TOTALE CONTENUTI</span>
                    <p>
                      {contentCount}{" "}
                      {contentCount === 1
                        ? "contenuto nella collaborazione"
                        : "contenuti nella collaborazione"}
                    </p>
                  </div>
                  <strong data-testid="total-value">
                    {formatCurrency(totalEur)}
                  </strong>
                </div>
              </div>
            </section>
          </div>
          <aside id="convertitore-pack" className="experience-sidebar">
            <SectionHeading
              number="03"
              title="Esperienza in pista"
              description="Trasforma la proposta in giri disponibili."
            />
            <div className="panel experience-panel">
              <div className="experience-hero">
                <div className="hero-label">
                  <span>VALORE DELLA COLLABORAZIONE</span>
                  <Flag size={19} />
                </div>
                <strong data-testid="experience-value">
                  {formatCurrency(totalEur)}
                </strong>
                <span className="hero-caption">La tua proposta, in pista.</span>
              </div>
              <div className="experience-body">
                <div className="field">
                  <label htmlFor="strategy">
                    <Layers size={14} /> Strategia
                  </label>
                  <div className="select-shell">
                    <select
                      id="strategy"
                      value={factor}
                      onChange={(e) => setFactor(Number(e.target.value))}
                    >
                      <option value={4}>Verticalizzato</option>
                      <option value={5}>Target adiacente</option>
                    </select>
                    <ChevronDown size={16} />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="track">
                    <MapPin size={14} /> Circuito
                  </label>
                  <div className="select-shell">
                    <select
                      id="track"
                      value={selectedTrack}
                      onChange={(e) => setSelectedTrack(e.target.value)}
                    >
                      {TRACK_NAMES.map((track) => (
                        <option key={track} value={track}>
                          {track.charAt(0) + track.slice(1).toLowerCase()}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} />
                  </div>
                </div>
                <NumberField
                  id="guests"
                  label="Ospiti extra"
                  value={numGuests}
                  onChange={(value) => setNumGuests(Math.floor(value))}
                  suffix="ospiti"
                />
                <div className="cost-breakdown">
                  <div>
                    <span>Base pista</span>
                    <strong>
                      {formatCurrency(packResults.trackBasePrice)}
                    </strong>
                  </div>
                  <div>
                    <span>Costo ospiti</span>
                    <strong>{formatCurrency(packResults.guestsCost)}</strong>
                  </div>
                  <div className="unit-total">
                    <span>Pack unitario</span>
                    <strong>{formatCurrency(packResults.packUnitCost)}</strong>
                  </div>
                </div>
                <div
                  className="laps-result"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <span className="small-label">GIRI TOTALI DISPONIBILI</span>
                  <div>
                    <strong data-testid="laps">
                      {packResults.laps.toLocaleString("it-IT")}
                    </strong>
                    <Flag size={28} />
                  </div>
                  <span className="track-badge">
                    <MapPin size={12} />
                    {selectedTrack.charAt(0) +
                      selectedTrack.slice(1).toLowerCase()}
                  </span>
                </div>
              </div>
            </div>
            <p className="sidebar-note">
              Il riepilogo si aggiorna mentre configuri la collaborazione.
            </p>
          </aside>
        </div>
      </main>
      <footer className="container footer">
        <span>© 2026 We Can Race</span>
        <span>DAL CONTENUTO ALLA PISTA.</span>
      </footer>
      <a
        className="mobile-summary"
        href="#convertitore-pack"
        aria-label="Vai al riepilogo dell’esperienza"
      >
        <span>
          Valore contenuti<strong>{formatCurrency(totalEur)}</strong>
        </span>
        <span className="mobile-laps">
          {packResults.laps.toLocaleString("it-IT")} giri{" "}
          <ArrowRight size={17} />
        </span>
      </a>
    </div>
  );
}
