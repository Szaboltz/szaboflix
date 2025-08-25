import 'expo-router/entry';
import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import useAuthStore from '../src/stores/authStore';

export default function App() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    router.replace(isAuthenticated ? '/home' : '/login');
  }, [isAuthenticated, router]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Carregando...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  text: {
    color: '#fff',
    fontSize: 18,
  }
});