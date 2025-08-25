import { Redirect } from 'expo-router';
import useAuthStore from '../src/stores/authStore';

export default function Index() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return <Redirect href={isAuthenticated ? '/home' : '/login'} />;
}