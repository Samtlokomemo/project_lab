
import { auth } from '@/database/firebase';
import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider,
  useRouter,
  useSegments,
} from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authenticatedUser) => {
      setUser(authenticatedUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (loading) return;

    const currentScreen = segments[0];
    const isAuthScreen =
      currentScreen === 'login' || currentScreen === 'cadastro';

    if (!user && !isAuthScreen) {
      router.replace('/login');
    } else if (user && isAuthScreen) {
      router.replace('/');
    }
  }, [user, loading, segments]);

  if (loading) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style="auto" />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="cadastro" />
      </Stack>
    </ThemeProvider>
  );
}
