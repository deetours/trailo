import { Trip, Destination, Experience, Stay, MapPoint } from '../types';

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
      },
      {
        day: 2,
        title: 'Chika to Balu ka Ghera',
        route: 'Chika → Balu ka Ghera',
        activities: ['River crossing', 'Alpine meadow trek'],
        notes: 'Long climb with views back toward the Pir Panjal range.'
      },
      {
        day: 3,
        title: 'Cross Hampta Pass to Shea Goru',
        route: 'Balu ka Ghera → Hampta Pass (4270m) → Shea Goru',
        activities: ['Summit push', 'Descent into the Lahaul side'],
        notes: 'The landscape flips from green to cold desert within a few hours.'
      },
      {
        day: 4,
        title: 'Shea Goru to Chatru',
        route: 'Shea Goru → Chatru',
        activities: ['Final descent', 'Optional side trip toward Chandratal'],
      },
      {
        day: 5,
        title: 'Chatru to Manali',
        route: 'Chatru → Rohtang Pass → Manali',
        activities: ['Drive back over Rohtang Pass'],
        notes: 'Trek ends; onward journey to Spiti is possible from Chatru instead.'
      }
    ],
    includedStays: [],
    relatedDestinations: ['d1'],
    relatedExperiences: ['e1']
  }
];

export const mockDestinations: Destination[] = [
  {
    id: 'd1',
    name: 'Spiti Valley',
    slug: 'spiti-valley',
    region: 'Himachal Pradesh',
    description: 'A cold desert mountain valley located high in the Himalayas.',
    heroMedia: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80',
    gallery: [],
    bestTime: 'May to October',
    relatedTrips: ['t2'],
    relatedTrails: [],
    relatedStays: ['s1']
  }
];

export const mockStays: Stay[] = [
  {
    id: 's1',
    name: 'Spiti Heritage Homestay',
    slug: 'spiti-heritage-homestay',
    location: 'Kaza, Spiti',
    type: 'Homestay',
    media: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&q=80',
    description: 'Authentic Spitian hospitality in a traditional mud-brick home.',
    externalStayoUrl: 'https://stayo.girivah.com/spiti-heritage'
  }
];

export const mockExperiences: Experience[] = [
  {
    id: 'e1',
    title: 'High Altitude Stargazing',
    slug: 'high-altitude-stargazing',
    category: 'Nature',
    description: 'Experience the Milky Way like never before at 4000m.',
    media: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80',
    relatedDestination: 'd1'
  }
];

export const mockMapPoints: MapPoint[] = [
  {
    id: 'm1',
    type: 'stay',
    lat: 32.2235,
    lng: 78.0734,
    refId: 's1',
    name: 'Spiti Heritage Homestay'
  },
  {
    id: 'm2',
    type: 'viewpoint',
    lat: 32.3235,
    lng: 78.1734,
    name: 'Key Monastery Viewpoint'
  }
];
