
import { authService } from '../services/authService';
import { mongoService } from '../services/mongoService';

export const authManager = {
  async initSession() {
    const session = await authService.getSession();
    if (session) {
      const user = await mongoService.getUserProfile();
      return {
        session: { user: { id: session.user.id }, access_token: session.token },
        user,
      };
    }
    return null;
  },

  async signIn(email: string, password: string) {
    const session = await authService.signIn(email, password);
    const user = await mongoService.getUserProfile();
    return {
      session: { user: { id: session.user.id }, access_token: session.token },
      user,
    };
  },

  async signUp(email: string, password: string) {
    const session = await authService.signUp(email, password);
    const user = await mongoService.getUserProfile();
    return {
      session: { user: { id: session.user.id }, access_token: session.token },
      user,
    };
  },

  async signInWithGoogle() {
    const session = await authService.signInWithGoogle();
    const user = await mongoService.getUserProfile();
    return {
      session: { user: { id: session.user.id }, access_token: session.token },
      user,
    };
  },

  async signOut() {
    await authService.signOut();
  }
};
