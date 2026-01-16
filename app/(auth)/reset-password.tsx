import { MyText } from '@/src/components/ThemedText';
import { supabase } from '@/src/lib/supabase';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';

export default function ResetPasswordScreen() {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const updatePassword = async () => {
    if (newPassword.length < 8) {
      Alert.alert("Error", "La nueva clave debe tener al menos 8 caracteres.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    setLoading(false);

    if (error) {
      Alert.alert("Error al actualizar el libreto", error.message);
    } else {
      Alert.alert(
        "¡Acción lista!", 
        "Contraseña actualizada. ¡Ya puedes entrar a escena!",
        [{ text: "ENTRAR", onPress: () => router.replace('/(auth)/login') }]
      );
    }
  };

  // Colores dinámicos
  const dynamicBg = isDark ? '#121212' : '#FFFFFF';
  const dynamicText = isDark ? '#FFFFFF' : '#000000';

  return (
    <View style={[styles.container, { backgroundColor: dynamicBg }]}>
      <MyText style={[styles.title, { color: dynamicText }]}>
        NUEVA <MyText style={styles.textRed}>CONTRASEÑA</MyText>
      </MyText>
      
      <MyText style={styles.subtitle}>
        Escribe tu nueva clave de acceso para el reparto.
      </MyText>

      <TextInput
        placeholder="Escribe la nueva clau..."
        placeholderTextColor="#52525a"
        style={styles.input}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <TouchableOpacity 
        onPress={updatePassword}
        disabled={loading}
        activeOpacity={0.8}
        style={[styles.button, loading && styles.buttonDisabled]}
      >
        <MyText style={styles.buttonText}>
          {loading ? "ACTUALIZANDO..." : "ACTUALIZAR DATOS"}
        </MyText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -1,
  },
  textRed: {
    color: '#dc2626',
  },
  subtitle: {
    color: '#71717a',
    textAlign: 'center',
    marginBottom: 40,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: '#27272a',
    paddingVertical: 16,
    color: '#7C3AED',
    fontSize: 16,
    marginBottom: 40,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  button: {
    backgroundColor: '#7C3AED',
    paddingVertical: 20,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#3f3f46',
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: 14,
  },
});