import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock Next.js modules
vi.mock("next/navigation", () => ({
  useParams: () => ({ id: "1" }),
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock wallet context
vi.mock("@/lib/wallet-context", () => ({
  useWallet: () => ({
    wallet: "GTEST123",
    connectWallet: vi.fn(),
  }),
}));

// Mock toast provider
vi.mock("@/components/ToastProvider", () => ({
  useToast: () => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
  }),
}));

// Mock contract functions
vi.mock("@/lib/contract", () => ({
  getJob: vi.fn(),
  acceptJob: vi.fn(),
  submitWork: vi.fn(),
  approveWork: vi.fn(),
  cancelJob: vi.fn(),
}));

// Mock format utilities
vi.mock("@/lib/format", () => ({
  toXlm: (value: string) => `${Number(value) / 10000000}`,
}));

// Mock stellar utilities
vi.mock("@/lib/stellar", () => ({
  getExplorerTxUrl: (hash: string) => `https://stellar.expert/tx/${hash}`,
}));

describe("Job Detail Mobile Footer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders sticky footer on mobile with proper spacing", async () => {
    const { getJob } = await import("@/lib/contract");
    vi.mocked(getJob).mockResolvedValue({
      client: "GCLIENT123",
      freelancer: null,
      amount: "10000000",
      description_hash: "abc123",
      status: "Open",
      created_at: "1234567890",
      deadline: "0",
      token: "GTOKEN123",
      revision_count: 0,
    });

    const JobDetailPage = (await import("@/app/job/[id]/page")).default;
    const { container } = render(<JobDetailPage />);

    // Wait for job to load
    await screen.findByText(/Job #1/);

    // Check for mobile spacer (hidden on desktop)
    const spacer = container.querySelector('[aria-hidden="true"].h-20.sm\\:hidden');
    expect(spacer).toBeInTheDocument();

    // Check for sticky footer with proper classes
    const footer = container.querySelector(".fixed.inset-x-0.bottom-0");
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass("z-20", "border-t", "bg-white/95", "backdrop-blur-sm");

    // Verify footer becomes static on desktop (sm: breakpoint)
    expect(footer).toHaveClass("sm:static", "sm:border-0", "sm:bg-transparent");
  });

  it("does not render spacer when no actions available", async () => {
    const { getJob } = await import("@/lib/contract");
    vi.mocked(getJob).mockResolvedValue({
      client: "GCLIENT123",
      freelancer: "GFREELANCER123",
      amount: "10000000",
      description_hash: "abc123",
      status: "Completed",
      created_at: "1234567890",
      deadline: "0",
      token: "GTOKEN123",
      revision_count: 0,
    });

    const JobDetailPage = (await import("@/app/job/[id]/page")).default;
    const { container } = render(<JobDetailPage />);

    await screen.findByText(/Job #1/);

    // No spacer should be present when no actions are available
    const spacer = container.querySelector('[aria-hidden="true"].h-20');
    expect(spacer).not.toBeInTheDocument();

    // No footer should be present
    const footer = container.querySelector(".fixed.inset-x-0.bottom-0");
    expect(footer).not.toBeInTheDocument();
  });

  it("footer buttons have proper mobile sizing", async () => {
    const { getJob } = await import("@/lib/contract");
    vi.mocked(getJob).mockResolvedValue({
      client: "GCLIENT123",
      freelancer: null,
      amount: "10000000",
      description_hash: "abc123",
      status: "Open",
      created_at: "1234567890",
      deadline: "0",
      token: "GTOKEN123",
      revision_count: 0,
    });

    const JobDetailPage = (await import("@/app/job/[id]/page")).default;
    render(<JobDetailPage />);

    await screen.findByText(/Job #1/);

    const acceptButton = await screen.findByRole("button", { name: /Accept Job/ });
    
    // Check mobile-first sizing (flex-1 for full width)
    expect(acceptButton).toHaveClass("flex-1", "min-w-0");
    
    // Check desktop sizing (flex-none with max width)
    expect(acceptButton).toHaveClass("sm:flex-none", "sm:max-w-48");
    
    // Check mobile padding is larger
    expect(acceptButton).toHaveClass("py-2.5", "sm:py-2");
  });
});
