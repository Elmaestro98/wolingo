import { Image, Text, View } from "react-native";

type NotificationPreviewProps = {
  /** Heure affichée en haut à droite (ex. « 19:00 ») */
  time: string;
  /** Durée de la leçon annoncée */
  lessonMinutes: number;
  /** Atténue l'aperçu quand le rappel est désactivé */
  dimmed?: boolean;
};

/** Aperçu de la notification de rappel, comme elle apparaîtra sur le téléphone (écran 03). */
export function NotificationPreview({ time, lessonMinutes, dimmed = false }: NotificationPreviewProps) {
  return (
    <View className="pb-2">
      {/* Fausse 2e notification "empilée" derrière, pour l'effet de pile */}
      <View className="absolute bottom-0 left-4 right-4 h-10 rounded-[18px] bg-[#EFE7D8]" />

      <View
        className={`flex-row items-center gap-3 rounded-[20px] bg-white px-3.5 py-3 shadow-md ${
          dimmed ? "opacity-[0.45]" : ""
        }`}
      >
        <Image
          source={require("@/assets/images/mascot-bell.png")}
          className="h-12 w-12 rounded-[14px] bg-yellow-light"
        />
        <View className="flex-1 gap-0.5">
          <View className="flex-row justify-between">
            <Text className="font-body-black text-[11.5px] uppercase tracking-[0.9px] text-muted">
              Wolingo
            </Text>
            <Text className="font-body-bold text-xs text-muted">{time}</Text>
          </View>
          <Text className="font-body-black text-[15px] text-ink">Nanga def ! C'est l'heure du wolof</Text>
          <Text className="font-body text-[13.5px] text-muted">
            Ta leçon de {lessonMinutes} min t'attend.
          </Text>
        </View>
      </View>
    </View>
  );
}
