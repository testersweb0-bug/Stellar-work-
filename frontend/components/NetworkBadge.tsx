"use client";

import { getConfiguredNetwork } from "@/lib/stellar";

export default function NetworkBadge() {
  const network = getConfiguredNetwork();

  if (!network) {
    return null;
  }

  const isMainnet = network === "mainnet";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
        isMainnet
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-amber-200 bg-amber-50 text-amber-800"
      }`}
      aria-label={`Network: ${network}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${isMainnet ? "bg-emerald-500" : "bg-amber-500"}`}
        aria-hidden="true"
      />
      {network}
    </span>
  );
}
