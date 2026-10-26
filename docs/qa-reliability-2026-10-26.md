# Reliability and usability follow-up — 26 October 2026

## Changes

- Offline replay calls the leave/mission data services. Requests leave IndexedDB only after successful persistence and a committed deletion. Failed requests remain retryable, preserve decision order, and retain a stable submission ID. Overlapping retries share one operation; supported browsers also coordinate across tabs with Web Locks.
- Creates use stable IDs to prevent duplicate submissions on retry. Status updates require a matching row. Replays denied by row-level security stay queued rather than falling through to an RPC that generates a new ID.
- Initial sample loading preserves existing local records, including changes made while the download is in flight. Reading placeholders does not persist or mutate shared sample objects. An explicit sample reset can still replace records.
- Demo sign-in and reset explain their limitations. Reset uses the shared accessible dialog, contains keyboard focus, restores trigger focus, and never claims an email was sent. The unused Remember me checkbox is removed; demo entry precedes the sample form.
- The sample-profile preview replaces the simulated LinkedIn import. It collects no URL or PDF, offers a review step, and explicitly identifies the summary and skills it will replace. Other profile sections are preserved.
- Notification read/dismissed preferences persist per normalized account identifier on the current device. Blocked storage leaves the controls usable and explains the session-only fallback. Notifications are identified as samples.
- Offline, install, and update notices reserve space under the header. A scrollable notice area is capped at 40% of the viewport, preserving content and bottom navigation. Update text asks users to save before reload; install copy explains the internet requirement.

## Verification

Automated results: 131 unit tests, 87 browser scenarios, 442 responsive checks, and 14 visual comparisons passed. Axe reported zero automated violations across 31 audited states.

- TypeScript, translation parity, RTL utility checks, migration lint, dead-code audit, production build, and performance budgets.
- Unit tests cover committed and aborted IndexedDB writes, failed/overlapping replay, stable IDs, server rejection, per-account notification persistence, blocked storage, sample preview, and background-initialization races.
- End-to-end tests cover real IndexedDB replay, a real waiting service worker, keyboard focus, and stacked offline/install/update notices at 320×568, 667×375, and 1280×800 in English and Arabic.
- Automated axe checks include reset preview and validation, preferences, navigation, notifications, and offline/install notices in both languages and light/dark themes. These checks do not establish full WCAG conformance.
- Responsive checks cover all eight sections at seven viewport sizes. Fourteen screenshot scenarios were checked; three login baselines were updated and visually inspected for the intended changes.
- Edge's actual browser zoom setting was exercised at 100%, 200%, and 400% in an isolated profile. Observed CSS viewport widths were 1250, 625, and 312 pixels, with device-pixel ratios 1, 2, and 4. The dashboard had no horizontal page overflow, and preferences retained keyboard focus and their accessible dialog name at every zoom level.

## Verification limits

Physical phones and spoken screen-reader output were not available for validation. Native Windows automation was attempted, but state capture returned `computer-use request timed out: get_window_state`, then `no screenshot targets found for MSEdge`. Browser accessibility-tree checks and keyboard tests passed; they do not replace Narrator, NVDA, VoiceOver, TalkBack, or physical-device testing.

Server replay behavior is covered with data-service tests. The real-browser replay test verifies local persistence in sample-data mode and intercepts its synthetic record when Supabase is configured; it does not write a QA decision to production. Existing queued creates denied by database policy remain pending until that policy supports insertion with a stable ID.
