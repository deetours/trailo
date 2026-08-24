import type { AuthSession } from '@/types/user';

export interface AuthService {
  register(input: { name: string; email: string; password: string; businessName: string }): Promise<AuthSession>;
  login(input: { email: string; password: string }): Promise<AuthSession>;
  logout(): Promise<void>;
  getSession(): Promise<AuthSession | null>;
  subscribeToSession(cb: (session: AuthSession | null) => void): () => void;
}
