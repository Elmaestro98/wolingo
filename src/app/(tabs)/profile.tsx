import { Alert, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { PlaceholderScreen } from '@/components/ui/placeholder-screen';
import { formatTime } from '@/lib/time';
import { useProgressStore } from '@/stores/progress-store';
import { useSettingsStore } from '@/stores/settings-store';

export default function ProfileScreen() {
  // Lu dans le magasin : les choix faits pendant l'onboarding
  const dailyGoalMinutes = useSettingsStore((state) => state.dailyGoalMinutes);
  const reminderEnabled = useSettingsStore((state) => state.reminderEnabled);
  const reminderTime = useSettingsStore((state) => state.reminderTime);
  const resetOnboarding = useSettingsStore((state) => state.resetOnboarding);
  const totalXp = useProgressStore((state) => state.totalXp);
  const resetProgress = useProgressStore((state) => state.resetProgress);

  function handleResetProgress() {
    // Action irréversible → on demande confirmation
    Alert.alert('Réinitialiser la progression ?', 'Tes XP, ta série et tes leçons terminées seront effacés.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Réinitialiser', style: 'destructive', onPress: resetProgress },
    ]);
  }

  return (
    <PlaceholderScreen
      title="Mon profil"
      description="Statistiques, badges et réglages (rappel, sons, vitesse audio).">
      {/* Provisoire : affiche les réglages pour vérifier qu'ils sont bien sauvegardés */}
      <View className="w-full gap-1 rounded-2xl bg-white p-4">
        <Text className="font-body text-base text-ink">
          Objectif : <Text className="font-body-black">{dailyGoalMinutes} min / jour</Text>
        </Text>
        <Text className="font-body text-base text-ink">
          Rappel :{' '}
          <Text className="font-body-black">{reminderEnabled ? formatTime(reminderTime) : 'désactivé'}</Text>
        </Text>
        <Text className="font-body text-base text-ink">
          XP total : <Text className="font-body-black">{totalXp} XP</Text>
        </Text>
      </View>

      {/* Remet hasCompletedOnboarding à false : la garde de la racine réaffiche l'onboarding */}
      <Button title="Revoir l'accueil" variant="white" onPress={resetOnboarding} />
      <Button title="Réinitialiser la progression" variant="danger" onPress={handleResetProgress} />
    </PlaceholderScreen>
  );
}
