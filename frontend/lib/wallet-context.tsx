"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import {
  connectWallet as stellarConnectWallet,
  getPublicKey,
} from "@/lib/stellar";

// Storage keys
const LAST_ACCOUNT_KEY = "stellarwork:last-connected-account";
const JOB_CACHE_PREFIX = "job-desc:";

interface WalletContextType {
  wallet: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchAccount: (address: string) => Promise<void>;
  clearCachedData: () => void;
  isSwitching: boolean;
}

type WalletDisplayMode = "short" | "full";

const WalletContext = createContext<WalletContextType>({
  wallet: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  connectWallet: async () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnectWallet: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  switchAccount: async () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  clearCachedData: () => {},
  isSwitching: false,
});

/** Remove all job description cache entries from localStorage. */
function clearJobCache() {
  if (typeof window === "undefined") return;
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(JOB_CACHE_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  for (const key of keysToRemove) {
    localStorage.removeItem(key);
  }
}

/** Persist the last-connected address so we can auto-reconnect on mount. */
function persistLastAccount(address: string | null) {
  if (typeof window === "undefined") return;
  if (address) {
    localStorage.setItem(LAST_ACCOUNT_KEY, address);
  } else {
    localStorage.removeItem(LAST_ACCOUNT_KEY);
  }
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<string | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const connectPromiseRef = useRef<Promise<string> | null>(null);

  // On mount: restore last session via Freighter if still allowed.
  useEffect(() => {
    getPublicKey().then((key) => {
      if (key) {
        setWallet(key);
        persistLastAccount(key);
      }
    });
  }, []);

  const clearCachedData = useCallback(() => {
    clearJobCache();
  }, []);

  const connectWallet = useCallback(async () => {
    if (wallet) return;

    if (!connectPromiseRef.current) {
      connectPromiseRef.current = stellarConnectWallet().finally(() => {
        connectPromiseRef.current = null;
      });
    }

    const key = await connectPromiseRef.current;
    setWallet(key);
    persistLastAccount(key);
  }, [wallet]);

  const disconnectWallet = useCallback(() => {
    setWallet(null);
    persistLastAccount(null);
    // Clear session display preference
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("wallet-display-mode");
    }
  }, []);

  /**
   * Switch to a different Freighter account.
   * Triggers Freighter's account selection, clears job cache, then updates state.
   * Caller is responsible for showing a confirmation dialog before calling this.
   */
  const switchAccount = useCallback(async (_address?: string) => {
    setIsSwitching(true);
    try {
      // Re-request access so Freighter shows the account picker.
      const newKey = await stellarConnectWallet();
      if (newKey && newKey !== wallet) {
        clearJobCache();
        setWallet(newKey);
        persistLastAccount(newKey);
      }
    } finally {
      setIsSwitching(false);
    }
  }, [wallet]);

  return (
    <WalletContext.Provider
      value={{ wallet, connectWallet, disconnectWallet, switchAccount, clearCachedData, isSwitching }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}

// ---------------------------------------------------------------------------
// WalletButton — compact connect/disconnect used in the mobile nav drawer
// ---------------------------------------------------------------------------

export function WalletButton() {
  const { wallet, connectWallet, disconnectWallet } = useWallet();
  const [connecting, setConnecting] = useState(false);
  const [displayMode, setDisplayMode] = useState<WalletDisplayMode>("short");

  useEffect(() => {
    const stored = sessionStorage.getItem("wallet-display-mode");
    if (stored === "short" || stored === "full") {
      setDisplayMode(stored);
    }
  }, []);

  useEffect(() => {
    if (!wallet) {
      setDisplayMode("short");
    }
  }, [wallet]);

  const toggleDisplayMode = useCallback(() => {
    setDisplayMode((current) => {
      const next: WalletDisplayMode = current === "short" ? "full" : "short";
      sessionStorage.setItem("wallet-display-mode", next);
      return next;
    });
  }, []);

  if (wallet) {
    const visibleAddress =
      displayMode === "full" ? wallet : `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;

    return (
      <div className="flex items-center gap-2">
        <span className="rounded-md bg-slate-100 px-3 py-1.5 font-mono text-xs text-slate-700">
          {visibleAddress}
        </span>
        <button
          type="button"
          onClick={toggleDisplayMode}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
          aria-label={
            displayMode === "short"
              ? "Show full wallet address"
              : "Show shortened wallet address"
          }
        >
          {displayMode === "short" ? "Show full" : "Show short"}
        </button>
        <button
          type="button"
          onClick={disconnectWallet}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={async () => {
        setConnecting(true);
        try {
          await connectWallet();
        } catch {
          /* user cancelled or Freighter unavailable */
        } finally {
          setConnecting(false);
        }
      }}
      className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
      disabled={connecting}
      aria-busy={connecting}
    >
      {connecting ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
