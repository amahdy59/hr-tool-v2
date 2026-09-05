# HR Tool — Maintenance & Quality Engineering Guide

This document establishes the architecture, standards, and automated quality gates designed to keep **HR Tool** self-maintainable, WCAG 2.2 AAA compliant, fully bilingual (LTR/RTL), and responsive across all device form factors.

---

## 1. Automated Verification Pipeline

Every commit pushed to the repository triggers automated quality checks locally (via `.githooks/pre-push`) and remotely in GitHub Actions CI/CD (`.github/workflows/deploy.yml`).

### Commands Quick Reference

| Command | Check Performed | Criteria / Gate |
| :--- | :--- | :--- |
| `npm run check:code` | **Code Review**: TypeScript check, PWA manifest verification, and i18n key symmetry | 0 TypeScript errors, valid manifest, 100% EN/AR translation key parity |
| `npm run check:a11y` | **Accessibility Review**: Headless Axe-core audit across Login, Case Study, and Dashboard (EN & AR) | 0 WCAG 2.2 AAA violations |
| `npm run check:responsive` | **Responsiveness Review**: Automated Puppeteer audit across 7 standard viewports (320px–1440px) | 0 horizontal scroll overflow (`scrollWidth <= innerWidth`) |
| `npm run test` | **Unit Tests**: Vitest test suite | All unit tests pass |
| `npm run test:e2e` | **E2E Tests**: Puppeteer end-to-end integration tests | All flows pass (auth, navigation, data tables, modals, filters) |
| `npm run prepush` | **Full Composite Gate**: Executes all checks in sequence prior to push | Zero failures allowed |

---

## 2. Pre-Push Local Enforcement

The repository utilizes a Git hook located at `.githooks/pre-push`.

### Enabling the Git Hook locally
If setting up a fresh clone, enable the hooks directory with:
```bash
git config core.hooksPath .githooks
```

Whenever you run `git push origin main`, the pre-push hook automatically executes:
1. `check:code` (TypeScript, PWA Manifest, i18n Parity)
2. `test` (Unit Tests)
3. `build` (Production Vite Build)
4. `check:a11y` (Axe-core WCAG 2.2 AAA)
5. `check:responsive` (7-Viewport Overflow Audit)
6. `test:e2e` (End-to-End User Journeys)

If any check fails, the push is immediately halted, safeguarding the production deployment.

---

## 3. GitHub Actions CI/CD Architecture

The workflow `.github/workflows/deploy.yml` enforces the same gates on Ubuntu runners before deploying static assets to GitHub Pages:

1. **Environment Setup**: Node.js 22 with npm cache.
2. **Code Review Step**: `npm run check:code`
3. **Unit Tests Step**: `npm run test`
4. **Production Build Step**: `npm run build`
5. **Accessibility Step**: `npm run check:a11y`
6. **Responsiveness Step**: `npm run check:responsive`
7. **E2E Suite Step**: `npm run test:e2e`
8. **Deployment Summary**: Writes a consolidated markdown status report to `$GITHUB_STEP_SUMMARY`.
9. **GitHub Pages Deployment**: Deploys artifact to `https://amahdy59.github.io/hr-tool-v2/`.

---

## 4. Developer Contribution & Extension Standards

### A. Adding Translations (i18n)
All strings are centralized in `src/i18n.ts`. When adding a new key:
1. Add the key under the appropriate section in `en.translation`.
2. Add the exact identical key path and Arabic translation under `ar.translation`.
3. Run `npm run check:code` to verify that parity is maintained. Missing keys will fail the build.

### B. Accessibility Guidelines (WCAG 2.2 AAA)
- **Contrast**: Maintain minimum 7:1 for body text and 4.5:1 for large text/icons.
- **Touch Targets**: Minimum 44x44px for all interactive buttons, selects, and links (`min-h-11`, `min-w-11`).
- **Focus Indicators**: Visible, high-contrast focus rings (`focus-visible:ring-2 focus-visible:ring-ring`).
- **Reduced Motion**: Respect `prefers-reduced-motion` using Tailwind's `motion-reduce:*` utilities or CSS variables.
- **Labels**: Every input must have an associated `<label>` or `aria-labelledby`, and contextual icons must have `aria-hidden="true"`.

### C. Responsiveness & RTL Standards
- **Breakpoints**: 320px, 375px, 414px, 768px, 1024px, 1280px, 1440px.
- **RTL Mirroring**: Use logical properties (`start`, `end`, `ms-*`, `me-*`) rather than `left`/`right`.
- **Zero Overflow**: Containers must use `w-full min-w-0 max-w-full overflow-hidden` or `overflow-x-auto` on scrollable data tables to prevent body scrollbar leaks.

---

## 5. Troubleshooting

- **Axe-core violation detected**:
  Check `accessibility_audit_report.json` generated in the root directory for exact CSS selectors and remediation guidance.
- **Horizontal overflow detected**:
  Inspect the offending viewport reported in `npm run check:responsive`. Look for fixed-width containers (`w-[...]` or `min-w-[...]`) that lack responsive overrides or `max-w-full`.
- **E2E or Puppeteer timeout on Windows**:
  Ensure local test servers listen on `127.0.0.1` rather than `localhost` to avoid IPv6 resolution delays.
