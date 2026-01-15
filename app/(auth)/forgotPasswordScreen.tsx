import { MyText } from '@/src/components/ThemedText';
import { supabase } from '@/src/lib/supabase';
import * as AuthSession from 'expo-auth-session';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, TextInput, TouchableOpacity, View } from 'react-native';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  return (
    <View className="flex-1 bg-background p-8 justify-center items-center">
      <MyText className="text-2xl font-bold mb-2 tracking-tighter">RECUPERAR <MyText className='text-red-600'>GUION</MyText></MyText>
      <MyText className="text-zinc-500 mb-8">Escribe tu correo y te enviaremos las instrucciones.</MyText>
      
      <TextInput
        placeholder="Tu correo electrónico..."
        placeholderTextColor={'#e096c380'}
        className="w-full border-b border-purple-600 text-purple-600 mb-8"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity 
        onPress={handleSendReset}
        disabled={loading}
        className="w-full border bg-red-600 py-5 rounded-full mt-4 flex-row justify-center items-center"
      >
        <MyText className="text-white text-center font-bold uppercase tracking-widest">
          {loading ? "ENVIANDO..." : "ENVIAR INSTRUCCIONES"}
        </MyText>
      </TouchableOpacity>
    </View>
  );
}