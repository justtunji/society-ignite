import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  status: 'idle' | 'loading' | 'success' | 'error';
  error?: string | null;
  onRetry?: () => void;
  children: React.ReactNode;
  loadingLabel?: string;
}

/**
 * Shared loading/error wrapper for every admin page.
 * Guarantees the user always sees either content, a spinner, or an
 * actionable error with a Retry button — never a blank "Loading..." forever.
 */
export const AsyncBoundary = ({ status, error, onRetry, children, loadingLabel = 'Loading…' }: Props) => {
  if (status === 'loading' || status === 'idle') {
    return (
      <div className="flex items-center gap-3 py-12 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>{loadingLabel}</span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <Alert variant="destructive" className="my-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Couldn't load this section</AlertTitle>
        <AlertDescription className="space-y-3">
          <p className="text-sm">{error || 'Unknown error'}</p>
          {onRetry && (
            <Button size="sm" variant="outline" onClick={onRetry}>
              <RefreshCw className="h-4 w-4 mr-2" /> Retry
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};
