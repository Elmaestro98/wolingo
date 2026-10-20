import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { BuildSentenceStep } from "@/components/lesson/build-sentence-step";
import { ExplanationStep } from "@/components/lesson/explanation-step";
import { FeedbackPanel } from "@/components/lesson/feedback-panel";
import { FillBlankStep } from "@/components/lesson/fill-blank-step";
import { LessonComplete } from "@/components/lesson/lesson-complete";
import { LessonHeader } from "@/components/lesson/lesson-header";
import { MatchPairsStep } from "@/components/lesson/match-pairs-step";
import { MultipleChoiceStep } from "@/components/lesson/multiple-choice-step";
import { WriteTranslationStep } from "@/components/lesson/write-translation-step";
import { Button } from "@/components/ui/button";
import { PlaceholderScreen } from "@/components/ui/placeholder-screen";
import { LESSONS, type LessonStep } from "@/content/lessons";
import { computeLessonResult, XP_PER_EXERCISE, type LessonResult } from "@/lib/lesson-result";
import { MAX_HEARTS, useProgressStore } from "@/stores/progress-store";

/** Le lecteur de leçon : affiche les étapes une par une et gère le cycle Vérifier → Correction. */
export default function LessonScreen() {
  // L'id vient de l'adresse : /lesson/u1-l3 → id = "u1-l3"
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = LESSONS[id];

  // Hauteur de la barre du bas de l'iPhone, pour que le panneau coloré descende jusqu'en bas
  const insets = useSafeAreaInsets();

  // ---- Les mémoires du lecteur (toutes AVANT le premier return : règle des hooks) ----
  // La file des étapes : un exercice raté y est ajouté à la fin pour être retenté
  const [queue, setQueue] = useState<LessonStep[]>(lesson?.steps ?? []);
  const [stepIndex, setStepIndex] = useState(0);
  // null = pas encore de réponse ; true / false = réponse juste / fausse
  const [answerIsCorrect, setAnswerIsCorrect] = useState<boolean | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  // Le bilan de la leçon, pour calculer XP, précision et étoiles à la fin
  const [correctCount, setCorrectCount] = useState(0);
  const [mistakeCount, setMistakeCount] = useState(0);
  // Heure de début (en millisecondes), mémorisée une seule fois à l'ouverture
  const [startedAt] = useState(() => Date.now());

  // Le résultat final : null tant que la leçon n'est pas finie
  const [result, setResult] = useState<LessonResult | null>(null);

  // L'action du magasin qui enregistre une leçon terminée, et la série (mise à jour juste après)
  const completeLesson = useProgressStore((state) => state.completeLesson);
  const streakDays = useProgressStore((state) => state.streakDays);

  if (!lesson) {
    return (
      <PlaceholderScreen
        title="Bientôt disponible"
        description="Le contenu de cette leçon est en cours de préparation. Reviens très vite !"
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

  // ---- Valeurs calculées ----
  const step = queue[stepIndex];
  const isLastStep = stepIndex === queue.length - 1;
  const progress = stepIndex / queue.length;
  const isExercise = step.type !== "explanation";
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
    setIsChecked(false);
  }

  /** Retire une vie (sans descendre sous 0) et fait vibrer « erreur ». */
  function loseHeart() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    // Forme « fonction » de set : part de la valeur la plus récente, même si on l'appelle plusieurs fois de suite
    setHearts((current) => Math.max(current - 1, 0));
    setMistakeCount((current) => current + 1);
  }

  /** Affiche la correction. Appelée par « Vérifier », ou directement par un exercice auto-vérifié. */
  function checkAnswer(isCorrect: boolean) {
    Keyboard.dismiss(); // ferme le clavier s'il est ouvert, pour bien voir la correction
    setAnswerIsCorrect(isCorrect);
    setIsChecked(true);
    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCorrectCount((current) => current + 1);
    } else {
      loseHeart();
      // Cahier des charges : « une erreur renvoie l'exercice en fin de leçon »
      setQueue([...queue, step]);
    }
  }

  /** Appelée par l'exercice quand la réponse change (null = plus de réponse, ex. toutes les tuiles retirées). */
  function handleAnswerChange(isCorrect: boolean | null) {
    setAnswerIsCorrect(isCorrect);
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
        <LessonHeader progress={progress} hearts={hearts} onClose={handleClose} />

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
            explanation={step.type === "explanation" ? "" : step.explanation}
            xp={XP_PER_EXERCISE}
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
  onAnswerChange: (isCorrect: boolean | null) => void;
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
  }
}

/** Le texte de la bonne réponse, affiché dans le panneau rouge en cas d'erreur. */
function getCorrectAnswer(step: LessonStep): string {
  switch (step.type) {
    case "multiple_choice":
    case "fill_blank":
      // Les deux ont `choices` et `answerIndex` : même calcul
      return step.choices[step.answerIndex];
    case "build_sentence":
      return step.answer.join(" "); // ["Joob", "angiy", "dem"] → "Joob angiy dem"
    case "write_translation":
      return step.acceptedAnswers[0]; // la première réponse acceptée est la « référence »
    default:
      return "";
  }
}
