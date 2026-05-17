
import { mongoService } from './mongoService';

export interface AuthSession {
  user: {
    id: string;
    email: string;
    username: string;
  };
  token: string;
}

class AuthService {
  private STORAGE_KEY = 'fv_token';

  async getSession(): Promise<AuthSession | null> {
    const token = localStorage.getItem(this.STORAGE_KEY);
    if (!token) return null;

    try {
      // In a real app, we might verify the token here
      const user = await mongoService.getUserProfile();
      return {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        token,
      };
    } catch (error) {
      this.clearSession();
      return null;
    }
  }

  async signIn(email: string, password: string): Promise<AuthSession> {
    const { token, user } = await mongoService.signIn(email, password);
    localStorage.setItem(this.STORAGE_KEY, token);
    return { user, token };
  }

  async signUp(email: string, password: string): Promise<AuthSession> {
    const { token, user } = await mongoService.signUp(email, password);
    localStorage.setItem(this.STORAGE_KEY, token);
    return { user, token };
  }

  async signInWithGoogle(): Promise<AuthSession> {
    // Simulated Google OAuth flow
    return new Promise((resolve) => {
      setTimeout(async () => {
        // Mock data for simulation
        const mockToken = 'mock_google_token_' + Math.random().toString(36).substr(2);
        localStorage.setItem(this.STORAGE_KEY, mockToken);
        
        // Use a generic cinephile user for simulation
        resolve({
          user: {
            id: 'google_user_123',
            email: 'google.cinephile@example.com',
            username: 'GoogleCinephile',
          },
          token: mockToken,
        });
      }, 1500);
    });
  }

  async signOut(): Promise<void> {
    this.clearSession();
  }

  private clearSession(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export const authService = new AuthService();
