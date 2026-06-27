"use client";

type ErrorBannerProps = {
  message: string;
  onDismiss?: () => void;
  onRetry?: () => void;
};

export default function ErrorBanner({
  message,
  onDismiss,
  onRetry,
}: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-red-100 p-3 text-sm text-red-700"
    >
      <span className="min-w-0 flex-1">{message}</span>
      <div className="flex items-center gap-2">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded px-2 py-1 font-semibold text-red-800 hover:bg-red-200"
          >
            Retry
          </button>
        )}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="rounded px-2 py-1 font-semibold text-red-800 hover:bg-red-200"
            aria-label="Dismiss error"
          >
            X
          </button>
        )}
      </div>
    </div>
  );
}
