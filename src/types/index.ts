export interface InstagramInputs {
  followers: number;
  engagement: number;
}

export interface TikTokInputs {
  followers: number;
  averageViews: number;
  engagement: number;
}

export interface ContentQuantities {
  stories: number;
  post: number;
  reel: number;
  tiktok: number;
}

export interface PackInputs {
  track: string;
  guests: number;
}

export interface CalculatorResults {
  instagram: {
    stories: number;
    post: number;
    reel: number;
  };
  tiktok: number;
  totalEur: number;
  pack: {
    trackBasePrice: number;
    guestsCost: number;
    packUnitCost: number;
    laps: number;
  };
}
