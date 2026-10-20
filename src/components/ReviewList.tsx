import { useState } from 'react';
import { getResult } from '../lib/score';
import type { AnswerMap, Question, QuestionResult } from '../types/quiz';
import styles from './ReviewList.module.css';

interface ReviewListProps {
  questions: Question[];
  answers: AnswerMap;
}

const RESULT_LABEL: Record<QuestionResult, string> = {
  correct: 'Correct',
  wrong: 'Wrong',
  skipped: 'Skipped',
};

/** Every question with the right answer and what the player picked. */
export function ReviewList({ questions, answers }: ReviewListProps) {
  const [filter, setFilter] = useState<'all' | 'missed'>('all');

  const rows = questions.map((question, index) => ({
    question,
    index,
    result: getResult(question, answers[index]),
  }));
  const missed = rows.filter((row) => row.result !== 'correct');
  const visible = filter === 'all' ? rows : missed;

  return (
    <section aria-labelledby="review-title">
      <div className={styles.header}>
        <h2 id="review-title" className={styles.title}>
          Review
        </h2>
        <div className={styles.filters}>
          <button
            type="button"
            className={styles.filter}
            aria-pressed={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            All ({rows.length})
          </button>
          <button
            type="button"
            className={styles.filter}
            aria-pressed={filter === 'missed'}
            onClick={() => setFilter('missed')}
          >
            Missed ({missed.length})
          </button>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className={styles.empty}>You got every question right.</p>
      ) : (
        <ol className={styles.list}>
          {visible.map(({ question, index, result }) => (
            <li key={index}>
              <details className={styles.item}>
                <summary className={styles.summary}>
                  <span className={styles.number}>{index + 1}</span>
                  <span className={styles.text}>{question.text}</span>
                  <span className={`${styles.tag} ${styles[result]}`}>
                    {RESULT_LABEL[result]}
                  </span>
                </summary>
                <ul className={styles.options}>
                  {question.options.map((option) => {
                    const picked = answers[index] === option.letter;
                    return (
                      <li key={option.letter} className={styles.option}>
                        <span className={styles.letter}>{option.letter}</span>
                        <span>{option.text}</span>
                        {option.isCorrect && (
                          <span className={styles.note}>Correct answer</span>
                        )}
                        {picked && (
                          <span className={styles.note}>Your answer</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </details>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
