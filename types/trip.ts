export type TripStatus = 'draft' | 'published' | 'archived';
export type TripType = 'road-trip' | 'trek' | 'expedition' | 'tour' | 'retreat' | 'other';
export type DifficultyLevel = 'easy' | 'moderate' | 'hard' | 'expert';

export interface TripBasicInfo {
  name: string;
  tripType: TripType;
  destinationRegion: string;
  durationDays: number;
  durationNights: number;
  groupSizeMin?: number;
  groupSizeMax?: number;
  difficultyLevel?: DifficultyLevel;
  startLocation?: string;
  endLocation?: string;
  languages?: string[];
}

export interface TripStory {
  tagline?: string;
  overview: string;
  highlights: string[];
}

export interface ItineraryDay {
  id: string;
  dayNumber: number;
  title: string;
  description?: string;
  activities: string[];
  meals?: ('breakfast' | 'lunch' | 'dinner')[];
  accommodation?: string;
  distanceKm?: number;
  elevationM?: number;
}

export interface TripMediaAsset {
  id: string;
  url: string;
  type: 'image' | 'video';
  caption?: string;
  isHero?: boolean;
  sortOrder: number;
}

export type PricingModel = 'per-person' | 'per-group' | 'tiered';

export interface PricingTier {
  id: string;
  label: string;
  price: number;
  minPax?: number;
  maxPax?: number;
}

export interface TripPricing {
  model: PricingModel;
  currency: string;
  basePrice?: number;
  tiers?: PricingTier[];
  depositRequired: boolean;
  depositAmount?: number;
  depositPercent?: number;
  paymentNotes?: string;
}

export interface TripLogistics {
  meetingPoint?: string;
  dropOffPoint?: string;
  transportProvided: boolean;
  accommodationType?: string;
  inclusions: string[];
  exclusions: string[];
  whatToBring?: string[];
  bestSeason?: string;
}

export interface TripPolicies {
  cancellationPolicy: string;
  refundPolicy?: string;
  ageRestriction?: string;
  fitnessRequirement?: string;
  safetyNotes?: string;
  termsUrl?: string;
}

export interface Trip {
  id: string;
  businessId: string;
  slug: string;
  status: TripStatus;
  basicInfo: TripBasicInfo;
  story: TripStory;
  itinerary: ItineraryDay[];
  media: TripMediaAsset[];
  pricing: TripPricing;
  logistics: TripLogistics;
  policies: TripPolicies;
  landingPageId?: string;
  createdAt: string;
  updatedAt: string;
}

export type TripSection = 'basicInfo' | 'story' | 'itinerary' | 'media' | 'pricing' | 'logistics' | 'policies' | 'page';
