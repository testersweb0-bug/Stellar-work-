import JobCardSkeleton from "@/components/JobCardSkeleton";

export default function Loading() {
  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 space-y-3">
            <div className="h-8 w-64 rounded bg-slate-200" />
            <div className="h-4 w-full max-w-2xl rounded bg-slate-200" />
            <div className="h-4 w-5/6 rounded bg-slate-200" />
          </div>
          <div className="flex gap-3">
            <div className="h-11 w-28 rounded-md bg-slate-200" />
            <div className="h-11 w-32 rounded-md bg-slate-200" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="h-6 w-32 rounded bg-slate-200" />
        <div className="h-10 w-24 rounded-md bg-slate-200" />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="space-y-3">
          <div className="h-5 w-40 rounded bg-slate-200" />
          <div className="h-4 w-72 rounded bg-slate-200" />
          <div className="flex flex-wrap gap-3">
            <div className="h-9 w-20 rounded-full bg-slate-200" />
            <div className="h-9 w-20 rounded-full bg-slate-200" />
            <div className="h-9 w-20 rounded-full bg-slate-200" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <JobCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}
