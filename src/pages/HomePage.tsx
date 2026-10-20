import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../constants/categories';
import { useQuiz } from '../context/useQuiz';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import {
  clampAmount,
  DEFAULT_SETTINGS,
  MAX_QUESTIONS,
  MIN_QUESTIONS,
} from '../lib/settings';
import type { Difficulty, QuestionFormat } from '../types/quiz';
import styles from './HomePage.module.css';

const FORMATS: { value: QuestionFormat; label: string }[] = [
  { value: 'any', label: 'mixed-format' },
  { value: 'multiple', label: 'multiple-choice' },
  { value: 'boolean', label: 'true-or-false' },
];

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 'any', label: 'any level' },
  { value: 'easy', label: 'easy' },
  { value: 'medium', label: 'medium' },
  { value: 'hard', label: 'hard' },
];

export function HomePage() {
  useDocumentTitle();
  const navigate = useNavigate();
  const { state, dispatch } = useQuiz();

  // Start from the last settings so "Change settings" feels like an edit.
  const [amount, setAmount] = useState(String(state.settings.amount));
  const [format, setFormat] = useState(state.settings.format);
  const [category, setCategory] = useState(
    state.settings.category === null ? '' : String(state.settings.category),
  );
  const [difficulty, setDifficulty] = useState(state.settings.difficulty);

  const noun = Number(amount) === 1 ? 'question' : 'questions';

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = Number.parseInt(amount, 10);
    dispatch({
      type: 'start',
      settings: {
        amount: Number.isNaN(parsed)
          ? DEFAULT_SETTINGS.amount
          : clampAmount(parsed),
        category: category === '' ? null : Number(category),
        difficulty,
        format,
      },
    });
    navigate('/quiz');
  }

  return (
    <div className="page">
      <h1 className="srOnly">Set up your quiz</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <fieldset className={styles.fieldset}>
          <legend className="srOnly">Quiz settings</legend>
          <p className={styles.sentence}>
            Ask me{' '}
            <input
              type="number"
              inputMode="numeric"
              className={`${styles.field} ${styles.amount}`}
              aria-label="Number of questions"
              aria-describedby="amount-hint"
              min={MIN_QUESTIONS}
              max={MAX_QUESTIONS}
              value={amount}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setAmount(e.target.value)
              }
            />{' '}
            <select
              className={styles.field}
              aria-label="Question format"
              value={format}
              onChange={(e) => setFormat(e.target.value as QuestionFormat)}
            >
              {FORMATS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>{' '}
            {noun} about{' '}
            <select
              className={styles.field}
              aria-label="Topic"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">anything</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            , pitched at{' '}
            <select
              className={styles.field}
              aria-label="Difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            >
              {DIFFICULTIES.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
            .
          </p>
        </fieldset>

        <div className={styles.actions}>
          <button
            type="submit"
            className={`button buttonPrimary ${styles.start}`}
          >
            Start quiz
          </button>
          <p id="amount-hint" className={styles.hint}>
            Pick between {MIN_QUESTIONS} and {MAX_QUESTIONS} questions.
          </p>
        </div>
      </form>
    </div>
  );
}
