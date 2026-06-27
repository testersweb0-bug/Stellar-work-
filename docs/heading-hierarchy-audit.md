# Heading Hierarchy Audit

This document provides an audit of heading hierarchies across all documentation files in the `docs/` directory.

## Audit Checklist

Use this checklist when reviewing or creating documentation:

- [ ] **One H1 per page** - Each document should have exactly one H1 heading
- [ ] **No skipped heading levels** - Headings should follow logical progression (H1 → H2 → H3, not H1 → H3)
- [ ] **Consistent heading style** - Use sentence case or title case consistently within a document
- [ ] **Descriptive headings** - Headings should clearly describe the content that follows
- [ ] **Logical nesting** - Subheadings should be directly related to their parent heading
- [ ] **No orphaned headings** - Each heading should have content following it

## Audit Results

### ✅ ARCHITECTURE.md

| Heading Level | Heading Text | Line |
|--------------|--------------|------|
| H1 | System Architecture | 1 |
| H2 | System Components | 5 |
| H2 | Data Split: On-chain vs Off-chain | 13 |
| H2 | Wallet Integration (Freighter) | 20 |
| H2 | Job & Escrow Lifecycle | 28 |
| H3 | Flow Diagram | 37 |

**Status**: ✅ Pass - One H1, no skipped levels, logical hierarchy

---

### ✅ CONTRACT.md

| Heading Level | Heading Text | Line |
|--------------|--------------|------|
| H1 | Escrow Contract Reference | 1 |
| H2 | Implemented (Starter Kit) | 5 |
| H2 | Stubbed (Contributor Scope) | 15 |
| H2 | Data Model | 20 |
| H3 | `Job` struct | 22 |
| H2 | Error Codes | 40 |

**Status**: ✅ Pass - One H1, no skipped levels, logical hierarchy

---

### ✅ TRIAGE.md

| Heading Level | Heading Text | Line |
|--------------|--------------|------|
| H1 | Issue Triage Guide | 1 |
| H2 | Overview | 5 |
| H2 | Triage Steps | 8 |
| H2 | Label Meanings | 25 |
| H2 | SLA Expectations | 43 |

**Status**: ✅ Pass - One H1, no skipped levels, logical hierarchy

---

### ✅ contract-reference.md

| Heading Level | Heading Text | Line |
|--------------|--------------|------|
| H1 | Contract Function Quick Reference | 1 |
| H2 | Core Lifecycle Methods | 5 |
| H2 | Dispute Resolution | 18 |
| H2 | Data Structures | 25 |
| H3 | JobStatus (Enum) | 27 |
| H3 | Job (Struct) | 35 |
| H2 | Administrative & Utility Methods | 53 |
| H3 | `get_admin` Return Format | 72 |

**Status**: ✅ Pass - One H1, no skipped levels, logical hierarchy

---

### ✅ environments.md

| Heading Level | Heading Text | Line |
|--------------|--------------|------|
| H1 | Environments Reference | 1 |
| H2 | Environment Variables | 3 |
| H3 | Required Variables | 5 |
| H3 | Optional Variables | 13 |
| H3 | Deprecated/Documented Variables | 25 |
| H2 | Target Environments | 33 |
| H3 | Testnet (Default) | 35 |
| H3 | Mainnet (Production) | 42 |
| H2 | Configuration Files | 48 |
| H3 | Frontend | 50 |
| H2 | Network Detection Logic | 58 |
| H2 | Explorer URLs | 67 |
| H2 | Deployment Considerations | 73 |
| H3 | Testnet Deployment | 75 |
| H3 | Mainnet Deployment | 82 |
| H2 | Common Issues | 90 |
| H2 | Synchronization with Code | 96 |

**Status**: ✅ Pass - One H1, no skipped levels, logical hierarchy

---

### ✅ maintenance-window-announcement-template.md

| Heading Level | Heading Text | Line |
|--------------|--------------|------|
| H1 | Maintenance Window Announcement Template | 1 |
| H2 | Pre-maintenance announcement | 5 |
| H3 | Timeline | 11 |
| H3 | Affected surfaces | 20 |
| H3 | Impact | 27 |
| H3 | Contact | 34 |
| H2 | Post-maintenance update | 41 |
| H3 | Timeline (actual) | 47 |
| H3 | Outcome | 55 |
| H3 | Verification | 60 |
| H3 | Follow-up | 67 |

