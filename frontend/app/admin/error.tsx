"use client";

import RouteErrorState from "@/components/RouteErrorState";

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorState
      title="Admin panel unavailable"
      description="The admin view failed to load. Retry to fetch the latest contract state."
      backHref="/"
      backLabel="Home"
      onRetry={reset}
    />
  );
}
