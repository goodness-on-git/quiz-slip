import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AnswerChoice } from '../components/AnswerChoice';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { QuestionNav } from '../components/QuestionNav';
import { useQuiz } from '../context/useQuiz';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useQuestionLoader } from '../hooks/useQuestionLoader';
import { countAnswered } from '../lib/score';
import styles from './QuizPage.module.css';

export function QuizPage() {
  useDocumentTitle('Quiz');
  useQuestionLoader();
  const { state } = useQuiz();

  switch (state.status) {
    case 'setup':
      return <Navigate to="/" replace />;
    case 'finished':
      return <Navigate to="/results" replace />;
    case 'loading':
      return <LoadingView />;
    case 'error':
      return <ErrorView />;
    case 'playing':
      return <ActiveQuiz />;
  }
}

function LoadingView() {
  return (
    <div className="page">
      <div role="status">
        <p className={styles.loadingText}>Fetching your questions</p>
        <span className={styles.loadingBar} aria-hidden="true" />
      </div>
    </div>
  );
}

function ErrorView() {
  const { state, dispatch } = useQuiz();
  return (
    <div className="page">
      <h1 className={styles.errorTitle}>
        We couldn&rsquo;t load your questions.
      </h1>
      <p className={styles.errorText}>{state.error}</p>
      <div className={styles.errorActions}>
        <button
          type="button"
          className="button buttonPrimary"
          onClick={() => dispatch({ type: 'retry' })}
        >
          Try again
        </button>
        <button
          type="button"
          className="button"
          onClick={() => dispatch({ type: 'reset' })}
        >
          Change settings
        </button>
      </div>
    </div>
  );
}

function ActiveQuiz() {
  const { state, dispatch } = useQuiz();
  const { questions, answers, current, furthest } = state;
  const [dialog, setDialog] = useState<'finish' | 'quit' | null>(null);

  // Answer with the A to D keys.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (document.querySelector('dialog[open]')) return;
      const target = event.target;
      if (
        target instanceof HTMLSelectElement ||
        target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      const letter = event.key.toUpperCase();
      const option = questions[current]?.options.find(
        (o) => o.letter === letter,
      );
      if (option) dispatch({ type: 'answer', letter });
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [questions, current, dispatch]);

  const question = questions[current];
  if (!question) return <Navigate to="/" replace />;

  const total = questions.length;
  const answered = countAnswered(answers);
  const unanswered = total - answered;
  const isFirst = current === 0;
  const isLast = current === total - 1;

  return (
    <div className="page">
      <div className={styles.topbar}>
        <p className={styles.count}>
          {answered} of {total} answered
        </p>
        <button
          type="button"
          className="button buttonQuiet"
          onClick={() => setDialog('quit')}
        >
          Quit
        </button>
      </div>

      <QuestionNav
        total={total}
        current={current}
        furthest={furthest}
        answers={answers}
        onSelect={(index) => dispatch({ type: 'goTo', index })}
      />

      <section className={styles.section}>
        {/* Announces the new question when the player moves on. */}
        <div aria-live="polite" aria-atomic="true">
          <p className={styles.meta}>
            <span>
              Question {current + 1} of {total}
            </span>
            <span>{question.category}</span>
            <span className={styles.difficulty}>{question.difficulty}</span>
          </p>
          <h1 className={styles.question}>{question.text}</h1>
        </div>

        <fieldset className={styles.options}>
          <legend className="srOnly">Choose an answer</legend>
          {question.options.map((option) => (
            <AnswerChoice
              key={`${current}-${option.letter}`}
              name={`question-${current}`}
              letter={option.letter}
              text={option.text}
              selected={answers[current] === option.letter}
              onSelect={() =>
                dispatch({ type: 'answer', letter: option.letter })
              }
            />
          ))}
        </fieldset>
      </section>

      <div className={styles.actions}>
        <button
          type="button"
          className="button"
          disabled={isFirst}
          onClick={() => dispatch({ type: 'goTo', index: current - 1 })}
        >
          Previous
        </button>
        <div className={styles.actionsEnd}>
          {isLast ? (
            <button
              type="button"
              className="button buttonPrimary"
              onClick={() => setDialog('finish')}
            >
              Finish quiz
            </button>
          ) : (
            <>
              <button
                type="button"
                className="button buttonQuiet"
                onClick={() => setDialog('finish')}
              >
                Finish quiz
              </button>
              <button
                type="button"
                className="button buttonPrimary"
                onClick={() => dispatch({ type: 'goTo', index: current + 1 })}
              >
                Next
              </button>
            </>
          )}
        </div>
      </div>

      <p className={styles.hint}>Tip: press A, B, C or D to answer.</p>

      {dialog === 'finish' && (
        <ConfirmDialog
          open
          title="Finish the quiz?"
          confirmLabel="Finish quiz"
          cancelLabel="Keep playing"
          onConfirm={() => {
            setDialog(null);
            dispatch({ type: 'finish' });
          }}
          onCancel={() => setDialog(null)}
        >
          {unanswered > 0
            ? `You've answered ${answered} of ${total}. The other ${unanswered} will count as wrong.`
            : "You've answered every question."}
        </ConfirmDialog>
      )}

      {dialog === 'quit' && (
        <ConfirmDialog
          open
          title="Quit this quiz?"
          confirmLabel="Quit quiz"
          cancelLabel="Keep playing"
          onConfirm={() => {
            setDialog(null);
            dispatch({ type: 'reset' });
          }}
          onCancel={() => setDialog(null)}
        >
          Your answers will be lost.
        </ConfirmDialog>
      )}
    </div>
  );
}
