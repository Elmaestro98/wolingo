import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { NotificationPreview } from "@/components/onboarding/notification-preview";
import { OnboardingHeader } from "@/components/onboarding/onboarding-header";
import { Button } from "@/components/ui/button";
import { Colors } from "@/constants/theme";
import { addMinutes, formatTime, getTimeCaption } from "@/lib/time";
import { useSettingsStore } from "@/stores/settings-store";

// Heures rapides, en minutes depuis minuit (8 × 60 = 480 → 08:00)
const PRESETS = [
  { minutes: 480, label: "Réveil" },
  { minutes: 750, label: "Midi" },
  { minutes: 1140, label: "Ataya" },
  { minutes: 1290, label: "Soirée" },
];

/** Pas des boutons − et + (en minutes). */
const STEP_MINUTES = 30;

/** Écran 03 de la maquette : choix de l'heure du rappel quotidien. */
export default function ReminderScreen() {
  // Lu dans le magasin : la durée choisie à l'écran 02, et le réglage déjà enregistré
  const dailyGoalMinutes = useSettingsStore((state) => state.dailyGoalMinutes);
  const savedTime = useSettingsStore((state) => state.reminderTime);
  const savedEnabled = useSettingsStore((state) => state.reminderEnabled);
  const setReminder = useSettingsStore((state) => state.setReminder);

  // Mémoire n°1 : l'heure du rappel, en minutes depuis minuit (1140 = 19:00)
  const [reminderTime, setReminderTime] = useState(savedTime);
  // Mémoire n°2 : le rappel est-il activé ?
  const [isEnabled, setIsEnabled] = useState(savedEnabled);

  function handleContinue() {
    // Le rappel sera programmé plus tard avec expo-notifications
    setReminder(isEnabled, reminderTime);
    router.push("/onboarding/level");
  }

  // Valeurs CALCULÉES à partir des mémoires (pas besoin de les mémoriser)
  const timeLabel = formatTime(reminderTime);
  const buttonTitle = isEnabled
    ? `Activer le rappel à ${timeLabel}`
    : "Continuer sans rappel";

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 px-6 pb-6 pt-4">
        <OnboardingHeader step={2} />

        <View className="mt-[22px]">
          <NotificationPreview
            time={timeLabel}
            lessonMinutes={dailyGoalMinutes}
            dimmed={!isEnabled}
          />
        </View>

        {/* Titre */}
        <View className="mt-5 gap-2">
          <Text className="font-body-black text-xs uppercase tracking-[1.7px] text-yellow-text">
            Ton rappel
          </Text>
          <Text className="font-title text-[30px] leading-[33px] text-ink">
            On te rappelle chaque jour ?
          </Text>
          <Text className="font-body text-[15px] leading-[22px] text-muted">
            Un petit rendez-vous quotidien, c'est le secret pour parler wolof
            couramment.
          </Text>
        </View>

        {/* Carte blanche : interrupteur + réglage de l'heure */}
        <View className="mt-[18px] rounded-[22px] bg-white p-1.5">
          {/* Ligne de l'interrupteur */}
          <View className="flex-row items-center gap-3.5 py-2.5 pl-3 pr-2.5">
            <View className="h-11 w-11 items-center justify-center rounded-[14px] bg-green-light">
              <Ionicons
                name="notifications-outline"
                size={22}
                color={Colors.green}
              />
            </View>
            <View className="flex-1">
              <Text className="font-body-black text-base text-ink">
                Rappel quotidien
              </Text>
              <Text className="font-body text-[13px] text-muted">
                Une notification douce par jour
              </Text>
            </View>
            <Switch
              value={isEnabled}
              onValueChange={setIsEnabled}
              trackColor={{ true: Colors.green, false: "#CFC6B8" }}
              thumbColor={Colors.white}
              ios_backgroundColor="#CFC6B8"
              accessibilityLabel="Rappel quotidien"
            />
          </View>

          {/* Réglage de l'heure : grisé et non cliquable si le rappel est désactivé */}
          <View
            pointerEvents={isEnabled ? "auto" : "none"}
            className={`mt-1 gap-3.5 border-t border-[#F0EADF] px-2.5 pb-2.5 pt-4 ${
              isEnabled ? "" : "opacity-40"
            }`}
          >
            {/* − 19:00 + */}
            <View className="flex-row items-center justify-between">
              <Pressable
                onPress={() =>
                  setReminderTime(addMinutes(reminderTime, -STEP_MINUTES))
                }
                accessibilityLabel={`Reculer de ${STEP_MINUTES} minutes`}
                className="h-12 w-12 items-center justify-center rounded-full border-2 border-disabled bg-white active:bg-cream"
              >
                <Ionicons name="remove" size={22} color={Colors.ink} />
              </Pressable>

              <View className="items-center gap-0.5">
                <Text className="font-title text-[46px] leading-[50px] text-ink">
                  {timeLabel}
                </Text>
                <Text className="font-body-bold text-[13px] text-green">
                  {getTimeCaption(reminderTime)}
                </Text>
              </View>

              <Pressable
                onPress={() =>
                  setReminderTime(addMinutes(reminderTime, STEP_MINUTES))
                }
                accessibilityLabel={`Avancer de ${STEP_MINUTES} minutes`}
                className="h-12 w-12 items-center justify-center rounded-full border-2 border-disabled bg-white active:bg-cream"
              >
                <Ionicons name="add" size={22} color={Colors.ink} />
              </Pressable>
            </View>

            {/* Heures rapides : celle qui correspond à l'heure choisie est en vert */}
            <View className="flex-row gap-1.5">
              {PRESETS.map((preset) => {
                const isSelected = preset.minutes === reminderTime;
                return (
                  <Pressable
                    key={preset.minutes}
                    onPress={() => setReminderTime(preset.minutes)}
                    className={`h-14 flex-1 items-center justify-center rounded-[14px] border-2 ${
                      isSelected
                        ? "border-green bg-green"
                        : "border-sand bg-cream"
                    }`}
                  >
                    <Text
                      className={`font-body-black text-[15px] ${isSelected ? "text-white" : "text-ink"}`}
                    >
                      {formatTime(preset.minutes)}
                    </Text>
                    <Text
                      className={`font-body-bold text-[11px] ${isSelected ? "text-white" : "text-ink"} opacity-85`}
                    >
                      {preset.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        {/* Astuce du chauffeur */}
        <View className="mt-3.5 flex-row items-center gap-3 rounded-2xl bg-yellow-light px-3.5 py-3">
          <View className="h-9 w-9 items-center justify-center rounded-full bg-yellow">
            <Ionicons name="cafe-outline" size={18} color="#3A2A00" />
          </View>
          <Text className="flex-1 font-body text-[13px] leading-[18px] text-[#5A4300]">
            <Text className="font-body-black text-[#3A2A00]">
              Astuce du chauffeur :
            </Text>{" "}
            à l'heure de l'ataya, révise quelques mots entre deux verres de thé.
          </Text>
        </View>

        <View className="flex-1" />

        <Button
          title={buttonTitle}
          arrow
          onPress={handleContinue}
        />

        {/* « Pas maintenant » n'apparaît que si le rappel est activé : il le désactive */}
        {isEnabled && (
          <Pressable
            onPress={() => setIsEnabled(false)}
            className="mt-2 h-11 items-center justify-center"
          >
            <Text className="font-body-black text-[15px] text-muted">
              Pas maintenant
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}
