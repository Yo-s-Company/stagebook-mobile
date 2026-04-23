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
    const isNewProject = segments[0] === 'new-project';
    const isPerfilScreen = segments[0] === 'perfilScreen';

    if (session && !inAppGroup &&!isNewProject && !isPerfilScreen) {
      router.replace('/(app)');
    } else if (!session && (inAppGroup || isNewProject)) {
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

  // Renderizado del Stack Principal
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* 1. El grupo principal con el Tab Navigator interno */}
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        
        {/* 2. La pantalla independiente (fuera de las pestañas) */}
        <Stack.Screen 
          name="new-project"
          options={{ 
            presentation: 'modal', 
            headerShown: false,
          }} 
        />
        
        {/* 3. Flujo de autenticación */}
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}