/**
 * Les voix wolof. Lancer avec : npm run audio -- u1-l1   (l'id de la leçon est facultatif)
 *
 * 1. Affiche les textes à enregistrer pour la leçon, avec le NOM DE FICHIER à utiliser,
 *    et coche ceux déjà présents dans assets/audio/.
 * 2. Régénère src/content/audio-manifest.ts : la liste des sons que l'app connaît.
 *    (L'app ne peut pas « fouiller » un dossier : chaque son doit être écrit dans ce fichier.)
 *
 * Ce script tourne sur l'ORDINATEUR (Node.js), jamais dans l'app.
 */
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { extname, basename } from "node:path";

import { LESSONS } from "../src/content/lessons.ts";
import { collectWolofTexts } from "../src/content/wolof-texts.ts";
import { audioKey } from "../src/lib/audio-key.ts";

const AUDIO_DIR = "assets/audio";
const MANIFEST_FILE = "src/content/audio-manifest.ts";
const EXTENSIONS = [".m4a", ".mp3", ".wav"];

mkdirSync(AUDIO_DIR, { recursive: true });

// Les fichiers audio déjà déposés : « jerejef » → « jerejef.m4a »
const files = new Map();
for (const file of readdirSync(AUDIO_DIR)) {
  if (EXTENSIONS.includes(extname(file).toLowerCase())) files.set(basename(file, extname(file)), file);
}

// Tous les textes wolof de l'app, rangés par nom de fichier
const allKeys = new Map();
for (const lesson of Object.values(LESSONS)) {
  for (const text of collectWolofTexts(lesson)) allKeys.set(audioKey(text), text);
}

// 1. La liste d'enregistrement d'une leçon
const lessonId = process.argv[2];
if (lessonId) {
  const lesson = LESSONS[lessonId];
  if (!lesson) {
    console.error(`❌ Leçon « ${lessonId} » introuvable. Exemple : npm run audio -- u1-l1`);
    process.exit(1);
  }
  const texts = collectWolofTexts(lesson);
  const done = texts.filter((text) => files.has(audioKey(text))).length;
  console.log(`\n🎙️  ${lesson.id} · ${lesson.title} : ${done}/${texts.length} enregistrés\n`);
  for (const text of texts) {
    const mark = files.has(audioKey(text)) ? "✅" : "⬜";
    console.log(`  ${mark}  ${text.padEnd(28)} →  ${AUDIO_DIR}/${audioKey(text)}.m4a`);
  }
  console.log("");
}

// Des fichiers qui ne correspondent à aucun texte ? (faute de frappe dans le nom)
for (const key of files.keys()) {
  if (!allKeys.has(key)) console.warn(`⚠️  ${AUDIO_DIR}/${files.get(key)} ne correspond à aucun texte wolof (nom mal écrit ?)`);
}

// 2. Le manifeste : seulement les fichiers qui correspondent à un texte
const lines = [...files.keys()]
  .filter((key) => allKeys.has(key))
  .sort()
  .map((key) => `  "${key}": require("@/assets/audio/${files.get(key)}"), // ${allKeys.get(key)}`);

writeFileSync(
  MANIFEST_FILE,
  `// ⚠️ Fichier GÉNÉRÉ par « npm run audio » : ne pas modifier à la main.
import type { AudioSource } from "expo-audio";

/** Les voix wolof disponibles, rangées par nom de fichier (voir lib/audio-key.ts). */
export const WOLOF_AUDIO: Record<string, AudioSource> = {
${lines.join("\n")}
};
`,
);
console.log(`📝 ${MANIFEST_FILE} : ${lines.length} voix connues de l'app.`);
