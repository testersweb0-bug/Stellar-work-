export default function Loading() {
  return (
    <section className="space-y-6">
      <div className="h-8 w-40 rounded bg-slate-200" />

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="h-5 w-32 rounded bg-slate-200" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="rounded-md border border-slate-200 p-3">
              <div className="h-8 w-12 rounded bg-slate-200" />
              <div className="mt-2 h-3 w-16 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="h-5 w-28 rounded bg-slate-200" />
        <div className="mt-4 overflow-x-auto">
          <div className="min-w-[900px] space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="grid grid-cols-6 gap-3">
                {Array.from({ length: 6 }).map((__, cellIndex) => (
                  <div key={cellIndex} className="h-4 rounded bg-slate-200" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
