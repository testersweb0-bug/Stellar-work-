"use client";

import RouteErrorState from "@/components/RouteErrorState";

export default function DisputesError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorState
      title="Disputes unavailable"
      description="The dispute dashboard could not be loaded. Retry to fetch the current dispute list."
      backHref="/"
      backLabel="Home"
      onRetry={reset}
    />
  );
}
