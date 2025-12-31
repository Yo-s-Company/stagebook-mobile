// app/(app)/index.tsx
import { Text, View } from 'react-native';

export default function HomeApp() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold">¡Bienvenido a la App Principal!</Text>
    </View>
  );
}