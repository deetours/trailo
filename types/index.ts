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

export interface Destination {
  id: string;
  name: string;
  slug: string;
  region: string;
  description: string;
  heroMedia: string;
  gallery: string[];
  bestTime: string;
  relatedTrips: string[];
  relatedTrails: string[];
  relatedStays: string[];
}

export interface Experience {
  id: string;
  title: string;
  slug: string;
  category: 'Adventure' | 'Nature' | 'Culture' | 'Slow travel';
  description: string;
  media: string;
  relatedDestination: string;
}

export interface Stay {
  id: string;
  name: string;
  slug: string;
  location: string;
  type: string;
  media: string;
  description: string;
  externalStayoUrl?: string;
}

export interface MapPoint {
  id: string;
  type: 'stay' | 'trail' | 'viewpoint' | 'cafe' | 'experience';
  lat: number;
  lng: number;
  refId?: string; // Reference to the actual entity (Stay, Trip, etc.)
  name: string;
}

export interface JournalPost {
  id: string;
  title: string;
  slug: string;
  body: string; // Rich text / markdown
  coverMedia: string;
  relatedTrip?: string;
  relatedDestination?: string;
}
