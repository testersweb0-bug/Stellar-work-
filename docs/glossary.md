# Glossary

Concise definitions for contract and frontend terminology used across StellarWork docs and code.

## Contract Terms

| Term | Definition |
|------|------------|
| **Escrow** | Soroban smart contract (`contracts/escrow`) that holds job payments and releases them based on on-chain job status. |
| **Job** | On-chain record with client, optional freelancer, amount, status, deadlines, and metadata hash. See [contract-reference.md](./contract-reference.md). |
| **Job status** | Lifecycle state: `Open`, `InProgress`, `SubmittedForReview`, `Completed`, `Cancelled`, or `Disputed`. |
| **Client** | Stellar account that posts and funds a job; may approve, reject, cancel, or raise disputes. |
| **Freelancer** | Stellar account that accepts a job, submits work, and receives payout on approval. |
| **desc_hash** | SHA-256 hash (`BytesN<32>`) of the job description stored on-chain; all-zero hash is rejected. |
| **description_payload_len** | Byte length of the off-chain description payload; enforced at `post_job` against contract limits. |
| **deadline** | Unix epoch **seconds** after which in-progress jobs may be cancelled via `enforce_deadline`; `0` means no deadline. |
| **Platform fee** | Percentage (default 2.5%, 250 bps) retained by the contract on successful payout; tracked per token. |
| **Native token** | Default Stellar token contract configured at contract `initialize`. |
| **Dispute** | Escalation path when client or freelancer calls `raise_dispute`; admin resolves via `resolve_dispute`. |
| **Revision** | Client rejection of submitted work (`reject_work`); returns job to `InProgress` until revision limit (3) is reached. |
| **Soroban** | Stellar smart contract platform; StellarWork contracts compile to wasm for Soroban deployment. |

## Frontend Terms

| Term | Definition |
|------|------------|
| **Freighter** | Browser wallet extension used to connect accounts and sign transactions (`@stellar/freighter-api`). |
| **Contract ID** | Deployed escrow contract address; set as `NEXT_PUBLIC_CONTRACT_ID` in `frontend/.env.local`. |
| **Off-chain metadata** | Job titles, descriptions, and profile details stored outside the contract (e.g. browser `localStorage`), matched to on-chain job IDs. |
| **Horizon / Soroban RPC** | Network endpoints the frontend uses to submit transactions and read contract state (see [environments.md](./environments.md)). |
| **scVal** | Soroban typed value encoding used when building contract invocation arguments in `frontend/lib/stellar.ts`. |
| **App Router** | Next.js routing under `frontend/app/` (`/`, `/post-job`, `/job/[id]`, `/dashboard`, etc.). |
| **Wallet context** | React context wrapping Freighter connection state and account address for pages and actions. |

## Shared Concepts

| Term | Definition |
|------|------------|
| **Testnet** | Default Stellar network for development; uses test lumens and testnet contract deployments. |
| **Integration boundary** | Split between authoritative on-chain job/financial state and off-chain descriptive content merged in the UI. |
| **Lifecycle action** | User operation that maps to a contract method (post, accept, submit, approve, cancel, dispute). |

For method-level detail, see [contract-reference.md](./contract-reference.md) and [ARCHITECTURE.md](./ARCHITECTURE.md).
