import { useContext } from 'react';
import { QuizContext, type QuizContextValue } from './quizContext';

export function useQuiz(): QuizContextValue {
  const value = useContext(QuizContext);
  if (value === null) {
    throw new Error('useQuiz must be used inside <QuizProvider>.');
  }
  return value;
}
