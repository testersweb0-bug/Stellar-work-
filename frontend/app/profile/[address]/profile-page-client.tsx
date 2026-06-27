"use client";

import ErrorBanner from "@/components/ErrorBanner";
import StatusPill from "@/components/StatusPill";
import { getJob, getJobCount } from "@/lib/contract";
import { toXlm } from "@/lib/format";
import type { Job } from "@/lib/types";
import { useWallet } from "@/lib/wallet-context";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

function isValidStellarAddress(address: string): boolean {
  return /^G[A-Z2-7]{55}$/.test(address);
}

interface ProfileJob {
  id: number;
  job: Job;
  role: "client" | "freelancer";
}

export default function ProfilePageClient({ address }: { address: string }) {
  const { wallet, connectWallet } = useWallet();

  const [jobs, setJobs] = useState<ProfileJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addressValid = isValidStellarAddress(address);

  const fetchJobs = useCallback(async () => {
    if (!wallet || !addressValid) return;
    setLoading(true);
    setError(null);
    try {
      const count = await getJobCount();
      const fetched: ProfileJob[] = [];
      for (let id = 1; id <= count; id += 1) {
        const job = await getJob(String(id));
        if (!job) continue;
        if (job.client === address) {
          fetched.push({ id, job, role: "client" });
        } else if (job.freelancer === address) {
          fetched.push({ id, job, role: "freelancer" });
        }
      }
      setJobs(fetched);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch job history.");
    } finally {
      setLoading(false);
    }
  }, [wallet, address, addressValid]);

  useEffect(() => {
    if (wallet) {
      fetchJobs();
    } else {
      setJobs([]);
      setLoading(false);
      setError(null);
    }
  }, [wallet, fetchJobs]);

  const jobsPosted = jobs.filter((j) => j.role === "client").length;
  const jobsCompleted = jobs.filter((j) => j.job.status === "Completed").length;
  const totalEarnedStroops = jobs
    .filter((j) => j.role === "freelancer" && j.job.status === "Completed")
    .reduce((sum, j) => {
      const amount = BigInt(j.job.amount);
      const fee = (amount * 250n) / 10_000n;
      return sum + (amount - fee);
    }, 0n);
  const totalSpentStroops = jobs
    .filter((j) => j.role === "client" && j.job.status === "Completed")
    .reduce((sum, j) => sum + BigInt(j.job.amount), 0n);

  if (!addressValid) {
    return (
      <section className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            Back to Home
          </Link>
          <h1 className="text-2xl font-semibold">Profile</h1>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-medium text-red-800">Invalid Address</p>
          <p className="mt-1 text-sm text-red-600">
            &ldquo;{address}&rdquo; is not a valid Stellar address.
          </p>
          <p className="mt-3 text-xs text-red-600">
            Stellar addresses start with &ldquo;G&rdquo; and are 56 characters long.
          </p>
        </div>
      </section>
    );
  }

  if (!wallet) {
    return (
      <section className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            Back to Home
          </Link>
          <h1 className="text-2xl font-semibold">Profile</h1>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-600">Connect your wallet to view this profile.</p>
          <button
            className="mt-4 rounded-md bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
            onClick={async () => {
              try {
                await connectWallet();
              } catch {
                // user cancelled wallet connect flow
              }
            }}
          >
            Connect Wallet
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          Back to Home
        </Link>
        <div>
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="mt-1 font-mono text-sm text-slate-500">{address}</p>
        </div>
      </div>

      {error && (
        <ErrorBanner
          message={error}
          onDismiss={() => setError(null)}
          onRetry={() => void fetchJobs()}
        />
      )}
      {loading && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-lg border border-slate-200 bg-white p-4">
                <div className="h-8 w-16 rounded bg-slate-200 mx-auto" />
                <div className="mt-2 h-3 w-20 rounded bg-slate-200 mx-auto" />
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 animate-pulse">
            <div className="h-6 w-28 rounded bg-slate-200" />
            <div className="mt-3 space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-10 w-full rounded bg-slate-200" />
              ))}
            </div>
          </div>
        </div>
      )}

      {!loading && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg border border-slate-200 bg-white p-4 text-center">
              <p className="text-2xl font-bold">{jobsPosted}</p>
              <p className="text-xs text-slate-500">Jobs Posted</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 text-center">
              <p className="text-2xl font-bold">{jobsCompleted}</p>
              <p className="text-xs text-slate-500">Jobs Completed</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 text-center">
              <p className="flex min-w-0 items-baseline justify-center gap-1 text-2xl font-bold">
                <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap tabular-nums">
                  {toXlm(totalEarnedStroops)}
                </span>
                <span className="shrink-0 text-xs font-semibold">XLM</span>
              </p>
              <p className="text-xs text-slate-500">XLM Earned</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 text-center">
              <p className="flex min-w-0 items-baseline justify-center gap-1 text-2xl font-bold">
                <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap tabular-nums">
                  {toXlm(totalSpentStroops)}
                </span>
                <span className="shrink-0 text-xs font-semibold">XLM</span>
              </p>
              <p className="text-xs text-slate-500">XLM Spent</p>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold">Job History</h2>
            {jobs.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">
                No jobs found for this address.
              </p>
            ) : (
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">
                    Job history with role, status, amount, and date
                  </caption>
                  <thead>
                    <tr className="border-b border-slate-200 text-xs text-slate-500">
                      <th scope="col" className="pb-2 pr-4">ID</th>
                      <th scope="col" className="pb-2 pr-4">Role</th>
                      <th scope="col" className="pb-2 pr-4">Status</th>
                      <th scope="col" className="pb-2 pr-4 text-right">Amount</th>
                      <th scope="col" className="pb-2 pr-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map(({ id, job, role }) => (
                      <tr key={`${id}-${role}`} className="border-b border-slate-100">
                        <th scope="row" className="py-2 pr-4">
                          <Link href={`/job/${id}`} className="font-medium hover:underline">
                            #{id}
                          </Link>
                        </th>
                        <td className="py-2 pr-4 capitalize">{role}</td>
                        <td className="py-2 pr-4">
                          <StatusPill status={job.status} />
                        </td>
                        <td className="py-2 pr-4 text-right">
                          <span className="inline-flex min-w-0 items-baseline justify-end gap-1">
                            <span className="min-w-0 max-w-[10rem] overflow-hidden text-ellipsis whitespace-nowrap tabular-nums">
                              {toXlm(job.amount)}
                            </span>
                            <span className="shrink-0">XLM</span>
                          </span>
                        </td>
                        <td className="py-2 pr-4 text-xs">
                          {new Date(Number(job.created_at) * 1000).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
