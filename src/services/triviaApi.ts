import { shuffle } from '../lib/shuffle';
import type { Question, QuizSettings } from '../types/quiz';

const ENDPOINT = 'https://opentdb.com/api.php';

export type TriviaErrorCode =
  | 'network'
  | 'rate-limit'
  | 'no-results'
  | 'unknown';

export class TriviaApiError extends Error {
  readonly code: TriviaErrorCode;

  constructor(code: TriviaErrorCode, message: string) {
    super(message);
    this.name = 'TriviaApiError';
    this.code = code;
  }
}

const MESSAGES: Record<TriviaErrorCode, string> = {
  network:
    "Couldn't reach the trivia server. Check your connection and try again.",
  'rate-limit':
    'The trivia server needs a short break between rounds. Wait a few seconds and try again.',
  'no-results':
    "There aren't enough questions for those settings. Try fewer questions or a different topic.",
  unknown: 'The trivia server sent an unexpected response. Try again.',
};

interface ApiQuestion {
  type: 'multiple' | 'boolean';
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface ApiResponse {
  response_code: number;
  results?: ApiQuestion[];
}

export function buildUrl(settings: QuizSettings): string {
  const params = new URLSearchParams({
    amount: String(settings.amount),
    // Percent-encoded text lets us decode safely instead of injecting HTML.
    encode: 'url3986',
  });
  if (settings.category !== null) {
    params.set('category', String(settings.category));
  }
  if (settings.difficulty !== 'any') {
    params.set('difficulty', settings.difficulty);
  }
  if (settings.format !== 'any') {
    params.set('type', settings.format);
  }
  return `${ENDPOINT}?${params.toString()}`;
}

function decode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function toQuestion(
  api: ApiQuestion,
  random: () => number = Math.random,
): Question {
  const correct = decode(api.correct_answer);
  const incorrect = api.incorrect_answers.map(decode);

  // True/False keeps its natural order. Multiple choice is shuffled.
  const texts =
    api.type === 'boolean'
      ? ['True', 'False']
      : shuffle([...incorrect, correct], random);

  return {
    text: decode(api.question),
    category: decode(api.category),
    difficulty: api.difficulty,
    options: texts.map((text, i) => ({
      letter: String.fromCharCode(65 + i),
      text,
      isCorrect: text === correct,
    })),
  };
}

// The API allows one request every 5 seconds. Identical requests that overlap
// (React StrictMode runs effects twice in development) share one network call.
const inFlight = new Map<string, Promise<Question[]>>();

export function fetchQuestions(
  settings: QuizSettings,
  random: () => number = Math.random,
): Promise<Question[]> {
  const url = buildUrl(settings);
  const existing = inFlight.get(url);
  if (existing) return existing;

  const request = load(url, random).finally(() => {
    inFlight.delete(url);
  });
  inFlight.set(url, request);
  return request;
}

async function load(url: string, random: () => number): Promise<Question[]> {
  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw new TriviaApiError('network', MESSAGES.network);
  }

  if (response.status === 429) {
    throw new TriviaApiError('rate-limit', MESSAGES['rate-limit']);
  }
  if (!response.ok) {
    throw new TriviaApiError('unknown', MESSAGES.unknown);
  }

  let data: ApiResponse;
  try {
    data = (await response.json()) as ApiResponse;
  } catch {
    throw new TriviaApiError('unknown', MESSAGES.unknown);
  }

  // The API reports most problems inside a 200 response.
  switch (data.response_code) {
    case 0:
      break;
    case 1:
      throw new TriviaApiError('no-results', MESSAGES['no-results']);
    case 5:
      throw new TriviaApiError('rate-limit', MESSAGES['rate-limit']);
    default:
      throw new TriviaApiError('unknown', MESSAGES.unknown);
  }

  if (!Array.isArray(data.results) || data.results.length === 0) {
    throw new TriviaApiError('no-results', MESSAGES['no-results']);
  }

  return data.results.map((q) => toQuestion(q, random));
}
