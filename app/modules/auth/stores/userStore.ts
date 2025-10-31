import type {User , AuthResponse} from '../types/user';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    accessToken: null as string | null,
  }),
  
  getters: {
    isLoggedIn: () => localStorage.getItem('user') !== null && localStorage.getItem('access_token') !== null,
    getUser: (state) => state.user,
    getAccessToken: (state) => state.accessToken,
    getUserId: (state) => state.user?.id,
    getUserEmail: (state) => state.user?.email,
    getUserName: (state) => state.user?.name,
    getUserPhone: (state) => state.user?.phone_number,
    getUserAvatar: (state) => state.user?.avatar_url,
    hasOAuthProvider: (state) => !!(
      state.user?.github_id || 
      state.user?.facebook_id || 
      state.user?.google_id
    ),
  },
  
  actions: {
    setAuth(authData: AuthResponse) {
      this.user = authData.user;
      this.accessToken = authData.access_token;
      
      if (process.client) {
        localStorage.setItem('access_token', authData.access_token);
        localStorage.setItem('user', JSON.stringify(authData.user));
      }
    },
    
    setUser(userData: User) {
      this.user = userData;
      
      if (process.client) {
        localStorage.setItem('user', JSON.stringify(userData));
      }
    },
    
    updateUser(updates: Partial<User>) {
      if (this.user) {
        this.user = { ...this.user, ...updates };
        
        if (process.client) {
          localStorage.setItem('user', JSON.stringify(this.user));
        }
      }
    },
    
    logout() {
      this.user = null;
      this.accessToken = null;
      
      if (process.client) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }
    },
    
    restoreSession() {
      if (process.client) {
        const token = localStorage.getItem('access_token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
          try {
            this.accessToken = token;
            this.user = JSON.parse(userStr);
          } catch (error) {
            console.error('Failed to restore session:', error);
            this.logout();
          }
        }
      }
    },
  },
});