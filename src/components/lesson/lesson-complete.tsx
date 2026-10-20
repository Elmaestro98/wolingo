import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import type { ComponentProps } from "react";
import { useEffect } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown, ZoomIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { Colors } from "@/constants/theme";
import type { Example } from "@/content/lessons";
import type { LessonResult } from "@/lib/lesson-result";

/** Tous les 10 jours de série, le « coffre Teranga » s'ouvre. */
const STREAK_CHEST_DAYS = 10;

// Confettis décoratifs : position, taille, couleur, rond ou rectangle
const CONFETTI = [
  { left: 60, top: 0, width: 8, height: 14, color: Colors.green, round: false },
  { left: 96, top: 20, width: 10, height: 10, color: Colors.yellow, round: true },
  { left: 130, top: 6, width: 7, height: 13, color: "#E5484D", round: false },
  { left: 252, top: 10, width: 8, height: 14, color: Colors.yellow, round: false },
  { left: 288, top: 0, width: 10, height: 10, color: Colors.green, round: true },
  { left: 318, top: 24, width: 7, height: 13, color: "#00853F", round: false },
  { left: 40, top: 40, width: 9, height: 9, color: "#E5484D", round: true },
  { left: 336, top: 50, width: 8, height: 14, color: Colors.yellow, round: false },
];

type LessonCompleteProps = {
  lessonTitle: string;
  result: LessonResult;
  /** Série de jours APRÈS cette leçon */
  streakDays: number;
  newWords: Example[];
  onContinue: () => void;
};

