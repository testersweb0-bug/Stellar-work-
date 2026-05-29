"use client";

import { useModalFocusTrap } from "@/lib/modal";
import { useCallback, useRef } from "react";

type CancelJobConfirmModalProps = {
  jobId: string;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
};

export default function CancelJobConfirmModal({
  jobId,
  onClose,
  onConfirm,
  loading = false,
}: CancelJobConfirmModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    if (!loading) {
      onClose();
    }
  }, [loading, onClose]);

  useModalFocusTrap(true, dialogRef, handleClose);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="cancel-job-title"
        aria-describedby="cancel-job-description"
        tabIndex={-1}
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
      >
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 id="cancel-job-title" className="text-base font-semibold text-slate-900">
            Cancel job #{jobId}?
          </h2>
          <p id="cancel-job-description" className="mt-1 text-sm text-slate-600">
            Escrowed funds will be refunded to your wallet. This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end gap-2 px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Keep job
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-md border border-red-600 bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Cancelling..." : "Confirm cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}
