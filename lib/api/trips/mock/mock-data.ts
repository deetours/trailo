import type { Trip } from '@/types/trip';

export const mockTrips: Trip[] = [
  {
    id: 't_demo_1',
    businessId: 'b_123',
    slug: 'pacific-coast-highway-adventure',
    status: 'draft',
    basicInfo: {
      name: 'Pacific Coast Highway Adventure',
      tripType: 'road-trip',
      destinationRegion: 'California, USA',
      durationDays: 7,
      durationNights: 6,
    },
    story: {
      overview: 'Experience the ultimate coastal drive along California\'s iconic Highway 1.',
      highlights: ['Big Sur', 'Golden Gate Bridge', 'Santa Barbara'],
    },
    itinerary: [],
    media: [],
    pricing: {
      model: 'per-person',
      currency: 'USD',
      basePrice: 1500,
      depositRequired: false,
    },
    logistics: {
      transportProvided: false,
      inclusions: [],
      exclusions: [],
    },
    policies: {
      cancellationPolicy: 'Flexible',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];
