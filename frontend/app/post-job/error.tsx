"use client";

import RouteErrorState from "@/components/RouteErrorState";

export default function PostJobError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorState
      title="Post job form unavailable"
      description="The posting flow failed to load. Retry to continue creating the job."
      backHref="/"
      backLabel="Home"
      onRetry={reset}
    />
  );
}
