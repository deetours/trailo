import type { AuthService } from '../service';
import type { AuthSession, User } from '@/types/user';

class MockAuthAdapter implements AuthService {
  private subscribers = new Set<(s: AuthSession | null) => void>();
  private session: AuthSession | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('trailo_session_data');
      if (stored) {
        try {
          this.session = JSON.parse(stored);
        } catch (e) {
          console.error('Failed to parse stored session');
        }
      }
    }
  }

  private notify() {
    this.subscribers.forEach(cb => cb(this.session));
  }

  private setSession(session: AuthSession | null) {
    this.session = session;
    if (typeof window !== 'undefined') {
      if (session) {
        localStorage.setItem('trailo_session_data', JSON.stringify(session));
        document.cookie = `trailo_session=valid; path=/; max-age=86400`;
      } else {
        localStorage.removeItem('trailo_session_data');
        document.cookie = `trailo_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      }
    }
    this.notify();
  }

  async register(input: { name: string; email: string; password: string; businessName: string }): Promise<AuthSession> {
    const user: User = {
      id: `u_${Date.now()}`,
      name: input.name,
      email: input.email,
      businessId: `b_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const session: AuthSession = { user, businessId: user.businessId };
    
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    this.setSession(session);
    return session;
  }

  async login(input: { email: string; password: string }): Promise<AuthSession> {
    const user: User = {
      id: `u_existing`,
      name: 'Test Organizer',
      email: input.email,
      businessId: `b_existing`,
      createdAt: new Date().toISOString(),
    };
    const session: AuthSession = { user, businessId: user.businessId };
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    this.setSession(session);
    return session;
  }

  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    this.setSession(null);
  }

  async getSession(): Promise<AuthSession | null> {
    return this.session;
  }

  subscribeToSession(cb: (session: AuthSession | null) => void): () => void {
    this.subscribers.add(cb);
    cb(this.session);
    return () => this.subscribers.delete(cb);
  }
}

export const authService = new MockAuthAdapter();
