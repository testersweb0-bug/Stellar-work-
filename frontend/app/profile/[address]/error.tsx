"use client";

import RouteErrorState from "@/components/RouteErrorState";

export default function ProfileError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorState
      title="Profile unavailable"
      description="We could not load this profile page. Retry or return to the home feed."
      backHref="/"
      backLabel="Home"
      onRetry={reset}
    />
  );
}
