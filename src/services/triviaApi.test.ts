import { afterEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_SETTINGS } from '../lib/settings';
import type { QuizSettings } from '../types/quiz';
import { buildUrl, fetchQuestions, toQuestion } from './triviaApi';

const apiQuestion = {
  type: 'multiple' as const,
  difficulty: 'medium' as const,
  category: 'Science%20%26%20Nature',
  question: 'What%20is%20the%20%22speed%22%20of%20light%3F%20%3Cb%3E',
  correct_answer: 'About%20300%2C000%20km%2Fs',
  incorrect_answers: ['Slow', 'Medium', 'Fast'],
};

function respondWith(body: unknown, init: { status?: number } = {}) {
  return vi.fn(async () => {
    const status = init.status ?? 200;
    return {
      ok: status >= 200 && status < 300,
      status,
      json: async () => body,
    } as Response;
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('buildUrl', () => {
  it('always asks for encoded text and leaves out "any" filters', () => {
    const url = new URL(buildUrl(DEFAULT_SETTINGS));
    expect(url.searchParams.get('amount')).toBe('10');
    expect(url.searchParams.get('encode')).toBe('url3986');
    expect(url.searchParams.has('category')).toBe(false);
    expect(url.searchParams.has('difficulty')).toBe(false);
    expect(url.searchParams.has('type')).toBe(false);
  });

  it('includes the filters the player chose', () => {
    const settings: QuizSettings = {
      amount: 5,
      category: 17,
      difficulty: 'hard',
      format: 'boolean',
    };
    const url = new URL(buildUrl(settings));
    expect(url.searchParams.get('category')).toBe('17');
    expect(url.searchParams.get('difficulty')).toBe('hard');
    expect(url.searchParams.get('type')).toBe('boolean');
  });
});

describe('toQuestion', () => {
  it('decodes text as plain strings, not HTML', () => {
    const question = toQuestion(apiQuestion, () => 0);
    expect(question.text).toBe('What is the "speed" of light? <b>');
    expect(question.category).toBe('Science & Nature');
  });

  it('labels options A to D and flags the correct one', () => {
    const question = toQuestion(apiQuestion, () => 0);
    expect(question.options.map((o) => o.letter)).toEqual(['A', 'B', 'C', 'D']);
    const correct = question.options.filter((o) => o.isCorrect);
    expect(correct).toHaveLength(1);
    expect(correct[0]?.text).toBe('About 300,000 km/s');
  });

  it('keeps True before False for true/false questions', () => {
    const question = toQuestion(
      {
        ...apiQuestion,
        type: 'boolean',
        correct_answer: 'False',
        incorrect_answers: ['True'],
      },
      () => 0,
    );
    expect(question.options.map((o) => o.text)).toEqual(['True', 'False']);
    expect(question.options[1]?.isCorrect).toBe(true);
  });
});

describe('fetchQuestions', () => {
  it('returns decoded questions on success', async () => {
    vi.stubGlobal(
      'fetch',
      respondWith({ response_code: 0, results: [apiQuestion] }),
    );
    const questions = await fetchQuestions(DEFAULT_SETTINGS);
    expect(questions).toHaveLength(1);
    expect(questions[0]?.difficulty).toBe('medium');
  });

  it('shares one request between identical calls made together', async () => {
    const fetchMock = respondWith({ response_code: 0, results: [apiQuestion] });
    vi.stubGlobal('fetch', fetchMock);
    await Promise.all([
      fetchQuestions(DEFAULT_SETTINGS),
      fetchQuestions(DEFAULT_SETTINGS),
    ]);
    expect(fetchMock.mock.calls).toHaveLength(1);
  });

  it('reports "no results" from the response code', async () => {
    vi.stubGlobal('fetch', respondWith({ response_code: 1, results: [] }));
    await expect(fetchQuestions(DEFAULT_SETTINGS)).rejects.toMatchObject({
      code: 'no-results',
    });
  });

  it('reports rate limiting from the HTTP status', async () => {
    vi.stubGlobal('fetch', respondWith({}, { status: 429 }));
    await expect(fetchQuestions(DEFAULT_SETTINGS)).rejects.toMatchObject({
      code: 'rate-limit',
    });
  });

  it('reports rate limiting from the response code', async () => {
    vi.stubGlobal('fetch', respondWith({ response_code: 5 }));
    await expect(fetchQuestions(DEFAULT_SETTINGS)).rejects.toMatchObject({
      code: 'rate-limit',
    });
  });

  it('reports network failures', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new TypeError('Failed to fetch');
      }),
    );
    await expect(fetchQuestions(DEFAULT_SETTINGS)).rejects.toMatchObject({
      code: 'network',
    });
  });
});
