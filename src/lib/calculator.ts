import { TRACK_BASE_PRICE, TRACK_GUEST_PRICE } from './tracks';

export function calculateInstagramValues(followers: number, engagement: number) {
  const f10k = followers / 10000;
  
  // Engagement factor for Stories and Post
  const engagementFactor = 
    engagement <= 2
      ? 1
      : engagement <= 5
        ? 1 + 0.1 * (engagement - 2)
        : 1.3 + 0.124 * (engagement - 5);

  // Stories
  const stories = Math.round((44 * Math.pow(f10k, 0.72)) * engagementFactor);

  // Post
  const basePost = followers <= 250000
    ? 80 * Math.pow(f10k, 0.95)
    : 80 * Math.pow(f10k, 0.845);
  const post = Math.round(basePost * engagementFactor);

  // Reel
  const engagementFactorReel = 
    engagement <= 2
      ? 1
      : engagement <= 5
        ? 1 + 0.12 * (engagement - 2)
        : 1.36 + 0.1 * (engagement - 5);
  const reel = Math.round((104 * Math.pow(f10k, 0.97)) * engagementFactorReel);

  return { stories, post, reel };
}

export function calculateTikTokValue(followers: number, averageViews: number, engagement: number) {
  const f10k = followers / 10000;
  const v5k = averageViews / 5000;

  const engagementFactor = 
    engagement <= 2
      ? 1
      : engagement <= 5
        ? 1 + 0.18 * (engagement - 2)
        : 1.54 + 0.25 * (engagement - 5);

  const rawTikTok = (27 * Math.pow(f10k, 0.25) * Math.pow(v5k, 0.85)) * engagementFactor;
  
  return Math.floor(Math.max(rawTikTok, 20));
}

export function isHalfStep(value: number): boolean {
  const remainder = value % 1;
  return Math.abs(remainder - 0.5) < 1e-9;
}

export function calculatePack(totalEur: number, track: string, guests: number, factor: number = 4) {
  const trackBasePrice = TRACK_BASE_PRICE[track] ?? 0;
  const guestsCost = guests * (TRACK_GUEST_PRICE[track] ?? 0);
  const packUnitCost = trackBasePrice + guestsCost;

  if (packUnitCost <= 0) return { trackBasePrice, guestsCost, packUnitCost, laps: 1 };

  const rawLaps = (totalEur / factor) / packUnitCost;
  const laps = Math.max(
    1,
    isHalfStep(rawLaps) ? rawLaps : Math.round(rawLaps)
  );

  return { trackBasePrice, guestsCost, packUnitCost, laps };
}

export type AutoFormulationPreset = 'balanced' | 'video_focus' | 'essential';

export interface AutoFormulationResult {
  stories: number;
  post: number;
  reel: number;
  tiktok: number;
  rationale: string;
  strategyName: string;
  influencerTier: string;
  hasTikTok: boolean;
  tikTokStatus: 'included' | 'excluded_no_account' | 'excluded_low_metrics';
  tikTokReason: string;
  totalEur: number;
}

