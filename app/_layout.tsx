import { Stack } from 'expo-router';
import useAuthStore from '../src/stores/authStore';

export default function Layout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Stack>
      {!isAuthenticated && <Stack.Screen name="login" options={{ headerShown: false }} />}
      {isAuthenticated && (
        <>
          <Stack.Screen name="home" options={{ title: 'Inicio' }} />
          <Stack.Screen name="details/[id]" options={{ title: 'Detalhes' }} />
          <Stack.Screen name="favorites" options={{ title: 'Favoritos' }} />
        </>
      )}
    </Stack>
  );
}