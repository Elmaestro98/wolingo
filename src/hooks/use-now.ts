import { useEffect, useState } from "react";

/**
 * Renvoie l'heure actuelle (en millisecondes) et la met à jour toutes les `intervalMs`.
 * Le composant qui l'utilise se redessine donc régulièrement : parfait pour un compte à rebours.
 *
 * C'est un « hook personnalisé » : une fonction qui commence par `use` et utilise d'autres hooks.
 */
export function useNow(intervalMs: number): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    // Toutes les `intervalMs`, on met l'heure à jour → le composant se redessine
    const timer = setInterval(() => setNow(Date.now()), intervalMs);

    // Fonction de NETTOYAGE : appelée quand le composant disparaît (ou si intervalMs change).
    // Sans elle, le minuteur continuerait de tourner pour rien, même écran fermé.
    return () => clearInterval(timer);
  }, [intervalMs]);

  return now;
}
