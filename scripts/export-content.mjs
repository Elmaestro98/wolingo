/**
 * Exporte TOUT le texte wolof de l'app dans un fichier CSV (ouvrable dans Excel / Google Sheets),
 * pour la relecture par un locuteur natif. Lancer avec : npm run content:export
 *
 * Ce script tourne sur l'ORDINATEUR (Node.js), jamais dans l'app.
 */
import { mkdirSync, writeFileSync } from "node:fs";

// Node sait lire directement un fichier TypeScript grâce à l'option --experimental-strip-types
// (voir la commande dans package.json)
import { LESSONS } from "../src/content/lessons.ts";

const OUTPUT_DIR = "content-review";
const OUTPUT_FILE = `${OUTPUT_DIR}/wolof-a-relire.csv`;

/** Toutes les lignes du tableau : [leçon, étape, type, wolof, français] */
const rows = [];

function add(lesson, stepNumber, kind, wolof, french = "") {
  rows.push([`${lesson.id} · ${lesson.title}`, stepNumber, kind, wolof, french]);
}

for (const lesson of Object.values(LESSONS)) {
  for (const word of lesson.newWords) add(lesson, "mots", "nouveau mot", word.wolof, word.french);

  lesson.steps.forEach((step, index) => {
    const n = index + 1;
    switch (step.type) {
      case "explanation":
        for (const ex of step.examples) add(lesson, n, "exemple", ex.wolof, ex.french);
        break;
      case "multiple_choice":
        add(lesson, n, "QCM (phrase)", step.prompt, step.choices[step.answerIndex]);
        break;
      case "fill_blank":
        add(lesson, n, "compléter", [step.before, step.choices[step.answerIndex], step.after].join(" ").trim(), step.translation);
        break;
      case "match_pairs":
        for (const pair of step.pairs) add(lesson, n, "associer", `${pair.wolof} ${pair.article}`, pair.french);
        break;
      case "build_sentence":
        add(lesson, n, "construire", step.answer.join(" "), step.sourceText);
        break;
      case "write_translation":
        for (const answer of step.acceptedAnswers) add(lesson, n, "écrire (réponse acceptée)", answer, step.sourceText);
        break;
      case "derem":
        for (const choice of step.choices) add(lesson, n, "dërëm", choice.wolof, `${choice.derem} dërëm`);
        break;
      case "lesson_card":
        for (const block of step.blocks) {
          if (block.type === "conjugation") for (const r of block.rows) add(lesson, n, "conjugaison", `${r.stem}${r.ending}`, r.french);
          if (block.type === "context_examples") for (const ex of block.examples) add(lesson, n, "exemple", ex.wolof, ex.french);
          if (block.type === "related_words") for (const w of block.words) add(lesson, n, "mot", w.wolof, w.french);
          if (block.type === "article_forms") for (const f of block.forms) add(lesson, n, "article", `${block.word} ${f.article}`, f.french);
          if (block.type === "noun_examples") for (const noun of block.nouns) add(lesson, n, "exemple", `${noun.noun} ${noun.classLetter}i`, noun.near);
          if (block.type === "word_header") add(lesson, n, "fiche mot", block.word, block.translation);
        }
        break;
    }
  });
}

/** Met une valeur entre guillemets pour le CSV (et double les guillemets à l'intérieur). */
const cell = (value) => `"${String(value).replaceAll('"', '""')}"`;

const header = ["Leçon", "Étape", "Type", "Wolof", "Français", "Correction (relecteur)"];
// Séparateur « ; » : c'est celui qu'Excel attend en français
const csv = [header, ...rows.map((row) => [...row, ""])].map((row) => row.map(cell).join(";")).join("\r\n");

mkdirSync(OUTPUT_DIR, { recursive: true });
// "﻿" au début : indique à Excel que le fichier est en UTF-8 (sinon ë, ñ, ŋ s'affichent mal)
writeFileSync(OUTPUT_FILE, "﻿" + csv, "utf8");

console.log(`✅ ${rows.length} lignes de wolof exportées dans ${OUTPUT_FILE}`);
