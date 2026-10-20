import { PROFILE, SITE } from '../constants/site';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import styles from './AboutPage.module.css';

const PROFILE_LINKS: { key: keyof typeof PROFILE.links; label: string }[] = [
  { key: 'github', label: 'GitHub' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'x', label: 'X' },
  { key: 'website', label: 'Website' },
];

export function AboutPage() {
  useDocumentTitle('About');

  const links = PROFILE_LINKS.filter(({ key }) => PROFILE.links[key] !== '');
  const hasProfile = PROFILE.name !== '';

  return (
    <div className="page">
      <h1 className={styles.title}>About {SITE.name}</h1>

      <div className={styles.content}>
        <section>
          <h2 className={styles.heading}>How it works</h2>
          <p>
            Choose how many questions you want, what they are about, and how
            hard they should be. Then answer them in any order. You can change
            an answer, skip ahead and come back, or finish early.
          </p>
          <p>
            Questions come from{' '}
            <a
              href={SITE.dataSource.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {SITE.dataSource.name}
            </a>
            , a free question bank written by its community. Nothing is saved on
            a server. Your round stays in this browser tab until you close it.
          </p>
        </section>

        <section>
          <h2 className={styles.heading}>Using a keyboard</h2>
          <p>
            Press A, B, C or D to pick an answer. Tab moves between the question
            numbers and the buttons, and Escape closes a dialog.
          </p>
        </section>

        <section>
          <h2 className={styles.heading}>Built with</h2>
          <p>
            React, TypeScript, Vite and React Router. Tests run on Vitest and
            Testing Library.
          </p>
        </section>

        {hasProfile && (
          <section>
            <h2 className={styles.heading}>Built by {PROFILE.name}</h2>
            {PROFILE.role !== '' && <p>{PROFILE.role}</p>}
            {PROFILE.bio !== '' && <p>{PROFILE.bio}</p>}
            {links.length > 0 && (
              <ul className={styles.links}>
                {links.map(({ key, label }) => (
                  <li key={key}>
                    <a
                      href={PROFILE.links[key]}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
