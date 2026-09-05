# HR Tool — Maintenance & Quality Engineering Guide

This document establishes the architecture, standards, and automated quality gates designed to keep **HR Tool** self-maintainable, WCAG 2.2 AAA compliant, fully bilingual (LTR/RTL), and responsive across all device form factors.

---

## 1. Automated Verification Pipeline (The "Review Team")

Every commit pushed to the repository triggers automated quality checks locally (via `.githooks/pre-push`) and remotely in GitHub Actions CI/CD (`.github/workflows/deploy.yml`).

### Commands Quick Reference

| Command | Check Performed | Criteria / Gate |
| :--- | :--- | :--- |
| `npm run check:code` | **Code Review**: TypeScript check, PWA manifest verification, i18n key symmetry, and RTL physical property linter | 0 TypeScript errors, valid manifest, 100% EN/AR translation key parity, 0 physical spacing classes |
| `npm run check:deadcode` | **Dead Code Audit**: Knip static analysis auditing unused files and dependencies | 0 unreferenced files, 0 dead dependencies |
| `npm run test` | **Unit Tests**: Vitest suite covering domain calculations, Zod schemas, and SafeStorage | 100% tests pass (29/29) |
| `npm run build` | **Production Build**: Vite production bundle + PWA Service Worker generation | Successful bundle with precache manifest |
| `npm run check:a11y` | **Accessibility Review**: Headless Axe-core audit across Login, Case Study, and Dashboard (EN & AR) | 0 WCAG 2.2 AAA violations |
| `npm run check:responsive` | **Responsiveness Review**: Automated Puppeteer audit across 7 standard viewports (320px–1440px) | 0 horizontal scroll overflow (`scrollWidth <= innerWidth`) |
| `npm run check:visual` | **Visual Regression**: Pixelmatch screenshot diffing against baseline renders across devices and locales | 0% visual layout regressions (< 0.1% subpixel tolerance) |
| `npm run test:e2e` | **E2E Tests**: Puppeteer end-to-end integration tests | All user journeys pass (28/28) |
| `npm run prepush` | **Full Composite Gate**: Executes all 8 checks in sequence prior to push | Zero failures allowed |

---

## 2. Pre-Push Local Enforcement

The repository utilizes a Git hook located at `.githooks/pre-push`.

### Enabling the Git Hook locally
If setting up a fresh clone, enable the hooks directory with:
```bash
git config core.hooksPath .githooks
```

Whenever you run `git push origin main`, the pre-push hook automatically executes all 8 review gates in sequence. If any check fails, the push is immediately halted, safeguarding the production deployment.

---

## 3. GitHub Actions CI/CD Architecture

The workflow `.github/workflows/deploy.yml` enforces the exact same 8 gates on Ubuntu runners before deploying static assets to GitHub Pages:

1. **Environment Setup**: Node.js 22 with npm cache.
2. **Code Review Step**: `npm run check:code`
3. **Dead Code Audit Step**: `npm run check:deadcode`
4. **Unit Tests Step**: `npm run test`
5. **Production Build Step**: `npm run build`
6. **Accessibility Step**: `npm run check:a11y`
7. **Responsiveness Step**: `npm run check:responsive`
8. **Visual Regression Step**: `npm run check:visual`
9. **E2E Suite Step**: `npm run test:e2e`
10. **Deployment Summary**: Writes a consolidated markdown status report to `$GITHUB_STEP_SUMMARY`.
11. **GitHub Pages Deployment**: Deploys artifact to `https://amahdy59.github.io/hr-tool-v2/`.

---

## 4. Architecture Decision Records (ADRs)

Institutional architecture memory is preserved under `docs/adr/`:
- **[0001: WCAG 2.2 AAA Standards](docs/adr/0001-wcag-22-aaa-accessibility-standard.md)**: 7:1 contrast ratios, 44px touch targets, motion safety.
- **[0002: Dual-Language i18n Parity](docs/adr/0002-dual-language-i18n-parity-gate.md)**: 100% key symmetry enforcement between EN and AR dictionaries.
- **[0003: PWA & Offline Resilience](docs/adr/0003-pwa-offline-resilience-strategy.md)**: Workbox precaching, font caching, and offline banner UX.
- **[0004: Design System Tokens Contract](docs/adr/0004-design-system-tokens-contract.md)**: Modular 4px/8px spacing and logical CSS properties.
- **[0005: Automated Review Team Pipeline](docs/adr/0005-automated-review-team-pipeline.md)**: Autonomous static, visual, and cognitive quality gates.

---

## 5. Developer Contribution & Extension Standards

### A. Zero-Trust Runtime Schemas (`src/domain/schemas.ts`)
All domain data (Employees, Leave Requests, Missions, Attendance) are governed by Zod schemas.
- When adding fields to models, update the corresponding schema in `src/domain/schemas.ts`.
- Use `SafeStorage.getItem(key, schema, defaultValue)` when interacting with localStorage to prevent corrupt state from crashing React components.

### B. Visual Regression Baselines (`scripts/visual_regression.cjs`)
When introducing intentional UI redesigns:
```bash
node scripts/visual_regression.cjs --update-baselines
```
Inspect the new images in `test/visual-baselines/` before committing.

### C. Adding Translations (i18n)
All strings are centralized in `src/i18n.ts`. When adding a new key:
1. Add the key under the appropriate section in `en.translation`.
2. Add the exact identical key path and Arabic translation under `ar.translation`.
3. Run `npm run check:code` to verify that parity is maintained. Missing keys will fail the build.

### D. Accessibility Guidelines (WCAG 2.2 AAA)
- **Contrast**: Maintain minimum 7:1 for body text and 4.5:1 for large text/icons.
- **Touch Targets**: Minimum 44x44px for all interactive buttons, selects, and links (`min-h-11`, `min-w-11`).
- **Focus Indicators**: Visible, high-contrast focus rings (`focus-visible:ring-2 focus-visible:ring-ring`).
- **Reduced Motion**: Respect `prefers-reduced-motion` using Tailwind's `motion-reduce:*` utilities or CSS variables.
- **Labels**: Every input must have an associated `<label>` or `aria-labelledby`, and contextual icons must have `aria-hidden="true"`.

### E. Responsiveness & RTL Standards
- **Breakpoints**: 320px, 375px, 414px, 768px, 1024px, 1280px, 1440px.
- **RTL Mirroring**: Use logical properties (`start`, `end`, `ms-*`, `me-*`, `ps-*`, `pe-*`) rather than `left`/`right`/`ml-*`/`mr-*`.
- **Zero Overflow**: Containers must use `w-full min-w-0 max-w-full overflow-hidden` or `overflow-x-auto` on scrollable data tables to prevent body scrollbar leaks.

---

## 6. Troubleshooting

- **Visual Regression failed**:
  Check `test/visual-baselines/diff-*.png` to see which pixels shifted. If the change was intentional, re-run with `--update-baselines`.
- **Axe-core violation detected**:
  Check `accessibility_audit_report.json` generated in the root directory for exact CSS selectors and remediation guidance.
- **Dead code detected by Knip**:
  Run `npx knip` to inspect unused files or dependencies. Clean up unused imports or add intentional entry points to `knip.json`.
