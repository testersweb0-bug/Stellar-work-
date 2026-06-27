"use client";

import type { JobStatus } from "@/lib/types";

const STATUS_META: Record<JobStatus, { label: string; className: string }> = {
  Open: {
    label: "Open",
    className: "bg-blue-100 text-blue-800 ring-blue-200",
  },
  InProgress: {
    label: "In Progress",
    className: "bg-yellow-100 text-yellow-800 ring-yellow-200",
  },
  SubmittedForReview: {
    label: "Submitted for Review",
    className: "bg-purple-100 text-purple-800 ring-purple-200",
  },
  Completed: {
    label: "Completed",
    className: "bg-green-100 text-green-800 ring-green-200",
  },
  Cancelled: {
    label: "Cancelled",
    className: "bg-red-100 text-red-800 ring-red-200",
  },
  Disputed: {
    label: "Disputed",
    className: "bg-orange-100 text-orange-800 ring-orange-200",
  },
};

export function getJobStatusLabel(status: JobStatus) {
  return STATUS_META[status].label;
}

export default function StatusPill({
  status,
  className = "",
}: {
  status: JobStatus;
  className?: string;
}) {
  const meta = STATUS_META[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${meta.className} ${className}`.trim()}
    >
      {meta.label}
    </span>
  );
}
