export type Difficulty = 'any' | 'easy' | 'medium' | 'hard';
export type QuestionFormat = 'any' | 'multiple' | 'boolean';

/** What the player asked for on the setup screen. */
export interface QuizSettings {
  amount: number;
  /** Open Trivia DB category id, or null for "anything". */
  category: number | null;
  difficulty: Difficulty;
  format: QuestionFormat;
}

export interface AnswerOption {
  /** "A", "B", "C"... Used as the option's identity inside a question. */
  letter: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  text: string;
  category: string;
  difficulty: Exclude<Difficulty, 'any'>;
  options: AnswerOption[];
}

/** Question index -> the letter of the option the player picked. */
export type AnswerMap = Record<number, string>;

export type QuestionResult = 'correct' | 'wrong' | 'skipped';
