import type { ImageSourcePropType } from "react-native";

/**
 * Catalogue des images utilisées dans le contenu des leçons.
 * Le contenu ne contient qu'un NOM (ex. "man") ; ce catalogue le relie au fichier.
 * Pourquoi ? `require()` exige un chemin écrit en toutes lettres : impossible de le construire
 * à partir d'une variable. Pour ajouter une image : la copier dans assets/images/content/ + une ligne ici.
 */
export const CONTENT_IMAGES = {
  man: require("@/assets/images/content/man.jpg"),
  sheep: require("@/assets/images/content/sheep.png"),
  awa: require("@/assets/images/content/awa.png"),
  coin500: require("@/assets/images/content/coin-500.jpg"),
} satisfies Record<string, ImageSourcePropType>;

/** Les noms d'images autorisés : "man" | … (TypeScript refusera un nom qui n'existe pas) */
export type ContentImageName = keyof typeof CONTENT_IMAGES;