export function calculateAutoFormulation(
  igFollowers: number,
  igEngagement: number,
  igValues: { stories: number; post: number; reel: number },
  ttFollowers: number,
  ttViews: number,
  ttEngagement: number,
  ttValue: number,
  preset: AutoFormulationPreset = 'balanced'
): AutoFormulationResult {
  // TikTok qualification check
  const hasTikTokAccount = ttFollowers > 0;
  // TikTok has good results if views >= 1500 and either good engagement or strong average reach
  const isGoodTikTok = 
    hasTikTokAccount && 
    ttViews >= 1500 && 
    (ttEngagement >= 1.8 || ttViews >= 4000 || ttValue >= 35);

  let tikTokStatus: 'included' | 'excluded_no_account' | 'excluded_low_metrics' = 'excluded_no_account';
  let tikTokReason = 'Nessun account TikTok specificato.';

  if (hasTikTokAccount) {
    if (isGoodTikTok) {
      tikTokStatus = 'included';
      tikTokReason = `Ottime performance video rilevate (${ttViews.toLocaleString('it-IT')} views medie, valore ${ttValue} €): TikTok incluso nel mix.`;
    } else {
      tikTokStatus = 'excluded_low_metrics';
      tikTokReason = 'Canale TikTok presente ma con views o engagement inferiori alla soglia consigliata: budget concentrato su Instagram.';
    }
  }

  let stories = 0;
  let post = 0;
  let reel = 0;
  let tiktok = 0;
  let influencerTier = 'Micro Creator';

  // Standalone TikTok creator
  if (igFollowers <= 0 && ttFollowers > 0) {
    influencerTier = 'TikTok Native Creator';
    if (isGoodTikTok) {
      tiktok = preset === 'essential' ? 1 : preset === 'video_focus' ? 2 : 1;
    }
    stories = 0;
    post = 0;
    reel = 0;
  } else {
    // Instagram tiers
    if (igFollowers < 20000) {
      influencerTier = 'Micro Creator (< 20K)';
      if (preset === 'essential') {
        stories = 3;
        reel = igValues.reel >= 40 ? 1 : 0;
        post = reel === 0 ? 1 : 0;
        tiktok = 0;
      } else if (preset === 'video_focus') {
        stories = 4;
        reel = 1;
        post = 0;
        tiktok = isGoodTikTok ? 1 : 0;
      } else {
        // Balanced
        stories = 4;
        reel = 1;
        post = 0;
        tiktok = isGoodTikTok ? 1 : 0;
      }
    } else if (igFollowers < 80000) {
      influencerTier = 'Mid Creator (20K - 80K)';
      if (preset === 'essential') {
        stories = 4;
        reel = 1;
        post = 0;
        tiktok = 0;
      } else if (preset === 'video_focus') {
        stories = 6;
        reel = 1;
        post = 0;
        tiktok = isGoodTikTok ? 1 : 0;
      } else {
        // Balanced
        stories = 5;
        reel = 1;
        post = 0;
        tiktok = isGoodTikTok ? 1 : 0;
      }
    } else if (igFollowers < 250000) {
      influencerTier = 'Macro Creator (80K - 250K)';
      if (preset === 'essential') {
        stories = 5;
        reel = 1;
        post = 0;
        tiktok = 0;
      } else if (preset === 'video_focus') {
        stories = 7;
        reel = 2;
        post = 0;
        tiktok = isGoodTikTok ? 1 : 0;
      } else {
        // Balanced
        stories = 6;
        reel = 1;
        post = 0;
        tiktok = isGoodTikTok ? (ttViews >= 30000 ? 2 : 1) : 0;
      }
    } else {
      influencerTier = 'Top Creator (250K+)';
      if (preset === 'essential') {
        stories = 6;
        reel = 1;
        post = 0;
        tiktok = 0;
      } else if (preset === 'video_focus') {
        stories = 9;
        reel = 2;
        post = 0;
        tiktok = isGoodTikTok ? 2 : 0;
      } else {
        // Balanced
        stories = 8;
        reel = 1;
        post = 1;
        tiktok = isGoodTikTok ? 1 : 0;
      }
    }

    // Regola di buon senso: le stories devono essere di più di qualsiasi altro formato
    const maxOther = Math.max(post, reel, tiktok);
    if (stories <= maxOther) {
      stories = maxOther + 2;
    }
  }

  const presetLabels: Record<AutoFormulationPreset, string> = {
    balanced: 'Mix Bilanciato (Event Day)',
    video_focus: 'Focus Video & Reach',
    essential: 'Pack Essenziale'
  };

  const totalEur = 
    (stories * igValues.stories) +
    (post * igValues.post) +
    (reel * igValues.reel) +
    (tiktok * ttValue);

  let rationale = `Configurazione formulata su profilo ${influencerTier}. Le Stories (${stories}) guidano la copertura live dell'evento garantendo frequenza e conversioni con il minimo attrito di produzione.`;
  if (reel > 0) {
    rationale += ` Incluso ${reel} Reel per amplificare la visibilità a lungo termine della pista.`;
  }
  if (tiktok > 0) {
    rationale += ` Aggiunto ${tiktok} TikTok grazie alle metriche favorevoli del canale.`;
  }

  return {
    stories,
    post,
    reel,
    tiktok,
    rationale,
    strategyName: presetLabels[preset],
    influencerTier,
    hasTikTok: hasTikTokAccount,
    tikTokStatus,
    tikTokReason,
    totalEur
  };
}
