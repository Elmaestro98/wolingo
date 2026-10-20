import Ionicons from "@expo/vector-icons/Ionicons";
import { useState, type ComponentProps } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MascotTip } from "@/components/onboarding/mascot-tip";
import { OnboardingHeader } from "@/components/onboarding/onboarding-header";
import { Button } from "@/components/ui/button";
import { ChoiceCard } from "@/components/ui/choice-card";
import { Colors } from "@/constants/theme";
import { useSettingsStore, type StartLevel } from "@/stores/settings-store";

type Level = {
  id: StartLevel;
  icon: ComponentProps<typeof Ionicons>["name"];
  title: string;
  description: string;
  /** Texte de l'étiquette sous la description */
  tag: string;
  /** Texte du bouton quand ce niveau est choisi */
  buttonTitle: string;
};

const LEVELS: Level[] = [
  {
    id: "beginner",
    icon: "leaf-outline",
    title: "Je débute",
    description: "On commence par les salutations et la politesse : Salaam aleekum, Jërëjëf…",
    tag: "Module 0 · Les bases",
    buttonTitle: "Commencer le module 0",
  },
  {
    id: "basics",
    icon: "locate-outline",
    title: "J'ai quelques bases",
    description: "Un test rapide pour débloquer directement les modules à ton niveau.",
    tag: "Test rapide · 3 min",
    buttonTitle: "Passer le test rapide",
  },
];

/**
 * Petite étiquette sous la description.
 * Composant défini DANS ce fichier : il ne sert qu'ici, inutile de lui créer un fichier.
 */
function LevelTag({ level, selected }: { level: Level; selected: boolean }) {
  // L'étiquette du test rapide est toujours jaune ; l'autre suit la sélection
  const isQuickTest = level.id === "basics";
  const background = isQuickTest ? "bg-yellow" : selected ? "bg-white" : "bg-[#F3EEE5]";
  const textColor = isQuickTest ? "text-[#3A2A00]" : selected ? "text-green" : "text-[#3D3730]";

  return (
    <View className={`flex-row items-center gap-1 rounded-full px-2.5 py-1 ${background}`}>
      {isQuickTest && <Ionicons name="flash" size={12} color="#3A2A00" />}
      <Text className={`font-body-black text-xs ${textColor}`}>{level.tag}</Text>
    </View>
  );
}

/** Écran 04 de la maquette : niveau de départ. Dernier écran de l'onboarding. */
export default function LevelScreen() {
  const completeOnboarding = useSettingsStore((state) => state.completeOnboarding);
  const [selectedLevel, setSelectedLevel] = useState<StartLevel>("basics");

  const currentLevel = LEVELS.find((level) => level.id === selectedLevel);

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 px-6 pb-6 pt-4">
        <OnboardingHeader step={3} />

        {/* Titre */}
        <View className="mt-[26px] gap-2">
          <Text className="font-body-black text-xs uppercase tracking-[1.7px] text-yellow-text">
            Ton point de départ
          </Text>
          <Text className="font-title text-[30px] leading-[33px] text-ink">
            Tu connais déjà un peu de wolof ?
          </Text>
          <Text className="font-body text-[15px] leading-[22px] text-muted">
            On adapte tes premières leçons à ton aisance.
          </Text>
        </View>

        {/* Les 2 cartes : même composant que l'écran 02, avec une étiquette en « footer » */}
        <View className="mt-[22px] gap-3" accessibilityRole="radiogroup">
          {LEVELS.map((level) => {
            const isSelected = level.id === selectedLevel;
            return (
              <ChoiceCard
                key={level.id}
                icon={level.icon}
                title={level.title}
                description={level.description}
                selected={isSelected}
                onPress={() => setSelectedLevel(level.id)}
                footer={<LevelTag level={level} selected={isSelected} />}
              />
            );
          })}
        </View>

        <View className="mt-[18px]">
          <MascotTip
            image={require("@/assets/images/driver.png")}
            title={
              <>
                Bul tiit ! <Text className="font-body-medium text-[#5A4300]">(N'aie pas peur !)</Text>
              </>
            }
            text="Même si tu pars de zéro, les révisions sont courtes et conviviales."
          />
        </View>

        <View className="flex-1" />

        <Button
          title={currentLevel?.buttonTitle ?? "Continuer"}
          arrow
          // Fin de l'onboarding : on l'enregistre dans le magasin. Aucune navigation à écrire :
          // la garde de la racine (Stack.Protected) bascule toute seule vers le Parcours.
          // Plus tard : lancer le test rapide si « basics ».
          onPress={() => completeOnboarding(selectedLevel)}
        />

        <View className="mt-3.5 flex-row items-center justify-center gap-1.5">
          <Ionicons name="refresh" size={15} color={Colors.muted} />
          <Text className="font-body text-[13px] text-muted">Tu pourras changer de niveau à tout moment.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
