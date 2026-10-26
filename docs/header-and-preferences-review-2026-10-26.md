# Header and preferences review — 26 October 2026

## Result

Fixed the accessibility menu failure and simplified the application shell around everyday HR tasks. The previous responsive implementation opened a mobile Sheet and desktop Popover from the same state; both could mount portals and compete for focus. Preferences now uses one responsive modal dialog, one trigger, and one focus scope at every width.

## Purpose and hierarchy

| Control | Purpose and placement |
| --- | --- |
| Current section | Plain text at the start of the header; replaces duplicate brand breadcrumbs and a truncated location badge. |
| Section search | Finds any of the eight sections with pointer or keyboard navigation. Ctrl/Cmd+K remains available. |
| Notifications | Read, filter, mark read, and dismiss HR notifications; available on mobile as well as desktop. |
| Preferences and accessibility | One consistent home for theme, language, and reading/interaction settings. |
| Account | Identity, profile, keyboard shortcuts, pending sync when relevant, and logout. |

Removed standalone theme/language, shortcut, and design-catalog toolbar buttons; static online indicators; demo notification generation; the cache-status sample notification; and the nonfunctional PRO badge. Design inspection remains available through the development-only shortcut. Dashboard actions use a clear primary/secondary hierarchy; optional workflow explanations use compact native help disclosures across attendance, leave, missions, payroll, and roles.

## Interaction and accessibility changes

- Preferences remains open when theme, language, or reading settings change. It contains focus, supports Escape, and returns focus on dismissal, including after changing viewport size.
- A bottom Done action closes long preference panels without requiring touch users to scroll back to the top. Login uses natural document height so its heading and controls remain reachable on short screens.
- Theme and language use labeled radio groups with keyboard navigation. Settings have unique IDs and visible descriptions. Larger targets now increase controls beyond their default size.
- Section search uses the existing command primitive inside the shared dialog, replacing manual focus blocking and invalid selection state after an empty search. The sample-data reset action is no longer in user navigation.
- Notification items and dismiss buttons are separate native controls. Actions have translated names, filters expose selection, and focus remains on a stable control when an item disappears.
- Horizontal tables have named, keyboard-focusable scroll regions. Shared buttons use semantic theme colors, fixing dark text on fixed blue gradients; destructive text/background contrast and dark secondary-button borders are improved.
- Updated runtime translations, the master dictionary, design-system guidance, and screenshot references. No runtime dependencies were added.

Interaction decisions follow the W3C guidance for [modal dialogs](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), [radio groups](https://www.w3.org/WAI/ARIA/apg/patterns/radio/), and [consistent identification](https://www.w3.org/WAI/WCAG22/Understanding/consistent-identification.html).

## Verification

- `npm run check:code`: passed TypeScript, 401-key translation parity, manifest, RTL, and migration checks.
- `npm run check:deadcode`: passed.
- `npm run test`: 109 tests passed, including new menu stability, preferences, notification focus, and account-menu coverage.
- `npm run build` and `npm run check:perf`: passed. Main assets remain within the 160 KiB JavaScript and 35 KiB CSS gzip budgets.
- `npm run test:e2e`: 74 checks passed, including repeated opening, language/theme changes, all reading settings, persistence, search recovery, focus containment, and return focus.
- `npm run check:responsive`: 442 checks passed across all eight sections in both languages at seven widths from 320px to 1440px, including enlarged settings and login control bounds. The reset action wraps at 320px with every reading option enabled.
- `npm run check:a11y`: zero automated violations across 23 states, including both themes/locales, mobile dashboards, navigation, notifications, preferences, and all enabled reading options.
- Screenshot coverage expanded to 14 deterministic scenarios, including Arabic desktop layout and preferences in both themes. Evidence is stored in `test/visual-baselines/`; the updated Arabic toolbar is also captured in `.codex-header-after-ar.png` locally.

Browser automation and visual inspection cover the verified scenarios. Physical-device and assistive-technology sessions remain additional release validation; automated results do not establish complete WCAG conformance.
