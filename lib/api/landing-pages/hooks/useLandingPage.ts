import { useState, useEffect } from 'react';
import { landingPagesService } from '../mock/mock-adapter';
import type { LandingPage } from '@/types/landing-page';

export function useLandingPage(tripId: string) {
  const [landingPage, setLandingPage] = useState<LandingPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = landingPagesService.subscribeToLandingPage(tripId, (lp) => {
      setLandingPage(lp);
      setIsLoading(false);
    });
    return unsubscribe;
  }, [tripId]);

  return { 
    landingPage, 
    isLoading, 
    generate: landingPagesService.generate.bind(landingPagesService), 
    regenerate: landingPagesService.regenerate.bind(landingPagesService), 
    publish: landingPagesService.publish.bind(landingPagesService), 
    unpublish: landingPagesService.unpublish.bind(landingPagesService),
    updateTheme: landingPagesService.updateTheme.bind(landingPagesService)
  };
}
