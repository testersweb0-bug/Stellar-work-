# Contributor Onboarding Checklist

Use this checklist for your first contribution to StellarWork. For ongoing rules, see [CONTRIBUTING.md](../CONTRIBUTING.md).

## Before You Start

- [ ] Read the [README](../README.md) for project overview and local setup options.
- [ ] Skim [ARCHITECTURE.md](./ARCHITECTURE.md) to understand on-chain vs off-chain data and the job lifecycle.
- [ ] Review open issues labeled [`good first issue`](https://github.com/anumukul/Stellar-work-/labels/good%20first%20issue) or pick an issue you can reproduce.
- [ ] Fork the repository and clone your fork locally.

## Local Setup

### Contract (Rust / Soroban)

- [ ] Install the [Soroban CLI](https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup) and Rust toolchain.
- [ ] Run contract tests:
  ```bash
  cd contracts/escrow
  cargo test
  ```
- [ ] Confirm the contract builds:
  ```bash
  cd contracts/escrow
  soroban contract build
  ```

### Frontend (Next.js)

Choose one setup path:

**Docker (recommended)**

- [ ] Copy environment file and start the stack:
  ```bash
  cd frontend
  cp .env.example .env.local
  cd ..
  docker compose up
  ```
- [ ] Open [http://localhost:3000](http://localhost:3000).

**Manual**

- [ ] Install dependencies and configure environment:
  ```bash
  cd frontend
  cp .env.example .env.local
  npm install
  npm run dev
  ```
- [ ] Set `NEXT_PUBLIC_CONTRACT_ID` in `.env.local` (see [environments.md](./environments.md) and [testnet-deployment-guide.md](./testnet-deployment-guide.md)).

### Optional Quality Tools

- [ ] Set up [pre-commit hooks](../CONTRIBUTING.md#pre-commit-hooks-optional) if you want automatic lint/format checks before commits.

## Before Your First PR

- [ ] Create a branch named `feature/<issue-number>-<short-description>` (see [CONTRIBUTING.md](../CONTRIBUTING.md#branching)).
- [ ] Keep changes scoped to the linked issue.
- [ ] Run the checks relevant to your change:
  - Contract: `cargo test`, `cargo fmt --all -- --check`, `soroban contract build` in `contracts/escrow`
  - Frontend: `npm run lint`, `npm test`, and `npm run build` in `frontend` when you touch UI or client code
- [ ] Reference the issue number in your PR description and explain key design choices.
- [ ] Add screenshots or short clips for UI changes.
- [ ] Confirm CI expectations in the [testing matrix](./testing-matrix.md).

## Helpful References

| Topic | Document |
|-------|----------|
| Contribution rules | [CONTRIBUTING.md](../CONTRIBUTING.md) |
| Contract API | [contract-reference.md](./contract-reference.md) |
| Environment variables | [environments.md](./environments.md) |
| Issue labels & triage | [TRIAGE.md](./TRIAGE.md) |
| Terminology | [glossary.md](./glossary.md) |
| Troubleshooting | [troubleshooting.md](./troubleshooting.md) |
