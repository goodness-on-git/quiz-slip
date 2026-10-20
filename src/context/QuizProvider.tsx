import { useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { saveState, loadState } from './persistence';
import { QuizContext } from './quizContext';
import { initialState, quizReducer } from './quizReducer';

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}
