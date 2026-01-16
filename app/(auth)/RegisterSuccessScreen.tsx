import { MyText } from '@/src/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Platform, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterSuccessScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  // Colores dinámicos manuales
  const dynamicBg = isDark ? '#121212' : '#FFFFFF';
  const dynamicText = isDark ? '#FFFFFF' : '#000000';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: dynamicBg }]}>
      <Ionicons name="sparkles-outline" size={80} color="#7C3AED" />

      <MyText style={[styles.title, { color: dynamicText }]}>
        ¡BIENVENIDO AL <MyText style={styles.textRed}>ELENCO</MyText>!
      </MyText>

      <MyText style={styles.subtitle}>
        Tu camerino está casi listo. {"\n"}
        Revisa tu correo para confirmar tu entrada a escena.
      </MyText>

      <TouchableOpacity
        onPress={() => router.replace('/(auth)/login')}
        activeOpacity={0.8}
        style={styles.button}
      >
        <MyText style={styles.buttonText}>
          Ir al Login
        </MyText>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 24,
    textAlign: 'center',
    letterSpacing: -1,
  },
  textRed: {
    color: '#dc2626',
  },
  subtitle: {
    color: '#71717a',
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
    lineHeight: 22,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  button: {
    marginTop: 40,
    backgroundColor: '#7C3AED',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: 14,
  },
});