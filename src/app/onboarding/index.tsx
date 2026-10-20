import { FeatureCard, type FeatureCardProps } from "@/components/onboarding/feature-card";
import { SpeechBubble } from "@/components/ui/speech-bubble";
import { Button } from "@/components/ui/button";
import { Colors } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Les données des 3 cartes « atouts » : une ligne = une carte
const FEATURES: FeatureCardProps[] = [
  {
    icon: "chatbubble-ellipses-outline",
    iconColor: Colors.green,
    iconBackground: "bg-green-light",
    title: "Wolof authentique",
    subtitle: "Le parler de tous les jours",
  },
  {
    icon: "flash-outline",
    iconColor: Colors.yellowText,
    iconBackground: "bg-yellow-light",
    title: "5 min par jour",
    subtitle: "Des leçons courtes",
  },
  {
    icon: "cloud-offline-outline",
    iconColor: "#3D3730",
    iconBackground: "bg-[#ECE7DF]",
    title: "100 % hors-ligne",
    subtitle: "Partout, sans réseau",
  },
];

/** Écran 01 de la maquette : premier écran au lancement de l'app. */
export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-cream">
      {/* Conteneur principal : les blocs s'empilent de haut en bas */}
      <View className="flex-1 px-6 pb-7 pt-5">
        {/* Décor : grand cercle crème derrière le haut de l'écran.
            absolute = sorti de la pile ; placé en PREMIER pour être dessiné DERRIÈRE le reste.
            left-1/2 + -ml-[260px] (la moitié de sa largeur) = centré horizontalement. */}
        <View className="absolute left-1/2 top-[-140px] -ml-[260px] h-[520px] w-[520px] rounded-full bg-[#F6E7C4] opacity-[0.55]" />

        {/* 1. Badge « drapeau + Wolingo » */}
        <View className="items-center">
          <View className="flex-row items-center gap-2 rounded-full bg-white px-3.5 py-2">
            {/* Drapeau du Sénégal : 3 bandes côte à côte (flex-row) */}
            <View className="h-3.5 w-5 flex-row overflow-hidden rounded-[3px]">
              <View className="flex-1 bg-[#00853F]" />
              <View className="flex-1 bg-[#FDEF42]" />
              <View className="flex-1 bg-[#E31B23]" />
            </View>
            <Text className="font-title text-[15px] text-ink">Wolingo</Text>
          </View>
        </View>

        {/* 2. Mascotte dans un cercle blanc avec un anneau jaune */}
        <View className="mt-[22px] items-center">
          <View className="h-[236px] w-[236px] items-center justify-center rounded-full border-4 border-yellow bg-white">
            <Image
              source={require("@/assets/images/mascot.png")}
              className="h-[212px] w-[212px] rounded-full"
              accessibilityLabel="Moussa, la mascotte de Wolingo, fait un signe de la main"
            />
          </View>

          {/* Bulle posée PAR-DESSUS, en haut à droite de ce bloc */}
          <SpeechBubble
            title="Nanga def ?"
            subtitle="Comment ça va ?"
            onPlay={() => {
              // Plus tard : jouer l'audio « Nanga def » avec expo-audio
            }}
            className="absolute right-0 top-1.5"
          />
        </View>

        {/* 3. Textes de bienvenue */}
        <View className="mt-[22px] items-center gap-1.5">
          <Text className="font-body-black text-xs uppercase tracking-[2px] text-yellow-text">
            Teranga Ndakarou
          </Text>
          <Text className="font-title text-[40px] leading-[44px] text-ink">
            Dalal ak jàmm !
          </Text>
          <Text className="text-center font-body text-[15px] leading-[22px] text-muted">
            « Sois le bienvenu en paix » — apprends le wolof en{" "}
            <Text className="font-body-black text-green">
              5 minutes par jour
            </Text>
            , même sans internet.
          </Text>
        </View>

        {/* Cartes « atouts » : une FeatureCard par élément de FEATURES */}
        <View className="mt-[22px] flex-row gap-2.5">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </View>

        {/* 4. Espace extensible : prend toute la place libre et pousse le bas de l'écran vers le bas */}
        <View className="flex-1" />

        {/* 5. Actions */}
        <View className="gap-1.5">
          <Button
            title="Commencer l'aventure"
            arrow
            onPress={() => router.push("/onboarding/goal")}
          />

          <Pressable
            onPress={() => router.push("/onboarding/level")}
            className="mt-2 h-12 items-center justify-center"
          >
            <Text className="font-body-black text-base text-green">
              J'ai déjà des bases · Test de niveau
            </Text>
          </Pressable>

          <View className="mt-1 flex-row items-center justify-center gap-1.5">
            <Ionicons
              name="heart-outline"
              size={14}
              color={Colors.yellowText}
            />
            <Text className="font-body text-xs text-disabled-text">
              Conçu au Sénégal pour faire rayonner notre patrimoine
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
