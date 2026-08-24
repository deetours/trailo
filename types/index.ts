export interface ItineraryDay {
  day: number;
  title: string;
  route: string;
  stayRef?: string;
  activities: string[];
  notes?: string;
}

export interface Trip {
  id: string;
  title: string;
  slug: string;
  duration: number; // in days
  vehicleTypes: string[];
  difficulty: 'Easy' | 'Moderate' | 'Hard' | 'Expert';
  distanceKm: number;
  estCost: number;
  bestSeason: string;
  heroMedia: string; // URL
  gallery: string[]; // URLs
  itinerary: ItineraryDay[];
  includedStays: string[]; // Refs to Stays
  relatedDestinations: string[]; // Refs to Destinations
  relatedExperiences: string[]; // Refs to Experiences
}
