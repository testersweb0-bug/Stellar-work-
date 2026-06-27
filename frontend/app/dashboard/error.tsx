"use client";

import RouteErrorState from "@/components/RouteErrorState";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorState
      title="Dashboard unavailable"
      description="We could not load your jobs right now. Retry to fetch the latest dashboard data."
      backHref="/"
      backLabel="Home"
      onRetry={reset}
    />
  );
}
