import { Suspense, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

export function Layout() {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const lastPath = useRef(pathname);

  // After navigating, start at the top and move focus to the new page so
  // keyboard and screen reader users don't stay stranded on the old link.
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    window.scrollTo(0, 0);
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <>
      <a href="#main" className="skipLink">
        Skip to content
      </a>
      <SiteHeader />
      <main
        id="main"
        ref={mainRef}
        tabIndex={-1}
        style={{ flex: 1, outline: 'none' }}
      >
        <Suspense
          fallback={
            <p role="status" className="srOnly">
              Loading page
            </p>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
