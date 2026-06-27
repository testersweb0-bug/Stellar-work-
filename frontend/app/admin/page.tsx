"use client";

import {
  getFees,
  getJob,
  getJobCount,
  getNativeToken,
  withdrawFees,
} from "@/lib/contract";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState from "@/components/EmptyState";
import ErrorBanner from "@/components/ErrorBanner";
import StatusPill from "@/components/StatusPill";
import SectionCard from "@/components/SectionCard";
import { formatDeadline, toXlm } from "@/lib/format";
import { isConfirmSuppressed, CONFIRM_KEYS } from "@/lib/confirm-prefs";
import { useWallet } from "@/lib/wallet-context";
import type { Job, JobStatus } from "@/lib/types";
import { useEffect, useState, useCallback } from "react";

const TX_LOG_KEY = "stellarwork:admin-withdrawals";

interface WithdrawalTx {
  id: string;
  amount: string;
  timestamp: number;
  status: "completed";
}

const STATUS_LABELS: Record<JobStatus, string> = {
  Open: "Open",
  InProgress: "In Progress",
  SubmittedForReview: "Submitted for Review",
  Completed: "Completed",
  Cancelled: "Cancelled",
  Disputed: "Disputed",
};

export default function AdminPage() {
  const { wallet, connectWallet } = useWallet();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [fees, setFees] = useState<bigint>(0n);
  const [nativeToken, setNativeToken] = useState<string>("");
  const [jobs, setJobs] = useState<Array<{ id: number; job: Job }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [withdrawing, setWithdrawing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [withdrawals, setWithdrawals] = useState<WithdrawalTx[]>([]);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);

  const fetchAdminData = useCallback(async (walletAddress: string) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const token = await getNativeToken();
      setNativeToken(token);

      const accrued = await getFees(token);
      setFees(BigInt(accrued));

      const count = await getJobCount();
      const fetched: Array<{ id: number; job: Job }> = [];
      for (let id = 1; id <= count; id += 1) {
        const job = await getJob(String(id));
        if (job) fetched.push({ id, job });
      }
      setJobs(fetched);

      const envAdmin = process.env.NEXT_PUBLIC_ADMIN_ADDRESS;
      if (envAdmin) {
        setIsAdmin(walletAddress === envAdmin);
      } else {
        setIsAdmin(true);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load admin data.");
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(TX_LOG_KEY);
        if (raw) setWithdrawals(JSON.parse(raw) as WithdrawalTx[]);
      } catch {
        /* ignore */
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(TX_LOG_KEY, JSON.stringify(withdrawals));
      } catch {
        /* ignore */
      }
    }
  }, [withdrawals]);

  useEffect(() => {
    if (wallet) {
      fetchAdminData(wallet);
    } else {
      setLoading(false);
      setIsAdmin(null);
      setFees(0n);
      setJobs([]);
      setError(null);
      setSuccessMessage(null);
    }
  }, [wallet, fetchAdminData]);

  const handleWithdraw = async () => {
    if (!nativeToken) return;
    setShowWithdrawConfirm(false);
    setWithdrawing(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await withdrawFees(nativeToken);
      const amount = toXlm(fees);
      setSuccessMessage(`Successfully withdrew ${amount} XLM in fees.`);
      const tx: WithdrawalTx = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        amount,
        timestamp: Date.now(),
        status: "completed",
      };
      setWithdrawals((prev) => [tx, ...prev].slice(0, 50));
      setFees(0n);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Withdraw failed.";
      if (msg.includes("Unauthorized") || msg.includes("#2")) {
        setIsAdmin(false);
        setError("Unauthorized: your wallet is not the contract admin.");
      } else {
        setError(msg);
      }
    } finally {
      setWithdrawing(false);
    }
  };

  if (!wallet) {
    return (
      <section className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-2xl font-semibold">Admin Panel</h1>
        <SectionCard className="p-8 text-center">
          <p className="text-slate-600">Connect your wallet to access admin controls.</p>
          <button
            className="mt-4 rounded-md bg-slate-900 px-5 py-2.5 text-sm font-medium text-white"
            onClick={async () => {
              try { await connectWallet(); } catch { /* cancelled */ }
            }}
          >
            Connect Wallet
          </button>
        </SectionCard>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-2xl font-semibold">Admin Panel</h1>
        <p className="text-sm text-slate-600">Loading admin data...</p>
      </section>
    );
  }

  if (isAdmin === false) {
    return (
      <section className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-2xl font-semibold">Admin Panel</h1>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-medium text-red-800">Unauthorized</p>
          <p className="mt-1 text-sm text-red-600">
            Your wallet ({wallet.slice(0, 6)}...{wallet.slice(-4)}) is not the
            contract admin.
          </p>
        </div>
      </section>
    );
  }

  const statusCounts = jobs.reduce<Record<string, number>>((acc, { job }) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin Panel</h1>

      {error && (
        <ErrorBanner
          message={error}
          onDismiss={() => setError(null)}
          onRetry={() => void fetchAdminData(wallet)}
        />
      )}
      {successMessage && (
        <p className="rounded-md bg-green-100 p-3 text-sm text-green-700">
          {successMessage}
        </p>
      )}

      <SectionCard title="Platform Fees">
        <p className="mt-2 flex min-w-0 items-baseline gap-2 text-3xl font-bold">
          <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap tabular-nums">
            {toXlm(fees)}
          </span>
          <span className="shrink-0 text-base font-semibold">XLM</span>
        </p>
        <p className="text-sm text-slate-500">Accrued platform fees (2.5%)</p>
        <button
          disabled={withdrawing || fees <= 0n}
          className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          onClick={() => {
            if (isConfirmSuppressed(CONFIRM_KEYS.withdrawFees)) {
              void handleWithdraw();
            } else {
              setShowWithdrawConfirm(true);
            }
          }}
          aria-haspopup="dialog"
        >
          {withdrawing ? "Withdrawing..." : "Withdraw Fees"}
        </button>
      </SectionCard>

      {showWithdrawConfirm && (
        <ConfirmDialog
          open={true}
          title="Withdraw all platform fees?"
          description="This will transfer all accrued platform fees to your admin wallet. The fee balance will be reset to zero."
          consequences={[
            "All accrued fees will be swept to the admin wallet immediately.",
            "The on-chain fee balance will be reset to 0.",
            "This action cannot be reversed.",
          ]}
          impactLine={`${toXlm(fees)} XLM will be transferred to your wallet`}
          confirmLabel="Yes, withdraw fees"
          variant="primary"
          loading={withdrawing}
          suppressKey={CONFIRM_KEYS.withdrawFees}
          onConfirm={() => void handleWithdraw()}
          onCancel={() => setShowWithdrawConfirm(false)}
        />
      )}

      {withdrawals.length > 0 && (
        <SectionCard title="Withdrawal History">
          <div className="mt-2 divide-y divide-slate-100">
            {withdrawals.slice(0, 10).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-slate-900">{tx.amount} XLM</p>
                  <p className="text-xs text-slate-400">
                    {new Date(tx.timestamp).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  Completed
                </span>
              </div>
            ))}
          </div>
          {withdrawals.length > 10 && (
            <p className="mt-2 text-xs text-slate-400">
              Showing 10 of {withdrawals.length} withdrawals
            </p>
          )}
        </SectionCard>
      )}

      <SectionCard title="Job Overview">
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          <div className="rounded-md border border-slate-200 p-3 text-center">
            <p className="text-2xl font-bold">{jobs.length}</p>
            <p className="text-xs text-slate-500">Total</p>
          </div>
          {(Object.keys(STATUS_LABELS) as JobStatus[]).map((status) => (
            <div
              key={status}
              className="rounded-md border border-slate-200 p-3 text-center"
            >
              <p className="text-2xl font-bold">{statusCounts[status] || 0}</p>
              <p className="text-xs text-slate-500">{STATUS_LABELS[status]}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="All Jobs">
        {jobs.length === 0 ? (
          <EmptyState
            title="No jobs yet"
            description="Jobs posted to the contract will appear here."
          />
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">
                All jobs with status, participants, amount, and deadline
              </caption>
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500">
                  <th scope="col" className="pb-2 pr-4">ID</th>
                  <th scope="col" className="pb-2 pr-4">Status</th>
                  <th scope="col" className="pb-2 pr-4">Client</th>
                  <th scope="col" className="pb-2 pr-4">Freelancer</th>
                  <th scope="col" className="pb-2 pr-4 text-right">Amount</th>
                  <th scope="col" className="pb-2 pr-4">Deadline</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(({ id, job }) => (
                  <tr key={id} className="border-b border-slate-100">
                    <th scope="row" className="py-2 pr-4 font-medium">#{id}</th>
                    <td className="py-2 pr-4">
                      <StatusPill status={job.status} />
                    </td>
                    <td className="py-2 pr-4 font-mono text-xs">
                      {job.client.slice(0, 8)}...
                    </td>
                    <td className="py-2 pr-4 font-mono text-xs">
                      {job.freelancer ? `${job.freelancer.slice(0, 8)}...` : "-"}
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
                      {(() => {
                        const deadline = formatDeadline(job.deadline);
                        if (!deadline) return "None";
                        return `${deadline.isPast ? "Past due" : deadline.relative} • ${deadline.exact}`;
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </section>
  );
}
