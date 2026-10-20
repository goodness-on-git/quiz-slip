import { DEFAULT_SETTINGS } from '../lib/settings';
import type { AnswerMap, Question, QuizSettings } from '../types/quiz';

export type QuizStatus =
  | 'setup' // nothing requested yet
  | 'loading' // fetching questions
  | 'playing'
  | 'finished'
  | 'error';

export interface QuizState {
  status: QuizStatus;
  settings: QuizSettings;
  questions: Question[];
  answers: AnswerMap;
  /** Index of the question on screen. */
  current: number;
  /** Highest question index the player has reached. Used to mark skipped ones. */
  furthest: number;
  error: string | null;
}

export type QuizAction =
  | { type: 'start'; settings: QuizSettings }
  | { type: 'retry' }
  | { type: 'loaded'; questions: Question[] }
  | { type: 'failed'; message: string }
  | { type: 'answer'; letter: string }
  | { type: 'goTo'; index: number }
  | { type: 'finish' }
  | { type: 'reset' };

export const initialState: QuizState = {
  status: 'setup',
  settings: DEFAULT_SETTINGS,
  questions: [],
  answers: {},
  current: 0,
  furthest: 0,
  error: null,
};

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'start':
      return { ...initialState, settings: action.settings, status: 'loading' };

    case 'retry':
      if (state.status !== 'error') return state;
      return { ...state, status: 'loading', error: null };

    case 'loaded':
      if (state.status !== 'loading') return state;
      return {
        ...state,
        status: 'playing',
        questions: action.questions,
        answers: {},
        current: 0,
        furthest: 0,
        error: null,
      };

    case 'failed':
      if (state.status !== 'loading') return state;
      return { ...state, status: 'error', error: action.message };

    case 'answer':
      if (state.status !== 'playing') return state;
      return {
        ...state,
        answers: { ...state.answers, [state.current]: action.letter },
      };

    case 'goTo': {
      if (state.status !== 'playing') return state;
      const last = state.questions.length - 1;
      const index = Math.min(Math.max(action.index, 0), last);
      return {
        ...state,
        current: index,
        furthest: Math.max(state.furthest, index),
      };
    }

    case 'finish':
      if (state.status !== 'playing') return state;
      return { ...state, status: 'finished' };

    case 'reset':
      // Keep the last settings so the setup screen is pre-filled.
      return { ...initialState, settings: state.settings };
  }
}
