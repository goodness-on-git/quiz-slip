import type { QuizSettings } from '../types/quiz';

export const MIN_QUESTIONS = 1;
export const MAX_QUESTIONS = 50;

export const DEFAULT_SETTINGS: QuizSettings = {
  amount: 10,
  category: null,
  difficulty: 'any',
  format: 'any',
};

/** Turns whatever was typed into a whole number the API accepts. */
export function clampAmount(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_SETTINGS.amount;
  return Math.min(MAX_QUESTIONS, Math.max(MIN_QUESTIONS, Math.round(value)));
}
