import styles from './AnswerChoice.module.css';

interface AnswerChoiceProps {
  /** Groups the radios of one question. */
  name: string;
  letter: string;
  text: string;
  selected: boolean;
  onSelect: () => void;
}

/** One answer row. A real radio input underneath, so keyboards just work. */
export function AnswerChoice({
  name,
  letter,
  text,
  selected,
  onSelect,
}: AnswerChoiceProps) {
  return (
    <label className={styles.option}>
      <input
        type="radio"
        className={styles.input}
        name={name}
        value={letter}
        checked={selected}
        onChange={onSelect}
      />
      <span className={styles.letter} aria-hidden="true">
        {letter}
      </span>
      <span className={styles.textWrap}>
        <span className={styles.text}>{text}</span>
      </span>
    </label>
  );
}
