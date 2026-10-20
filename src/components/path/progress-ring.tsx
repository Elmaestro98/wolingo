import Svg, { Circle } from "react-native-svg";

import { Colors } from "@/constants/theme";

type ProgressRingProps = {
  /** Avancement entre 0 (vide) et 1 (plein) */
  progress: number;
  size?: number;
  strokeWidth?: number;
};

/** Anneau de progression (objectif du jour). Dessiné en SVG. */
export function ProgressRing({ progress, size = 40, strokeWidth = 5 }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2; // rayon du cercle, bordure comprise
  const circumference = 2 * Math.PI * radius; // longueur totale du tour
  const clamped = Math.min(Math.max(progress, 0), 1); // force la valeur entre 0 et 1

  return (
    // rotation -90° : le remplissage démarre en haut (midi) au lieu de la droite (3 h)
    <Svg width={size} height={size} style={{ transform: [{ rotate: "-90deg" }] }}>
      {/* Le rail gris : un cercle complet */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={Colors.sand}
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* La partie verte : un trait en pointillés dont le "trou" cache la partie non atteinte */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={Colors.green}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - clamped)}
      />
    </Svg>
  );
}
