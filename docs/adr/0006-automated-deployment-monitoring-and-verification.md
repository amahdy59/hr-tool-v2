# ADR 0006: Automated Multi-Target Deployment Monitoring & Verification

- **Status**: Accepted
- **Date**: 2026-09-05
- **Deciders**: Engineering Director, Principal Architect, Staff DevOps Engineer

---

## Context and Problem Statement
Deployments across modern distributed web applications frequently span multiple services and environments:
1. **Database & Backend Previews**: Supabase Preview branch migrations executing schema updates and data seeds.
2. **Preview Hosting**: Vercel branch deployments and preview environments.
3. **Production Static Hosting**: GitHub Pages hosting static client bundles with service worker caches.

A failure in any one of these targets (such as a database seed syntax error in Supabase Preview, a broken edge asset, or an uncaught runtime exception on the live production bundle) can compromise availability or block team workflows. Teams should not have to manually refresh browser consoles or inspect remote check runs to verify that deployments succeeded.

---

## Decision
We introduce an **Automated Deployment Verification Architecture** composed of:

1. **Pre-Deployment Migration Gate (`scripts/lint_supabase_migrations.cjs`)**:
   - Statically validates all SQL migrations and seeds prior to pushing.
   - Enforces strict RFC-4122 hexadecimal UUID formatting (`^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$`).
   - Flags hazardous uncasted UUID comparisons (`id LIKE '...'` without `::text`).
   - Automatically executes during pre-push and in `scripts/code_review.cjs`.

2. **Multi-Target Check-Run Auto-Checker (`scripts/check_deployments.cjs`)**:
   - Queries the GitHub Check Runs API for the target commit SHA.
   - Tracks all deployment targets: `Supabase Preview`, `Vercel`, and `Deploy static content to Pages`.
   - Supports polling with timeout (`--wait --timeout 300`) to wait for asynchronous deployment completion.
   - Exits with a non-zero exit code if any target deployment fails or times out.

3. **Live Production Smoke Testing (`npm run check:live`)**:
   - Executes automated headless browser smoke tests (Puppeteer) against the live deployed URL.
   - Verifies HTTP 200/304 status, `#root` DOM mounting, Quick Login authentication flow, and authenticated dashboard rendering.
   - Asserts zero unhandled browser console exceptions and zero failed network requests.

4. **CI/CD Pipeline Integration (`.github/workflows/deploy.yml`)**:
   - Runs post-deployment live verification step immediately following the `deploy-pages` action.

---

## Consequences
- **Positive**:
  - Immediate, automated visibility into multi-cloud deployment status (Supabase, Vercel, GitHub Pages).
  - Pre-deployment migration linting prevents database preview failures before code is pushed.
  - Live production endpoints are continuously validated against silent runtime errors and broken assets.
- **Trade-offs**:
  - Live smoke tests require network connectivity to public deployment endpoints.
