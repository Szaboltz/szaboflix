import { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Button,
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

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { favorites, addFavorite, removeFavorite } = useFavoritesStore();
  const { logout } = useAuthStore();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          "https://api.themoviedb.org/3/movie/popular",
          {
            params: {
              api_key: "79d5569236adb05640c1a9287ae16d2a", 
              language: "pt-BR",
            },
          }
        );
        setMovies(response.data.results);
      } catch (error) {
        console.error("Erro ao carregar filmes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const renderItem = ({ item }: { item: Movie }) => {
    const isFavorite = favorites.includes(item.id);
    const handleFavorite = () => {
      if (isFavorite) {
        removeFavorite(item.id);
      } else {
        addFavorite(item.id);
      }
    };

    return (
      <TouchableOpacity
        style={styles.movieItem}
        onPress={() => router.push(`/details/${item.id}`)}
      >
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
          style={styles.poster}
        />
        <Text style={styles.title}>{item.title}</Text>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavorite}
        >
          <Text style={styles.favoriteText}>{isFavorite ? "★" : "☆"}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleFavorites = () => {
    router.push("/favorites");
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Favoritos" onPress={handleFavorites} color="#ffd700" />
        <Button title="Logout" onPress={handleLogout} color="#ff4444" />
      </View>
      <FlatList
        data={movies}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  loadingText: { color: "#fff", fontSize: 18 },
  list: { padding: 10 },
  movieItem: { flex: 1, margin: 5, alignItems: "center" },
  poster: { width: 150, height: 225, borderRadius: 8 },
  title: { color: "#fff", textAlign: "center", marginTop: 5, fontSize: 14 },
  favoriteButton: { position: "absolute", top: 5, right: 5, padding: 5 },
  favoriteText: { color: "#ffd700", fontSize: 20 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#222",
  },
});
