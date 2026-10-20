import { describe, expect, it } from 'vitest';
import type { Question } from '../types/quiz';
import {
  countAnswered,
  countCorrect,
  getPercentage,
  getResult,
  getVerdict,
} from './score';

const question: Question = {
  text: 'Which planet is closest to the sun?',
  category: 'Science & Nature',
  difficulty: 'easy',
  options: [
    { letter: 'A', text: 'Venus', isCorrect: false },
    { letter: 'B', text: 'Mercury', isCorrect: true },
  ],
};

describe('getResult', () => {
  it('marks the right pick as correct', () => {
    expect(getResult(question, 'B')).toBe('correct');
  });

  it('marks the wrong pick as wrong', () => {
    expect(getResult(question, 'A')).toBe('wrong');
  });

  it('marks no pick as skipped', () => {
    expect(getResult(question, undefined)).toBe('skipped');
  });
});

describe('counting', () => {
  const questions = [question, question, question];

  it('counts only correct answers', () => {
    expect(countCorrect(questions, { 0: 'B', 1: 'A' })).toBe(1);
  });

  it('counts answered questions', () => {
    expect(countAnswered({ 0: 'B', 2: 'A' })).toBe(2);
  });
});

describe('getPercentage', () => {
  it('rounds to a whole number', () => {
    expect(getPercentage(1, 3)).toBe(33);
  });

  it('returns 0 when there are no questions', () => {
    expect(getPercentage(0, 0)).toBe(0);
  });
});

describe('getVerdict', () => {
  it('has a line for a perfect score and for a low one', () => {
    expect(getVerdict(100)).toBe('A perfect round.');
    expect(getVerdict(10).startsWith('A tough round')).toBe(true);
  });
});
