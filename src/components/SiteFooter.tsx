import type { ComponentType, SVGProps } from 'react';
import { PROFILE, SITE } from '../constants/site';
import { GithubIcon, GlobeIcon, LinkedinIcon, XIcon } from './Icons';
import styles from './SiteFooter.module.css';

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const LINK_ICONS: {
  key: keyof typeof PROFILE.links;
  label: string;
  Icon: IconComponent;
}[] = [
  { key: 'github', label: 'GitHub', Icon: GithubIcon },
  { key: 'linkedin', label: 'LinkedIn', Icon: LinkedinIcon },
  { key: 'x', label: 'X', Icon: XIcon },
  { key: 'website', label: 'Website', Icon: GlobeIcon },
];

export function SiteFooter() {
  // Only show the links that have been filled in.
  const links = LINK_ICONS.filter(({ key }) => PROFILE.links[key] !== '');

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.row}`}>
        <p className={styles.note}>
          Questions from{' '}
          <a
            href={SITE.dataSource.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {SITE.dataSource.name}
          </a>
          .
        </p>

        {links.length > 0 && (
          <ul className={styles.links}>
            {links.map(({ key, label, Icon }) => (
              <li key={key}>
                <a
                  href={PROFILE.links[key]}
                  className={styles.iconLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                >
                  <Icon />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </footer>
  );
}
