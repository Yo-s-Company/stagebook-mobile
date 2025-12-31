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
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Componentes personalizados
import { MyText } from '@/src/components/ThemedText';
import Typewriter from '@/src/components/Typewriter';

export default function RegisterScreen() {
  const router = useRouter();
  
  // Estados de los campos
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados de enfoque para el Cursor
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  

  // Estados de error y feedback
  const [error, setError] = useState(false);
  const [buttonText, setButtonText] = useState("CREAR MI CAMERINO");

  const handleRegister = () => {
    if (!name || !email || !password) {
      setError(true);
      setButtonText("LIBRETO INCOMPLETO");
      
      setTimeout(() => {
        setButtonText("CREAR MI CAMERINO");
      }, 2000);
      return;
    }
    console.log("Registrando nuevo artista...");
    // router.replace('/(app)'); 
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
              <MyText className={`text-[10px] uppercase tracking-widest mb-1 ml-2 ${error && !name ? 'text-red-500' : ''}`}>
                Nombre del Artista / Director
              </MyText>
              <View className={`flex-row items-center border-b-2 py-2 px-2 ${error && !name ? 'border-red-600' : nameFocused ? 'border-foreground' : 'border-zinc-800'}`}>
                <TextInput
                  placeholder="Tu nombre artístico..."
                  placeholderTextColor="#52525aff"
                  className="flex-1 font-mono text-foreground opacity-80"
                  onFocus={() => { setNameFocused(true); setError(false); }}
                  onBlur={() => setNameFocused(false)}
                  onChangeText={setName}
                  value={name}
                />
              </View>
            </View>

            {/* Campo Email */}
            <View className="mt-4">
              <MyText className={`text-[10px] uppercase tracking-widest mb-1 ml-2 ${error && !email ? 'text-red-500' : ''}`}>
                Correo Electrónico
              </MyText>
              <View className={`flex-row items-center border-b-2 py-2 px-2 ${error && !email ? 'border-red-600' : emailFocused ? 'border-purple-600' : 'border-zinc-800'}`}>
                <TextInput
                  placeholder="email@ejemplo.com"
                  placeholderTextColor="#52525aff"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="flex-1 font-mono text-foreground opacity-80"
                  onFocus={() => { setEmailFocused(true); setError(false); }}
                  onBlur={() => setEmailFocused(false)}
                  onChangeText={setEmail}
                  value={email}
                />
              </View>
            </View>

            {/* Campo Password */}
            <View className="mt-4">
              <MyText className={`text-[10px] uppercase tracking-widest mb-1 ml-2 ${error && !password ? 'text-red-500' : ''}`}>
                Contraseña
              </MyText>
              <View className={`flex-row items-center border-b-2 py-2 px-2 ${error && !password ? 'border-red-600' : passwordFocused ? 'border-red-600' : 'border-zinc-800'}`}>
                <TextInput
                  placeholder="Mínimo 8 caracteres"
                  placeholderTextColor="#52525aff"
                  className="flex-1 font-mono text-foreground opacity-80"
                  onFocus={() => { setPasswordFocused(true); setError(false); }}
                  onBlur={() => setPasswordFocused(false)}
                  onChangeText={setPassword}
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
            </View>

            {/* Botón Principal */}
            <TouchableOpacity 
              onPress={handleRegister}
              activeOpacity={0.8}
              className={`w-full py-5 rounded-full mt-8 bg-purple-600 text-white ${
                error 
                ? 'bg-red-700 border-red-700' 
                : 'bg-foreground border-red-600'
              }`}
            >
              <MyText className={`text-center font-bold uppercase tracking-widest text-sm text-white ${
                error ? 'text-white' : 'text-background'
              }`}>
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
            <TouchableOpacity className="w-full border border-zinc-800 py-5 rounded-full flex-row justify-center items-center bg-blue-600">
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