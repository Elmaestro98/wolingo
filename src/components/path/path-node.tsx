import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import type { PathItemState, PathItemStatus } from "@/lib/path";
import { QUIZ_QUESTION_COUNT } from "@/lib/quiz";

/** Hauteur de la zone de l'icône : le centre de l'icône est à la moitié (utilisé pour tracer le chemin). */
export const NODE_AREA_HEIGHT = 104;

type PathNodeProps = {
  state: PathItemState;
  /** Appelée quand on touche une leçon accessible (terminée ou en cours) */
  onPress: () => void;
};

/** Une étape du chemin : l'icône (rond, coffre ou losange) + son étiquette en dessous. */
export function PathNode({ state, onPress }: PathNodeProps) {
  const { item, status } = state;

  return (
    <View className="items-center">
      {/* Zone de hauteur fixe : toutes les icônes ont leur centre à la même hauteur */}
      <View style={{ height: NODE_AREA_HEIGHT }} className="items-center justify-center">
        {item.kind === "chest" && <ChestIcon isOpen={status === "completed"} />}
        {item.kind === "quiz" && <QuizIcon status={status} onPress={onPress} />}
        {item.kind === "lesson" && status === "completed" && (
          <CompletedLessonIcon title={item.title} onPress={onPress} />
        )}
        {item.kind === "lesson" && status === "current" && (
          <CurrentLessonIcon title={item.title} onPress={onPress} />
        )}
        {item.kind === "lesson" && status === "locked" && <LockedLessonIcon title={item.title} />}
      </View>

      <NodeLabel state={state} />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Les icônes (une par apparence)
// ---------------------------------------------------------------------------

function CompletedLessonIcon({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}, terminée. Refaire la leçon`}
      className="h-[72px] w-[72px] items-center justify-center rounded-full border-b-[6px] border-green-shadow bg-green active:mt-[6px] active:border-b-0"
    >
      <Ionicons name="checkmark-sharp" size={32} color={Colors.white} />
    </Pressable>
  );
}

/** Halo jaune + bulle noire « COMMENCER » : signale l'étape à faire maintenant (leçon ou quiz). */
function StartBubble() {
  return (
    <>
      {/* Halo jaune transparent derrière le bouton */}
      <View className="absolute h-[104px] w-[104px] rounded-full bg-yellow/30" />

      {/* Bulle noire « COMMENCER » au-dessus, avec sa petite pointe */}
      <View className="absolute -top-[40px] items-center">
        <View className="rounded-xl bg-ink px-3.5 py-[7px]">
          <Text className="font-body-black text-[13px] uppercase tracking-[0.5px] text-white">Commencer</Text>
        </View>
        {/* Triangle dessiné avec des bordures : seule la bordure du haut est colorée */}
        <View className="h-0 w-0 border-l-[7px] border-r-[7px] border-t-[8px] border-l-transparent border-r-transparent border-t-ink" />
      </View>
    </>
  );
}

function CurrentLessonIcon({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <View className="items-center justify-center">
      <StartBubble />

      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Commencer la leçon ${title}`}
        className="h-[84px] w-[84px] items-center justify-center rounded-full border-b-[6px] border-[#B8890F] bg-yellow active:mt-[6px] active:border-b-0"
      >
        <Ionicons name="play" size={34} color="#3A2A00" style={{ marginLeft: 4 }} />
      </Pressable>
    </View>
  );
}

function LockedLessonIcon({ title }: { title: string }) {
  return (
    <View
      accessible
      accessibilityLabel={`${title}, verrouillée`}
      className="h-[72px] w-[72px] items-center justify-center rounded-full border-b-[6px] border-[#D6CCBB] bg-sand"
    >
      <Ionicons name="lock-closed" size={26} color="#857A6B" />
    </View>
  );
}

function ChestIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <View
      accessible
      accessibilityLabel={isOpen ? "Coffre ouvert" : "Coffre secret, verrouillé"}
      className={`h-16 w-16 items-center justify-center rounded-[20px] border-2 border-b-[7px] ${
        isOpen
          ? "border-yellow border-b-[#B8890F] bg-yellow"
          : "border-yellow border-b-[#E8CF86] bg-yellow-light"
      }`}
    >
      <Ionicons
        name={isOpen ? "gift" : "gift-outline"}
        size={28}
        color={isOpen ? "#3A2A00" : Colors.yellowText}
      />
    </View>
  );
}

// Apparence du losange du quiz selon son état (classes écrites EN ENTIER pour Tailwind)
const QUIZ_LOOKS = {
  locked: { box: "border-[#D6CCBB] bg-sand", icon: "trophy-outline", color: "#857A6B" },
  current: { box: "border-[#B8890F] bg-yellow", icon: "trophy", color: "#3A2A00" },
  completed: { box: "border-green-shadow bg-green", icon: "trophy", color: Colors.white },
} as const;

function QuizIcon({ status, onPress }: { status: PathItemStatus; onPress: () => void }) {
  const look = QUIZ_LOOKS[status];

  // Carré tourné de 45° = losange ; l'icône est retournée de -45° pour rester droite
  const diamond = (
    <View
      className={`h-[72px] w-[72px] rotate-45 items-center justify-center rounded-[22px] border-b-[6px] ${look.box}`}
    >
      <Ionicons name={look.icon} size={30} color={look.color} style={{ transform: [{ rotate: "-45deg" }] }} />
    </View>
  );

  // Verrouillé : rien à toucher
  if (status === "locked") {
    return (
      <View accessible accessibilityLabel="Grand quiz du module, verrouillé">
        {diamond}
      </View>
    );
  }

  return (
    <View className="items-center justify-center">
      {status === "current" && <StartBubble />}
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={
          status === "current" ? "Commencer le Grand quiz du module" : "Refaire le Grand quiz"
        }
        className="active:opacity-80"
      >
        {diamond}
      </Pressable>
    </View>
  );
}

// ---------------------------------------------------------------------------
// L'étiquette sous l'icône
// ---------------------------------------------------------------------------

function NodeLabel({ state }: { state: PathItemState }) {
  const { item, status, stars, lessonNumber } = state;

  if (item.kind === "chest") {
    return (
      <View className="rounded-full bg-yellow-light px-2.5 py-1">
        <Text className="font-body-black text-[12.5px] text-[#5A4300]">
          {item.title} · +{item.xpReward} XP
        </Text>
      </View>
    );
  }

  if (item.kind === "quiz" && status === "current") {
    return (
      <View className="items-center rounded-[14px] bg-white px-3.5 py-1.5">
        <Text className="font-body-black text-[15px] text-ink">{item.title}</Text>
        <Text className="font-body-bold text-xs text-muted">
          {QUIZ_QUESTION_COUNT} questions · tout le module
        </Text>
      </View>
    );
  }

  if (item.kind === "quiz") {
    return <Text className="font-body-black text-sm text-[#3D3730]">{item.title}</Text>;
  }

  if (status === "completed") {
    return (
      <View className="flex-row items-center gap-1.5 rounded-full bg-white px-2.5 py-1">
        <Text className="font-body-black text-[13.5px] text-ink">{item.title}</Text>
        <View className="flex-row gap-px">
          {/* 3 étoiles : jaune si gagnée, grise sinon */}
          {[1, 2, 3].map((star) => (
            <Ionicons
              key={star}
              name="star"
              size={12}
              color={star <= stars ? Colors.yellow : Colors.disabled}
            />
          ))}
        </View>
      </View>
    );
  }

  if (status === "current") {
    return (
      <View className="items-center rounded-[14px] bg-white px-3.5 py-1.5">
        <Text className="font-body-black text-[15px] text-ink">{item.title}</Text>
        <Text className="font-body-bold text-xs text-muted">
          Leçon {lessonNumber} · {item.minutes} min
        </Text>
      </View>
    );
  }

  return <Text className="font-body-bold text-[13.5px] text-muted">{item.title}</Text>;
}
