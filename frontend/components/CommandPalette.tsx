"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/lib/wallet-context";

interface Command {
  id: string;
  label: string;
  shortcut?: string;
  category: "navigation" | "action";
  action: () => void;
}

function fuzzyMatch(query: string, target: string): boolean {
  const q = query.toLowerCase().replace(/\s+/g, "");
  const t = target.toLowerCase().replace(/\s+/g, "");
  if (t.includes(q)) return true;
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++;
  }
  return qi === q.length;
}

export default function CommandPalette() {
  const router = useRouter();
  const { wallet, connectWallet, disconnectWallet } = useWallet();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const adminAddress = process.env.NEXT_PUBLIC_ADMIN_ADDRESS;
  const isAdmin = wallet && (adminAddress ? wallet === adminAddress : true);

  const commands: Command[] = useMemo(
    () => [
      { id: "nav-dashboard", label: "Go to Dashboard", shortcut: "G D", category: "navigation", action: () => router.push("/dashboard") },
      { id: "nav-jobs", label: "View Jobs", shortcut: "G J", category: "navigation", action: () => router.push("/") },
      { id: "nav-post", label: "Post a Job", shortcut: "G P", category: "navigation", action: () => router.push("/post-job") },
      ...(isAdmin ? [{ id: "nav-admin", label: "Go to Admin", shortcut: "G A", category: "navigation" as const, action: () => router.push("/admin") }] : []),
      { id: "nav-disputes", label: "View Disputes", shortcut: "G V", category: "navigation" as const, action: () => router.push("/disputes") },
      ...(wallet
        ? [
            { id: "action-disconnect", label: "Disconnect Wallet", category: "action" as const, action: () => disconnectWallet() },
          ]
        : [
            { id: "action-connect", label: "Connect Wallet", category: "action" as const, action: () => connectWallet().catch(() => {}) },
          ]),
    ],
    [router, wallet, isAdmin, connectWallet, disconnectWallet],
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    return commands.filter((c) => fuzzyMatch(query, c.label));
  }, [commands, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filtered]);
import { useModalFocusTrap } from "@/lib/modal";
import { useWallet } from "@/lib/wallet-context";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type CommandItem = {
  id: string;
  label: string;
  keywords: string[];
  run: () => void;
};

