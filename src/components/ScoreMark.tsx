import styles from './ScoreMark.module.css';

interface ScoreMarkProps {
  correct: number;
  total: number;
}

/** The score, circled in marker pen like a teacher would on a quiz slip. */
export function ScoreMark({ correct, total }: ScoreMarkProps) {
  return (
    <p className={styles.score}>
      <span className="srOnly">
        You scored {correct} out of {total}.
      </span>
      <span className={styles.numbers} aria-hidden="true">
        <span className={styles.big}>{correct}</span>
        <span className={styles.of}>/{total}</span>
      </span>
      <svg
        className={styles.circle}
        viewBox="0 0 320 160"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          pathLength={1}
          d="M262 28C200 6 90 10 44 48C8 78 22 124 90 140C168 158 270 142 298 96C322 56 270 22 190 14"
        />
      </svg>
    </p>
  );
}
