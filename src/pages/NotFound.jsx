import { Link } from 'react-router-dom';
import Button from '../components/atoms/Button';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function NotFound({ standalone = false }) {
  useDocumentTitle('Page not found');
  return (
    <div className={`flex flex-col items-center justify-center text-center ${standalone ? 'min-h-screen px-6' : 'py-24'}`}>
      <p className="text-6xl font-extrabold tracking-tight text-link">404</p>
      <h1 className="mt-4 text-2xl font-extrabold text-ink">We can’t find that page</h1>
      <p className="mt-2 max-w-sm text-muted">The link may be broken, or the page may have moved.</p>
      <Button as={Link} to="/" className="mt-8">
        Back to dashboard
      </Button>
    </div>
  );
}
