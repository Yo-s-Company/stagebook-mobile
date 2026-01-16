import { supabase } from '@/src/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import * as AuthSession from 'expo-auth-session';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Componentes personalizados
import Typewriter from '@/src/components/Typewriter';
import { useShake } from '@/src/components/useShake';
import { vibrateError } from '@/src/components/vibration';
import RegisterSuccessScreen from './RegisterSuccessScreen';

WebBrowser.maybeCompleteAuthSession();

export default function RegisterScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const router = useRouter();

  type FieldError = 'name' | 'email' | 'password' | null;
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  

  // Estados de los campos
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados de enfoque
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldError, setFieldError] = useState<FieldError>(null);

  const [buttonText, setButtonText] = useState("CREAR MI CAMERINO");

  // Shakes
  const nameShake = useShake();
  const emailShake = useShake();
  const passwordShake = useShake();

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = async () => {
    if (!name) {
      vibrateError();
      setFieldError('name');
      setErrorMessage('Este nombre debe aparecer en el reparto');
      nameShake.shake();
      return;
    }
    if (!email || !isValidEmail(email)) {
      vibrateError();
      setFieldError('email');
      setErrorMessage(email ? 'El correo no tiene un formato válido' : 'Necesitamos un correo para enviarte el guion');
      emailShake.shake();
      return;
    }
    if (!password || password.length < 8) {
      vibrateError();
      setFieldError('password');
      setErrorMessage(password ? 'La contraseña debe tener al menos 8 caracteres' : 'La contraseña es obligatoria');
      passwordShake.shake();
      return;
    }

    setIsLoading(true);
    setButtonText('PREPARANDO ESCENA...');

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    });

    setIsLoading(false);

    if (authError) {
      vibrateError();
      if (authError.message.toLowerCase().includes('email')) {
        setFieldError('email');
        setErrorMessage('Este correo ya está registrado');
      } else {
        setFieldError('email');
        setErrorMessage('No se pudo crear el camerino');
      }
      setButtonText('CREAR MI CAMERINO');
      return;
    }
    setIsRegistered(true);
  };

  if (isRegistered) {
    return <RegisterSuccessScreen />;
  }

  const handleGoogleRegister = async () => {
    try {
      const redirectUrl = AuthSession.makeRedirectUri({ scheme: 'stagebookmobile', path: 'auth/callback' });
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: redirectUrl, skipBrowserRedirect: true },
      });
      if (error || !data?.url) throw new Error(error?.message || 'No se pudo iniciar Google');
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

      if (result.type === 'success') {
        const url = new URL(result.url);
        const access_token = url.searchParams.get('access_token');
        const refresh_token = url.searchParams.get('refresh_token');
        if (access_token && refresh_token) {
          await supabase.auth.setSession({ access_token, refresh_token });
          router.replace('/(app)');
        }
      }
    } catch (err) {
      console.error('Google register error:', err);
      vibrateError();
    }
  };

  const dynamicBg = isDark ? '#121212' : '#FFFFFF';
  const dynamicText = isDark ? '#FFFFFF' : '#000000';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: dynamicBg }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex1}>
        <ScrollView style={styles.flex1} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('@/assets/images/logo.png')} 
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={[styles.title, { color: dynamicText }]}>
              NUEVA <Text style={styles.textRed}>ARTISTA</Text>
            </Text>
            <View style={styles.typewriterContainer}>
              <Typewriter text="Escribe tus primeras líneas..." speed={70} style={styles.typewriterText} />
            </View>
          </View>

          <View style={styles.form}>
            {/* Campo Nombre */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, fieldError === 'name' && styles.errorColor]}>
                Nombre del Artista / Director
              </Text>
              <Animated.View style={nameShake.animatedStyle}>
                <View style={[styles.inputWrapper, fieldError === 'name' ? styles.borderRed : nameFocused ? styles.borderBlue : styles.borderDefault]}>
                  <TextInput
                    placeholder="Nombre completo"
                    placeholderTextColor="#52525a"
                    style={styles.input}
                    onFocus={() => setNameFocused(true)}
                    onBlur={() => setNameFocused(false)}
                    onChangeText={(text) => { setName(text); if (fieldError === 'name') setFieldError(null); }}
                    value={name}
                  />
                </View>
              </Animated.View>
              {fieldError === 'name' && <Text style={styles.errorSubtext}>{errorMessage}</Text>}
            </View>

            {/* Campo Email */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, fieldError === 'email' && styles.errorColor]}>
                Correo Electrónico
              </Text>
              <Animated.View style={emailShake.animatedStyle}>
                <View style={[styles.inputWrapper, fieldError === 'email' ? styles.borderRed : emailFocused ? styles.borderPurple : styles.borderDefault]}>
                  <TextInput
                    placeholder="email@ejemplo.com"
                    placeholderTextColor="#52525a"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    onChangeText={(text) => { setEmail(text); if (fieldError === 'email') setFieldError(null); }}
                    value={email}
                  />
                </View>
              </Animated.View>
              {fieldError === 'email' && <Text style={styles.errorSubtext}>{errorMessage}</Text>}
            </View>

            {/* Campo Password */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, fieldError === 'password' && styles.errorColor]}>
                Contraseña
              </Text>
              <Animated.View style={passwordShake.animatedStyle}>
                <View style={[styles.inputWrapper, fieldError === 'password' ? styles.borderRed : passwordFocused ? styles.borderRed : styles.borderDefault]}>
                  <TextInput
                    placeholder="Mínimo 8 caracteres"
                    placeholderTextColor="#52525a"
                    secureTextEntry={!showPassword}
                    style={styles.input}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    onChangeText={(text) => { setPassword(text); if (fieldError === 'password') setFieldError(null); }}
                    value={password}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#71717a" />
                  </TouchableOpacity>
                </View>
              </Animated.View>
              {fieldError === 'password' && <Text style={styles.errorSubtext}>{errorMessage}</Text>}
            </View>

            <TouchableOpacity onPress={handleRegister} activeOpacity={0.8} style={styles.mainButton}>
              <Text style={styles.mainButtonText}>{buttonText}</Text>
            </TouchableOpacity>

            <View style={styles.separatorContainer}>
              <View style={styles.line} />
              <Text style={styles.separatorText}>O TAMBIÉN</Text>
              <View style={styles.line} />
            </View>

            <TouchableOpacity onPress={handleGoogleRegister} style={styles.googleButton}>
              <Ionicons name="logo-google" size={18} color="#FFFFFF" />
              <Text style={styles.googleButtonText}>UNIRSE CON GOOGLE</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.footerLink} onPress={() => router.replace('/(auth)/login')}>
              <Text style={styles.footerText}>
                ¿YA ERES PARTE DEL ELENCO? <Text style={styles.loginLink}>INICIA SESIÓN</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 32, paddingVertical: 40 },
  header: { alignItems: 'center', marginBottom: 40 },
  logoContainer: { width: 64, height: 64, marginBottom: 16, opacity: 0.8 },
  logo: { width: '100%', height: '100%' },
  title: { fontSize: 30, fontWeight: 'bold', letterSpacing: -1, textTransform: 'uppercase' },
  textRed: { color: '#dc2626' },
  typewriterContainer: { height: 24, marginTop: 4 },
  typewriterText: { color: '#71717a', fontStyle: 'italic' },
  form: { width: '100%' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4, marginLeft: 8, color: '#71717a' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 2, paddingVertical: 8, paddingHorizontal: 8 },
  input: { flex: 1, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', color: '#7C3AED', opacity: 0.8 },
  borderDefault: { borderBottomColor: '#27272a' },
  borderPurple: { borderBottomColor: '#7C3AED' },
  borderBlue: { borderBottomColor: '#3b82f6' },
  borderRed: { borderBottomColor: '#dc2626' },
  errorColor: { color: '#ef4444' },
  errorSubtext: { fontSize: 10, color: '#ef4444', marginTop: 4, marginLeft: 8, fontStyle: 'italic' },
  eyeIcon: { paddingHorizontal: 8 },
  mainButton: { width: '100%', paddingVertical: 20, borderRadius: 999, marginTop: 32, backgroundColor: '#7C3AED', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 },
  mainButtonText: { color: '#FFFFFF', textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, fontSize: 14 },
  separatorContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  line: { flex: 1, height: 1, backgroundColor: '#e9d5ff' },
  separatorText: { fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', marginHorizontal: 16, fontSize: 10, color: '#d8b4fe', letterSpacing: 1 },
  googleButton: { width: '100%', backgroundColor: '#2563eb', paddingVertical: 20, borderRadius: 999, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  googleButtonText: { color: '#FFFFFF', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, fontSize: 12, marginLeft: 12 },
  footerLink: { marginTop: 24, alignItems: 'center' },
  footerText: { fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', color: '#71717a', fontSize: 10, letterSpacing: 1 },
  loginLink: { color: '#dc2626', fontWeight: 'bold' }
});