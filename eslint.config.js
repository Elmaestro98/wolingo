// Configuration d'ESLint, l'outil qui analyse le code et signale les erreurs probables.
// Doc : https://docs.expo.dev/guides/using-eslint/
const { defineConfig, globalIgnores } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const globals = require("globals");

module.exports = defineConfig([
  // Dossiers à NE PAS analyser : fichiers générés, dépendances, maquettes HTML
  globalIgnores(["dist/*", ".expo/*", "node_modules/*", "wolingo-maquettes/*"]),

  // Les règles recommandées par Expo (React, hooks, imports…)
  expoConfig,

  {
    rules: {
      // Règle pensée pour le HTML (où une apostrophe peut casser la page). Dans un <Text> React Native,
      // « J'ai déjà des bases » s'affiche sans problème : inutile d'écrire &apos; partout en français.
      "react/no-unescaped-entities": "off",
    },
  },

  // Les fichiers de configuration tournent dans Node.js (ordinateur), pas dans l'app : ils ont le droit
  // d'utiliser `module`, `require`, `__dirname`…
  {
    files: ["*.config.js"],
    languageOptions: { globals: globals.node },
  },
]);
