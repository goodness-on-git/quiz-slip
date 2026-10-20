import { useEffect } from 'react';
import { useQuiz } from '../context/useQuiz';
import { fetchQuestions, TriviaApiError } from '../services/triviaApi';

/**
 * Fetches questions whenever the quiz is in the "loading" state.
 * Also covers a page refresh in the middle of loading.
 */
export function useQuestionLoader() {
  const { state, dispatch } = useQuiz();
  const { status, settings } = state;

  useEffect(() => {
    if (status !== 'loading') return;

    // If the player leaves before the answer arrives, drop the result.
    let ignore = false;

    fetchQuestions(settings)
      .then((questions) => {
        if (!ignore) dispatch({ type: 'loaded', questions });
      })
      .catch((error: unknown) => {
        if (ignore) return;
        const message =
          error instanceof TriviaApiError
            ? error.message
            : 'Something went wrong. Try again.';
        dispatch({ type: 'failed', message });
      });

    return () => {
      ignore = true;
    };
  }, [status, settings, dispatch]);
}
