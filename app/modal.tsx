import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, Text, TouchableOpacity, View } from 'react-native';

export default function ModalScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-slate-950 p-6">
      <Text className="text-2xl font-bold text-slate-900 dark:text-white">
        Soy un Modal 
      </Text>
      
      <Text className="text-slate-500 text-center mt-2 mb-8">
        Aparecí desde abajo porque así está configurado en el Layout.
      </Text>

      {/* Botón para cerrar el modal */}
      <TouchableOpacity 
        className="bg-slate-200 dark:bg-slate-800 px-8 py-3 rounded-full"
        onPress={() => router.back()}
      >
        <Text className="text-slate-900 dark:text-white font-semibold">Cerrar</Text>
      </TouchableOpacity>

      {/* En iOS los modales a veces necesitan un estilo de barra específico */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}