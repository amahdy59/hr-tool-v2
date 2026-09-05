# ADR 0002: Zero-Defect Dual-Language (EN/AR) Translation Parity Gate

- **Status**: Accepted
- **Date**: 2026-09-05
- **Deciders**: Localization Architect, Principal Frontend Architect

---

## Context and Problem Statement
Bi-directional, bilingual systems (English LTR and Arabic RTL) frequently degrade over time when developers add features in English without adding corresponding Arabic keys, resulting in missing translations, fallback raw strings, or untranslated layout bugs in production.

Traditional internationalization setups rely on manual review to catch missing keys. For enterprise HR software deployed across MENA and international teams, a missing Arabic translation damages professional credibility and breaks layout mirroring.

---

## Decision
We enforce an **automated key-for-key symmetry verification gate** on every push and CI run.

### Key Architectural Constraints:
1. **Single Source of Truth (`src/i18n.ts`)**: English (`en`) and Arabic (`ar`) translation dictionaries reside side-by-side with identical hierarchical tree structures.
2. **Automated Tree Diffing**: `scripts/code_review.cjs` parses the translation dictionaries and computes recursive set differences (`enKeys \ arKeys` and `arKeys \ enKeys`).
3. **Hard Build Failure**: Any missing key or orphan key in either language causes exit code 1, aborting the pre-push hook and GitHub Actions deployment.
4. **No Raw String Literals in UI**: User-facing labels must be wrapped in `t('...')` hooks with interpolation parameters rather than hardcoded English.

---

## Consequences
- **Positive**:
  - 100% feature parity between English and Arabic at all times.
  - Zero raw string fallbacks or missing text in production.
- **Trade-offs**:
  - Developers cannot merge a UI change without supplying both English and Arabic translations simultaneously.
