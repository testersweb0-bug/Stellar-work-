import JobCardSkeleton from "@/components/JobCardSkeleton";

export default function Loading() {
  return (
    <section className="space-y-6">
      <div className="h-8 w-44 rounded bg-slate-200" />
      <div className="h-4 w-96 max-w-full rounded bg-slate-200" />
      <div className="grid gap-4 lg:grid-cols-2">
        <JobCardSkeleton />
        <JobCardSkeleton />
      </div>
    </section>
  );
}
