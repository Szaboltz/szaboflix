import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import useFavoritesStore from "../../src/stores/favoritesStore";

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams();
  type Movie = {
    id: number;
    poster_path: string;
    title: string;
    overview: string;
    vote_average: number;
    release_date: string;
    runtime: number;
  };
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { favorites, addFavorite, removeFavorite } = useFavoritesStore();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}`,
          {
            params: {
              api_key: "79d5569236adb05640c1a9287ae16d2a", 
              language: "pt-BR",
            },
          }
        );
        setMovie(response.data);
      } catch (err) {
        setError("Erro ao carregar detalhes do filme");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const isFavorite = movie ? favorites.includes(movie.id) : false;
  const handleFavorite = () => {
    if (!movie) return;
    if (isFavorite) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie.id);
    }
  };

  if (!movie) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Filme não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
        style={styles.poster}
      />
      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.overview}>{movie.overview}</Text>
      <Text style={styles.details}>Avaliação: {movie.vote_average}/10</Text>
      <Text style={styles.details}>Lançamento: {movie.release_date}</Text>
      <Text style={styles.details}>Duração: {movie.runtime} minutos</Text>
      <TouchableOpacity style={styles.favoriteButton} onPress={handleFavorite}>
        <Text style={styles.favoriteText}>
          {isFavorite ? "Remover Favorito" : "Adicionar Favorito"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#000",
    alignItems: "center",
  },
  poster: { width: 200, height: 300, borderRadius: 10, marginBottom: 20 },
  title: { color: "#fff", fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  overview: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  details: { color: "#fff", fontSize: 14, marginBottom: 5 },
  favoriteButton: {
    backgroundColor: "#ffd700",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  favoriteText: { color: "#000", fontWeight: "bold" },
  errorText: { color: "#fff", fontSize: 18 },
});
