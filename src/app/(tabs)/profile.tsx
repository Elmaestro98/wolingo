import Ionicons from "@expo/vector-icons/Ionicons";
import Constants from "expo-constants";
import type { ComponentProps, ReactNode } from "react";
import { Alert, Pressable, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DevMenu } from "@/components/dev/dev-menu";
import { Colors } from "@/constants/theme";
import { useLearnerStats } from "@/hooks/use-learner-stats";
import { getBadgeStates, type BadgeId, type BadgeState } from "@/lib/badges";
import { addMinutes, formatTime } from "@/lib/time";
import { useProgressStore } from "@/stores/progress-store";
import { useSettingsStore, type DailyGoalMinutes } from "@/stores/settings-store";

type IconName = ComponentProps<typeof Ionicons>["name"];

/** Le sens (le badge) → l'apparence (l'icône) : choisie ici, pas dans lib/badges.ts */
const BADGE_ICONS: Record<BadgeId, IconName> = {
  first_step: "footsteps",
  first_taxi: "car-sport",
  streak_3: "flame",
  xp_100: "flash",
  words_25: "library",
};

const GOAL_OPTIONS: DailyGoalMinutes[] = [5, 10, 15];

/** Pas des boutons − / + du rappel (en minutes). */
const REMINDER_STEP = 30;

