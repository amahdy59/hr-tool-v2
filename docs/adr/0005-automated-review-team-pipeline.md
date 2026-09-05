# ADR 0005: The "Automated Review Team" Quality Gate Pipeline

- **Status**: Accepted
- **Date**: 2026-09-05
- **Deciders**: Engineering Director, Principal Architect, Staff QA Engineer

---

## Context and Problem Statement
Human code reviews are prone to cognitive fatigue, missed edge cases, and subjectivity. Mechanical checks—such as checking whether an Arabic translation key is missing, whether a modal causes a 1px horizontal overflow on an iPhone SE, whether an icon button has an accessible label, or whether unused dead exports are lingering—should not consume human engineering cycles.

---

## Decision
We construct an **autonomous "Review Team"** comprised of automated scripts that execute both locally prior to push (`.githooks/pre-push`) and remotely in GitHub Actions CI/CD (`.github/workflows/deploy.yml`).

### The Automated Reviewer Roster:
1. **The Code Reviewer (`npm run check:code`)**:
   - TypeScript compilation (`tsc --noEmit`).
   - PWA Manifest verification.
   - i18n translation key parity check (100% EN/AR symmetry).
   - RTL logical property linter (flags forbidden physical spacing).
2. **The Accessibility Auditor (`npm run check:a11y`)**:
   - Axe-core headless engine evaluating WCAG 2.2 AAA across Login, Case Study, and Dashboard in EN/AR. Zero violations allowed.
3. **The Responsiveness Inspector (`npm run check:responsive`)**:
   - Puppeteer engine simulating 7 viewports (320px to 1440px) ensuring 0 horizontal scroll overflow (`scrollWidth <= innerWidth`).
4. **The Visual Regression Guard (`npm run check:visual`)**:
   - Pixelmatch image diffing against baseline screenshots, flagging unexpected layout or style regressions.
5. **The Dead Code Hunter (`npm run check:deadcode`)**:
   - Knip static analysis auditing unused files, exports, and dependencies.
6. **The Functional QA Suite (`npm run test` & `npm run test:e2e`)**:
   - 21 Vitest unit tests + 28 Puppeteer E2E user journey tests.

---

## Consequences
- **Positive**:
  - Eliminates human error and catches regressions before code reaches `main`.
  - Gives every pull request the scrutiny of a dedicated QA, Accessibility, and Architecture team.
- **Trade-offs**:
  - Local pre-push verification takes ~1-2 minutes; developers must maintain green builds at all times.
