# ADR 0003: Progressive Web Application (PWA) and Offline Resilience Strategy

- **Status**: Accepted
- **Date**: 2026-09-05
- **Deciders**: Systems Architect, Staff Security Engineer

---

## Context and Problem Statement
Corporate networks frequently suffer from captive portals, intermittent spotty Wi-Fi, and VPN reconnection latency. Standard single-page applications crash or display generic browser dinosaur errors when connectivity drops mid-session.

HR Tool requires high availability and resilience so employees can review policies, check attendance histories, and draft leave requests regardless of momentary network degradation.

---

## Decision
We implement a **PWA Application Shell with Workbox Service Worker Precaching and Stale-While-Revalidate Caching**.

### Key Architectural Constraints:
1. **Precaching Core App Shell**: All core JavaScript, CSS, HTML, SVG logos, and manifest assets are precached by Vite PWA (`vite-plugin-pwa`) at build time.
2. **Font Caching**: Google Fonts (`Inter`, `Noto Sans Arabic`, `IBM Plex Sans`) are cached using a `StaleWhileRevalidate` strategy with a 365-day TTL and 30-entry max limit.
3. **Graceful Offline UX (`OfflineBanner`)**: A custom, accessible offline banner automatically renders at the top of the interface when `window.onoffline` fires, reassuring the user that cached data remains accessible.
4. **Standalone App Manifest**: Standard Web App Manifest (`manifest.webmanifest`) supports home screen installation on iOS, Android, macOS, and Windows.

---

## Consequences
- **Positive**:
  - Near-instant load times (< 300ms) on repeat visits.
  - Zero downtime during temporary network outages.
- **Trade-offs**:
  - Service worker updates must be handled cleanly via Workbox to avoid serving stale assets across production deploys.
