import type { Trip, TripSection } from '@/types/trip';

export interface CompletenessResult {
  isReadyForGeneration: boolean;
  percent: number;
  missing: { section: TripSection; label: string }[];
}

export function getTripCompleteness(trip: Trip): CompletenessResult {
  const missing: { section: TripSection; label: string }[] = [];
  
  if (!trip.basicInfo.name) missing.push({ section: 'basicInfo', label: 'Trip Name' });
  if (!trip.basicInfo.destinationRegion) missing.push({ section: 'basicInfo', label: 'Destination Region' });
  
  if (!trip.story.overview) missing.push({ section: 'story', label: 'Overview' });
  
  if (!trip.itinerary || trip.itinerary.length === 0) missing.push({ section: 'itinerary', label: 'At least one itinerary day' });
  
  if (!trip.pricing.basePrice && (!trip.pricing.tiers || trip.pricing.tiers.length === 0)) {
    missing.push({ section: 'pricing', label: 'Pricing Information' });
  }

  const totalRequired = 5; // Simplified for now
  const percent = Math.round(((totalRequired - missing.length) / totalRequired) * 100);

  return {
    isReadyForGeneration: missing.length === 0,
    percent,
    missing,
  };
}
