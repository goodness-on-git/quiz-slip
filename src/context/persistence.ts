import { readSession, writeSession } from '../lib/storage';
import { initialState, type QuizState, type QuizStatus } from './quizReducer';

export const STORAGE_KEY = 'quizslip:session:v1';

const STATUSES: readonly QuizStatus[] = [
  'setup',
  'loading',
  'playing',
  'finished',
  'error',
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isQuestion(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value.text === 'string' &&
    typeof value.category === 'string' &&
    Array.isArray(value.options) &&
    value.options.every(
      (o) =>
        isRecord(o) &&
        typeof o.letter === 'string' &&
        typeof o.text === 'string' &&
        typeof o.isCorrect === 'boolean',
    )
  );
}

/** Checks data from storage before trusting it as quiz state. */
export function isQuizState(value: unknown): value is QuizState {
  if (!isRecord(value)) return false;
  const { settings } = value;
  return (
    typeof value.status === 'string' &&
    STATUSES.includes(value.status as QuizStatus) &&
    isRecord(settings) &&
    typeof settings.amount === 'number' &&
    typeof settings.difficulty === 'string' &&
    typeof settings.format === 'string' &&
    (settings.category === null || typeof settings.category === 'number') &&
    Array.isArray(value.questions) &&
    value.questions.every(isQuestion) &&
    isRecord(value.answers) &&
    typeof value.current === 'number' &&
    typeof value.furthest === 'number' &&
    (value.error === null || typeof value.error === 'string')
  );
}

export function loadState(): QuizState {
  const saved = readSession(STORAGE_KEY);
  if (!isQuizState(saved)) return initialState;
  // A round that was playing needs its questions. If they are gone, start over.
  if (
    (saved.status === 'playing' || saved.status === 'finished') &&
    saved.questions.length === 0
  ) {
    return { ...initialState, settings: saved.settings };
  }
  return saved;
}

export function saveState(state: QuizState): void {
  writeSession(STORAGE_KEY, state);
}
