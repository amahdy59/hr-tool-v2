# Logo, focus, and modal surface review — 26 October 2026

The HR mark now uses separate, readable H and R strokes in a flat blue tile. The wordmark has a space between HR and Tool and preserves LTR ordering in Arabic. Removing filters, decorative nodes, gradients, and shared SVG resource identifiers avoids small-size overlap and clipping.

Composite search fields now draw one focus boundary around the entire shell, including the icon and clear action. The inner input has no independent border or halo. Ordinary fields have one idle border and a solid two-pixel focus ring; keyboard focus preserves each control's existing corner radius. Stronger-focus and forced-colors indicators remain available.

The shared dialog frame clips its contents while an inset, padded viewport handles scrolling. The close control stays outside the viewport, and headers reserve its space. Mobile dialogs consistently use the full dynamic viewport. The dashboard filter drawer uses an independent inset viewport and cannot scroll its outer frame, including Vaul's below-screen filler. Its overlay sits above the application header.

Scrollbars use a rounded visible thumb, a transparent rail, and no Chromium arrow buttons. Modal rails stay clear of rounded corners and the close control. Firefox retains thin native scrollbars. The screenshot runner now explicitly keeps native scrollbars visible instead of accepting Puppeteer's default hide-scrollbars flag.

Source review covered all shared-dialog call sites, the dashboard drawer, form primitives, search surfaces, and notification/filter popovers. Browser checks exercise leave and mission requests, employee forms at desktop/portrait/landscape sizes, preferences, search, and the short-screen history drawer. The E2E checks assert that the form bottom is reachable, the close control stays in place, and scroll areas remain inside the frame.

Four additional screenshot states cover focused search in Arabic/light and English/dark, short-height Arabic preferences, and Arabic mobile leave requests. The updated visual set contains 18 scenarios. Screenshots were visually reviewed with native scrollbars enabled. Automated accessibility coverage also includes section search in both languages and themes.

Verification uses the repository's type, localization, RTL, unit, build, performance, accessibility, responsive, visual, and end-to-end gates. Automated checks and browser emulation do not replace physical-device or spoken screen-reader testing.

Results: 131 unit tests, 98 browser scenarios, 442 responsive checks, and 18 visual comparisons passed. Axe reported zero automated violations across 35 states. TypeScript, translation parity, RTL utilities, migration lint, dead-code analysis, production build, and performance budgets passed.
