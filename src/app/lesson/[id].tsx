import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { BuildSentenceStep } from "@/components/lesson/build-sentence-step";
import { ExplanationStep } from "@/components/lesson/explanation-step";
import { FeedbackPanel } from "@/components/lesson/feedback-panel";
import { FillBlankStep } from "@/components/lesson/fill-blank-step";
import { LessonCardStep } from "@/components/lesson/lesson-card-step";
import { LessonComplete } from "@/components/lesson/lesson-complete";
import { LessonHeader } from "@/components/lesson/lesson-header";
import { MatchPairsStep } from "@/components/lesson/match-pairs-step";
import { MultipleChoiceStep } from "@/components/lesson/multiple-choice-step";
import { OutOfHearts } from "@/components/lesson/out-of-hearts";
import { WriteTranslationStep } from "@/components/lesson/write-translation-step";
import { DeremStep } from "@/components/lesson/derem-step";
import { Button } from "@/components/ui/button";
import { PlaceholderScreen } from "@/components/ui/placeholder-screen";
import { LESSONS, type LessonStep } from "@/content/lessons";
import { useNow } from "@/hooks/use-now";
import { findDeremAnswerIndex } from "@/lib/derem";
import { computeHearts } from "@/lib/hearts";
import { computeLessonResult, XP_PER_EXERCISE, type LessonResult } from "@/lib/lesson-result";
import { areAllLessonsCompleted } from "@/lib/path";
import { buildModuleQuiz, findModuleOfItem, isExerciseStep } from "@/lib/quiz";
import { buildReviewSession, getStepRef, REVIEW_SESSION_ID } from "@/lib/review";
import { useProgressStore } from "@/stores/progress-store";
import { useSettingsStore } from "@/stores/settings-store";