**Status**: ✅ Pass - One H1, no skipped levels, logical hierarchy

---

### ✅ production-escalation.md

| Heading Level | Heading Text | Line |
|--------------|--------------|------|
| H1 | Production Escalation Path | 1 |
| H2 | Escalation levels | 5 |
| H2 | First response | 14 |
| H2 | Escalation ladder | 21 |
| H2 | Ownership and contact path | 30 |
| H2 | Mitigation checklist | 39 |
| H2 | Related docs | 47 |

**Status**: ✅ Pass - One H1, no skipped levels, logical hierarchy

---

### ✅ release-checklist.md

| Heading Level | Heading Text | Line |
|--------------|--------------|------|
| H1 | Release Checklist | 1 |
| H2 | Contract | 5 |
| H2 | Frontend | 11 |
| H2 | Communications | 19 |
| H2 | Release | 24 |
| H2 | Rollback Checklist (Failed Release) | 31 |

**Status**: ✅ Pass - One H1, no skipped levels, logical hierarchy

---

### ✅ storage-key-migration-note.md

| Heading Level | Heading Text | Line |
|--------------|--------------|------|
| H1 | Storage Key Migration Note | 1 |
| H2 | Migration approach | 5 |
| H2 | Backward compatibility concerns | 12 |
| H2 | Rollback note | 19 |

**Status**: ✅ Pass - One H1, no skipped levels, logical hierarchy

---

### ✅ testnet-deployment-guide.md

| Heading Level | Heading Text | Line |
|--------------|--------------|------|
| H1 | Stellar Testnet Deployment Guide | 1 |
| H2 | Prerequisites | 5 |
| H2 | 1) Configure Soroban Identity and Network | 11 |
| H2 | 2) Build Contract | 24 |
| H2 | 3) Deploy Contract | 38 |
| H2 | 4) Initialize Contract | 49 |
| H2 | 5) Configure Frontend | 63 |
| H2 | 6) Smoke Check | 83 |
| H2 | Common Errors | 92 |

**Status**: ✅ Pass - One H1, no skipped levels, logical hierarchy

---

### ✅ troubleshooting.md

| Heading Level | Heading Text | Line |
|--------------|--------------|------|
| H1 | Local Development Troubleshooting Guide | 1 |
| H2 | 1. Contract Build Failures | 5 |
| H3 | Issue: `error: no such subcommand: contract` | 7 |
| H3 | Issue: `error: failed to run custom build command for 'soroban-env-common ...'` | 13 |
| H2 | 2. Frontend Connection Issues | 19 |
| H3 | Issue: `NEXT_PUBLIC_CONTRACT_ID is not configured` | 21 |
| H3 | Issue: `Error: contract not found` (in browser) | 30 |
| H2 | 3. Transaction Failures | 36 |
| H3 | Issue: `HostError: Error(Contract, #10)` (Already Initialized) | 38 |
| H3 | Issue: `Insufficient Balance` | 41 |
| H3 | Issue: `Unauthorized` / `Error(Contract, #2)` | 52 |
| H2 | 4. Tooling Issues | 55 |
| H3 | Issue: `npm install` hanging or failing | 57 |
| H3 | Issue: Pre-commit hooks failing | 66 |

**Status**: ✅ Pass - One H1, no skipped levels, logical hierarchy

---

## Summary

**Total Files Audited**: 11

**Pass**: 11 ✅  
**Fail**: 0 ❌

**Overall Status**: ✅ All documentation files have proper heading hierarchy with no skipped levels and exactly one H1 per page.

## Recommendations

1. **Maintain current standards** - All files follow proper heading hierarchy conventions
2. **Use audit checklist** - Apply the checklist above when creating new documentation
3. **Consider automated linting** - Tools like `markdownlint` can enforce heading hierarchy rules automatically
4. **Regular reviews** - Re-run this audit when adding new documentation files
