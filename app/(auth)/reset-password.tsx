import { MyText } from '@/src/components/ThemedText';
import { supabase } from '@/src/lib/supabase';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';

export default function ResetPasswordScreen() {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const updatePassword = async () => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      alert("Error al actualizar el libreto: " + error.message);
    } else {
      alert("Contraseña actualizada ¡Ya puedes entrar a escena!");
      router.replace('/(auth)/login');
    }
    setLoading(false);
  };

  return (
    <View className="flex-1 bg-background p-8 justify-center">
      <MyText className="text-2xl font-bold mb-4">NUEVA CONTRASEÑA</MyText>
      <TextInput
        placeholder="Escriu la nova clau..."
        className="border-b border-zinc-800 py-4 text-foreground mb-8"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TouchableOpacity 
        onPress={updatePassword}
        className="bg-purple-600 py-5 rounded-full"
      >
        <MyText className="text-white text-center font-bold">ACTUALIZAR DATOS</MyText>
      </TouchableOpacity>
    </View>
  );
}