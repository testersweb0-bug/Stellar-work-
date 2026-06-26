"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet, WalletButton } from "@/lib/wallet-context";
import { useState, useEffect, useRef } from "react";
import NetworkBadge from "@/components/NetworkBadge";
import NotificationInbox from "@/components/NotificationInbox";

export function Navigation() {
  const pathname = usePathname();
  const { wallet } = useWallet();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const lastLinkRef = useRef<HTMLAnchorElement>(null);

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

  // Focus management when menu opens/closes
  useEffect(() => {
    if (menuOpen) {
      firstLinkRef.current?.focus();
    }
  }, [menuOpen]);

  // Focus trap within menu
  const handleMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const links = menuRef.current?.querySelectorAll("a");
    if (!links || links.length === 0) return;

    const firstLink = links[0] as HTMLAnchorElement;
    const lastLink = links[links.length - 1] as HTMLAnchorElement;
    const currentIndex = Array.from(links).indexOf(document.activeElement as HTMLAnchorElement);

    if (event.key === "Tab") {
      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstLink) {
          event.preventDefault();
          lastLink.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastLink) {
          event.preventDefault();
          firstLink.focus();
        }
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = currentIndex < links.length - 1 ? currentIndex + 1 : 0;
      (links[nextIndex] as HTMLAnchorElement).focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : links.length - 1;
      (links[prevIndex] as HTMLAnchorElement).focus();
    }
  };

  const adminAddress = process.env.NEXT_PUBLIC_ADMIN_ADDRESS;
  const showAdmin = wallet && (adminAddress ? wallet === adminAddress : true);

  const links: Array<{ href: string; label: string }> = [
    { href: "/", label: "Jobs" },
    { href: "/post-job", label: "Post Job" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/disputes", label: "Disputes" },
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
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" className="shrink-0 text-lg font-semibold">
            StellarWork
          </Link>
          <NetworkBadge />
        </div>

        <div className="hidden min-w-0 items-center gap-4 lg:flex">
          <nav
            aria-label="Main navigation"
            className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 text-sm"
          >
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={
                  isActive(href)
                    ? "font-semibold text-slate-900"
                    : "text-slate-600 hover:text-slate-900"
                }
              >
                {label}
              </Link>
            ))}
          </nav>
          <NotificationInbox />
          <WalletButton />
        </div>

        <button
          ref={menuButtonRef}
          className="rounded-md p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
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

      {menuOpen && (
        <div
          ref={menuRef}
          className="border-t border-slate-200 px-4 py-3 lg:hidden"
          onKeyDown={handleMenuKeyDown}
        >
          <nav aria-label="Main navigation" className="flex flex-col gap-2 text-sm">
            {links.map(({ href, label }, index) => (
              <Link
                key={href}
                ref={index === 0 ? firstLinkRef : index === links.length - 1 ? lastLinkRef : undefined}
                href={href}
                className={
                  isActive(href)
                    ? "rounded-md bg-slate-100 px-2 py-1 font-semibold text-slate-900"
                    : "rounded-md px-2 py-1 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }
                onClick={() => {
                  setMenuOpen(false);
                  menuButtonRef.current?.focus();
                }}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 border-t border-slate-100 pt-3">
            <WalletButton />
          </div>
        </div>
      )}
    </header>
  );
}
