import { AiFeedback, Topic, TranslationResult } from '../types/dayline';

export const topics: Topic[] = [
  {
    id: 'daylight',
    title: 'My Quiet Victory Today',
    description: 'A small success you are proud of, no matter how small it is.',
    words: [
      { word: 'accomplish', meaning: 'to achieve or complete' },
      { word: 'steady', meaning: 'stable and not changing' },
      { word: 'rewarding', meaning: 'bringing satisfaction or benefit' },
      { word: 'moment', meaning: 'a short period of time' },
      { word: 'confidence', meaning: 'feeling of trust or certainty' },
    ],
    vibe: 'calm',
  },
  {
    id: 'people',
    title: 'A Conversation That Stayed With Me',
    description: 'Describe a recent chat, call, or comment that felt meaningful.',
    words: [
      { word: 'genuine', meaning: 'real and sincere' },
      { word: 'listen', meaning: 'to pay attention to someone' },
      { word: 'respect', meaning: 'to show appreciation' },
      { word: 'tone', meaning: 'a style or attitude in speaking' },
      { word: 'unexpected', meaning: 'not expected' },
    ],
    vibe: 'warm',
  },
  {
    id: 'future',
    title: 'Tomorrow-I Can-Do List',
    description: 'Plan one short goal for tomorrow and one feeling you want to keep.',
    words: [
      { word: 'focus', meaning: 'concentrate on one thing' },
      { word: 'habit', meaning: 'a regular behavior' },
      { word: 'simple', meaning: 'easy or uncomplicated' },
      { word: 'balance', meaning: 'a good proportion or stability' },
      { word: 'motivate', meaning: 'to give someone a reason to act' },
    ],
    vibe: 'bright',
  },
];

export const translationDb: Record<string, Omit<TranslationResult, 'query'>> = {
  accomplish: {
    meaning: 'to accomplish / to achieve',
    expression: 'accomplish your goal',
    example: 'I want to accomplish one clear task before bedtime.',
  },
  steady: {
    meaning: 'calm and stable',
    expression: 'Take steady steps.',
    example: 'A steady pace helps keep the work less stressful.',
  },
  reward: {
    meaning: 'reward, result, satisfaction',
    expression: 'It feels very rewarding.',
    example: 'Helping others feels rewarding.',
  },
  genuine: {
    meaning: 'sincere, genuine',
    expression: 'a genuine smile',
    example: 'She gave a genuine thank you.',
  },
  motivate: {
    meaning: 'to motivate, to give energy',
    expression: 'Stay motivated',
    example: 'A short goal helps me stay motivated.',
  },
};

export const aiFeedback: AiFeedback = {
  summary: 'Your diary is clear and easy to follow overall.',
  corrections: [
    {
      original: 'I also did my presentation.',
      corrected: 'I also finished my presentation.',
      reason: 'finished is more natural when you complete a task like a presentation.',
    },
  ],
  encouragement: 'The message is already clear. Keep writing with the same pace and add one more reflective sentence.',
};

export const toDateInputValue = (date: Date): string => date.toISOString().slice(0, 10);
export const todayDate = toDateInputValue(new Date());
export const getDefaultTopicId = (): string => topics[0]?.id ?? '';

export const formatDateLabel = (date: string) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', weekday: 'short' }).format(new Date(date));

export const getLookupResult = (query: string): TranslationResult => {
  const normalized = query.trim().toLowerCase();
  const foundKey = Object.keys(translationDb).find(
    (word) => normalized === word || normalized.includes(word),
  );

  return foundKey
    ? { query, ...translationDb[foundKey] }
    : {
        query,
        meaning: 'context check needed',
        expression: 'Expression can change by sentence structure.',
        example: 'Use a few related expressions and check which tone sounds most natural.',
      };
};
