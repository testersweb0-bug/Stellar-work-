# Storage Key Migration Note

This note defines how to safely introduce future contract storage key changes without breaking deployed state.

## Migration approach

- Introduce new keys with explicit versioned prefixes (example: `v2:job:{id}`) instead of reusing existing keys.
- Keep read compatibility by checking both key formats during a transition window.
- Write only to the new key format after rollout starts.
- Add a one-time migration path for existing records where required, and make it idempotent.

## Backward compatibility concerns

- Existing on-chain state may only exist under legacy keys, so reads must continue to support legacy keys until migration completion.
- Index/count keys can diverge if writes happen to both formats without a clear source of truth.
- Frontend assumptions tied to old key-derived behavior may fail if contract query methods change shape during migration.
- Replaying migration logic must not duplicate records or overwrite newer values.

## Rollback note

If rollout issues occur, rollback by keeping the previous contract logic as the active read/write path while preserving migrated data:

1. Stop writing to new keys.
2. Re-enable legacy-key writes and dual-read logic.
3. Validate critical queries (`get_job`, `get_job_count`, and state transitions) against legacy keys.
4. Resume migration only after parity checks pass in staging/testnet.
