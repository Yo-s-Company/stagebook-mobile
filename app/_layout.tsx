import { Stack, useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';


export default function RootLayout() {
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: isDark ? '#121212' : '#FFFFFF' }}>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#f80000' },
            headerShadowVisible: false,
            headerTitleAlign: 'left',
            headerShown: false, // Se mantiene false por defecto, pero el (app) lo activa
            headerTitle: () => (
              <View style={styles.headerTitleContainer}>
                <Image
                  source={require('../assets/images/LogoEditado.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <View style={styles.brandContainer}>
                  <Text style={styles.brandStage}>Stage</Text>
                  <Text style={styles.brandBook}>Book</Text>
                </View>
              </View>
            ),
headerRight: () => (
  <TouchableOpacity
    onPress={() => {
      console.log("Navegando al perfil...");
      router.push('/profile/profile'); 
    }}
    activeOpacity={0.7}
  >
    <Image
      source={{ uri: 'https://i.pravatar.cc/100' }}
      style={styles.avatar}
    />
  </TouchableOpacity>
),
          }}
        >
          {/* Mostramos el header solo cuando el usuario ya entró a la App */}
          <Stack.Screen name="(app)" options={{ headerShown: true }} />
        </Stack>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  headerTitleContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8 
  },
  logo: { 
    width: 40, 
    height: 40 
  },
  brandContainer: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  brandStage: { 
    fontWeight: 'bold', 
    fontSize: 18, 
    color: '#FFFFFF' 
  },
  brandBook: { 
    fontWeight: 'bold', 
    fontSize: 18, 
    color: '#000000' 
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#FFFFFF'
  }
});