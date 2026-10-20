import { Link, NavLink } from 'react-router-dom';
import { SITE } from '../constants/site';
import { SlipIcon } from './Icons';
import { ThemeToggle } from './ThemeToggle';
import styles from './SiteHeader.module.css';

function navClass({ isActive }: { isActive: boolean }) {
  return isActive ? `${styles.link} ${styles.active}` : styles.link;
}

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.row}`}>
        <Link to="/" className={styles.brand}>
          <SlipIcon width="1.6em" height="1.6em" />
          {SITE.name}
        </Link>

        <div className={styles.actions}>
          <nav aria-label="Main">
            <ul className={styles.links}>
              <li>
                <NavLink to="/" end className={navClass}>
                  Play
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className={navClass}>
                  About
                </NavLink>
              </li>
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
