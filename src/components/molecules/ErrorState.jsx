import Button from '../atoms/Button';
import Icon from '../atoms/Icon';

export default function ErrorState({ message, onRetry }) {
  return (
    <div role="alert" className="flex flex-col items-center rounded-2xl border border-danger-line bg-danger-soft px-6 py-12 text-center">
      <span className="mb-3 text-danger">
        <Icon name="alert" className="h-8 w-8" />
      </span>
      <h2 className="text-base font-bold text-danger-ink">Something went wrong</h2>
      <p className="mt-1 max-w-md text-sm text-danger-ink">{message}</p>
      {onRetry && (
        <Button variant="secondary" className="mt-5" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
