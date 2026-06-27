export default function Loading() {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-4 w-14 rounded bg-slate-200" />
        <div className="h-8 w-36 rounded bg-slate-200" />
      </div>

      <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-5">
        <div className="h-5 w-28 rounded bg-slate-200" />
        <div className="h-4 w-3/5 rounded bg-slate-200" />
        <div className="h-4 w-2/3 rounded bg-slate-200" />
        <div className="h-4 w-1/2 rounded bg-slate-200" />
        <div className="h-4 w-3/4 rounded bg-slate-200" />
      </div>

      <div className="flex gap-3">
        <div className="h-11 w-32 rounded-md bg-slate-200" />
        <div className="h-11 w-32 rounded-md bg-slate-200" />
      </div>
    </section>
  );
}
