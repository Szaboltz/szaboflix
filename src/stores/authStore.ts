import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interface para definir a estrutura do estado
interface AuthState {
  user: { username: string } | null; // Dados do usuário logado
  isAuthenticated: boolean;          // Status de autenticação
  setUser: (user: { username: string }) => Promise<void>; // Método para login
  logout: () => Promise<void>;       // Método para logout
}

// Criação da store com Zustand
const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  // Método para definir o usuário e atualizar o estado
  setUser: async (user: { username: string }) => {
    set({ user, isAuthenticated: true });
    await AsyncStorage.setItem('user', JSON.stringify(user)); // Persiste no AsyncStorage
  },

  // Método para fazer logout e limpar o estado
  logout: async () => {
    set({ user: null, isAuthenticated: false });
    await AsyncStorage.removeItem('user'); // Remove os dados do usuário
    await AsyncStorage.removeItem('token'); // Remove o token
  },
}));

// Carrega o estado inicial do AsyncStorage ao iniciar
(async () => {
  const userString = await AsyncStorage.getItem('user');
  if (userString) {
    await useAuthStore.getState().setUser(JSON.parse(userString));
  }
})();

export default useAuthStore;