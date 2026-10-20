import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState, type ComponentProps } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MascotTip } from "@/components/onboarding/mascot-tip";
import { OnboardingHeader } from "@/components/onboarding/onboarding-header";
import { Button } from "@/components/ui/button";
import { ChoiceCard } from "@/components/ui/choice-card";
import { useSettingsStore, type DailyGoalMinutes } from "@/stores/settings-store";

// Les 3 identifiants possibles : TypeScript refusera toute autre valeur
type GoalId = "calm" | "regular" | "intense";

type Goal = {
  id: GoalId;
  icon: ComponentProps<typeof Ionicons>["name"];
  title: string;
  minutes: DailyGoalMinutes;
  description: string;
  recommended?: boolean;
};

// Les données des 3 objectifs (même principe que FEATURES dans l'écran d'accueil)
const GOALS: Goal[] = [
  {
    id: "calm",
    icon: "cafe-outline",
    title: "Tranquille",
    minutes: 5,
    description: "Idéal pour débuter sans pression",
  },
  {
    id: "regular",
    icon: "flash-outline",
    title: "Régulier",
    minutes: 10,
    description: "Le bon équilibre pour progresser vite",
    recommended: true,
  },
  {
    id: "intense",
    icon: "rocket-outline",
    title: "Intensif",
    minutes: 15,
    description: "Pour parler wolof en un éclair",
  },
];

/** Écran 02 de la maquette : choix de l'objectif quotidien. */
export default function GoalScreen() {
  // Lit dans le magasin : la durée déjà enregistrée (10 au premier lancement)
  const savedMinutes = useSettingsStore((state) => state.dailyGoalMinutes);
  // Récupère l'action qui enregistre la durée dans le magasin
  const setDailyGoal = useSettingsStore((state) => state.setDailyGoal);

  // Mémoire LOCALE pendant que l'utilisateur hésite ; part de la valeur enregistrée
  const [selectedMinutes, setSelectedMinutes] = useState<DailyGoalMinutes>(savedMinutes);

  function handleContinue() {
    setDailyGoal(selectedMinutes); // le choix devient visible par TOUS les écrans
    router.push("/onboarding/reminder");
  }

  return (
    <SafeAreaView className="flex-1 bg-cream">    
      <View className="flex-1 px-6 pb-7 pt-4">
        <OnboardingHeader step={1} />

        {/* Titre */}
        <View className="mt-[26px] gap-2">
          <Text className="font-title text-[32px] leading-[35px] text-ink">
            Quel est ton objectif ?
          </Text>
          <Text className="font-body text-[15px] leading-[22px] text-muted">
            Choisis un rythme adapté à tes journées. Tu pourras le changer quand
            tu veux.
          </Text>
        </View>

        {/* Les 3 cartes : chacune est « selected » si ses minutes sont celles en mémoire */}
        <View className="mt-[22px] gap-3" accessibilityRole="radiogroup">
          {GOALS.map((goal) => (
            <ChoiceCard
              key={goal.id}
              icon={goal.icon}
              title={goal.title}
              highlight={`${goal.minutes} min / jour`}
              description={goal.description}
              badge={goal.recommended ? "Recommandé" : undefined}
              selected={goal.minutes === selectedMinutes}
              onPress={() => setSelectedMinutes(goal.minutes)}
            />
          ))}
        </View>

        <View className="mt-[18px]">
          <MascotTip
            title={<Text className="italic">« Ndank-ndank mooy jàpp golo ci naay. »</Text>}
            text="Doucement, on attrape le singe dans la forêt. L'important, c'est la régularité !"
          />
        </View>

        <View className="flex-1" />

        {/* Le texte du bouton se met à jour tout seul quand selectedMinutes change */}
        <Button title={`Continuer · ${selectedMinutes} min/jour`} arrow onPress={handleContinue} />
      </View>
    </SafeAreaView>
  );
}
