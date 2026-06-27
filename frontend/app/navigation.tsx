"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet, WalletButton } from "@/lib/wallet-context";
import { useMessaging } from "@/lib/messaging-context";
import { useState, useEffect, useRef } from "react";
import NetworkBadge from "@/components/NetworkBadge";
import NotificationInbox from "@/components/NotificationInbox";
import WalletMenu from "@/components/WalletMenu";

export function Navigation() {
  const pathname = usePathname();
  const { wallet } = useWallet();
  const { unreadCount } = useMessaging();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const lastLinkRef = useRef<HTMLAnchorElement>(null);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Handle Escape key to close menu
  useEffect(() => {
    if (!menuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);

  // Focus management when menu opens
  useEffect(() => {
    if (menuOpen) {
      firstLinkRef.current?.focus();
    }
  }, [menuOpen]);

  // Focus trap within mobile menu
  const handleMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const focusable = menuRef.current?.querySelectorAll<HTMLElement>(
      "a, button:not([disabled])",
    );
    if (!focusable || focusable.length === 0) return;

    const items = Array.from(focusable);
    const firstItem = items[0];
    const lastItem = items[items.length - 1];
    const currentIndex = items.indexOf(document.activeElement as HTMLElement);

    if (event.key === "Tab") {
      if (event.shiftKey) {
        if (document.activeElement === firstItem) {
          event.preventDefault();
          lastItem.focus();
        }
      } else {
        if (document.activeElement === lastItem) {
          event.preventDefault();
          firstItem.focus();
        }
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      items[nextIndex]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      items[prevIndex]?.focus();
    }
  };

  const adminAddress = process.env.NEXT_PUBLIC_ADMIN_ADDRESS;
  const showAdmin = wallet && (adminAddress ? wallet === adminAddress : true);

  const links: Array<{ href: string; label: string; shortcut?: string }> = [
    { href: "/", label: "Jobs" },
    { href: "/post-job", label: "Post Job", shortcut: "n" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/transactions", label: "Transactions" },
    { href: "/disputes", label: "Disputes" },
    { href: "/messages", label: "Messages" },
  ];

  if (showAdmin) {
    links.push({ href: "/admin", label: "Admin" });
  }

  if (wallet) {
    links.push({ href: `/profile/${wallet}`, label: "Profile" });
  }

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4">
        {/* Logo + network badge */}
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" className="shrink-0 text-lg font-semibold">
            StellarWork
          </Link>
          <NetworkBadge />
        </div>

        {/* ⌘K hint — desktop only */}
        <kbd className="hidden rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 lg:inline-block">
          ⌘K
        </kbd>

        {/* Desktop nav */}
        <div className="hidden min-w-0 items-center gap-4 lg:flex">
          <nav
            aria-label="Main navigation"
            className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 text-sm"
          >
            {links.map(({ href, label, shortcut }) => (
              <Link
                key={href}
                href={href}
                className={
                  isActive(href)
                    ? "font-semibold text-slate-900"
                    : "text-slate-600 hover:text-slate-900"
                }
                aria-label={shortcut ? `${label} (shortcut: ${shortcut})` : label}
                aria-current={isActive(href) ? "page" : undefined}
              >
                <span className="relative inline-flex items-center gap-1">
                  {label}
                  {href === "/messages" && unreadCount > 0 && (
                    <span
                      className="inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white"
                      aria-label={`${unreadCount} unread messages`}
                    >
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </span>
                {shortcut && (
                  <kbd className="ml-1 rounded border border-slate-200 bg-slate-50 px-1 py-0.5 text-[10px] font-medium text-slate-400">
                    {shortcut}
                  </kbd>
                )}
              </Link>
            ))}
          </nav>

          <NotificationInbox />

          {/* WalletMenu provides disconnect + account switcher in desktop nav */}
          <WalletMenu />
        </div>

        {/* Mobile hamburger */}
        <button
          ref={menuButtonRef}
          className="rounded-md p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div
          id="mobile-nav-menu"
          ref={menuRef}
          className="border-t border-slate-200 px-4 py-3 lg:hidden"
          onKeyDown={handleMenuKeyDown}
        >
          <nav aria-label="Main navigation" className="flex flex-col gap-2 text-sm">
            {links.map(({ href, label, shortcut }, index) => (
              <Link
                key={href}
                ref={
                  index === 0
                    ? firstLinkRef
                    : index === links.length - 1
                      ? lastLinkRef
                      : undefined
                }
                href={href}
                className={
                  isActive(href)
                    ? "rounded-md bg-slate-100 px-2 py-1 font-semibold text-slate-900"
                    : "rounded-md px-2 py-1 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }
                aria-current={isActive(href) ? "page" : undefined}
                aria-label={shortcut ? `${label} (shortcut: ${shortcut})` : label}
                onClick={() => {
                  setMenuOpen(false);
                  menuButtonRef.current?.focus();
                }}
              >
                <span className="inline-flex items-center gap-1.5">
                  {label}
                  {href === "/messages" && unreadCount > 0 && (
                    <span
                      className="inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white"
                      aria-label={`${unreadCount} unread messages`}
                    >
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </span>
                {shortcut && (
                  <kbd className="ml-1 rounded border border-slate-200 bg-slate-50 px-1 py-0.5 text-[10px] font-medium text-slate-400">
                    {shortcut}
                  </kbd>
                )}
              </Link>
            ))}
          </nav>

          {/* WalletButton in mobile drawer — simpler connect/disconnect UI */}
          <div className="mt-3 border-t border-slate-100 pt-3">
            <WalletButton />
          </div>
        </div>
      )}
    </header>
  );
}
