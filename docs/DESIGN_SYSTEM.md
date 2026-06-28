# HR Tool - Design System Guidelines

This document outlines the design system specifications, spacing tokens, layout guidelines, and typography scales used in the HR Tool. Following these guidelines ensures design consistency, responsiveness, accessibility, and high performance across all views.

---

## 📐 Layout & Spacing System

We adhere to a strict **4px/8px grid system** for layouts. All margins, paddings, and flex/grid gaps must align with this spacing scale:

### 1. Label-to-Input Spacing (Standardized)
- **Token:** `--spacing-label-input`
- **Value:** `4px` (Tailwind `space-y-1` or `gap-1` or `mb-1`)
- **Rule:** The vertical spacing between a form `<label>` (or `<legend>`) and its corresponding input box, search field, or dropdown trigger must be exactly **4px**. This maintains a tight visual grouping between labels and inputs.

### 2. Field-to-Field Spacing
- **Spacing:** `16px` (Tailwind `space-y-4` or `gap-4` or `mb-4`)
- **Rule:** Spacing between adjacent form groups or input fields in a form column.

### 3. Element Spacing inside Rows
- **Spacing:** `8px` to `12px` (Tailwind `gap-2` to `gap-3`)
- **Rule:** Spacing between buttons, pills, tags, or inline controls (e.g., search box next to a filter button).

### 4. Section-to-Section Spacing
- **Spacing:** `24px` to `32px` (Tailwind `space-y-6` to `space-y-8` or `gap-6` to `gap-8`)
- **Rule:** Spacing between large card layouts, tables, tab layouts, or page panels.

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
