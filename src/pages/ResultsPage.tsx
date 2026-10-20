import { Navigate, useNavigate } from 'react-router-dom';
import { ReviewList } from '../components/ReviewList';
import { ScoreMark } from '../components/ScoreMark';
import { useQuiz } from '../context/useQuiz';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { countCorrect, getPercentage, getVerdict } from '../lib/score';
import styles from './ResultsPage.module.css';

export function ResultsPage() {
  useDocumentTitle('Results');
  const navigate = useNavigate();
  const { state, dispatch } = useQuiz();

  if (state.status === 'setup') return <Navigate to="/" replace />;
  if (state.status !== 'finished') return <Navigate to="/quiz" replace />;

  const { questions, answers, settings } = state;
  const correct = countCorrect(questions, answers);
  const percentage = getPercentage(correct, questions.length);

  function playAgain() {
    dispatch({ type: 'start', settings });
    navigate('/quiz');
  }

  function newQuiz() {
    dispatch({ type: 'reset' });
    navigate('/');
  }

  return (
    <div className={`page ${styles.layout}`}>
      <h1 className="srOnly">Results</h1>

      <div className={styles.summary}>
        <ScoreMark correct={correct} total={questions.length} />
        <p className={styles.verdict}>{getVerdict(percentage)}</p>
        <p className={styles.percent}>{percentage}% correct</p>

        <div className={styles.actions}>
          <button
            type="button"
            className="button buttonPrimary"
            onClick={playAgain}
          >
            Play again
          </button>
          <button type="button" className="button" onClick={newQuiz}>
            New quiz
          </button>
        </div>
      </div>

      <ReviewList questions={questions} answers={answers} />
    </div>
  );
}
