/**
 * Charte graphique Wolingo (relevée dans la maquette).
 * Mêmes valeurs que dans tailwind.config.js : à utiliser quand une couleur
 * doit être passée en JavaScript (icônes, barre d'onglets…).
 */
export const Colors = {
  green: '#0B5D3B',
  greenDark: '#08462C',
  greenLight: '#E3F1E8',
  greenShadow: '#063A24',
  yellow: '#F2C230',
  yellowLight: '#FCEFC7',
  yellowText: '#8A5A00',
  red: '#C0262D',
  redLight: '#FDECEC',
  redShadow: '#8E1B20',
  disabled: '#E6DFD3',
  disabledText: '#6B6258',
  cream: '#FBF7F0',
  sand: '#ECE5D9',
  white: '#FFFFFF',
  ink: '#1E1B16',
  muted: '#5E564C',
} as const;

/** Noms des fichiers de police (pour les endroits où on ne peut pas utiliser className). */
export const Fonts = {
  title: 'BricolageGrotesque_800ExtraBold',
  bodyBold: 'NunitoSans_700Bold',
  bodyBlack: 'NunitoSans_800ExtraBold',
} as const;
