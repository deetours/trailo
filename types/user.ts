export interface User {
  id: string;
  name: string;
  email: string;
  businessId?: string;
  createdAt: string;
}

export interface AuthSession {
  user: User;
  businessId?: string;
}
