import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text } from 'react-native';

import { Colors } from '@/constants/theme';

/** Les 3 styles de bouton de la maquette. */
type Variant = 'primary' | 'danger' | 'white';

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  /** Affiche une flèche → après le texte */
  arrow?: boolean;
};

// Classes de chaque variante. Toujours écrire les classes EN ENTIER
// (jamais `bg-${color}`) : Tailwind cherche les noms complets dans le code.
const variants = {
  primary: { background: 'bg-green border-green-shadow', text: 'text-white', icon: Colors.white },
  danger: { background: 'bg-red border-red-shadow', text: 'text-white', icon: Colors.white },
  white: { background: 'bg-white border-green-shadow', text: 'text-green', icon: Colors.green },
};

/** Gros bouton 3D : « Continuer », « Vérifier », « Compris »… */
export function Button({ title, onPress, variant = 'primary', disabled = false, arrow = false }: Props) {
  const style = variants[variant];

  // Bouton normal : bande foncée de 5px dessous (effet 3D).
  // Quand on appuie (active:) : la bande disparaît et le bouton descend de 5px → il "s'enfonce".
  // Désactivé : pas de bande, déjà "enfoncé", couleurs grisées.
  const backgroundClasses = disabled
    ? 'mt-[5px] bg-disabled'
    : `border-b-[5px] ${style.background} active:mt-[5px] active:border-b-0`;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      className={`w-full flex-row items-center justify-center gap-2 rounded-2xl py-4 ${backgroundClasses}`}>
      <Text className={`font-body-black text-lg ${disabled ? 'text-disabled-text' : style.text}`}>
        {title}
      </Text>
      {arrow && (
        <Ionicons name="arrow-forward" size={20} color={disabled ? Colors.disabledText : style.icon} />
      )}
    </Pressable>
  );
}
