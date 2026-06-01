import { beforeEach, describe, expect, it, vi } from "vitest";

describe("Network passphrase defaults", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("defaults getNetwork to testnet when no env is set", async () => {
    const { getNetwork } = await import("../lib/stellar");
    expect(getNetwork()).toBe("testnet");
  });

  it("defaults getConfiguredNetwork to null when no env is set", async () => {
    const { getConfiguredNetwork } = await import("../lib/stellar");
    expect(getConfiguredNetwork()).toBeNull();
  });

  it("returns testnet when NEXT_PUBLIC_NETWORK is testnet", async () => {
    vi.stubEnv("NEXT_PUBLIC_NETWORK", "testnet");
    const { getConfiguredNetwork, getNetwork } = await import("../lib/stellar");
    expect(getConfiguredNetwork()).toBe("testnet");
    expect(getNetwork()).toBe("testnet");
  });

  it("returns mainnet when NEXT_PUBLIC_NETWORK is mainnet", async () => {
    vi.stubEnv("NEXT_PUBLIC_NETWORK", "mainnet");
    const { getConfiguredNetwork, getNetwork } = await import("../lib/stellar");
    expect(getConfiguredNetwork()).toBe("mainnet");
    expect(getNetwork()).toBe("mainnet");
  });

  it("uses testnet passphrase in getNetwork when env override is missing", async () => {
    const { getNetwork } = await import("../lib/stellar");
    expect(getNetwork()).toBe("testnet");
  });

  it("uses mainnet passphrase when env override is set to mainnet", async () => {
    vi.stubEnv("NEXT_PUBLIC_NETWORK", "mainnet");
    const { getNetwork } = await import("../lib/stellar");
    expect(getNetwork()).toBe("mainnet");
  });
});
