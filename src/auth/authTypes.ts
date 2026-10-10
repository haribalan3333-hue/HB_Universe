export interface UserAccount {
  id: string;
  username: string;
  display_name: string;
  email: string;
  avatar: string;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
  is_active?: boolean;
}

export interface Session {
  token: string;
  expiresAt: number;
  user: UserAccount;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserAccount | null;
  token: string | null;
  session: Session | null;
  isGuest: boolean;
  offlineMode: boolean;
  authLoading: boolean;
  authError: string | null;
}

export interface LoginCredentials {
  email_or_username?: string;
  username?: string;
  email?: string;
  password: string;
}

export interface RegisterData {
  username: string;
  display_name?: string;
  email: string;
  password: string;
  avatar?: string;
  date_of_birth?: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: UserAccount;
    token: string;
    refresh_token?: string;
  };
  error?: string | { code?: string; message: string };
}

export interface ProgressionEventPayload {
  event: string;
  entityId: string;
  score?: number;
}
