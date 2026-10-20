import type { AnswerMap, Question, QuestionResult } from '../types/quiz';

export function getResult(
  question: Question,
  pickedLetter: string | undefined,
): QuestionResult {
  if (pickedLetter === undefined) return 'skipped';
  const picked = question.options.find((o) => o.letter === pickedLetter);
  return picked?.isCorrect ? 'correct' : 'wrong';
}

export function countCorrect(
  questions: readonly Question[],
  answers: AnswerMap,
): number {
  return questions.filter((q, i) => getResult(q, answers[i]) === 'correct')
    .length;
}

export function countAnswered(answers: AnswerMap): number {
  return Object.keys(answers).length;
}

export function getPercentage(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

export function getVerdict(percentage: number): string {
  if (percentage === 100) return 'A perfect round.';
  if (percentage >= 80) return 'Sharp. Hard to fault that round.';
  if (percentage >= 60) return 'A solid round.';
  if (percentage >= 40) return 'Mixed. Some good ones in there.';
  return 'A tough round. The review below shows where it slipped.';
}
