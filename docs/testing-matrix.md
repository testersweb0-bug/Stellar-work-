# Testing Matrix

Summary of test suites in StellarWork: what each layer covers, how to run it, and who is expected to maintain it.

## Overview

| Layer | Location | Command | CI workflow | Primary owner |
|-------|----------|---------|-------------|---------------|
| Contract unit / integration | `contracts/escrow/src/lib.rs` (`mod test`) | `cd contracts/escrow && cargo test` | [Contract CI](../.github/workflows/contract.yml) | Contract contributors |
| Frontend unit | `frontend/__tests__/` | `cd frontend && npm test` | Not gated in CI today* | Frontend contributors |
| Frontend E2E | `frontend/e2e/` | `cd frontend && npm run test:e2e` | Not gated in CI today* | Frontend contributors |

\* Frontend CI currently runs lint and production build only. Contributors should still run unit and E2E tests locally before opening PRs that touch frontend behavior (see [CONTRIBUTING.md](../CONTRIBUTING.md) and [release-checklist.md](./release-checklist.md)).

## Contract Tests

**Scope:** Soroban escrow logic—job lifecycle, fees, disputes, deadlines, authorization, and invariants—using the Soroban test environment and snapshot fixtures under `contracts/escrow/test_snapshots/`.

**Covers**

- Happy paths: post → accept → submit → approve
- Invalid transitions and error codes
- Fee accounting and admin operations
- Dispute raise/resolve flows
- Property-style and matrix tests for status transitions

**Commands**

```bash
cd contracts/escrow
cargo test                    # run all contract tests
cargo fmt --all -- --check    # formatting (also run in CI)
soroban contract build        # wasm build (also run in CI)
```

**Expectation:** Any change to `contracts/escrow/` must include updated or new tests. CI blocks merge on fmt, build, and test failures.

## Frontend Unit Tests

**Scope:** Isolated tests for utilities, React components, and contract helper logic with mocked wallet/RPC dependencies (Vitest + Testing Library).

**Covers**

| Area | Example files |
|------|----------------|
| Contract helpers | `__tests__/contract.test.ts` |
| Formatting / IDs | `__tests__/format.test.ts`, `__tests__/recent-ids.test.ts` |
| Wallet context | `__tests__/wallet-context.test.tsx` |
| Page components | `__tests__/job-detail-actions.test.tsx`, `__tests__/disputes-page.test.tsx` |
| UI primitives | `__tests__/toast-provider.test.tsx`, `__tests__/smoke.test.tsx` |

**Commands**

```bash
cd frontend
npm test                 # single run (CI-friendly)
npm run test:watch       # watch mode during development
npm run lint             # ESLint
npm run typecheck        # TypeScript
npm run build            # production build (run in CI)
```

**Expectation:** Add or update unit tests when changing logic in `frontend/lib/` or component behavior. Mock external Stellar calls; do not hit testnet in unit tests.

## Frontend E2E Tests

**Scope:** Browser-level flows against the running Next.js app (Playwright)—navigation, page load, and critical user journeys without full on-chain signing.

**Covers**

| Spec | Focus |
|------|-------|
| `e2e/home.spec.ts` | Home page load, navigation to post job and dashboard |
| `e2e/post-job.spec.ts` | Post job page rendering and form presence |
| `e2e/job-detail.spec.ts` | Job detail route and UI elements |
| `e2e/navigation.spec.ts` | Cross-page navigation consistency |

**Commands**

```bash
cd frontend
npm run dev              # start app in a separate terminal (default :3000)
npm run test:e2e         # headless Playwright run
npm run test:e2e -- --headed   # visible browser (debugging)
```

**Expectation:** Update E2E specs when routes, primary headings, or navigation labels change. E2E tests assume the dev server is reachable at the Playwright base URL (see `frontend/playwright.config.ts` if present).

## What Is Not Covered Here

- Manual testnet deployment verification (see [testnet-deployment-guide.md](./testnet-deployment-guide.md))
- Pre-commit hook runs (optional; see [CONTRIBUTING.md](../CONTRIBUTING.md#pre-commit-hooks-optional))
- Full wallet-signed transaction flows on public networks (manual QA with Freighter on testnet)

## Quick Pre-PR Matrix

| You changed… | Run at minimum |
|--------------|----------------|
| `contracts/escrow/` | `cargo test`, `cargo fmt --all -- --check`, `soroban contract build` |
| `frontend/lib/` or components | `npm test`, `npm run lint`, `npm run build` |
| Routes or primary UI flows | Above + `npm run test:e2e` |
| Docs only | No test runs required; verify links manually |
