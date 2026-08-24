import { Trip } from '../types';

export const mockTrips: Trip[] = [
  {
    id: 't1',
    title: 'The Great Himalayan Crossing',
    slug: 'great-himalayan-crossing',
    duration: 12,
    vehicleTypes: ['4x4 SUV', 'Adventure Motorcycle'],
    difficulty: 'Expert',
    distanceKm: 1200,
    estCost: 1500,
    bestSeason: 'June to September',
    heroMedia: 'https://images.unsplash.com/photo-1520696773539-71285223c683?auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513221943033-90d565691cc4?auto=format&fit=crop&q=80'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Manali',
        route: 'Manali Basecamp',
        activities: ['Briefing', 'Acclimatization Walk'],
        notes: 'Rest is crucial today.'
      },
      {
        day: 2,
        title: 'Over the Rohtang Pass',
        route: 'Manali to Keylong',
        activities: ['Off-road driving', 'Photography'],
      }
    ],
    includedStays: ['s1'],
    relatedDestinations: ['d1'],
    relatedExperiences: ['e1']
  },
  {
    id: 't2',
    title: 'Spiti Valley Circuit',
    slug: 'spiti-valley-circuit',
    duration: 8,
    vehicleTypes: ['SUV'],
    difficulty: 'Moderate',
    distanceKm: 850,
    estCost: 800,
    bestSeason: 'May to October',
    heroMedia: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80',
    gallery: [],
    itinerary: [],
    includedStays: [],
    relatedDestinations: ['d1'],
    relatedExperiences: []
  },
  {
    id: 't3',
    title: 'Hampta Pass Trek',
    slug: 'hampta-pass-trek',
    duration: 5,
    vehicleTypes: [],
    difficulty: 'Moderate',
    distanceKm: 35,
    estCost: 450,
    bestSeason: 'Mid-June to early September',
    heroMedia: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Manali to Jobra, trek to Chika',
        route: 'Jobra → Chika',
        activities: ['Drive to trailhead', 'Short acclimatization trek'],
        notes: 'Gentle first day through pine forest alongside the Rani Nallah.'
      }
    ],
    includedStays: [],
    relatedDestinations: ['d1'],
    relatedExperiences: ['e1']
  }
];
