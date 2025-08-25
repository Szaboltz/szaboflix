import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavoritesState {
  favorites: number[];
  addFavorite: (movieId: number) => void;
  removeFavorite: (movieId: number) => void;
}

const useFavoritesStore = create<FavoritesState>((set) => ({
  favorites: [],
  addFavorite: async (movieId: number) => {
    set((state) => ({ favorites: [...state.favorites, movieId] }));
    await AsyncStorage.setItem('favorites', JSON.stringify(useFavoritesStore.getState().favorites));
  },
  removeFavorite: async (movieId: number) => {
    set((state) => ({ favorites: state.favorites.filter(id => id !== movieId) }));
    await AsyncStorage.setItem('favorites', JSON.stringify(useFavoritesStore.getState().favorites));
  },
}));

(async () => {
  const favoritesString = await AsyncStorage.getItem('favorites');
  useFavoritesStore.setState({ favorites: favoritesString ? JSON.parse(favoritesString) : [] });
})();

export default useFavoritesStore;