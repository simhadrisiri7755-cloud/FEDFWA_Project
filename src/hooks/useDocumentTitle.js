import { useEffect } from 'react';

/** Sets a meaningful <title> per page — helps screen-reader users know where they are (WCAG 2.4.2). */
export default function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Staffly` : 'Staffly · Employee Management';
  }, [title]);
}
