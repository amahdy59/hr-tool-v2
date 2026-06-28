# HR Tool - Design System Guidelines

This document outlines the design system specifications, spacing tokens, layout guidelines, and typography scales used in the HR Tool. Following these guidelines ensures design consistency, responsiveness, accessibility, and high performance across all views.

---

## 📐 Layout & Spacing System

We adhere to a strict **4px/8px grid system** for layouts. All margins, paddings, and flex/grid gaps must align with this spacing scale:

### 1. Label-to-Input Spacing (Standardized)
- **Token:** `--spacing-label-input`
- **Value:** `4px` (Tailwind `space-y-1` or `gap-1` or `mb-1`)
- **Rule:** The vertical spacing between a form `<label>` (or `<legend>`) and its corresponding input box, search field, or dropdown trigger must be exactly **4px**. This maintains a tight visual grouping between labels and inputs.
- **Search fields:** Search inputs follow the same rule. The Manage Employees search groups use `space-y-1`, so labels such as **Search Employees**, **Search Departments**, **Search Job Titles**, and **Search Activity Log** sit exactly **4px** above their search boxes.

### 2. Field-to-Field Spacing
- **Spacing:** `16px` (Tailwind `space-y-4` or `gap-4` or `mb-4`)
- **Rule:** Spacing between adjacent form groups or input fields in a form column.

### 3. Element Spacing inside Rows
- **Spacing:** `8px` to `12px` (Tailwind `gap-2` to `gap-3`)
- **Rule:** Spacing between buttons, pills, tags, or inline controls (e.g., search box next to a filter button).

### 4. Section-to-Section Spacing
- **Spacing:** `24px` to `32px` (Tailwind `space-y-6` to `space-y-8` or `gap-6` to `gap-8`)
- **Rule:** Spacing between large card layouts, tables, tab layouts, or page panels.

### 5. Tabs-to-Panel Spacing
- **Spacing:** `12px` (Tailwind `gap-3`)
- **Rule:** The vertical spacing between a tab list and the first control inside the active tab panel must be **12px** for dense management screens.
- **Manage Employees:** The tab root uses `gap-3`; tab panels must not add an extra top margin. This keeps the distance from the tab underline to the search/input group consistent across Directory, Departments, Job Titles, and Activity Log.

---

## 🎨 Color Tokens & Contrast (WCAG 2.2 AAA)

We follow strict accessibility color rules:
- **Light Mode Background:** `#F8FAFC`
- **Dark Mode Background:** `#0F172A`
- **Standard Text Color:** `#0F172A` (Light Mode), `#EEF2F7` (Dark Mode)
- **Focus Ring Color:** `#2563EB` (Tailwind `ring-ring` / `focus:ring-2`)
- **Contract Ratio:** Must exceed `7:1` for normal text and `4.5:1` for large text.

---

## 🔤 Typography

- **Primary Typeface:** `Inter, sans-serif` for English and numerical layouts.
- **Font Scale:**
  - **Body text:** `16px` (`--text-base`)
  - **Small text/Labels:** `14px` (`--text-sm`)
  - **Extra small text/Helper text:** `12px` (`--text-xs`)
  - **Section Titles:** `18px` (`--text-lg`, semi-bold)
  - **Page Headers:** `24px` (`--text-xl`, bold)

---

## 🌍 Arabic & English (Bilingual / RTL Mirroring)

- **Directionality:** Dynamic mirroring is managed by `useArabicDomTranslation` and `DirectionProvider` dynamically via `document.documentElement.dir = 'rtl'`.
- **Text Alignment:** Labels and fields must align to the *start* of the viewport (`text-start` or logical properties like `margin-inline-start`).
- **Icons:** Directional arrows and navigation controls mirror in RTL, while non-directional branding icons do not.

---

## Component Standards

### Dropdowns and Select Menus
- Use the shared Radix-based components in `src/app/components/ui/select.tsx` for all select/dropdown field controls.
- Use `src/app/components/ui/dropdown-menu.tsx` for action menus and overflow menus.
- Do not use native `<select>` controls for app UI unless there is a documented browser/platform reason. This keeps styling, keyboard behavior, focus states, and selected states consistent.
- Triggers and menu items must keep a minimum touch target of `44px` height.
- Selected menu items should use the shared selected state treatment: subtle primary background, primary text, and a check indicator where applicable.
- Menu content should use the shared popover surface: `bg-popover`, `border-border`, `rounded-[var(--radius-input)]`, and constrained max height with vertical scrolling.

### Pagination
- Use the shared `src/app/components/Pagination.tsx` component for table/list pagination across the site.
- Pagination must expose a `nav` landmark with a translated `aria-label`, `aria-current="page"` on the active page, descriptive previous/next labels, and disabled states where actions are unavailable.
- Page-size controls must use the shared `Select` component and a unique label id from `React.useId()` when multiple pagination components can appear on the same page.
- Pagination must not create page-level horizontal scrolling on mobile.
- Page buttons must remain at least `44px` by `44px`.
- Middle page buttons may be hidden on very narrow screens, but first page, current page, last page, previous, next, and ellipsis context should remain understandable.
- Empty states should show useful text such as `No entries found` instead of rendering inactive pagination controls.

### Form Labels and Field Accessibility
- Every visible label must be programmatically associated with its field using `htmlFor` and a matching `id`, or by using a component that provides equivalent ARIA labeling.
- For reusable or repeated component instances, generate ids with `React.useId()` to avoid duplicate ids.
- `DatePicker` supports `id`, `aria-label`, `aria-describedby`, and `aria-invalid`; use these props instead of visual-only labels.
- Search inputs should use `type="search"`, a clear accessible name, and `role="search"` on the form wrapper where appropriate.

### Buttons and Icon-Only Controls
- Use the shared `Button` component in `src/app/components/ui/button.tsx` for interactive buttons.
- Icon-only buttons must have an `aria-label`.
- Decorative icons inside controls must include `aria-hidden="true"`.
- Prefer logical spacing classes (`ms`, `me`, `ps`, `pe`, `text-start`) so layouts mirror cleanly in RTL.

---

## Verification Checklist

Before pushing UI changes:
- Run `npm run typecheck`.
- Run `npm run build`.
- Check at least one desktop viewport and one mobile viewport for no unexpected horizontal page scroll, visible focus states, and 44px minimum touch targets.
- Open representative dropdowns and pagination menus to verify selected states, keyboard focus, and scroll behavior.
- Do not commit generated `dist/` preview/build output unless the release process explicitly requires it.
