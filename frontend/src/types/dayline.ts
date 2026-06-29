export type Vocabulary = {
  word: string;
  meaning: string;
  pron?: string;
};

export type Topic = {
  id: string;
  title: string;
  description: string;
  words: Vocabulary[];
  vibe: string;
};

export type TranslationResult = {
  query: string;
  meaning: string;
  expression: string;
  example: string;
};

export type TranslationApiResult = {
  text: string;
  translation: string;
  pron?: string;
};

export type Correction = {
  original: string;
  corrected: string;
  reason: string;
};

export type AiFeedback = {
  summary: string;
  corrections: Correction[];
  encouragement: string;
};