export default function CommandPalette() {
  const router = useRouter();
  const { wallet, connectWallet } = useWallet();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = useMemo<CommandItem[]>(() => {
    const items: CommandItem[] = [
      {
        id: "jobs",
        label: "Go to Jobs",
        keywords: ["home", "jobs", "browse"],
        run: () => router.push("/"),
      },
      {
        id: "post-job",
        label: "Post Job",
        keywords: ["create", "post", "new job"],
        run: () => router.push("/post-job"),
      },
      {
        id: "dashboard",
        label: "Go to Dashboard",
        keywords: ["dashboard", "overview"],
        run: () => router.push("/dashboard"),
      },
      {
        id: "disputes",
        label: "Go to Disputes",
        keywords: ["disputes", "conflict"],
        run: () => router.push("/disputes"),
      },
    ];

    if (!wallet) {
      items.push({
        id: "connect-wallet",
        label: "Connect Wallet",
        keywords: ["wallet", "connect", "freighter"],
        run: () => {
          void connectWallet();
        },
      });
    } else {
      items.push({
        id: "profile",
        label: "Go to Profile",
        keywords: ["profile", "account"],
        run: () => router.push(`/profile/${wallet}`),
      });
    }

    return items;
  }, [connectWallet, router, wallet]);

  const filteredCommands = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return commands;
    }

    return commands.filter((command) => {
      const haystack = [command.label, ...command.keywords].join(" ").toLowerCase();
      return haystack.includes(normalized);
    });
  }, [commands, query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      const isInput =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement ||
        (e.target as HTMLElement)?.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        return;
      }

      if (e.key === "Escape" && open) {
        e.preventDefault();
        close();
        return;
      }

      if (!isInput && !open) {
        if (e.key === "n" && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          router.push("/post-job");
          return;
        }
        if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          const searchInput = document.querySelector<HTMLInputElement>('[aria-label*="search" i], [placeholder*="search" i], [type="search"]');
          searchInput?.focus();
          return;
        }
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, close, router]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (listRef.current && !listRef.current.contains(e.target as Node) && inputRef.current !== e.target) {
        close();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, close]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
        close();
      }
      return;
    }
  };

  useEffect(() => {
    const el = listRef.current?.children[selectedIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div className="fixed inset-0 bg-black/30" onClick={close} aria-hidden="true" />
      <div className="relative z-50 w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center border-b border-slate-100 px-4">
          <svg className="mr-3 h-4 w-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search commands..."
            className="flex-1 bg-transparent py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            aria-label="Search commands"
          />
          <kbd className="ml-2 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
            esc
          </kbd>
        </div>
        <ul ref={listRef} className="max-h-72 overflow-y-auto p-2" role="listbox">
          {filtered.length === 0 ? (
            <li className="px-3 py-4 text-center text-sm text-slate-400">No commands found</li>
          ) : (
            filtered.map((cmd, index) => (
              <li
                key={cmd.id}
                role="option"
                aria-selected={index === selectedIndex}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm cursor-pointer ${
                  index === selectedIndex ? "bg-slate-100 text-slate-900" : "text-slate-700"
                }`}
                onClick={() => {
                  cmd.action();
                  close();
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <span className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">
                    {cmd.category === "navigation" ? "→" : "⚡"}
                  </span>
                  {cmd.label}
                </span>
                {cmd.shortcut && (
                  <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
                    {cmd.shortcut}
                  </kbd>
                )}
    setSelectedIndex(0);
  }, []);

  const executeCommand = useCallback(
    (command: CommandItem) => {
      command.run();
      close();
    },
    [close],
  );

  useModalFocusTrap(open, dialogRef, close);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isPaletteShortcut =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";

      if (isPaletteShortcut) {
        event.preventDefault();
        setOpen((current) => !current);
        setQuery("");
        setSelectedIndex(0);
        return;
      }

      if (!open) {
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((current) =>
          filteredCommands.length === 0
            ? 0
            : (current + 1) % filteredCommands.length,
        );
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((current) =>
          filteredCommands.length === 0
            ? 0
            : (current - 1 + filteredCommands.length) % filteredCommands.length,
        );
      } else if (event.key === "Enter" && filteredCommands[selectedIndex]) {
        event.preventDefault();
        executeCommand(filteredCommands[selectedIndex]);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [executeCommand, filteredCommands, open, selectedIndex]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-[15vh] backdrop-blur-sm">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        tabIndex={-1}
        className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5"
      >
        <div className="border-b border-slate-100 px-4 py-3">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search commands..."
            aria-label="Search commands"
            className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </div>
        <ul role="listbox" aria-label="Commands" className="max-h-72 overflow-y-auto py-2">
          {filteredCommands.length === 0 ? (
            <li className="px-4 py-3 text-sm text-slate-500">No matching commands.</li>
          ) : (
            filteredCommands.map((command, index) => (
              <li key={command.id} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={index === selectedIndex}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => executeCommand(command)}
                  className={`flex w-full px-4 py-2.5 text-left text-sm ${
                    index === selectedIndex
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {command.label}
                </button>
              </li>
            ))
          )}
        </ul>
        <div className="flex items-center gap-4 border-t border-slate-100 px-4 py-2 text-[10px] text-slate-400">
          <span>
            <kbd className="rounded border border-slate-200 bg-slate-50 px-1 py-0.5 font-medium">↑↓</kbd> navigate
          </span>
          <span>
            <kbd className="rounded border border-slate-200 bg-slate-50 px-1 py-0.5 font-medium">↵</kbd> select
          </span>
          <span>
            <kbd className="rounded border border-slate-200 bg-slate-50 px-1 py-0.5 font-medium">esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}
