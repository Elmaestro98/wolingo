/**
 * Apparence des réponses à choisir, partagée par les exercices à choix (QCM, compléter la phrase…).
 * Avant la vérification : normale ou sélectionnée. Après : juste, fausse, ou pâlie.
 */
export type ChoiceLook = "idle" | "selected" | "correct" | "wrong" | "dimmed";

/** Déduit l'apparence d'une réponse à partir de la situation. */
export function getChoiceLook(
  index: number,
  selectedIndex: number | null,
  answerIndex: number,
  checked: boolean,
): ChoiceLook {
  if (!checked) return index === selectedIndex ? "selected" : "idle";
  if (index === answerIndex) return "correct";
  if (index === selectedIndex) return "wrong";
  return "dimmed";
}

/** Les classes de chaque apparence (écrites EN ENTIER pour Tailwind). */
export const CHOICE_LOOK_CLASSES: Record<
  ChoiceLook,
  { card: string; badge: string; badgeText: string; text: string }
> = {
  idle: { card: "border-sand bg-white", badge: "bg-[#F3EEE5]", badgeText: "text-[#3D3730]", text: "text-ink" },
  selected: { card: "border-green bg-green-light", badge: "bg-green", badgeText: "text-white", text: "text-green-dark" },
  correct: { card: "border-green bg-green-light", badge: "bg-green", badgeText: "text-white", text: "text-green-dark" },
  wrong: { card: "border-red bg-red-light", badge: "bg-red", badgeText: "text-white", text: "text-red-shadow" },
  dimmed: { card: "border-sand bg-white opacity-50", badge: "bg-[#F3EEE5]", badgeText: "text-[#3D3730]", text: "text-ink" },
};
