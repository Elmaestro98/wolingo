<p align="center">
  <img src="assets/logo.png" alt="Logo Wolingo" width="160">
</p>

<h1 align="center">Wolingo</h1>

<p align="center">
  Apprends le wolof en t'amusant — leçons courtes, quiz animés, audio natif, 100 % hors ligne.
</p>

---

## À propos

Wolingo est une application mobile (Android et iOS) pour apprendre le wolof à partir du français. Elle adapte le cours « Initiation au Wolof — Méthode rapide » de Xavier Bry en 10 modules interactifs : explications courtes, exercices, quiz, écoute et prononciation.

Projet développé par **AFRICATECHNOLOGIE / E-DEV** — Saint-Louis, Sénégal.

Le cahier des charges complet est dans [`CAHIER_DES_CHARGES.md`](CAHIER_DES_CHARGES.md).

## Fonctionnalités (V1)

- **Parcours en 11 modules** (sons + unités 1 à 10) : présent démonstratif, classes nominales, pronoms, possessifs, accompli, questions, nombres et dërëm, impératif, futur, passés, conditionnel.
- **Exercices variés** : QCM, traduction FR ↔ WO, construction de phrase par tuiles, écoute, prononciation, conversion FCFA ↔ dërëm.
- **Correction tolérante** sur les accents (ë/é) et les variantes acceptées.
- **Gamification** : XP, série de jours, badges, révision espacée (J+1, J+3, J+7).
- **Animations** : tuiles glissantes, confettis, secousse sur erreur, retour haptique.
- **Hors ligne** : contenu, audio et progression stockés sur le téléphone, sans compte.

## Stack technique

| Besoin | Outil |
| --- | --- |
| Framework | Expo + React Native + TypeScript |
| Navigation | Expo Router |
| Animations | Reanimated, Gesture Handler, Lottie |
| Audio | expo-audio |
| Stockage | expo-sqlite + Drizzle ORM, contenu en JSON |
| État | Zustand |
| Styles | NativeWind (Tailwind) |
| Notifications | expo-notifications |
| Tests | Jest, React Native Testing Library, Zod |
| Build | EAS Build / Submit / Update |

## Structure du projet (prévue)

```
wolingo/
├── src/
│   ├── app/                    # Écrans (Expo Router)
│   │   ├── (tabs)/             # Parcours, Révision, Lexique, Profil
│   │   └── lecon/[id].tsx      # Lecteur de leçon
│   ├── components/
│   │   ├── exercices/          # QCM, Traduction, OrdreMots, Ecoute, Prononciation, Nombres
│   │   └── ui/                 # Boutons, cartes, barre de progression, mascotte
│   ├── content/
│   │   ├── modules/            # module-00.json … module-10.json
│   │   ├── lexique.json        # Banque de mots
│   │   └── schema.ts           # Schémas Zod du contenu
│   ├── constants/theme.ts      # Couleurs de la charte
│   └── lib/
│       ├── db/                 # SQLite + Drizzle (progression)
│       ├── correcteur.ts       # Comparaison tolérante des réponses
│       ├── revision.ts         # Révision espacée
│       └── gamification.ts     # XP, série, badges
├── assets/
│   ├── audio/                  # Fichiers M4A nommés par audioId
│   ├── animations/             # Fichiers Lottie
│   └── logo.png
├── CAHIER_DES_CHARGES.md
└── README.md
```

## Démarrage

Prérequis : Node.js LTS, l'application **Expo Go** sur ton téléphone (ou un émulateur Android / simulateur iOS).

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npx expo start

# Valider les fichiers de contenu
npm run content:check

# Générer la liste des audios à enregistrer
npm run audio:list
```

Scanne le QR code avec Expo Go pour ouvrir l'app.

## Ajouter du contenu

Le contenu ne touche pas au code : chaque module est un fichier JSON dans `content/modules/`.

```json
{
  "id": "u1-l3-e05",
  "type": "ordre_mots",
  "consigne": "Traduis : Diop est en train de s'en aller",
  "tuiles": ["Joob", "angiy", "dem", "mungi"],
  "reponses_acceptees": ["Joob angiy dem"],
  "audioId": "u1-joob-angiy-dem",
  "explication": "Nom + a + ngi + di se contracte en « angiy »."
}
```

Types d'exercice : `qcm`, `traduction_fr_wo`, `traduction_wo_fr`, `ordre_mots`, `ecoute`, `prononciation`, `nombres`.

Tout nouveau contenu wolof doit être relu par un locuteur natif avant fusion.

## Charte graphique

| Couleur | Code | Usage |
| --- | --- | --- |
| Vert | `#00773D` | Couleur principale, bonnes réponses |
| Jaune | `#FFC003` | XP, série, badges |
| Rouge | `#E40718` | Erreurs |
| Blanc | `#FFFFFF` | Fond |

## Feuille de route

- [ ] Lot 1 — Fondations (projet Expo, moteur de leçon, SQLite)
- [ ] Lot 2 — Composants d'exercice et animations
- [ ] Lot 3 — Contenu des modules 0 à 3 + audio
- [ ] Lot 4 — Parcours, XP, série, badges, révision
- [ ] Lot 5 — Bêta fermée (MVP)
- [ ] Lot 6 — Modules 4 à 10
- [ ] Lot 7 — Publication sur les stores

## Crédits

- Cours d'origine : *Initiation au Wolof — Méthode rapide*, Xavier Bry, relu par Maïmouna Kane. Adaptation soumise à l'accord de l'auteur.
- Conception et développement : AFRICATECHNOLOGIE / E-DEV — africatechnologie9@gmail.com

## Licence

Tous droits réservés © 2026 AFRICATECHNOLOGIE. Le contenu pédagogique reste la propriété de ses auteurs.
