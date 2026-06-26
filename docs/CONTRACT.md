# Escrow Contract Reference

Location: `contracts/escrow/src/lib.rs`

## Implemented (Starter Kit)

- `post_job(amount, desc_hash, deadline)`
- `accept_job(job_id)`
- `submit_work(job_id)`
- `approve_work(job_id)`
- `cancel_job(job_id)`
- `get_job(job_id)`
- `get_job_count()`

## Stubbed (Contributor Scope)

- `raise_dispute(job_id)` — not implemented
- `resolve_dispute(job_id, winner)` — not implemented

## Data Model

### `Job` struct

| Field | Type | Description |
|-------|------|-------------|
| `client` | `Address` | The account that created and funded the job. |
| `freelancer` | `Option<Address>` | The account assigned to the job (`None` until accepted). |
| `amount` | `i128` | Total payment held in escrow (in the token's smallest unit). |
| `description_hash` | `BytesN<32>` | SHA-256 hash of the job description (all-zero hash is rejected). |
| `status` | `JobStatus` | Current lifecycle state of the job. |
| `created_at` | `u64` | **Unix epoch seconds** — set by `e.ledger().timestamp()` at `post_job` time. Read-only after creation. Example: `1710000000` (≈ 2024-03-10 UTC). |
| `deadline` | `u64` | **Unix epoch seconds** — the latest time the job is active. Use `0` for no deadline. Example: `1712592000` (≈ 2024-04-09 UTC, 30 days after the example `created_at`). |
| `token` | `Address` | The whitelisted token contract used for payment. |
| `revision_count` | `u32` | Number of times the client has rejected submitted work (max 3). |

> **Note on `created_at` vs `deadline`:** Both fields use the same unit — Unix epoch **seconds** from the Soroban ledger clock (`e.ledger().timestamp()`). They are never wall-clock timestamps supplied by the caller. `created_at` is always immutable. `deadline == 0` means no expiry enforced.

- `JobStatus`: `Open`, `InProgress`, `SubmittedForReview`, `Completed`, `Cancelled`, `Disputed`

## Error Codes

- `1` JobNotFound
- `2` Unauthorized
- `3` InvalidStatus
- `4` InsufficientFunds
- `5` JobAlreadyAccepted
- `6` DeadlinePassed
- `7` AlreadyInitialized

## Upgrade Mechanism

The contract supports a two-step upgrade process with a timelock delay (24 hours) to update the contract WASM while preserving storage state.

### Flow

1. **Propose**: Admin calls `propose_upgrade(admin, new_wasm_hash)` to initiate the upgrade. This stores the proposed WASM hash and sets a timelock deadline.
2. **Wait**: The timelock period must elapse (24 hours from proposal).
3. **Execute**: Admin calls `execute_upgrade(admin)` after the deadline. The contract emits a `contract_upgraded` event and updates the WASM via `Env::deployer().update_current_contract_wasm()`.
4. **Cancel**: Admin may call `cancel_upgrade(admin)` at any point before execution to abort the upgrade.

### Events

| Event | Topics | Data |
|-------|--------|------|
| `upgrade_proposed` | `(admin, new_wasm_hash, deadline)` | - |
| `contract_upgraded` | `(admin, new_wasm_hash)` | - |
| `upgrade_cancelled` | `(admin, new_wasm_hash)` | - |

### Error Codes

| Code | Error | Description |
|------|-------|-------------|
| `18` | UpgradeNotApproved | Reserved for future use |
| `19` | UpgradeTimelockPending | Attempted upgrade before timelock expiry |
| `20` | NoPendingUpgrade | No upgrade proposal exists
