import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS } from '../lib/settings';
import type { Question } from '../types/quiz';
import {
  initialState,
  quizReducer,
  type QuizAction,
  type QuizState,
} from './quizReducer';

const questions: Question[] = [0, 1, 2].map((n) => ({
  text: `Question ${n}`,
  category: 'General Knowledge',
  difficulty: 'easy',
  options: [
    { letter: 'A', text: 'Right', isCorrect: true },
    { letter: 'B', text: 'Wrong', isCorrect: false },
  ],
}));

function run(actions: QuizAction[], from: QuizState = initialState) {
  return actions.reduce(quizReducer, from);
}

const playing = run([
  { type: 'start', settings: DEFAULT_SETTINGS },
  { type: 'loaded', questions },
]);

describe('quizReducer', () => {
  it('starts loading with the chosen settings', () => {
    const settings = { ...DEFAULT_SETTINGS, amount: 3 };
    const state = run([{ type: 'start', settings }]);
    expect(state.status).toBe('loading');
    expect(state.settings).toEqual(settings);
  });

  it('moves to playing when questions arrive', () => {
    expect(playing.status).toBe('playing');
    expect(playing.questions).toHaveLength(3);
    expect(playing.current).toBe(0);
  });

  it('records an error and allows a retry', () => {
    const failed = run([
      { type: 'start', settings: DEFAULT_SETTINGS },
      { type: 'failed', message: 'Nope' },
    ]);
    expect(failed.status).toBe('error');
    expect(failed.error).toBe('Nope');
    expect(quizReducer(failed, { type: 'retry' }).status).toBe('loading');
  });

  it('ignores a late response after the player has left', () => {
    const state = run([
      { type: 'start', settings: DEFAULT_SETTINGS },
      { type: 'reset' },
      { type: 'loaded', questions },
    ]);
    expect(state.status).toBe('setup');
  });

  it('stores an answer for the current question and lets it change', () => {
    const state = run(
      [
        { type: 'answer', letter: 'B' },
        { type: 'goTo', index: 1 },
        { type: 'answer', letter: 'A' },
        { type: 'goTo', index: 0 },
        { type: 'answer', letter: 'A' },
      ],
      playing,
    );
    expect(state.answers).toEqual({ 0: 'A', 1: 'A' });
  });

  it('keeps goTo inside the question range and tracks the furthest', () => {
    expect(quizReducer(playing, { type: 'goTo', index: 99 }).current).toBe(2);
    expect(quizReducer(playing, { type: 'goTo', index: -4 }).current).toBe(0);
    const back = run(
      [
        { type: 'goTo', index: 2 },
        { type: 'goTo', index: 0 },
      ],
      playing,
    );
    expect(back.furthest).toBe(2);
  });

  it('only accepts answers while playing', () => {
    expect(quizReducer(initialState, { type: 'answer', letter: 'A' })).toBe(
      initialState,
    );
  });

  it('finishes a round', () => {
    expect(quizReducer(playing, { type: 'finish' }).status).toBe('finished');
  });

  it('reset clears the round but keeps the settings', () => {
    const settings = { ...DEFAULT_SETTINGS, category: 17 };
    const state = run([
      { type: 'start', settings },
      { type: 'loaded', questions },
      { type: 'answer', letter: 'A' },
      { type: 'finish' },
      { type: 'reset' },
    ]);
    expect(state.status).toBe('setup');
    expect(state.questions).toEqual([]);
    expect(state.answers).toEqual({});
    expect(state.settings).toEqual(settings);
  });
});
