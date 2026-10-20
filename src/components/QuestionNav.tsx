import type { AnswerMap } from '../types/quiz';
import styles from './QuestionNav.module.css';

interface QuestionNavProps {
  total: number;
  current: number;
  /** Highest question index reached so far. */
  furthest: number;
  answers: AnswerMap;
  onSelect: (index: number) => void;
}

/** Jump between questions and see which ones are answered or skipped. */
export function QuestionNav({
  total,
  current,
  furthest,
  answers,
  onSelect,
}: QuestionNavProps) {
  return (
    <nav aria-label="Questions">
      <ol className={styles.list}>
        {Array.from({ length: total }, (_, index) => {
          const isCurrent = index === current;
          const answered = answers[index] !== undefined;
          const skipped = !answered && index <= furthest && !isCurrent;

          const status = answered
            ? 'answered'
            : skipped
              ? 'skipped'
              : 'not answered';
          const classes = [
            styles.dot,
            answered ? styles.answered : '',
            skipped ? styles.skipped : '',
            isCurrent ? styles.current : '',
          ].join(' ');

          return (
            <li key={index}>
              <button
                type="button"
                className={classes}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`Question ${index + 1}, ${status}`}
                onClick={() => onSelect(index)}
              >
                {index + 1}
              </button>
            </li>
          );
        })}
      </ol>
      <p className={styles.legend}>
        Filled means answered. Dashed means skipped.
      </p>
    </nav>
  );
}
