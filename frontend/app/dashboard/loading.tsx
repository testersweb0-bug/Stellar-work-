import JobCardSkeleton from "@/components/JobCardSkeleton";

export default function Loading() {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <div className="h-8 w-40 rounded bg-slate-200" />
        <div className="grid grid-cols-2 gap-4 sm:max-w-md">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="h-8 w-16 rounded bg-slate-200" />
            <div className="mt-2 h-3 w-28 rounded bg-slate-200" />
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="h-8 w-16 rounded bg-slate-200" />
            <div className="mt-2 h-3 w-28 rounded bg-slate-200" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-9 w-24 rounded-full bg-slate-200" />
        ))}
      </div>

      <div className="grid gap-8">
        <div className="space-y-3">
          <div className="h-6 w-32 rounded bg-slate-200" />
          <div className="grid gap-4 sm:grid-cols-2">
            <JobCardSkeleton />
            <JobCardSkeleton />
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-6 w-36 rounded bg-slate-200" />
          <div className="grid gap-4 sm:grid-cols-2">
            <JobCardSkeleton />
            <JobCardSkeleton />
          </div>
        </div>
      </div>
    </section>
  );
}
