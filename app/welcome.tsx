import Logo from '@/src/components/Logo';
import { MyText } from '@/src/components/ThemedText';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-8">

        {/* Logo */}
        <View className="items-center mb-6">
          <Logo width={220} />
        </View>

        {/* Título */}
        <MyText className="text-5xl font-mono-bold tracking-tighter">
          STAGE
          <MyText className="text-red-600 font-mono-bold">BOOK</MyText>
        </MyText>

        {/* Subtítulo */}
        <MyText className="mt-2 text-base tracking-widest text-slate-500 uppercase">
          Artistic planner & portafolio
        </MyText>

        {/* Loader cinematográfico */}
        <View className="animate-soft-pulse mt-12">
          <ActivityIndicator size="large" color="#dc2626" />
        </View>

      </View>

      {/* Leyenda inferior */}
      <View className="pb-6 items-center">
        <MyText className="text-xs text-slate-400 tracking-wide">
          Una aplicación de{' '}
          <MyText className="text-purple-600 font-mono-bold">
            Yo´s Company
          </MyText>
        </MyText>
      </View>
    </SafeAreaView>
  );
}
