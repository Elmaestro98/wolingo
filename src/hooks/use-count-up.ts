import { useEffect, useState } from "react";

/**
 * Fait « défiler » un nombre de 0 jusqu'à `target` (comme un compteur de score), puis s'arrête.
 * Le défilement ralentit à la fin : il démarre vite et se pose en douceur sur le résultat.
 *
 * @param durationMs durée du défilement, en millisecondes
 * @param delayMs attente avant de commencer (pour suivre l'apparition de la carte)
 */
export function useCountUp(target: number, durationMs = 800, delayMs = 0): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    let startTime: number | null = null;

    // requestAnimationFrame : le téléphone nous rappelle à chaque nouvelle image (~60 fois par seconde)
    function tick(time: number) {
      startTime ??= time; // la première image fixe l'heure de départ
      const elapsed = Math.min((time - startTime) / durationMs, 1); // de 0 (début) à 1 (fin)
      const eased = 1 - (1 - elapsed) ** 3; // courbe qui ralentit vers la fin
      setValue(Math.round(target * eased));
      if (elapsed < 1) frame = requestAnimationFrame(tick);
    }

    const timer = setTimeout(() => {
      frame = requestAnimationFrame(tick);
    }, delayMs);

    // Nettoyage : si l'écran se ferme pendant le défilement, on arrête tout
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [target, durationMs, delayMs]);

  return value;
}
