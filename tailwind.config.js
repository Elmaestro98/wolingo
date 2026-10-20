/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Couleurs relevées dans la maquette (wolingo-maquettes).
      // Mêmes valeurs que dans src/constants/theme.ts : modifier les deux ensemble.
      colors: {
        green: {
          DEFAULT: '#0B5D3B', // boutons, titres de mots, bonne réponse   → bg-green
          dark: '#08462C', //    zones vert foncé                        → bg-green-dark
          light: '#E3F1E8', //   fond d'une carte sélectionnée          → bg-green-light
          shadow: '#063A24', //  bande 3D sous le bouton vert           → border-green-shadow
        },
        yellow: {
          DEFAULT: '#F2C230', // XP, série, bouton « Commencer »
          light: '#FCEFC7', //   encadrés « astuce »
          text: '#8A5A00', //    petits surtitres (« TON RYTHME »)       → text-yellow-text
        },
        red: {
          DEFAULT: '#C0262D', // mauvaise réponse, cœurs
          light: '#FDECEC', //   fond du panneau d'erreur
          shadow: '#8E1B20', //  bande 3D sous le bouton rouge
        },
        disabled: {
          DEFAULT: '#E6DFD3', // fond d'un bouton désactivé              → bg-disabled
          text: '#6B6258', //    texte d'un bouton désactivé            → text-disabled-text
        },
        cream: '#FBF7F0', //     fond des écrans                         → bg-cream
        sand: '#ECE5D9', //      bordures                                → border-sand
        ink: '#1E1B16', //       texte principal                         → text-ink
        muted: '#5E564C', //     texte secondaire                        → text-muted
      },
      // Une police par épaisseur : en React Native, `font-bold` ne marche pas
      // avec une police personnalisée, il faut nommer le bon fichier.
      fontFamily: {
        title: ['BricolageGrotesque_800ExtraBold'], //           font-title
        'title-medium': ['BricolageGrotesque_600SemiBold'], //  font-title-medium
        body: ['NunitoSans_400Regular'], //                      font-body
        'body-medium': ['NunitoSans_600SemiBold'], //           font-body-medium
        'body-bold': ['NunitoSans_700Bold'], //                 font-body-bold
        'body-black': ['NunitoSans_800ExtraBold'], //           font-body-black
      },
    },
  },
  plugins: [],
};
