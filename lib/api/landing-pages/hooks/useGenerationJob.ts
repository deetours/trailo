import { useState, useEffect } from 'react';
import { landingPagesService } from '../mock/mock-adapter';
import type { GenerationJob } from '@/types/landing-page';

export function useGenerationJob(jobId: string | undefined) {
  const [job, setJob] = useState<GenerationJob | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!jobId) {
      setIsLoading(false);
      return;
    }
    const unsubscribe = landingPagesService.subscribeToJob(jobId, (j) => {
      setJob(j);
      setIsLoading(false);
    });
    return unsubscribe;
  }, [jobId]);

  return { job, isLoading };
}
