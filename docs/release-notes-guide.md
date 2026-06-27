# Release Notes Writing Guide

Use this guide when drafting GitHub release notes or changelog entries. For the pre-release verification steps, see [release-checklist.md](./release-checklist.md).

## Template Structure

Each release should include these sections in order. Omit a section only when nothing applies.

```markdown
## Summary
One or two sentences describing the release theme.

## Added
- New user-facing features or contract capabilities.

## Changed
- Behavior changes that are not breaking fixes.

## Fixed
- Bug fixes with enough context to understand impact.

## Contract
- Deployment notes: wasm changes, new init requirements, migration steps.

## Breaking Changes
- Explicit list of changes that require action from integrators or operators.

## Contributors
- @username for notable contributions (optional).
```

## Example Entries

### Added

```markdown
## Added
- Dispute overview page at `/disputes` for jobs in `Disputed` status.
- `get_open_jobs_count` read method for dashboard metrics.
```

### Changed

```markdown
## Changed
- Post-job form now validates description length against the on-chain payload limit before submission.
- Platform fee display uses 2.5% (250 bps) consistently across job detail and admin views.
```

### Fixed

```markdown
## Fixed
- Job detail page no longer shows approve actions when status is `Cancelled`.
- Contract rejects `post_job` when `desc_hash` is all zeros (#142).
```

### Contract

```markdown
## Contract
- Redeploy required: escrow wasm updated for deadline enforcement on `accept_job`.
- After deploy, run `initialize` only on fresh instances; existing deployments keep prior admin and token config.
```

### Breaking Changes

```markdown
## Breaking Changes
- `NEXT_PUBLIC_SOROBAN_RPC` replaces the unused `NEXT_PUBLIC_SOROBAN_RPC_URL` env var; update `.env.local` before upgrading frontend.
- `post_job` signature now requires `description_payload_len`; update custom integrators.
```

## Scope Rules

**Include in release notes**

- User-visible frontend behavior (pages, flows, errors, wallet prompts).
- Contract method additions, signature changes, or state machine changes.
- Required operator actions (redeploy, env var changes, re-initialization).
- Security fixes and data-integrity fixes (describe impact, not exploit details).
- Notable performance or reliability improvements users or integrators would notice.

**Keep brief or omit**

- Internal refactors with no external behavior change.
- Dependency bumps that do not change runtime behavior.
- CI, lint, or test-only changes (unless they unblock releases).
- Documentation-only updates (link to docs in Summary if helpful).

**Breaking change criteria**

Mark a change as breaking when:

- A contract method signature or storage layout requires redeploy or migration.
- Frontend env vars are renamed, removed, or change semantics.
- Job status transitions or authorization rules change in a way that breaks existing clients.
- Default network or contract ID assumptions change for packaged deployments.

When in doubt, prefer calling out a change explicitly rather than burying it under **Changed**.

## Writing Tips

- Lead with the outcome (“Freelancers can extend job TTL”) not the implementation (“Added `extend_job_ttl` helper”).
- Link related issues or PRs: `(#123)`.
- Use present tense for capabilities (“Adds”, “Fixes”) or past tense consistently within a release—do not mix both in the same section.
- For contract releases, always state whether redeploy is required and whether existing job state remains compatible.