/** Le lecteur de leçon : affiche les étapes une par une et gère le cycle Vérifier → Correction. */
export default function LessonScreen() {
  // L'id vient de l'adresse : /lesson/u1-l3 → id = "u1-l3"
  const { id } = useLocalSearchParams<{ id: string }>();
  const reviewItems = useProgressStore((state) => state.reviewItems);
  const isReviewSession = id === REVIEW_SESSION_ID;

  // 3 sortes de séances : une leçon écrite à la main, le Grand quiz (tiré au hasard),
  // ou la révision du jour (les exercices ratés à revoir aujourd'hui).
  // useState(() => …) FIGE le résultat : sinon la séance changerait de questions à chaque redessin !
  const [lesson] = useState(
    () =>
      LESSONS[id] ??
      buildModuleQuiz(id) ??
      (isReviewSession ? buildReviewSession(reviewItems, new Date()) : undefined),
  );

  // Hauteur de la barre du bas de l'iPhone, pour que le panneau coloré descende jusqu'en bas
  const insets = useSafeAreaInsets();

  // ---- Les mémoires du lecteur (toutes AVANT le premier return : règle des hooks) ----
  // La file des étapes : un exercice raté y est ajouté à la fin pour être retenté
  const [queue, setQueue] = useState<LessonStep[]>(lesson?.steps ?? []);
  const [stepIndex, setStepIndex] = useState(0);
  // null = pas encore de réponse ; true / false = réponse juste / fausse
  const [answerIsCorrect, setAnswerIsCorrect] = useState<boolean | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  // Ce que l'utilisateur a répondu (pour « Ta réponse » dans le panneau d'erreur) ; null si rien de textuel
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  // Le bilan de la leçon, pour calculer XP, précision et étoiles à la fin
  const [correctCount, setCorrectCount] = useState(0);
  const [mistakeCount, setMistakeCount] = useState(0);
  // Heure de début (en millisecondes), mémorisée une seule fois à l'ouverture
  const [startedAt] = useState(() => Date.now());
  // Les exercices ratés PENDANT cette séance : réussis au 2e essai, ils ne montent pas de palier
  const [missedThisSession, setMissedThisSession] = useState<string[]>([]);

  // Le résultat final : null tant que la leçon n'est pas finie
  const [result, setResult] = useState<LessonResult | null>(null);

  // L'action du magasin qui enregistre une leçon terminée, et la série (mise à jour juste après)
  const completeLesson = useProgressStore((state) => state.completeLesson);
  const streakDays = useProgressStore((state) => state.streakDays);
  const completedLessons = useProgressStore((state) => state.completedLessons);

  // Défense en profondeur : un quiz ne se joue que si TOUTES les leçons de son module sont bouclées,
  // même si on arrive ici par un autre chemin que le Parcours (lien direct, menu développeur…)
  const lessonModule = findModuleOfItem(id);
  const isQuiz = lessonModule?.items.find((item) => item.id === id)?.kind === "quiz";
  const isQuizLocked =
    isQuiz && lessonModule !== undefined && !areAllLessonsCompleted(lessonModule.items, completedLessons);

  // Les vies : sauvegardées dans le magasin (elles se rechargent même app fermée)
  const isPremium = useSettingsStore((state) => state.isPremium);
  const savedHearts = useProgressStore((state) => state.hearts);
  const heartsRefillStartedAt = useProgressStore((state) => state.heartsRefillStartedAt);
  const loseStoredHeart = useProgressStore((state) => state.loseHeart);

  // La révision espacée
  const scheduleReview = useProgressStore((state) => state.scheduleReview);
  const markReviewSuccess = useProgressStore((state) => state.markReviewSuccess);

  // L'heure actuelle, gardée en MÉMOIRE (useNow) et rafraîchie toutes les 30 s.
  // Jamais Date.now() directement pendant l'affichage : il doit rester « pur » (règle react-hooks/purity).
  const now = useNow(30_000);

  const heartsState = { hearts: savedHearts, refillStartedAt: heartsRefillStartedAt };
  // Vies À CET INSTANT (sauvegardées + regagnées depuis)
  const currentHearts = computeHearts(heartsState, now).hearts;
  const isOutOfHearts = !isPremium && currentHearts === 0;

  if (!lesson) {
    return (
      <PlaceholderScreen
        title={isReviewSession ? "Rien à réviser" : "Bientôt disponible"}
        description={
          isReviewSession
            ? "Aucun exercice à revoir aujourd'hui. Reviens demain, ou fais une nouvelle leçon !"
            : "Le contenu de cette leçon est en cours de préparation. Reviens très vite !"
        }
      >
        <Button title="Retour au parcours" variant="white" onPress={() => router.back()} />
      </PlaceholderScreen>
    );
  }

  // Leçon finie : tout l'écran est remplacé par le bilan
  if (result) {
    return (
      <LessonComplete
        lessonTitle={lesson.title}
        result={result}
        streakDays={streakDays}
        newWords={lesson.newWords}
        onContinue={() => router.back()}
      />
    );
  }

  // Quiz demandé alors qu'une leçon du module n'est pas encore bouclée
  if (isQuizLocked) {
    return (
      <PlaceholderScreen
        title="Pas encore !"
        description="Termine d'abord toutes les leçons du module : le Grand quiz vient tout à la fin."
      >
        <Button title="Retour au parcours" variant="white" onPress={() => router.back()} />
      </PlaceholderScreen>
    );
  }

  // Plus de vies (version gratuite) : la leçon s'arrête.
  // « && !isChecked » : on laisse d'abord l'utilisateur lire la correction de sa dernière erreur.
  if (isOutOfHearts && !isChecked) {
    return <OutOfHearts savedHearts={heartsState} onBack={() => router.back()} />;
  }

  // ---- Valeurs calculées ----
  const step = queue[stepIndex];
  const isLastStep = stepIndex === queue.length - 1;
  const progress = stepIndex / queue.length;
  // Les explications et les fiches ne sont pas des exercices : on avance avec « Continuer »
  const isExercise = isExerciseStep(step);
  // « Associer » se vérifie paire par paire, tout seul : pas de bouton « Vérifier »
  const isAutoChecked = step.type === "match_pairs";

  /** Fin de la leçon : calcule le résultat, l'enregistre, puis affiche le bilan. */
  function finishLesson() {
    const lessonResult = computeLessonResult(correctCount, mistakeCount, Date.now() - startedAt);
    completeLesson(lesson.id, lessonResult); // sauvegarde (la série est mise à jour dans le magasin)
    setResult(lessonResult); // → au prochain affichage, `if (result)` montre l'écran de bilan
  }

  function goToNextStep() {
    if (isLastStep) {
      finishLesson();
      return;
    }
    setStepIndex(stepIndex + 1);
    // Remise à zéro pour l'étape suivante
    setAnswerIsCorrect(null);
    setUserAnswer(null);
    setIsChecked(false);
  }

  /** Une erreur : vibration, compteur d'erreurs, et une vie en moins (sauf Premium : vies illimitées). */
  function loseHeart() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    setMistakeCount((current) => current + 1);
    if (!isPremium) {
      loseStoredHeart();
    }
  }

  /** Affiche la correction. Appelée par « Vérifier », ou directement par un exercice auto-vérifié. */
  function checkAnswer(isCorrect: boolean) {
    Keyboard.dismiss(); // ferme le clavier s'il est ouvert, pour bien voir la correction
    setAnswerIsCorrect(isCorrect);
    setIsChecked(true);
    // Référence stable de l'exercice (« u1-l3#4 ») pour la révision espacée
    const stepRef = getStepRef(step);
    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCorrectCount((current) => current + 1);
      // En révision, une réussite du 1er coup fait monter l'exercice d'un palier (J+3, J+7, puis maîtrisé)
      if (isReviewSession && stepRef && !missedThisSession.includes(stepRef)) markReviewSuccess(stepRef);
    } else {
      loseHeart();
      // Cahier des charges : « une erreur renvoie l'exercice en fin de leçon »…
      setQueue([...queue, step]);
      // … et le programme en révision pour demain (J+1)
      if (stepRef) {
        scheduleReview(stepRef);
        setMissedThisSession([...missedThisSession, stepRef]);
      }
    }
  }

  /**
   * Appelée par l'exercice quand la réponse change (null = plus de réponse, ex. toutes les tuiles retirées).
   * `answerText` (facultatif) : ce que l'utilisateur a répondu, pour l'afficher en cas d'erreur.
   */
  function handleAnswerChange(isCorrect: boolean | null, answerText?: string) {
    setAnswerIsCorrect(isCorrect);
    setUserAnswer(answerText ?? null);
    if (isAutoChecked && isCorrect !== null) {
      checkAnswer(isCorrect); // pas de bouton : on vérifie tout de suite
    }
  }

  function handleClose() {
    Alert.alert("Quitter la leçon ?", "Ta progression dans cette leçon sera perdue.", [
      { text: "Continuer la leçon", style: "cancel" },
      { text: "Quitter", style: "destructive", onPress: () => router.back() },
    ]);
  }

  return (
    // edges={["top"]} : le bas est géré à la main (insets) pour que le panneau coloré aille jusqu'au bord
    <SafeAreaView edges={["top"]} className="flex-1 bg-cream">
      {/* Sur iPhone, quand le clavier s'ouvre, tout ce qui est dedans remonte (le bouton reste visible) */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        {/* null = vies illimitées (affiche « ∞ ») */}
        <LessonHeader progress={progress} hearts={isPremium ? null : currentHearts} onClose={handleClose} />

        {/* key={stepIndex} : à chaque nouvelle étape, tout est recréé à neuf (défilement ET choix de l'exercice).
          keyboardShouldPersistTaps : un toucher sur un bouton (ex. « ë ») agit même si le clavier est ouvert */}
        <ScrollView
          key={stepIndex}
          className="flex-1"
          contentContainerClassName="px-5 pb-6 pt-2"
          keyboardShouldPersistTaps="handled"
        >
          <StepView
            step={step}
            checked={isChecked}
            onAnswerChange={handleAnswerChange}
            onMistake={loseHeart}
          />
        </ScrollView>

        {/* Bas de l'écran : 3 cas possibles */}
        {isChecked ? (
          // 3. Après « Vérifier » : le panneau de correction
          <FeedbackPanel
            isCorrect={answerIsCorrect === true}
            correctAnswer={getCorrectAnswer(step)}
            userAnswer={userAnswer}
            translation={getAnswerTranslation(step)}
            explanation={getStepExplanation(step)}
            xp={XP_PER_EXERCISE}
            // Une vie n'est perdue que pour un utilisateur gratuit
            heartLost={!isPremium}
            bottomInset={insets.bottom}
            onContinue={goToNextStep}
          />
        ) : isAutoChecked ? (
          // Exercice auto-vérifié : rien en bas tant qu'il n'est pas terminé (juste l'espace du bas de l'iPhone)
          <View style={{ height: insets.bottom }} />
        ) : (
          <View style={{ paddingBottom: insets.bottom + 8 }} className="border-t border-[#F0EADF] px-5 pt-4">
            {isExercise ? (
              // 2. Exercice : « Vérifier », grisé tant qu'aucune réponse n'est donnée
              <Button
                title="Vérifier"
                disabled={answerIsCorrect === null}
                onPress={() => checkAnswer(answerIsCorrect === true)}
              />
            ) : (
              // 1. Explication : on avance directement
              <Button title={isLastStep ? "Terminer" : "Continuer"} onPress={goToNextStep} />
            )}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type StepViewProps = {
  step: LessonStep;
  checked: boolean;
  onAnswerChange: (isCorrect: boolean | null, answerText?: string) => void;
  onMistake: () => void;
};

/** Choisit le bon composant selon la sorte d'étape (`step.type`). */
function StepView({ step, checked, onAnswerChange, onMistake }: StepViewProps) {
  switch (step.type) {
    case "explanation":
      return (
        <ExplanationStep
          eyebrow={step.eyebrow}
          title={step.title}
          text={step.text}
          examples={step.examples}
        />
      );
    case "lesson_card":
      return <LessonCardStep step={step} />;
    case "multiple_choice":
      return <MultipleChoiceStep step={step} checked={checked} onAnswerChange={onAnswerChange} />;
    case "fill_blank":
      return <FillBlankStep step={step} checked={checked} onAnswerChange={onAnswerChange} />;
    case "match_pairs":
      return (
        <MatchPairsStep step={step} checked={checked} onAnswerChange={onAnswerChange} onMistake={onMistake} />
      );
    case "build_sentence":
      return <BuildSentenceStep step={step} checked={checked} onAnswerChange={onAnswerChange} />;
    case "write_translation":
      return <WriteTranslationStep step={step} checked={checked} onAnswerChange={onAnswerChange} />;
    case "derem":
      return <DeremStep step={step} checked={checked} onAnswerChange={onAnswerChange} />;
    default: {
      // Vérification d'exhaustivité : TypeScript refuse cette ligne si un type d'étape est oublié
      const unhandled: never = step;
      return unhandled;
    }
  }
}

/** Le texte de la bonne réponse, affiché dans le panneau rouge en cas d'erreur. */
function getCorrectAnswer(step: LessonStep): string {
  switch (step.type) {
    case "multiple_choice":
      return step.choices[step.answerIndex];
    case "fill_blank":
      // La phrase ENTIÈRE avec le bon mot (comme la réponse envoyée par l'exercice), pour comparer mot à mot
      return [step.before, step.choices[step.answerIndex], step.after]
        .filter((part) => part !== "")
        .join(" ");
    case "build_sentence":
      return step.answer.join(" "); // ["Joob", "angiy", "dem"] → "Joob angiy dem"
    case "write_translation":
      return step.acceptedAnswers[0]; // la première réponse acceptée est la « référence »
    case "derem": {
      // La bonne réponse est calculée, comme dans l'exercice
      const index = findDeremAnswerIndex(
        step.priceCfa,
        step.choices.map((choice) => choice.derem),
      );
      return step.choices[index]?.wolof ?? "";
    }
    default:
      return "";
  }
}

/** La traduction française de la bonne réponse, quand l'exercice en a une (sinon undefined). */
function getAnswerTranslation(step: LessonStep): string | undefined {
  switch (step.type) {
    case "fill_blank":
      return step.translation;
    case "build_sentence":
    case "write_translation":
      return step.sourceText; // la phrase française de départ
    default:
      return undefined;
  }
}

/** L'explication affichée dans le panneau de correction (les explications et fiches n'en ont pas). */
function getStepExplanation(step: LessonStep): string {
  switch (step.type) {
    case "explanation":
    case "lesson_card":
      return "";
    default:
      // Ici, TypeScript sait qu'il ne reste que des exercices : tous ont un champ `explanation`
      return step.explanation;
  }
}
