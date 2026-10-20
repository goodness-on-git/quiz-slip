import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import styles from './NotFoundPage.module.css';

export function NotFoundPage() {
  useDocumentTitle('Page not found');
  return (
    <div className="page">
      <h1 className={styles.title}>That page doesn&rsquo;t exist.</h1>
      <p className={styles.text}>
        The link may be old, or the address may have a typo.
      </p>
      <Link to="/" className="button buttonPrimary">
        Set up a quiz
      </Link>
    </div>
  );
}
