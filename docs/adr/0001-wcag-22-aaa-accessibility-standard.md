# ADR 0001: Adoption of WCAG 2.2 Level AAA Accessibility Standards

- **Status**: Accepted
- **Date**: 2026-09-05
- **Deciders**: Principal Product Designer, Principal Frontend Architect, QA Lead

---

## Context and Problem Statement
Enterprise HR management systems are mission-critical tools used daily by diverse workforces with varying sensory, physical, cognitive, and linguistic needs. Default corporate tools frequently fail accessibility audits due to low-contrast color palettes (3:1), tiny touch targets (under 32px), inaccessible modals without keyboard traps, and jarring motion that can cause vestibular disorientation.

We required an uncompromised accessibility standard that makes HR Tool globally inclusive, government-contract ready, and immune to accessibility litigation.

---

## Decision
We mandate strict compliance with **WCAG 2.2 Level AAA** across all public and authenticated views of HR Tool.

### Key Architectural Constraints:
1. **7:1 Contrast Ratio**: All body and normal text must maintain at least 7:1 contrast against its background surface (exceeding the standard 4.5:1 AA requirement). Large text (18pt+ / 14pt bold+) must achieve at least 4.5:1.
2. **Minimum 44x44px Interactive Touch Targets**: All buttons, links, dropdowns, and form triggers must feature a minimum physical target size of 44x44px (`min-h-11 min-w-11`).
3. **High-Contrast Visible Focus Rings**: Every focusable element must display a custom 2px focus ring (`focus-visible:ring-2 focus-visible:ring-ring`) that passes contrast checks in both Light and Dark themes. Browser default outlines alone are disallowed.
4. **Motion Safety (`prefers-reduced-motion`)**: All decorative animations and gradient blobs must be completely bypassed or instantly terminated when the user or operating system requests reduced motion.
5. **Screen Reader Live Regions**: Real-time filtering, count changes, offline connectivity events, and error alerts must leverage polite or assertive `aria-live` regions.

---

## Consequences
- **Positive**:
  - Eliminates visual fatigue and eye strain for all users.
  - Guarantees 100% keyboard navigability for power users and switch-device operators.
  - Enforced via automated Axe-core gates in CI (`npm run check:a11y`).
- **Trade-offs**:
  - Color palette is strictly curated; highly saturated pastels cannot be used as text colors.
  - Spacing scales must account for 44px minimum heights, requiring disciplined mobile responsive layouts.
