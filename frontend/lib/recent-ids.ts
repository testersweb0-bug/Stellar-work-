/**
 * Helper utilities for managing recent job IDs with ordering guarantees.
 */

/**
 * Generates an array of job IDs within a specified window, ordered by the given sort direction.
 * 
 * @param startId - The starting job ID (inclusive)
 * @param endId - The ending job ID (inclusive)
 * @param sortOrder - The sort order: "newest" (descending) or "oldest" (ascending)
 * @returns Array of job IDs as strings, ordered according to sortOrder
 * 
 * @example
 * getRecentJobIds(1, 5, "newest") // ["5", "4", "3", "2", "1"]
 * getRecentJobIds(1, 5, "oldest") // ["1", "2", "3", "4", "5"]
 * getRecentJobIds(5, 1, "newest") // [] (invalid range)
 */
export function getRecentJobIds(
  startId: number,
  endId: number,
  sortOrder: "newest" | "oldest"
): string[] {
  // Handle invalid ranges
  if (startId > endId || startId < 1 || endId < 1) {
    return [];
  }

  // Generate IDs in ascending order
  const ids = Array.from(
    { length: endId - startId + 1 },
    (_, i) => String(startId + i)
  );

  // Reverse for newest-first ordering
  if (sortOrder === "newest") {
    ids.reverse();
  }

  return ids;
}

/**
 * Calculates the pagination window bounds for fetching recent jobs.
 * 
 * @param totalCount - Total number of jobs available
 * @param page - Current page number (1-indexed)
 * @param pageSize - Number of items per page
 * @returns Object with startId and endId for the current page window, or null if invalid
 * 
 * @example
 * getJobWindowBounds(100, 1, 10) // { startId: 91, endId: 100 }
 * getJobWindowBounds(100, 2, 10) // { startId: 81, endId: 90 }
 * getJobWindowBounds(0, 1, 10) // null (empty set)
 */
export function getJobWindowBounds(
  totalCount: number,
  page: number,
  pageSize: number
): { startId: number; endId: number } | null {
  // Handle empty set
  if (totalCount === 0 || page < 1 || pageSize < 1) {
    return null;
  }

  // Calculate window bounds (jobs are 1-indexed)
  const endId = Math.max(1, totalCount - (page - 1) * pageSize);
  const startId = Math.max(1, endId - pageSize + 1);

  return { startId, endId };
}
