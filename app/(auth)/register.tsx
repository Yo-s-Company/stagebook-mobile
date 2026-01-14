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
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Componentes personalizados
import { MyText } from '@/src/components/ThemedText';
import Typewriter from '@/src/components/Typewriter';
import { useShake } from '@/src/components/useShake';
import { vibrateError } from '@/src/components/vibration';

WebBrowser.maybeCompleteAuthSession();
export default function RegisterScreen() {
type FieldError = 'name' | 'email' | 'password' | null;
  const router = useRouter();
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  
  // Estados de los campos
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados de enfoque para el Cursor
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldError, setFieldError] = useState<FieldError>(null);

  // Estados de error y feedback
  const [buttonText, setButtonText] = useState("CREAR MI CAMERINO");

  //Shakes
  const nameShake = useShake();
  const emailShake = useShake();
  const passwordShake = useShake();

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const handleRegister = async () => {
  if (!name) {
    vibrateError();
    setFieldError('name');
    setErrorMessage('Este nombre debe aparecer en el reparto');
    nameShake.shake();
    return;
  }

  if (!email) {
    vibrateError();
    setFieldError('email');
    setErrorMessage('Necesitamos un correo para enviarte el guion');
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
    setErrorMessage('La contraseña es obligatoria');
    passwordShake.shake();
    return;
  }

  if (password.length < 8) {
    vibrateError();
    setFieldError('password');
    setErrorMessage('La contraseña debe tener al menos 8 caracteres');
    passwordShake.shake();
    return;
  }

  setIsLoading(true);
  setButtonText('PREPARANDO ESCENA...');

    const { data, error: authError } = await supabase.auth.signUp({
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
  } else if (authError.message.toLowerCase().includes('password')) {
    setFieldError('password');
    setErrorMessage('La contraseña no es válida');
  } else {
    setFieldError('email');
    setErrorMessage('No se pudo crear el camerino');
  }

  setButtonText('CREAR MI CAMERINO');
  return;
}
    if (!authError) {
      setIsRegistered(true); // Activaciòn de la pantalla de éxito
    }
  };

  // 3. Pantalla de Éxito
  if (isRegistered) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center px-8">
        <Ionicons name="sparkles-outline" size={80} color="#7C3AED" />
        <MyText className="text-3xl font-bold mt-6 text-center uppercase tracking-tighter">
          ¡Bienvenido al <MyText className="text-red-600">Elenco</MyText>!
        </MyText>
        <MyText className="text-zinc-500 text-center mt-4 italic">
          Tu camerino está casi listo. Por favor, revisa tu correo para confirmar tu entrada a escena.
        </MyText>
        <TouchableOpacity 
          onPress={() => router.replace('/(auth)/login')}
          className="mt-10 bg-foreground px-10 py-4 rounded-full bg-[#7C3AED]"
        >
          <MyText className="text-background font-bold uppercase tracking-widest">Ir al Login</MyText>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleGoogleRegister = async () => {
  try {
    const redirectUrl = AuthSession.makeRedirectUri({
      scheme: 'stagebookmobile',
      path: 'auth/callback',
    });

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: true,
      },
    });

    if (error || !data?.url) {
      throw new Error(error?.message || 'No se pudo iniciar Google');
    }

    const result = await WebBrowser.openAuthSessionAsync(
      data.url,
      redirectUrl
    );

    if (result.type === 'success') {
      const url = new URL(result.url);

      const access_token = url.searchParams.get('access_token');
      const refresh_token = url.searchParams.get('refresh_token');

      if (access_token && refresh_token) {
        await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        // 🎯 Aquí NO mostramos pantalla de "revisa tu correo"
        router.replace('/(app)');
      }
    }
  } catch (err) {
    console.error('Google register error:', err);
    vibrateError();
  }
};

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1"
      >
        <ScrollView 
          className="flex-1"
          contentContainerClassName="flex-grow justify-center px-8 py-10"
        >
          {/* Header con Estética de Teatro */}
          <View className="items-center mb-10">
            <View className="w-16 h-16 mb-4 opacity-80">
              <Image 
                source={require('@/assets/images/logo.png')} 
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>
            <MyText className="text-3xl font-bold tracking-tighter uppercase">
              NUEVA <MyText className="text-red-600">OBRA</MyText>
            </MyText>
            <View className="h-6 mt-1">
              <Typewriter 
                text="Escribe tus primeras líneas..." 
                speed={70} 
                className="text-zinc-500 italic" 
              />
            </View>
          </View>

          <View className="space-y-6">
            
            {/* Campo Nombre */}
            <View>
              <MyText className={`text-[10px] uppercase tracking-widest mb-1 ml-2 ${
                fieldError === 'name' ? 'text-red-500' : ''
              }`}>
                Nombre del Artista / Director
              </MyText>
              <Animated.View style={nameShake.animatedStyle}>
                  <View className={`flex-row items-center border-b-2 py-2 px-2 ${
                    fieldError === 'name'
                      ? 'border-red-600'
                      : nameFocused
                      ? 'border-foreground'
                      : 'border-zinc-800'
                  }`}>
                  <TextInput
                  placeholder="Nombre completo"
                  placeholderTextColor="#52525aff"
                  className="flex-1 font-mono text-foreground opacity-80"
                  onFocus={() => { setNameFocused(true); }}
                  onBlur={() => setNameFocused(false)}
                  onChangeText={(text) => {
                    setName(text);
                    if (fieldError === 'name') {
                      setFieldError(null);
                      setErrorMessage('');
                    }
                  }}
                  value={name}
                />
              </View>
              </Animated.View>
            </View>
              {fieldError === 'name' && (
          <MyText className="text-[10px] text-red-500 mt-1 ml-2 italic">
            {errorMessage}
          </MyText>
        )}

            {/* Campo Email */}
            <View className="mt-4">
              <MyText className={`text-[10px] uppercase tracking-widest mb-1 ml-2 ${
                fieldError === 'email' ? 'text-red-500' : ''
              }`}>
                Correo Electrónico
              </MyText>
            <Animated.View style={emailShake.animatedStyle}>
              <View className={`flex-row items-center border-b-2 py-2 px-2 ${
                fieldError === 'email'
                  ? 'border-red-600'
                  : emailFocused
                  ? 'border-purple-600'
                  : 'border-zinc-800'
              }`}>

                <TextInput
                  placeholder="email@ejemplo.com"
                  placeholderTextColor="#52525aff"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="flex-1 font-mono text-foreground opacity-80"
                  onFocus={() => { setEmailFocused(true); }}
                  onBlur={() => setEmailFocused(false)}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (fieldError === 'email') {
                      setFieldError(null);
                      setErrorMessage('');
                    }
                  }}
                  value={email}
                />
              </View>
              </Animated.View>
            </View>
              {fieldError === 'email' && (
                <MyText className="text-[10px] text-red-500 mt-1 ml-2 italic">
                  {errorMessage}
                </MyText>
              )}

            {/* Campo Password */}
            
            <View className="mt-4">
              <MyText className={`text-[10px] uppercase tracking-widest mb-1 ml-2 ${
                fieldError === 'password' ? 'text-red-500' : ''
              }`}>
                Contraseña
              </MyText>
              <Animated.View style={passwordShake.animatedStyle}>
              <View className={`flex-row items-center border-b-2 py-2 px-2 ${
                fieldError === 'password'
                  ? 'border-red-600'
                  : passwordFocused
                  ? 'border-red-600'
                  : 'border-zinc-800'
              }`}>

                <TextInput
                  placeholder="Mínimo 8 caracteres"
                  placeholderTextColor="#52525aff"
                  className="flex-1 font-mono text-foreground opacity-80"
                  onFocus={() => { setPasswordFocused(true);}}
                  onBlur={() => setPasswordFocused(false)}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (fieldError === 'password') {
                      setFieldError(null);
                      setErrorMessage('');
                    }
                  }}
                  secureTextEntry={!showPassword}
                  value={password}
                />

              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="mx-2">
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#71717a" 
                />
              </TouchableOpacity>
              </View>
              </Animated.View>
            </View>
              {fieldError === 'password' && (
                <MyText className="text-[10px] text-red-500 mt-1 ml-2 italic">
                  {errorMessage}
                </MyText>
              )}

            {/* Botón Principal */}
            <TouchableOpacity 
              onPress={handleRegister}
              activeOpacity={0.8}
              className={`w-full py-5 rounded-full mt-8 bg-purple-600 text-white`}
            >
              <MyText className={`text-center font-bold uppercase tracking-widest text-sm text-white`}>
                {buttonText}
              </MyText>
            </TouchableOpacity>

            {/* Separador */}
            <View className="flex-row items-center py-4">
              <View className="flex-1 h-[1px] bg-purple-200" />
              <MyText className="mx-4 text-[10px] text-purple-200 uppercase tracking-widest">O también</MyText>
              <View className="flex-1 h-[1px] bg-purple-200" />
            </View>

            {/* Google */}
            <TouchableOpacity 
              onPress={handleGoogleRegister}
              className="w-full border border-zinc-800 py-5 rounded-full flex-row justify-center items-center bg-blue-600"
              >
              <Ionicons name="logo-google" size={18} color="#a1a1aa" />
              <MyText className="ml-3 text-white font-bold uppercase tracking-widest text-xs">
                Unirse con Google
              </MyText>
            </TouchableOpacity>

            {/* Link a Login */}
            <TouchableOpacity 
              className="mt-6 items-center" 
              onPress={() => router.replace('/(auth)/login')}
            >
              <MyText className="text-zinc-500 text-[10px] uppercase tracking-widest">
                ¿Ya eres parte del elenco? <MyText className="text-red-600 font-bold">Inicia sesión</MyText>
              </MyText>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}