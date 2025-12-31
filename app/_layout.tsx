import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme as useNWColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { View, useColorScheme as useRNColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import "../global.css";

// IMPORTANTE: Eliminamos la importación de 'systemColorScheme' de dist/runtime 
// ya que eso causa el error de "Observable".

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();

  // 1. Usamos el hook de React Native para obtener el string "light" | "dark"
  const colorSystem = useRNColorScheme();

  // 2. Usamos el hook de NativeWind para controlar el tema de la app
  const { colorScheme, setColorScheme } = useNWColorScheme();

  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'SpaceMono-Bold': require('../assets/fonts/SpaceMono-Bold.ttf'),
  });

  // 3. Sincronizar el tema al cambiar el sistema
useEffect(() => {
    if (colorSystem) {
      setColorScheme(colorSystem);
    }
  }, [colorSystem]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      const timer = setTimeout(() => {
        router.replace('/(auth)/login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; 
  }

return (
  <SafeAreaProvider>
    <View className={`flex-1 bg-background ${colorScheme === 'dark' ? 'dark' : ''}`}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colorScheme === 'dark' ? '#000000' : '#E5E4E2',
          },
        }}
      >
        <Stack.Screen name="welcome" />
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(app)/index" />
      </Stack>
    </View>
  </SafeAreaProvider>
);
}