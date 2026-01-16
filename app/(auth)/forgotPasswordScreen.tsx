import { MyText } from '@/src/components/ThemedText';
import { supabase } from '@/src/lib/supabase';
import * as AuthSession from 'expo-auth-session';
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

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const handleSendReset = async () => {
    if (!email) {
      Alert.alert("Error", "Por favor, introduce tu correo electrónico.");
      return;
    }

    setLoading(true);
    const redirectUrl = AuthSession.makeRedirectUri({ path: 'reset-password' });

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert(
        "Correo enviado", 
        "Revisa tu bandeja de entrada para recuperar tu guion.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    }
  };

  // Colores dinámicos manuales para el fondo
  const dynamicBg = isDark ? '#121212' : '#FFFFFF';
  const dynamicText = isDark ? '#FFFFFF' : '#000000';

  return (
    <View style={[styles.container, { backgroundColor: dynamicBg }]}>
      <MyText style={[styles.title, { color: dynamicText }]}>
        RECUPERAR <MyText style={styles.brandRed}>GUION</MyText>
      </MyText>
      
      <MyText style={styles.subtitle}>
        Escribe tu correo y te enviaremos las instrucciones.
      </MyText>
      
      <TextInput
        placeholder="Tu correo electrónico..."
        placeholderTextColor={'#e096c380'}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity 
        onPress={handleSendReset}
        disabled={loading}
        activeOpacity={0.8}
        style={styles.button}
      >
        <MyText style={styles.buttonText}>
          {loading ? "ENVIANDO..." : "ENVIAR INSTRUCCIONES"}
        </MyText>
      </TouchableOpacity>
      
      {/* Botón opcional para volver atrás si el usuario se arrepiente */}
      <TouchableOpacity 
        onPress={() => router.back()} 
        style={styles.backButton}
      >
        <MyText style={styles.backButtonText}>VOLVER AL REPARTO</MyText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: -1,
  },
  brandRed: {
    color: '#dc2626',
  },
  subtitle: {
    color: '#71717a',
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 14,
  },
  input: {
    width: '100%',
    borderBottomWidth: 2,
    borderBottomColor: '#7C3AED', // Color morado de StageBook
    color: '#7C3AED',
    fontSize: 16,
    paddingVertical: 12,
    marginBottom: 32,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  button: {
    width: '100%',
    backgroundColor: '#dc2626', // Rojo para acciones de "emergencia" o guion
    paddingVertical: 18,
    borderRadius: 999,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
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
  backButton: {
    marginTop: 24,
    padding: 10,
  },
  backButtonText: {
    color: '#71717a',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  }
});