import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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

export default function LoginScreen() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState(false);
  const [buttonText, setButtonText] = useState("ENTRAR A ESCENA");

  const handleLogin = () => {
    if (!email || !password) {
      setError(true);
      setButtonText("ERROR EN EL LIBRETO");
      
      setTimeout(() => {
        setButtonText("ENTRAR A ESCENA");
      }, 2000);
      return;
    }
    console.log("Entrando a escena...");
    router.replace('/(app)');
  };

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
              <MyText className={`text-[10px] uppercase tracking-widest mb-1 ml-2 ${error && !email ? 'text-red-500' : ''}`}>
                Identificación (Email)
              </MyText>
              
              <View className={`flex-row items-center border-b-2 py-2 px-2 ${error && !email ? 'border-red-600' : emailFocused ? 'border-purple-600' : 'border-zinc-800'}`}>
                <TextInput
                  value={email}
                  onChangeText={(val) => { setEmail(val); setError(false); }}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  placeholder="Escribe tu correo..."
                  placeholderTextColor="#52525aff"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="flex-1 font-mono text-foreground opacity-80"
                />
              </View>
              {error && !email && (
                <MyText className="text-[10px] text-red-500 mt-1 ml-2 italic">
                  Este campo es obligatorio para la función
                </MyText>
              )}
            </View>

            {/* Campo de Password */}
            <View className="mt-8">
              <MyText className={`text-[10px] uppercase tracking-widest mb-1 ml-2 ${error && !password ? 'text-red-500' : ''}`}>
                Clave de acceso
              </MyText>
              <View className={`flex-row items-center border-b-2 py-2 px-2 ${error && !password ? 'border-red-600' : passwordFocused ? 'border-purple-600' : 'border-zinc-800'}`}>
                <TextInput
                  value={password}
                  onChangeText={(val) => { setPassword(val); setError(false); }}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  secureTextEntry={!showPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#52525aff"
                  className="flex-1 font-mono text-foreground tracking-widest opacity-80"
                />
                
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="mx-2">
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color="#71717a" 
                  />
                </TouchableOpacity>

              </View>
              {error && !password && (
                <MyText className="text-[10px] text-red-500 mt-1 ml-2 italic">
                  La clave es necesaria para abrir el telón
                </MyText>
              )}
            </View>

            {/* Botón de Entrada */}
            <TouchableOpacity 
              onPress={handleLogin}
              activeOpacity={0.8}
              className={`w-full py-5 rounded-full mt-10 shadow-lg  ${error ? 'bg-red-700' : 'bg-[#7C3AED]'}`}
            >
              <MyText className="text-white text-center font-bold uppercase tracking-[3px] text-sm">
                {buttonText}
              </MyText>
            </TouchableOpacity>

            {/* Alternativa Google */}
            <TouchableOpacity className="w-full border bg-blue-600 py-5 rounded-full mt-4 flex-row justify-center items-center">
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