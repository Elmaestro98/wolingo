import { router, useLocalSearchParams } from 'expo-router';

import { Button } from '@/components/ui/button';
import { PlaceholderScreen } from '@/components/ui/placeholder-screen';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <PlaceholderScreen
      title={`Leçon ${id}`}
      description="Cartes d'explication puis exercices, avec barre de progression.">
      <Button title="Quitter" variant="white" onPress={() => router.back()} />
    </PlaceholderScreen>
  );
}
