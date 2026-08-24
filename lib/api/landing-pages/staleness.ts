import type { Trip } from '@/types/trip';
import type { LandingPage } from '@/types/landing-page';

export function isLandingPageStale(trip: Trip, landingPage: LandingPage): boolean {
  if (landingPage.status !== 'ready' && landingPage.status !== 'published') return false;
  
  const currentRev = landingPage.revisions.find(r => r.id === landingPage.currentRevisionId);
  if (!currentRev) return false;

  const tripUpdated = new Date(trip.updatedAt).getTime();
  const snapshotUpdated = new Date(currentRev.snapshotOfTripUpdatedAt).getTime();
  
  // If trip was updated after the snapshot was taken
  return tripUpdated > snapshotUpdated;
}
