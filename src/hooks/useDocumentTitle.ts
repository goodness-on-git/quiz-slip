import { useEffect } from 'react';
import { SITE } from '../constants/site';

/** Sets the browser tab title. Pass nothing for the bare site name. */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE.name}` : SITE.name;
  }, [title]);
}
