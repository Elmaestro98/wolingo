/**
 * Transforme un texte wolof en NOM DE FICHIER audio (sans l'extension).
 * Exemples : « Jërëjëf » → « jerejef », « Nanga def ? » → « nanga-def ».
 *
 * 1. ñ et ŋ sont de VRAIES lettres en wolof (ñu = ils, nu = nous) : on les écrit « ny » et « ng »
 * 2. normalize("NFD") sépare chaque lettre de son accent (ë devient e + ¨)
 * 3. on supprime les accents, on met en minuscules
 * 4. tout ce qui n'est pas une lettre ou un chiffre devient un tiret
 */
export function audioKey(wolof: string): string {
  return wolof
    .toLowerCase()
    .replace(/ñ/g, "ny")
    .replace(/ŋ/g, "ng")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // les accents séparés à l'étape 2
    .replace(/[^a-z0-9]+/g, "-") // espaces, « ? », apostrophes… → tiret
    .replace(/^-+|-+$/g, ""); // pas de tiret au début ni à la fin
}
