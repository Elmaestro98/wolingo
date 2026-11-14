import type { Lesson } from "./lessons";

/**
 * Tous les textes wolof qu'on peut ÉCOUTER dans une leçon (sans doublons, dans l'ordre d'apparition).
 * Sert au script d'enregistrement (scripts/audio.mjs) et aux tests.
 * ⚠️ Import relatif (pas « @/ ») : ce fichier est aussi lu par Node.js, hors de l'app.
 */
export function collectWolofTexts(lesson: Lesson): string[] {
  const texts: string[] = [];

  for (const step of lesson.steps) {
    switch (step.type) {
      case "explanation":
        for (const example of step.examples) texts.push(example.wolof);
        break;
      case "multiple_choice":
        texts.push(step.prompt);
        break;
      case "fill_blank":
        // La phrase complète, avec le bon mot à la place du trou
        texts.push([step.before, step.choices[step.answerIndex], step.after].join(" ").trim());
        break;
      case "lesson_card":
        for (const block of step.blocks) {
          if (block.type === "context_examples") for (const example of block.examples) texts.push(example.wolof);
          if (block.type === "related_words") for (const word of block.words) texts.push(word.wolof);
        }
        break;
    }
  }
  for (const word of lesson.newWords) texts.push(word.wolof);

  return [...new Set(texts)]; // Set = enlève les doublons
}
