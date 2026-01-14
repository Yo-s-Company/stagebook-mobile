import { supabase } from '@/src/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import * as AuthSession from 'expo-auth-session';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Componentes propios
import { MyText } from '@/src/components/ThemedText';
import Typewriter from '@/src/components/Typewriter';
import { useShake } from '@/src/components/useShake';
import { vibrateError } from '@/src/components/vibration';
import { Animated } from 'react-native';

WebBrowser.maybeCompleteAuthSession();
export default function LoginScreen() {

  type FieldError = 'email' | 'password' | null;

  const [fieldError, setFieldError] = useState<FieldError>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const emailShake = useShake();
  const passwordShake = useShake();

  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [buttonText, setButtonText] = useState("ENTRAR A ESCENA");
  const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

  const handleLogin = () => {
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

    router.replace('/(app)');
  };
const handleGoogleLogin = async () => {
  try {
    const redirectUrl = AuthSession.makeRedirectUri({
      scheme: 'stagebookmobile',
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

    await WebBrowser.openAuthSessionAsync(
      data.url,
      redirectUrl
    );
  } catch (err) {
    console.error('Google login error:', err);
    vibrateError();
  }
};


useEffect(() => {
  const { data: listener } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      if (session) {
        router.replace('/(app)');
      }
    }
  );

  return () => {
    listener.subscription.unsubscribe();
  };
}, []);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1"
      >
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 32 }}
      >          
          {/* Sección Logo/Header */}
          <View className="items-center mb-12">
            <View className="w-20 h-20 mb-4">
              <Image 
                source={require('@/assets/images/logo.png')} 
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>
            <MyText className="text-4xl font-bold tracking-tighter">
              STAGE<MyText className="text-red-600">BOOK</MyText>
            </MyText>
            <View className="h-6 mt-1">
              <Typewriter 
                text="Bienvenido, artista" 
                speed={80} 
                className="text-zinc-500 italic" 
              />
            </View>
          </View>

          {/* Formulario */}
          <View className="space-y-8">
            
            {/* Campo de Email */}
              <View className="mt-6">
                <MyText className={`text-[10px] uppercase tracking-widest mb-1 ml-2 ${
                  fieldError === 'email' ? 'text-red-500' : ''
                }`}>
                  Identificación (Email)
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
                      value={email}
                      onChangeText={(val) => {
                        setEmail(val);
                        if (fieldError === 'email') {
                          setFieldError(null);
                          setErrorMessage('');
                        }
                      }}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      placeholder="Escribe tu correo..."
                      placeholderTextColor="#52525aff"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      className="flex-1 font-mono text-foreground opacity-80"
                    />
                  </View>
                </Animated.View>

                {fieldError === 'email' && (
                  <MyText className="text-[10px] text-red-500 mt-1 ml-2 italic">
                    {errorMessage}
                  </MyText>
                )}
              </View>

          {/* Campo de Password */}
          <View className="mt-8">
            <MyText
              className={`text-[10px] uppercase tracking-widest mb-1 ml-2 ${
                fieldError === 'password' ? 'text-red-500' : ''
              }`}
            >
              Clave de acceso
            </MyText>

            <Animated.View style={passwordShake.animatedStyle}>
              <View
                className={`flex-row items-center border-b-2 py-2 px-2 ${
                  fieldError === 'password'
                    ? 'border-red-600'
                    : passwordFocused
                    ? 'border-purple-600'
                    : 'border-zinc-800'
                }`}
              >
                <TextInput
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    if (fieldError === 'password') {
                      setFieldError(null);
                      setErrorMessage('');
                    }
                  }}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  secureTextEntry={!showPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#52525aff"
                  className="flex-1 font-mono text-foreground tracking-widest opacity-80"
                />

                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="mx-2"
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
              <MyText className="text-[10px] text-red-500 mt-1 ml-2 italic">
                {errorMessage}
              </MyText>
            )}
          </View>

            {/* Botón de Entrada */}
            <TouchableOpacity 
              onPress={handleLogin}
              activeOpacity={0.8}
              className={`w-full py-5 rounded-full mt-10 shadow-lg bg-[#7C3AED]`}
            >
              <MyText className="text-white text-center font-bold uppercase tracking-[3px] text-sm">
                {buttonText}
              </MyText>
            </TouchableOpacity>

            {/* Alternativa Google */}
            <TouchableOpacity 
              onPress={handleGoogleLogin}
              className="w-full border bg-blue-600 py-5 rounded-full mt-4 flex-row justify-center items-center"
              >
              <Ionicons name="logo-google" size={18} color="#a1a1aa" className="mr-3" />
              <MyText className="text-white font-bold ml-2">CONTINUAR CON GOOGLE</MyText>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="mt-12 items-center">
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <MyText className="text-zinc-500 text-[10px] uppercase tracking-widest">
                ¿No tienes cuenta? <MyText className="text-red-600 font-bold">REGÍSTRATE</MyText>
              </MyText>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}