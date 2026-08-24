import type { AuthSession } from '@/types/user';
import type { BusinessEntityType, BusinessAddress } from '@/types/business';

export interface RegisterInput {
  ownerName: string;
  ownerEmail: string;
  ownerPhone?: string;
  password: string;
  legalName: string;
  displayName: string;
  entityType: BusinessEntityType;
  address?: BusinessAddress;
}

export interface AuthService {
  register(input: RegisterInput): Promise<AuthSession>;
  login(input: { email: string; password: string }): Promise<AuthSession>;
  logout(): Promise<void>;
  getSession(): Promise<AuthSession | null>;
  subscribeToSession(cb: (session: AuthSession | null) => void): () => void;
}