/** Onglet « Profil » : statistiques, badges, Premium et réglages. */
export default function ProfileScreen() {
  const stats = useLearnerStats();
  const badges = getBadgeStates(stats);

  // Réglages : les MÊMES magasins que l'onboarding → un changement ici se retrouve partout
  const dailyGoalMinutes = useSettingsStore((state) => state.dailyGoalMinutes);
  const setDailyGoal = useSettingsStore((state) => state.setDailyGoal);
  const reminderEnabled = useSettingsStore((state) => state.reminderEnabled);
  const reminderTime = useSettingsStore((state) => state.reminderTime);
  const setReminder = useSettingsStore((state) => state.setReminder);
  const isPremium = useSettingsStore((state) => state.isPremium);
  const resetOnboarding = useSettingsStore((state) => state.resetOnboarding);
  const resetProgress = useProgressStore((state) => state.resetProgress);

  // Numéro de version lu dans app.json (via expo-constants)
  const appVersion = Constants.expoConfig?.version ?? "?";

  function handleResetProgress() {
    // Action irréversible → on demande confirmation
    Alert.alert(
      "Réinitialiser la progression ?",
      "Tes XP, ta série et tes leçons terminées seront effacés.",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Réinitialiser", style: "destructive", onPress: resetProgress },
      ],
    );
  }

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-cream">
      <ScrollView contentContainerClassName="gap-5 px-4 pb-10" showsVerticalScrollIndicator={false}>
        <View className="px-2 pt-3.5">
          <Text className="font-body-black text-[11.5px] uppercase tracking-[1.6px] text-yellow-text">
            Wolingo
          </Text>
          <Text className="font-title text-[26px] leading-[29px] text-ink">Mon profil</Text>
        </View>

        {/* Statistiques : grille 2 × 2 (flex-wrap + basis ~ moitié) */}
        <View className="flex-row flex-wrap gap-2.5">
          <StatTile icon="flash" iconColor={Colors.yellow} value={`${stats.totalXp}`} label="XP gagnés" />
          <StatTile
            icon="flame"
            iconColor="#F59F0B"
            value={`${stats.streakDays}`}
            label={stats.streakDays > 1 ? "jours d'affilée" : "jour d'affilée"}
          />
          <StatTile
            icon="book"
            iconColor={Colors.green}
            value={`${stats.completedLessonCount}/${stats.totalLessonCount}`}
            label="leçons terminées"
          />
          <StatTile
            icon="chatbubbles"
            iconColor={Colors.green}
            value={`${stats.learnedWordCount}`}
            label="mots appris"
          />
        </View>

        {/* Badges */}
        <Section title="Badges">
          <View className="flex-row flex-wrap gap-2.5">
            {badges.map((badge) => (
              <BadgeTile key={badge.id} badge={badge} />
            ))}
          </View>
        </Section>

        {/* Premium */}
        <View
          className={`flex-row items-center gap-3 rounded-[20px] p-4 ${isPremium ? "bg-green" : "bg-yellow-light"}`}
        >
          <View
            className={`h-11 w-11 items-center justify-center rounded-full ${isPremium ? "bg-white/20" : "bg-yellow"}`}
          >
            <Ionicons name="diamond" size={20} color={isPremium ? Colors.white : "#3A2A00"} />
          </View>
          <View className="flex-1">
            <Text className={`font-title text-lg ${isPremium ? "text-white" : "text-[#3A2A00]"}`}>
              {isPremium ? "Wolingo Premium" : "Passe à Premium"}
            </Text>
            <Text className={`font-body text-[13px] ${isPremium ? "text-[#D5EADD]" : "text-[#5A4300]"}`}>
              {isPremium
                ? "Vies illimitées activées. Jërëjëf !"
                : "Vies illimitées : apprends sans jamais t'arrêter."}
            </Text>
          </View>
          {!isPremium && (
            <Pressable
              // Le paiement est hors V1
              onPress={() => Alert.alert("Wolingo Premium", "Bientôt disponible !")}
              accessibilityRole="button"
              className="rounded-full bg-yellow px-3 py-2 active:opacity-80"
            >
              <Text className="font-body-black text-[13px] text-[#3A2A00]">Découvrir</Text>
            </Pressable>
          )}
        </View>

        {/* Réglages */}
        <Section title="Réglages">
          <View className="overflow-hidden rounded-[20px] bg-white">
            <SettingRow icon="flag" label="Objectif quotidien">
              <View className="flex-row gap-1.5">
                {GOAL_OPTIONS.map((minutes) => {
                  const isSelected = minutes === dailyGoalMinutes;
                  return (
                    <Pressable
                      key={minutes}
                      onPress={() => setDailyGoal(minutes)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      className={`h-9 min-w-11 items-center justify-center rounded-full px-2.5 ${
                        isSelected ? "bg-green" : "bg-[#F3EEE5]"
                      }`}
                    >
                      <Text
                        className={`font-body-black text-[13px] ${isSelected ? "text-white" : "text-ink"}`}
                      >
                        {minutes}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </SettingRow>

            <SettingRow icon="notifications" label="Rappel quotidien">
              <Switch
                value={reminderEnabled}
                onValueChange={(enabled) => setReminder(enabled, reminderTime)}
                trackColor={{ true: Colors.green, false: "#CFC6B8" }}
                thumbColor={Colors.white}
                ios_backgroundColor="#CFC6B8"
              />
            </SettingRow>

            {reminderEnabled && (
              <SettingRow icon="time" label="Heure du rappel">
                <View className="flex-row items-center gap-2">
                  <RoundButton
                    icon="remove"
                    label={`Reculer de ${REMINDER_STEP} minutes`}
                    onPress={() => setReminder(true, addMinutes(reminderTime, -REMINDER_STEP))}
                  />
                  <Text className="w-14 text-center font-title text-lg text-ink">
                    {formatTime(reminderTime)}
                  </Text>
                  <RoundButton
                    icon="add"
                    label={`Avancer de ${REMINDER_STEP} minutes`}
                    onPress={() => setReminder(true, addMinutes(reminderTime, REMINDER_STEP))}
                  />
                </View>
              </SettingRow>
            )}

            <SettingRow icon="refresh" label="Revoir l'accueil" onPress={resetOnboarding} />
            <SettingRow
              icon="trash"
              label="Réinitialiser la progression"
              danger
              onPress={handleResetProgress}
            />
          </View>
        </Section>

        {/* Visible uniquement pendant le développement */}
        <DevMenu />

        <Text className="text-center font-body text-xs text-muted">Wolingo v{appVersion}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Petits composants locaux (ils ne servent que dans cet écran)
// ---------------------------------------------------------------------------

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="gap-2.5">
      <Text className="px-2 font-body-black text-xs uppercase tracking-[1.4px] text-muted">{title}</Text>
      {children}
    </View>
  );
}

function StatTile({
  icon,
  iconColor,
  value,
  label,
}: {
  icon: IconName;
  iconColor: string;
  value: string;
  label: string;
}) {
  return (
    <View className="grow basis-[45%] gap-1 rounded-[20px] bg-white p-4">
      <Ionicons name={icon} size={22} color={iconColor} />
      <Text className="font-title text-[26px] leading-7 text-ink">{value}</Text>
      <Text className="font-body-bold text-[13px] text-muted">{label}</Text>
    </View>
  );
}

function BadgeTile({ badge }: { badge: BadgeState }) {
  return (
    <View
      accessible
      accessibilityLabel={`Badge ${badge.title} : ${badge.description}, ${badge.unlocked ? "gagné" : "pas encore gagné"}`}
      className={`w-[30%] grow items-center gap-1.5 rounded-[18px] bg-white px-2 py-3 ${badge.unlocked ? "" : "opacity-45"}`}
    >
      <View
        className={`h-12 w-12 items-center justify-center rounded-full ${badge.unlocked ? "bg-yellow" : "bg-[#F3EEE5]"}`}
      >
        <Ionicons
          name={badge.unlocked ? BADGE_ICONS[badge.id] : "lock-closed"}
          size={22}
          color={badge.unlocked ? "#3A2A00" : "#857A6B"}
        />
      </View>
      <Text className="text-center font-body-black text-[12.5px] text-ink">{badge.title}</Text>
      <Text className="text-center font-body text-[11px] leading-[14px] text-muted">{badge.description}</Text>
    </View>
  );
}

type SettingRowProps = {
  icon: IconName;
  label: string;
  /** Si fournie, toute la ligne est touchable */
  onPress?: () => void;
  /** Texte en rouge (action dangereuse) */
  danger?: boolean;
  /** Ce qui s'affiche à droite (interrupteur, boutons…) */
  children?: ReactNode;
};

function SettingRow({ icon, label, onPress, danger = false, children }: SettingRowProps) {
  const content = (
    <View className="min-h-14 flex-row items-center gap-3 border-b border-[#F0EADF] px-4 py-2.5">
      <Ionicons name={icon} size={19} color={danger ? Colors.red : Colors.muted} />
      <Text className={`flex-1 font-body-bold text-[15px] ${danger ? "text-red" : "text-ink"}`}>{label}</Text>
      {children ?? (onPress && <Ionicons name="chevron-forward" size={18} color={Colors.disabled} />)}
    </View>
  );

  // Ligne touchable seulement si elle a une action
  return onPress ? (
    <Pressable onPress={onPress} accessibilityRole="button" className="active:bg-cream">
      {content}
    </Pressable>
  ) : (
    content
  );
}

function RoundButton({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="h-9 w-9 items-center justify-center rounded-full border-2 border-disabled active:bg-cream"
    >
      <Ionicons name={icon} size={18} color={Colors.ink} />
    </Pressable>
  );
}
