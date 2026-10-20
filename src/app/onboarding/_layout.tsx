import { Stack } from "expo-router";

/** Regroupe les 4 écrans de l'onboarding (index → goal → reminder → level) dans une pile. */
export default function OnboardingLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
