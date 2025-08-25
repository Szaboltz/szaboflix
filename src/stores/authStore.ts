import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  user: { username: string } | null; 
  isAuthenticated: boolean;    
  setUser: (user: { username: string }) => Promise<void>; 
  logout: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: async (user: { username: string }) => {
    set({ user, isAuthenticated: true });
    await AsyncStorage.setItem('user', JSON.stringify(user));
  },

  logout: async () => {
    set({ user: null, isAuthenticated: false });
    await AsyncStorage.removeItem('user'); 
    await AsyncStorage.removeItem('token'); 
  },
}));

(async () => {
  const userString = await AsyncStorage.getItem('user');
  if (userString) {
    await useAuthStore.getState().setUser(JSON.parse(userString));
  }
})();

export default useAuthStore;