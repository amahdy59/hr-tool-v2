# ADR 0004: Design System Tokens Contract and Zero Magic Numbers

- **Status**: Accepted
- **Date**: 2026-09-05
- **Deciders**: Design Systems Architect, Lead Frontend Engineer

---

## Context and Problem Statement
Codebases built with utility CSS without strict governance tend to accumulate "magic numbers"—arbitrary pixel values (`w-[317px]`, `text-[13px]`, `px-[19px]`, raw hex `#1a2b3c`). This leads to visual inconsistency across pages, broken dark modes, and high maintenance costs when modifying brand colors or radius scales.

---

## Decision
We establish a **Semantic Design Token Contract** enforced through CSS custom properties and standard Tailwind utility scales.

### Key Architectural Constraints:
1. **Semantic Color Variables**: Colors must reference functional roles (`--color-surface-base`, `--color-text-primary`, `--primary`, `--border`) rather than hardcoded palette names or raw hex strings.
2. **Fixed Spacing Scale**: All padding, margins, and gaps follow a 4px/8px modular scale (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`).
3. **Logical CSS Properties**: Layout wrappers and spacing utilities must strictly utilize logical properties (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`) instead of directional physical properties (`ml-*`, `mr-*`, `pl-*`, `pr-*`, `left-*`, `right-*`) to preserve RTL layout mirroring in Arabic.
4. **Interactive Component Tokens**: Interactive elements utilize standardized tokens for radii (`--radius`, `--radius-button`, `--radius-card`) and elevations (`--elevation-sm`, `--elevation-md`).

---

## Consequences
- **Positive**:
  - Seamless dark/light theme switching without visual artifacts.
  - Pixel-consistent rhythm across all data tables, modals, and navigation drawers.
- **Trade-offs**:
  - Requires developers to consult design system documentation before introducing ad-hoc values.
