# HR Tool - Design System Guidelines

This document defines the layout, typography, accessibility, bilingual, and shared component rules used across the HR Tool. Follow these standards to keep the product consistent, responsive, and maintainable.

---

## Layout And Spacing System

The application uses a strict 4px/8px spacing scale.

### Label-To-Input Spacing

- **Token:** `--spacing-label-input`
- **Value:** `4px` (`space-y-1`, `gap-1`, or `mb-1`)
- **Rule:** The vertical space between a visible label and its field, search input, or dropdown trigger must be exactly `4px`.
- **Search fields:** Search groups such as **Search Employees**, **Search Departments**, **Search Job Titles**, and **Search Activity Log** follow the same `4px` label spacing.

### Field-To-Field Spacing

- **Spacing:** `16px` (`space-y-4`, `gap-4`, or `mb-4`)
- **Rule:** Use this spacing between adjacent form groups or stacked controls.

### Row Control Spacing

- **Spacing:** `8px` to `12px` (`gap-2` to `gap-3`)
- **Rule:** Use this spacing between buttons, pills, tags, and inline controls.

### Section Spacing

- **Spacing:** `24px` to `32px` (`space-y-6`, `space-y-8`, `gap-6`, or `gap-8`)
- **Rule:** Use this spacing between large panels, tables, tab groups, and page sections.

### Tabs-To-Panel Spacing

- **Spacing:** `12px` (`gap-3`)
- **Rule:** The vertical space between a tab list and the first control inside the active tab panel must be `12px`.
- **Manage Employees:** Tab panels must not add extra top margin. This keeps Directory, Departments, Job Titles, and Activity Log aligned.

---

## Color Tokens And Contrast

- **Light background:** `#F8FAFC`
- **Dark background:** `#0B1220`
- **Light text:** `#0F172A`
- **Dark text:** `#F1F5F9`
- **Focus ring:** `#2563EB`
- **Normal text contrast:** Target `7:1` or better.
- **Large text contrast:** Target `4.5:1` or better.

Avoid one-note palettes. Product surfaces should feel quiet, operational, and easy to scan rather than decorative.

---

## Typography

- **English and numeric layouts:** `Inter, sans-serif`
- **Arabic layouts:** `"Noto Sans Arabic", "Tahoma", sans-serif`
- **Body text:** `16px` (`--text-base`)
- **Labels and small text:** `14px` (`--text-sm`)
- **Helper text:** `12px` (`--text-xs`)
- **Section titles:** `18px` (`--text-lg`, semibold)
- **Page headers:** `24px` (`--text-xl`, semibold)

Do not scale font size with viewport width. Keep letter spacing at `0` for normal interface text.

---

## Arabic And English Localization

Arabic support must be treated as a product requirement, not a visual afterthought.

- **Directionality:** `DirectionProvider` sets `document.documentElement.dir` dynamically.
- **Alignment:** Use logical utilities such as `text-start`, `ms-*`, `me-*`, `ps-*`, and `pe-*`.
- **Fully Arabic content:** Do not change strings that are already fully translated into Arabic.
- **Mixed Arabic/English content:** Fix strings only when both Arabic and Latin characters appear in the same visible value, such as a translated Arabic title with an untranslated English department acronym.
- **Job titles:** Add exact dictionary entries for job titles before relying on partial word replacement. Exact entries prevent mixed output such as `HR المدير`.
- **Attributes:** Translate `placeholder`, `title`, and `aria-label` with the same rules used for visible text.
- **Eastern Arabic numerals:** In Arabic mode, ordinary text-node digits are converted to Eastern Arabic numerals by `useArabicDomTranslation`.
- **Interactive exceptions:** Components with React-managed numbers or complex interactions can opt out with `data-no-auto-translate`, then render Arabic formatting natively.
- **LTR fields:** Email, URL, telephone, and password-like fields that contain LTR data must keep `dir="ltr"` and left text alignment.

---

## Translation Dictionary Management

To prevent duplication and maintain consistent wording across components, we follow a single-source dictionary pattern:

