import { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  Image,
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import useFavoritesStore from "../src/stores/favoritesStore";
import useAuthStore from "../src/stores/authStore";

type Movie = {
  id: number;
  title: string;
  poster_path: string;
};

export default function Favorites() {
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const favorites = useFavoritesStore((state) => state.favorites);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchFavoriteMovies = async () => {
      try {
        const movies = await Promise.all(
          favorites.map(async (id) => {
            const response = await axios.get(
              `https://api.themoviedb.org/3/movie/${id}`,
              {
                params: {
                  api_key: "79d5569236adb05640c1a9287ae16d2a",
                  language: "pt-BR",
                },
              }
            );
            return response.data;
          })
        );
        setFavoriteMovies(movies);
      } catch (error) {
        console.error("Erro ao carregar filmes favoritados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavoriteMovies();
  }, [favorites]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.userText}>
        Usuário: {user?.username || "Não logado"}
      </Text>
      <FlatList
        data={favoriteMovies}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.movieItem}
            onPress={() => router.push(`/details/${item.id}`)}
            activeOpacity={0.7}
          >
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
              }}
              style={styles.poster}
            />
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum filme favoritado</Text>
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 10 },
  userText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  list: { paddingBottom: 20 },
  movieItem: { marginBottom: 15, alignItems: "center" },
  poster: { width: 150, height: 225, borderRadius: 8 },
  title: { color: "#fff", textAlign: "center", marginTop: 5, fontSize: 14 },
  emptyText: { color: "#fff", textAlign: "center", fontSize: 16 },
});
