import { Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  title: string;
  description: string;
  children?: React.ReactNode;
};

/** Écran temporaire en attendant l'intégration de la maquette. */
export function PlaceholderScreen({ title, description, children }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 items-center justify-center gap-4 px-6">
        <Image source={require('@/assets/logo.png')} className="h-24 w-28" resizeMode="contain" />
        <Text className="font-body-black text-xs tracking-widest">Wolingo</Text>
        <Text className="font-title text-4xl text-ink">{title}</Text>
        <Text className="text-center font-body text-base text-muted">{description}</Text>
        {children}
      </View>
    </SafeAreaView>
  );
}
