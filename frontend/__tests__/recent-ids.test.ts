import { describe, expect, it } from "vitest";
import { getRecentJobIds, getJobWindowBounds } from "@/lib/recent-ids";

describe("getRecentJobIds", () => {
  it("returns IDs in newest-first order", () => {
    const result = getRecentJobIds(1, 5, "newest");
    expect(result).toEqual(["5", "4", "3", "2", "1"]);
  });

  it("returns IDs in oldest-first order", () => {
    const result = getRecentJobIds(1, 5, "oldest");
    expect(result).toEqual(["1", "2", "3", "4", "5"]);
  });

  it("handles single ID range", () => {
    expect(getRecentJobIds(3, 3, "newest")).toEqual(["3"]);
    expect(getRecentJobIds(3, 3, "oldest")).toEqual(["3"]);
  });

  it("returns empty array for invalid ranges", () => {
    expect(getRecentJobIds(5, 1, "newest")).toEqual([]);
    expect(getRecentJobIds(5, 1, "oldest")).toEqual([]);
  });

  it("returns empty array for negative IDs", () => {
    expect(getRecentJobIds(-1, 5, "newest")).toEqual([]);
    expect(getRecentJobIds(1, -5, "oldest")).toEqual([]);
  });

  it("returns empty array for zero IDs", () => {
    expect(getRecentJobIds(0, 5, "newest")).toEqual([]);
    expect(getRecentJobIds(1, 0, "oldest")).toEqual([]);
  });

  it("maintains deterministic ordering for same inputs", () => {
    const result1 = getRecentJobIds(10, 20, "newest");
    const result2 = getRecentJobIds(10, 20, "newest");
    expect(result1).toEqual(result2);
  });

  it("handles large ID ranges", () => {
    const result = getRecentJobIds(1, 100, "newest");
    expect(result).toHaveLength(100);
    expect(result[0]).toBe("100");
    expect(result[99]).toBe("1");
  });
});

describe("getJobWindowBounds", () => {
  it("calculates first page window correctly", () => {
    const result = getJobWindowBounds(100, 1, 10);
    expect(result).toEqual({ startId: 91, endId: 100 });
  });

  it("calculates second page window correctly", () => {
    const result = getJobWindowBounds(100, 2, 10);
    expect(result).toEqual({ startId: 81, endId: 90 });
  });

  it("calculates last page window with partial results", () => {
    const result = getJobWindowBounds(25, 3, 10);
    expect(result).toEqual({ startId: 1, endId: 5 });
  });

  it("handles single job", () => {
    const result = getJobWindowBounds(1, 1, 10);
    expect(result).toEqual({ startId: 1, endId: 1 });
  });

  it("returns null for empty set", () => {
    expect(getJobWindowBounds(0, 1, 10)).toBeNull();
  });

  it("returns null for invalid page number", () => {
    expect(getJobWindowBounds(100, 0, 10)).toBeNull();
    expect(getJobWindowBounds(100, -1, 10)).toBeNull();
  });

  it("returns null for invalid page size", () => {
    expect(getJobWindowBounds(100, 1, 0)).toBeNull();
    expect(getJobWindowBounds(100, 1, -10)).toBeNull();
  });

  it("handles window bounds at minimum ID (1)", () => {
    const result = getJobWindowBounds(5, 1, 10);
    expect(result).toEqual({ startId: 1, endId: 5 });
  });

  it("maintains consistent bounds for same inputs", () => {
    const result1 = getJobWindowBounds(100, 5, 10);
    const result2 = getJobWindowBounds(100, 5, 10);
    expect(result1).toEqual(result2);
  });
});
