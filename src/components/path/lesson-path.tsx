import { Image, useWindowDimensions, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { NODE_AREA_HEIGHT, PathNode } from "@/components/path/path-node";
import { SpeechBubble } from "@/components/ui/speech-bubble";
import { Colors } from "@/constants/theme";
import { getZigzagOffset, type PathItemState } from "@/lib/path";

/** Hauteur réservée à chaque étape (icône + étiquette + espace). */
const ROW_HEIGHT = 165;

type Point = { x: number; y: number };

type LessonPathProps = {
  states: PathItemState[];
  /** Appelée avec l'id de la leçon touchée */
  onOpenLesson: (lessonId: string) => void;
};

/** Le chemin en zigzag : les étapes l'une sous l'autre, reliées par un trait courbe. */
export function LessonPath({ states, onOpenLesson }: LessonPathProps) {
  // Largeur de l'écran du téléphone (se met à jour toute seule si l'écran tourne)
  const { width } = useWindowDimensions();
  const totalHeight = states.length * ROW_HEIGHT;

  // Centre de chaque icône : milieu de l'écran + décalage du zigzag ; une ligne plus bas à chaque étape
  const points: Point[] = states.map((_, index) => ({
    x: width / 2 + getZigzagOffset(index),
    y: index * ROW_HEIGHT + NODE_AREA_HEIGHT / 2,
  }));

  // Le trait est vert jusqu'à l'étape en cours, puis en pointillés
  const currentIndex = states.findIndex((state) => state.status === "current");
  const splitIndex = currentIndex === -1 ? points.length - 1 : currentIndex;
  const donePoints = points.slice(0, splitIndex + 1); // de la 1re étape à l'étape en cours
  const todoPoints = points.slice(splitIndex); //         de l'étape en cours à la dernière

  return (
    <View style={{ height: totalHeight }}>
      {/* 1. Le trait, dessiné EN PREMIER pour être DERRIÈRE les icônes */}
      <Svg width={width} height={totalHeight} style={{ position: "absolute" }}>
        {todoPoints.length > 1 && (
          <Path
            d={buildCurve(todoPoints)}
            stroke={Colors.sand}
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray="1 16"
            fill="none"
          />
        )}
        {donePoints.length > 1 && (
          <Path d={buildCurve(donePoints)} stroke={Colors.green} strokeWidth={8} strokeLinecap="round" fill="none" />
        )}
      </Svg>

      {/* 2. Les étapes, chacune décalée horizontalement (translateX) */}
      {states.map((state, index) => (
        <View
          key={state.item.id}
          className="items-center"
          style={{ height: ROW_HEIGHT, transform: [{ translateX: getZigzagOffset(index) }] }}
        >
          <PathNode state={state} onPress={() => onOpenLesson(state.item.id)} />
        </View>
      ))}

      {/* 3. La mascotte, à hauteur de l'étape en cours, du côté opposé au zigzag */}
      {currentIndex !== -1 && (
        <PathMascot
          top={currentIndex * ROW_HEIGHT}
          side={getZigzagOffset(currentIndex) > 0 ? "left" : "right"}
        />
      )}
    </View>
  );
}

/** La mascotte et sa bulle d'encouragement, posées par-dessus le chemin. */
function PathMascot({ top, side }: { top: number; side: "left" | "right" }) {
  return (
    <View
      // pointerEvents="none" : la mascotte ne bloque pas les touchers sur le chemin derrière elle
      pointerEvents="none"
      className={`absolute w-[132px] gap-2 ${side === "left" ? "left-5 items-start" : "right-5 items-end"}`}
      style={{ top }}
    >
      <SpeechBubble title="Dalal ak jàmm !" subtitle="On reprend là où tu t'es arrêté ?" />
      <Image
        source={require("@/assets/images/mascot.png")}
        className="h-16 w-16 rounded-full border-[3px] border-white"
      />
    </View>
  );
}

/**
 * Construit le "chemin" SVG (attribut `d`) qui passe par tous les points avec des courbes douces.
 * M x y = poser le crayon ; C … = courbe de Bézier vers le point suivant.
 * Les deux points de contrôle sont à mi-hauteur : la courbe part et arrive verticalement.
 */
function buildCurve(points: Point[]): string {
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const previous = points[i - 1];
    const point = points[i];
    const midY = (previous.y + point.y) / 2;
    d += ` C ${previous.x} ${midY}, ${point.x} ${midY}, ${point.x} ${point.y}`;
  }
  return d;
}
