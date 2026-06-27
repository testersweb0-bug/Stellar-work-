"use client";

import RouteErrorState from "@/components/RouteErrorState";

export default function JobError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorState
      title="Job details unavailable"
      description="The job page could not be loaded. Retry or return to the job list."
      backHref="/"
      backLabel="Jobs"
      onRetry={reset}
    />
  );
}
