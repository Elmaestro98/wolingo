import { Text, View } from "react-native";

import { ArticleFormsBlock } from "@/components/lesson/blocks/article-forms-block";
import { ConjugationBlock } from "@/components/lesson/blocks/conjugation-block";
import { ContextExamplesBlock } from "@/components/lesson/blocks/context-examples-block";
import { NounExamplesBlock } from "@/components/lesson/blocks/noun-examples-block";
import { RelatedWordsBlock } from "@/components/lesson/blocks/related-words-block";
import { RuleBlock } from "@/components/lesson/blocks/rule-block";
import { TipBlock } from "@/components/lesson/blocks/tip-block";
import { WordHeaderBlock } from "@/components/lesson/blocks/word-header-block";
import type { CardBlock, LessonCardStepData } from "@/content/lessons";

/** Étape « fiche » (maquettes 06 et 07) : un titre puis une suite de blocs. */
export function LessonCardStep({ step }: { step: LessonCardStepData }) {
  return (
    <View className="gap-4">
      <View className="gap-1.5">
        <Text className="font-body-black text-xs uppercase tracking-[1.5px] text-yellow-text">
          {step.eyebrow}
        </Text>
        {step.title && <Text className="font-title text-[30px] leading-[33px] text-ink">{step.title}</Text>}
        {step.intro && <Text className="font-body text-base leading-6 text-muted">{step.intro}</Text>}
      </View>

      {/* Les blocs, l'un sous l'autre. La position sert de key : l'ordre des blocs ne change jamais. */}
      {step.blocks.map((block, index) => (
        <BlockView key={index} block={block} />
      ))}
    </View>
  );
}

/** Choisit le bon composant selon la sorte de bloc (même principe que StepView dans le lecteur). */
function BlockView({ block }: { block: CardBlock }) {
  switch (block.type) {
    case "rule":
      return <RuleBlock title={block.title} text={block.text} tiles={block.tiles} />;
    case "tip":
      return <TipBlock speaker={block.speaker} image={block.image} text={block.text} />;
    case "noun_examples":
      return <NounExamplesBlock title={block.title} nouns={block.nouns} />;
    case "conjugation":
      return <ConjugationBlock title={block.title} rows={block.rows} />;
    case "word_header":
      return (
        <WordHeaderBlock
          image={block.image}
          word={block.word}
          phonetic={block.phonetic}
          partOfSpeech={block.partOfSpeech}
          translation={block.translation}
          definition={block.definition}
          tags={block.tags}
          culturalNote={block.culturalNote}
        />
      );
    case "article_forms":
      return (
        <ArticleFormsBlock
          title={block.title}
          text={block.text}
          word={block.word}
          forms={block.forms}
          pluralNote={block.pluralNote}
        />
      );
    case "context_examples":
      return <ContextExamplesBlock title={block.title} examples={block.examples} />;
    case "related_words":
      return <RelatedWordsBlock title={block.title} words={block.words} />;
    default: {
      // « Vérification d'exhaustivité » : si TOUS les types sont traités au-dessus, `block` est de type
      // `never` (impossible) ici. Si on oublie un case, TypeScript refuse cette ligne → on est prévenu.
      const unhandled: never = block;
      return unhandled;
    }
  }
}
