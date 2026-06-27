"use client";

import Link from "next/link";

type RouteErrorStateProps = {
  title: string;
  description: string;
  backHref: string;
  backLabel?: string;
  onRetry: () => void;
};

export default function RouteErrorState({
  title,
  description,
  backHref,
  backLabel = "Go back",
  onRetry,
}: RouteErrorStateProps) {
  return (
    <section className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-start justify-center gap-6 rounded-3xl border border-slate-200 bg-white px-6 py-10 shadow-sm">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600">
          Error
        </p>
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        <p className="max-w-xl text-sm leading-6 text-slate-600">{description}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Retry
        </button>
        <Link
          href={backHref}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          {backLabel}
        </Link>
      </div>
    </section>
  );
}
