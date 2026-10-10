// ==========================================
// HB UNIVERSE — CENTRALIZED API CLIENT
// ==========================================

const API_BASE_URL = ((import.meta as any).env?.VITE_API_URL) || 'http://localhost:8000/api';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  success: boolean;
  status: number;
}

export class ApiClient {
  private getToken(): string | null {
    try {
      return localStorage.getItem('HB_UNIVERSE_AUTH_TOKEN_V11');
    } catch {
      return null;
    }
  }

  async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        return {
          success: false,
          error: json.detail || json.error || 'Server request error',
          status: res.status,
        };
      }

      return {
        success: true,
        data: json,
        status: res.status,
      };
    } catch {
      // Offline / Network Error fallback
      return {
        success: false,
        error: 'Offline Mode: Backend server unavailable. Local offline engine active.',
        status: 0,
      };
    }
  }

  get<T = any>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T = any>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  patch<T = any>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T = any>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
