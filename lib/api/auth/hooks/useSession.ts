import { useState, useEffect } from 'react';
import { authService } from '../mock/mock-adapter';
import type { AuthSession } from '@/types/user';

export function useSession() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.subscribeToSession((s) => {
      setSession(s);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  return { session, isLoading };
}
