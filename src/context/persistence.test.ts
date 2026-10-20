import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS } from '../lib/settings';
import { isQuizState, loadState, saveState, STORAGE_KEY } from './persistence';
import { initialState, type QuizState } from './quizReducer';

const saved: QuizState = {
  ...initialState,
  status: 'playing',
  questions: [
    {
      text: 'Q',
      category: 'Art',
      difficulty: 'hard',
      options: [{ letter: 'A', text: 'x', isCorrect: true }],
    },
  ],
  answers: { 0: 'A' },
};

describe('persistence', () => {
  it('restores what was saved', () => {
    saveState(saved);
    expect(loadState()).toEqual(saved);
  });

  it('falls back to the initial state when nothing is saved', () => {
    expect(loadState()).toEqual(initialState);
  });

  it('ignores corrupt data', () => {
    window.sessionStorage.setItem(STORAGE_KEY, '{not json');
    expect(loadState()).toEqual(initialState);
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ status: 1 }));
    expect(loadState()).toEqual(initialState);
  });

  it('starts over when a round has lost its questions', () => {
    saveState({ ...saved, questions: [] });
    expect(loadState()).toEqual({
      ...initialState,
      settings: DEFAULT_SETTINGS,
    });
  });

  it('validates the shape of state', () => {
    expect(isQuizState(saved)).toBe(true);
    expect(isQuizState(null)).toBe(false);
    expect(isQuizState({ ...saved, answers: [] })).toBe(false);
  });
});
