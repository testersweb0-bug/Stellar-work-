"use client";

import RouteErrorState from "@/components/RouteErrorState";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorState
      title="Something went wrong"
      description="The page failed to load. You can retry or return to the home feed."
      backHref="/"
      backLabel="Home"
      onRetry={reset}
    />
  );
}
