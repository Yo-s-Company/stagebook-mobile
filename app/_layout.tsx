import { supabase } from '@/src/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);
  const segments = useSegments();
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  // Escucha cambios de sesión
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setInitialized(true);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  // Redirecciones según sesión
  useEffect(() => {
    if (!initialized) return;

    const inAppGroup = segments[0] === '(app)';

    if (session && !inAppGroup) {
      router.replace('/(app)');
    } else if (!session && inAppGroup) {
      router.replace('/login');
    }
  }, [session, initialized, segments]);

  // Loading mientras inicializa
  if (!initialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: isDark ? '#121212' : '#fff' }}>
        <ActivityIndicator size="large" color="#f80000" />
      </View>
    );
  }

  // Stack principal
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
