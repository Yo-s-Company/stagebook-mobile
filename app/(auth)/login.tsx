import { supabase } from '@/src/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import * as AuthSession from 'expo-auth-session';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
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
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Componentes propios
import Typewriter from '@/src/components/Typewriter';
import { useShake } from '@/src/components/useShake';
import { vibrateError } from '@/src/components/vibration';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const router = useRouter();

  type FieldError = 'email' | 'password' | null;
  const [fieldError, setFieldError] = useState<FieldError>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const emailShake = useShake();
  const passwordShake = useShake();

  const [email, setEmail] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [buttonText, setButtonText] = useState('ENTRAR A ESCENA');

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Manejo de login con email y password
  const handleLogin = async () => {
    if (!email) {
      vibrateError();
      setFieldError('email');
      setErrorMessage('El correo es obligatorio');
      emailShake.shake();
      return;
    }
    if (!isValidEmail(email)) {
      vibrateError();
      setFieldError('email');
      setErrorMessage('El correo no tiene un formato válido');
      emailShake.shake();
      return;
    }
    if (!password) {
      vibrateError();
      setFieldError('password');
      setErrorMessage('La clave es necesaria');
      passwordShake.shake();
      return;
    }

    setFieldError(null);
    setErrorMessage('');
    setButtonText('COMPROBANDO ELENCO...');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      vibrateError();
      const isInvalid = error.message.includes('Invalid login credentials');
      setFieldError('password');
      setErrorMessage(isInvalid ? 'Credenciales no encontradas en el reparto' : error.message);
      setButtonText('FALLO EN EL ESTRENO');
      setTimeout(() => setButtonText('ENTRAR A ESCENA'), 2000);
      passwordShake.shake();
      return;
    }

    setButtonText('¡TELÓN ARRIBA!');
  };

  // Login con Google
  const handleGoogleLogin = async () => {
    try {
      const redirectUrl = AuthSession.makeRedirectUri({ scheme: 'stagebookmobile' });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: redirectUrl, skipBrowserRedirect: true },
      });

      if (error) throw new Error(error.message);
      if (data?.url) {
        await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
      } else {
        throw new Error('No se pudo iniciar sesión con Google');
      }
    } catch (err) {
      console.error('Google login error:', err);
      vibrateError();
    }
  };

  // Escucha cambios de sesión
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        router.replace('/(auth)/reset-password');
      } else if (session && event === 'SIGNED_IN') {
        router.replace('/(app)');
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const dynamicBg = isDark ? '#121212' : '#FFFFFF';
  const dynamicText = isDark ? '#FFFFFF' : '#000000';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: dynamicBg }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex1}
      >
        <ScrollView
          style={styles.flex1}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.headerSection}>
            <View style={styles.logoContainer}>
              <Image
                source={require('@/assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={[styles.brandText, { color: dynamicText }]}>
              STAGE<Text style={styles.brandRed}>BOOK</Text>
            </Text>
            <View style={styles.typewriterContainer}>
              <Typewriter text="Bienvenido, artista" speed={80} style={styles.typewriterText} />
            </View>
          </View>

          {/* Formulario */}
          <View style={styles.formContainer}>
            {/* Email */}
            <View style={styles.inputGap}>
              <Text
                style={[
                  styles.label,
                  fieldError === 'email' && styles.errorText,
                  { color: isDark ? '#a1a1aa' : '#71717a' },
                ]}
              >
                Identificación (Email)
              </Text>
              <Animated.View style={emailShake.animatedStyle}>
                <View
                  style={[
                    styles.inputWrapper,
                    fieldError === 'email'
                      ? styles.borderRed
                      : emailFocused
                      ? styles.borderPurple
                      : styles.borderDefault,
                  ]}
                >
                  <TextInput
                    value={email}
                    onChangeText={(val) => {
                      setEmail(val);
                      if (fieldError === 'email') setFieldError(null);
                    }}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    placeholder="Escribe tu correo..."
                    placeholderTextColor="#52525a"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                  />
                </View>
              </Animated.View>
              {fieldError === 'email' && <Text style={styles.errorSubtext}>{errorMessage}</Text>}
            </View>

            {/* Password */}
            <View style={styles.inputGap}>
              <Text
                style={[
                  styles.label,
                  fieldError === 'password' && styles.errorText,
                  { color: isDark ? '#a1a1aa' : '#71717a' },
                ]}
              >
                Clave de acceso
              </Text>
              <Animated.View style={passwordShake.animatedStyle}>
                <View
                  style={[
                    styles.inputWrapper,
                    fieldError === 'password'
                      ? styles.borderRed
                      : passwordFocused
                      ? styles.borderPurple
                      : styles.borderDefault,
                  ]}
                >
                  <TextInput
                    value={password}
                    onChangeText={(val) => {
                      setPassword(val);
                      if (fieldError === 'password') setFieldError(null);
                    }}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    secureTextEntry={!showPassword}
                    placeholder="••••••••"
                    placeholderTextColor="#52525a"
                    style={styles.input}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color="#71717a"
                    />
                  </TouchableOpacity>
                </View>
              </Animated.View>
              {fieldError === 'password' && (
                <Text style={styles.errorSubtext}>{errorMessage}</Text>
              )}
              <TouchableOpacity
                onPress={() => router.push('/(auth)/forgotPasswordScreen')}
                style={styles.forgotBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.forgotText}>¿OLVIDASTE TU CONTRASEÑA?</Text>
              </TouchableOpacity>
            </View>

            {/* Botón login */}
            <TouchableOpacity onPress={handleLogin} activeOpacity={0.8} style={styles.loginBtn}>
              <Text style={styles.loginBtnText}>{buttonText}</Text>
            </TouchableOpacity>

            {/* Google */}
            <TouchableOpacity onPress={handleGoogleLogin} style={styles.googleBtn}>
              <Ionicons name="logo-google" size={18} color="#FFFFFF" />
              <Text style={styles.googleBtnText}>CONTINUAR CON GOOGLE</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.footerText}>
                ¿No tienes cuenta? <Text style={styles.registerLink}>REGÍSTRATE</Text>
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
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 32 },
  headerSection: { alignItems: 'center', marginBottom: 48 },
  logoContainer: { width: 80, height: 80, marginBottom: 16 },
  logo: { width: '100%', height: '100%' },
  brandText: { fontSize: 36, fontWeight: 'bold', letterSpacing: -1 },
  brandRed: { color: '#dc2626' },
  typewriterContainer: { height: 24, marginTop: 4 },
  typewriterText: { color: '#71717a', fontStyle: 'italic' },
  formContainer: { width: '100%' },
  inputGap: { marginTop: 24 },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
    marginLeft: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#7C3AED',
    opacity: 0.8,
  },
  borderDefault: { borderBottomColor: '#27272a' },
  borderPurple: { borderBottomColor: '#7C3AED' },
  borderRed: { borderBottomColor: '#dc2626' },
  errorText: { color: '#ef4444' },
  errorSubtext: { fontSize: 10, color: '#ef4444', marginTop: 4, marginLeft: 8, fontStyle: 'italic' },
  eyeIcon: { paddingHorizontal: 8 },
  forgotBtn: { alignSelf: 'flex-end', marginTop: 8 },
  forgotText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#71717a',
    fontSize: 10,
    letterSpacing: 1,
  },
  loginBtn: {
    backgroundColor: '#7C3AED',
    width: '100%',
    paddingVertical: 20,
    borderRadius: 999,
    marginTop: 40,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  loginBtnText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 3,
    fontSize: 14,
  },
  googleBtn: {
    backgroundColor: '#2563eb',
    width: '100%',
    paddingVertical: 20,
    borderRadius: 999,
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleBtnText: { color: '#FFFFFF', fontWeight: 'bold', marginLeft: 12 },
  footer: { marginTop: 48, alignItems: 'center', marginBottom: 20 },
  footerText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#71717a',
    fontSize: 10,
    letterSpacing: 1,
  },
  registerLink: { color: '#dc2626', fontWeight: 'bold' },
});