- **Single Source of Truth:** [translations.json](file:///c:/Users/AhmedMahdy/OneDrive%20-%20Advansys%20IS/Documents/Antigravity/HR%20Tool/translations.json) at the project root is the master dictionary. All new UI strings, translations, and notes must be added here first.
- **Code Reference:** Runtime translations are read dynamically from components or DOM translation hooks. 
- **Automated Compilation:** Run `node scripts/update_dictionary.cjs` to compile updates from `translations.json` into the code-level dictionary ([useArabicDomTranslation.ts](file:///c:/Users/AhmedMahdy/OneDrive%20-%20Advansys%20IS/Documents/Antigravity/HR%20Tool/src/lib/useArabicDomTranslation.ts)) and synchronize key translations inside `i18n.ts`. Do not manually modify translations inside `useArabicDomTranslation.ts` directly.
- **Adding New Keys:**
  1. Add the text entry object to the array in `translations.json`.
  2. Run `node scripts/update_dictionary.cjs` to compile it.
  3. (Optional) Reference the compiled key in `i18n.ts` if dynamic interpolation is needed.

---

## Component Standards

### Dropdowns And Select Menus

- Use `src/app/components/ui/select.tsx` for field selects.
- Use `src/app/components/ui/dropdown-menu.tsx` for action menus.
- Avoid native `<select>` controls unless a platform reason is documented.
- Triggers and menu items must keep a minimum `44px` touch target.
- Selected menu items should use subtle primary background, primary text, and a check indicator where applicable.
- Menu content should use `bg-popover`, `border-border`, `rounded-[var(--radius-input)]`, and a constrained max height with scrolling.

### Pagination

- Use the shared [Pagination.tsx](file:///c:/Users/AhmedMahdy/OneDrive%20-%20Advansys%20IS/Documents/Antigravity/HR%20Tool/src/app/components/Pagination.tsx) component for tables and list views.
- Page buttons should be grouped into one contiguous control without horizontal gaps.
- Adjacent borders should overlap with `-ms-[1px]`, plus `hover:z-10` and `focus:z-10`.
- Only the outer corners of the pagination bar should be rounded.
- Active page buttons use GitHub-style blue: `#0969da` in light mode and `#1f6feb` in dark mode.
- Previous and Next buttons must include text labels plus directional chevrons.
- In Arabic mode, Previous must point toward the right and Next must point toward the left. Use language-aware icon selection in the component for pagination icons instead of relying only on global RTL icon flipping.
- The pagination `<nav>` must expose a translated `aria-label`.
- Active page buttons require `aria-current="page"`.
- Buttons must keep a minimum `44px` touch target (`h-11`).
- Page-size selects must be programmatically labeled, preferably with `React.useId()`.

### Form Labels And Field Accessibility

- Every visible label must be associated with its field using `htmlFor` and `id`, or an equivalent ARIA pattern.
- Repeated component instances should generate ids with `React.useId()`.
- `DatePicker` supports `id`, `aria-label`, `aria-describedby`, and `aria-invalid`; use these props instead of visual-only labels.
- Search inputs should use `type="search"`, a clear accessible name, and `role="search"` on the wrapper where appropriate.

### Buttons And Icon-Only Controls

- Use `src/app/components/ui/button.tsx` for buttons.
- Icon-only buttons must have an `aria-label`.
- Decorative icons inside controls must use `aria-hidden="true"`.
- Prefer lucide icons when a matching symbol exists.
- Use logical spacing classes so layouts mirror cleanly in RTL.

---

## Verification Checklist

Before pushing UI or localization changes:

- Run `npm run typecheck`.
- Run `npm run build`.
- Check at least one desktop viewport and one mobile viewport.
- Confirm there is no unexpected horizontal page scroll.
- Confirm focus states are visible.
- Confirm interactive controls keep 44px minimum targets.
- Open representative dropdowns and pagination controls.
- Switch between English and Arabic and check for mixed Arabic/English strings.
- Confirm fully Arabic content remains unchanged.
- Confirm pagination arrows point in the correct direction in Arabic and English.
- Do not commit generated `dist/` preview/build output unless the release process explicitly requires it.