/** Écran 18 de la maquette : le bilan de fin de leçon. */
export function LessonComplete({ lessonTitle, result, streakDays, newWords, onContinue }: LessonCompleteProps) {
  // useEffect avec [] : exécuté UNE SEULE FOIS, quand l'écran apparaît → vibration de victoire
  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-cream">
      {/* Décor : grand cercle crème derrière le haut de l'écran (comme sur l'Accueil) */}
      <View className="absolute left-1/2 top-[-180px] -ml-[240px] h-[480px] w-[480px] rounded-full bg-[#F6E7C4] opacity-60" />

      <ScrollView contentContainerClassName="px-5 pb-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Confettis */}
        <View pointerEvents="none" className="absolute left-0 right-0 top-10 h-[200px]">
          {CONFETTI.map((piece, index) => (
            <Animated.View
              key={index}
              entering={FadeIn.delay(200 + index * 80)}
              className={piece.round ? "rounded-full" : "rounded-sm"}
              style={{
                position: "absolute",
                left: piece.left,
                top: piece.top,
                width: piece.width,
                height: piece.height,
                backgroundColor: piece.color,
                transform: [{ rotate: `${index * 25}deg` }],
              }}
            />
          ))}
        </View>

        {/* Badge du haut */}
        <View className="items-center">
          <View className="flex-row items-center gap-2 rounded-full bg-white px-3.5 py-2">
            <Ionicons name="star" size={16} color={Colors.yellow} />
            <Text className="font-body-black text-xs uppercase tracking-[1.2px] text-[#3D3730]">
              {lessonTitle} · validée
            </Text>
          </View>
        </View>

        {/* Le lion « surgit » avec un effet ressort */}
        <Animated.View entering={ZoomIn.springify().damping(12)} className="mt-2.5 items-center">
          <Image
            source={require("@/assets/images/lion.png")}
            className="h-[190px] w-[145px]"
            resizeMode="contain"
            accessibilityLabel="Le lion mascotte de Wolingo lève le pouce"
          />
        </Animated.View>

        <View className="mt-1.5 items-center gap-1">
          <Text className="font-title text-[34px] leading-9 text-ink">Leçon terminée !</Text>
          <Text className="font-body text-[15.5px] text-muted">
            <Text className="font-body-black text-green">Baax na lool !</Text> Tu as assuré aujourd'hui.
          </Text>
        </View>

        {/* 3 statistiques, qui apparaissent l'une après l'autre (delay croissant) */}
        <View className="mt-[18px] flex-row gap-2">
          <StatCard icon="flash" iconColor={Colors.yellow} value={`+${result.xp}`} valueColor="text-[#6B4700]" label="XP gagnés" delay={300} />
          <StatCard
            icon="locate"
            iconColor={Colors.green}
            value={`${Math.round(result.accuracy * 100)} %`}
            valueColor="text-green"
            label="Précision"
            delay={420}
          />
          <StatCard icon="timer-outline" iconColor="#3D3730" value={`${result.minutes} min`} valueColor="text-ink" label="Temps" delay={540} />
        </View>

        <Animated.View entering={FadeInDown.delay(660)} className="mt-3">
          <StreakCard streakDays={streakDays} />
        </Animated.View>

        {newWords.length > 0 && (
          <Animated.View entering={FadeInDown.delay(780)} className="mt-3">
            <NewWordsCard words={newWords} />
          </Animated.View>
        )}
      </ScrollView>

      <View className="px-5 pb-2 pt-3">
        <Button title="Continuer" arrow onPress={onContinue} />
      </View>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Les cartes
// ---------------------------------------------------------------------------

type StatCardProps = {
  icon: ComponentProps<typeof Ionicons>["name"];
  iconColor: string;
  value: string;
  /** Classe de couleur du chiffre (écrite en entier) */
  valueColor: string;
  label: string;
  /** Retard d'apparition, en millisecondes */
  delay: number;
};

function StatCard({ icon, iconColor, value, valueColor, label, delay }: StatCardProps) {
  return (
    <Animated.View entering={FadeInDown.delay(delay)} className="flex-1 items-center gap-1 rounded-[18px] bg-white px-1.5 py-3">
      <Ionicons name={icon} size={22} color={iconColor} />
      <Text className={`font-title text-[22px] ${valueColor}`}>{value}</Text>
      <Text className="font-body-bold text-xs text-muted">{label}</Text>
    </Animated.View>
  );
}

function StreakCard({ streakDays }: { streakDays: number }) {
  // Position dans le cycle de 10 jours : 1 à 10 (10 = coffre atteint, pas 0)
  const daysInCycle = streakDays % STREAK_CHEST_DAYS === 0 ? STREAK_CHEST_DAYS : streakDays % STREAK_CHEST_DAYS;
  const daysLeft = STREAK_CHEST_DAYS - daysInCycle;
  const segments = Array.from({ length: STREAK_CHEST_DAYS }, (_, index) => index + 1);

  return (
    <View className="rounded-[20px] bg-yellow-light p-4">
      <View className="flex-row items-center gap-3">
        <View className="h-11 w-11 items-center justify-center rounded-[14px] bg-yellow">
          <Ionicons name="flame" size={24} color="#F59F0B" />
        </View>
        <View className="flex-1">
          <Text className="font-title text-xl text-[#3A2A00]">
            {streakDays} jour{streakDays > 1 ? "s" : ""} d'affilée !
          </Text>
          <Text className="font-body text-[13.5px] text-[#5A4300]">
            {daysLeft === 0
              ? "Le coffre Teranga est ouvert, bravo !"
              : `Encore ${daysLeft} jour${daysLeft > 1 ? "s" : ""} pour ouvrir le coffre Teranga`}
          </Text>
        </View>
      </View>

      {/* 10 segments : remplis jusqu'au jour atteint, puis le coffre */}
      <View
        accessible
        accessibilityLabel={`Série : ${daysInCycle} jours sur ${STREAK_CHEST_DAYS}`}
        className="mt-3.5 flex-row items-center gap-1"
      >
        {segments.map((day) => (
          <View
            key={day}
            className={`h-2.5 flex-1 rounded-full ${day <= daysInCycle ? "bg-[#E0A800]" : "bg-[#EAD9A6]"}`}
          />
        ))}
        <View className="ml-1 h-8 w-8 items-center justify-center rounded-lg bg-white">
          <Ionicons name={daysLeft === 0 ? "gift" : "gift-outline"} size={16} color={Colors.yellowText} />
        </View>
      </View>
    </View>
  );
}

function NewWordsCard({ words }: { words: Example[] }) {
  return (
    <View className="gap-3 rounded-[20px] bg-white p-4">
      <Text className="font-body-black text-[15px] text-ink">
        {words.length} nouveau{words.length > 1 ? "x" : ""} mot{words.length > 1 ? "s" : ""}
      </Text>
      {/* Grille de 2 colonnes (même astuce que « compléter la phrase ») */}
      <View className="flex-row flex-wrap gap-2">
        {words.map((word) => (
          <View key={word.wolof} className="grow basis-[45%] flex-row items-center justify-between rounded-2xl bg-[#F3EEE5] px-3.5 py-3">
            <View className="shrink">
              <Text className="font-title text-lg text-green">{word.wolof}</Text>
              <Text className="font-body text-[13px] text-muted">{word.french}</Text>
            </View>
            <Pressable
              // Plus tard : jouer l'audio avec expo-audio
              onPress={() => {}}
              accessibilityRole="button"
              accessibilityLabel={`Écouter « ${word.wolof} »`}
              className="h-9 w-9 items-center justify-center rounded-full bg-white"
            >
              <Ionicons name="volume-high-outline" size={16} color={Colors.green} />
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}
