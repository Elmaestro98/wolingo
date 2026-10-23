import '@/global.css';

import {
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_800ExtraBold,
} from '@expo-google-fonts/bricolage-grotesque';
import {
  NunitoSans_400Regular,
  NunitoSans_600SemiBold,
  NunitoSans_700Bold,
  NunitoSans_800ExtraBold,
} from '@expo-google-fonts/nunito-sans';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useReminderSync } from '@/hooks/use-reminder-sync';
import { configureNotifications } from '@/services/notifications';
import { useSettingsStore } from '@/stores/settings-store';

// Garde l'écran de démarrage (logo) affiché tant qu'on ne dit pas de le cacher
SplashScreen.preventAutoHideAsync();

// Une seule fois au démarrage : nos notifications s'affichent même app ouverte
configureNotifications();

export default function RootLayout() {
  // Lit dans le magasin : l'onboarding est-il terminé ?
  // (Les hooks doivent TOUJOURS être appelés avant le premier `return`.)
  const hasCompletedOnboarding = useSettingsStore((state) => state.hasCompletedOnboarding);

  // Le rappel quotidien du téléphone suit les réglages (heure, activé, durée)
  useReminderSync();

  // Charge les 6 fichiers de police ; `fontsLoaded` passe à true quand c'est fini
  const [fontsLoaded, fontError] = useFonts({
    BricolageGrotesque_600SemiBold,
    BricolageGrotesque_800ExtraBold,
    NunitoSans_400Regular,
    NunitoSans_600SemiBold,
    NunitoSans_700Bold,
    NunitoSans_800ExtraBold,
  });

  useEffect(() => {
    // Polices prêtes (ou en erreur : on n'en bloque pas l'app pour autant) → on cache le logo
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Tant que les polices ne sont pas prêtes, on n'affiche rien (le logo reste visible)
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        {/* Écrans accessibles UNIQUEMENT une fois l'onboarding terminé */}
        <Stack.Protected guard={hasCompletedOnboarding}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="lesson/[id]" options={{ presentation: 'fullScreenModal' }} />
        </Stack.Protected>

        {/* Écrans accessibles UNIQUEMENT tant que l'onboarding n'est PAS terminé */}
        <Stack.Protected guard={!hasCompletedOnboarding}>
          <Stack.Screen name="onboarding" />
        </Stack.Protected>
      </Stack>
    </GestureHandlerRootView>
  );
}
