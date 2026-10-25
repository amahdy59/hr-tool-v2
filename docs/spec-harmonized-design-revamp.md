# Architectural Design Specification: Harmonized Enterprise HR System Revamp

## 1. Overview & Vision
This specification defines the complete visual and interaction overhaul of the HR System into a world-class, premium enterprise application. It harmonizes the core strengths of three leading design philosophies:
- **Apple Human Interface Guidelines (HIG)**: Vibrancy, frosted glassmorphism (`backdrop-blur-xl`), continuous smooth curvature (`rounded-2xl` / `rounded-3xl`), and tactile spring micro-interactions (`active:scale-[0.98]`).
- **Google Material Design 3 (Material You)**: Expressive tonal color architecture, organic pill chips, dynamic state layers, and contextual elevation without heavy drop shadows.
- **Microsoft Fluent Design System 2**: Acrylic surfaces, clean high-density data tables, accessible WCAG 2.2 AAA contrast, and structured corporate precision.

---

## 2. Color Architecture & Brand Identity: Executive Indigo & Electric Azure

### Light Mode Palette
- **Canvas Base (`--background`)**: `#F8FAFC` (Slate-50 with soft ambient lighting)
- **Card Surface (`--card`)**: `#FFFFFF` with specular inner border (`rgba(226, 232, 240, 0.8)`) and dual-tier shadow.
- **Primary Brand (`--primary`)**: `#2563EB` (Electric Azure) graduating to `#1D4ED8` (Royal Indigo).
- **Secondary (`--secondary`)**: `#475569` (Refined Slate).
- **Accent Emerald (`--color-success` / Present)**: `#10B981` (Emerald) with soft container `#ECFDF5`.
- **Accent Amber (`--color-warning` / Pending)**: `#F59E0B` (Warm Amber) with soft container `#FFFBEB`.
- **Accent Ruby (`--destructive` / Absent)**: `#EF4444` (Ruby) with soft container `#FEF2F2`.
- **Accent Violet (`--color-mission` / Special)**: `#8B5CF6` (Vibrant Violet) with soft container `#F5F3FF`.

### Dark Mode Palette
- **Canvas Base (`--background`)**: `#0B0F19` (Luminous deep sapphire-charcoal).
- **Card Surface (`--card`)**: `#111827` (Rich slate-900) with subtle border `rgba(255, 255, 255, 0.08)`.
- **Primary Brand (`--primary`)**: `#60A5FA` / `#93C5FD` (Luminous Azure with 7:1+ contrast on dark).
- **Muted Surfaces (`--muted`)**: `#1E293B` (Slate-800).
- **Border & Dividers (`--border`)**: `#334155` (Slate-700).

### High Contrast Mode (WCAG 2.2 AAA)
- Guaranteed 7:1+ contrast for normal text and 10:1+ for headers across both light (`.hc`) and dark high-contrast (`.dark.hc`) modes.
- Preserved focus rings: `ring-2 ring-primary ring-offset-2 ring-offset-background`.

---

## 3. Surface Elevation & Materials

### Acrylic Glass Header
- `backdrop-blur-xl bg-white/80 dark:bg-slate-900/80` with bottom border `border-slate-200/70 dark:border-slate-800/70`.
- Integrated search bar with subtle keyboard shortcut indicator (`⌘K` / `Ctrl+K`), ambient hover glow, and unread notification indicator.

### Acrylic Navigation Sidebar
- Translucent dark/light acrylic shell with soft border divider.
- Nav items with smooth pill contours (`rounded-xl`), energetic active tint (`bg-blue-500/10 dark:bg-blue-400/15 text-blue-600 dark:text-blue-400 font-semibold`), and an active accent pillar (`border-s-4 border-blue-600`).
- Collapsed rail view with smooth tooltip previews and tactile spring click feedback (`active:scale-[0.98]`).

### Card Elevation & Continuous Curves
- Primary cards: `rounded-2xl bg-card border border-border/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`.
- Modals, Drawers & Sheets: `rounded-3xl` with backdrop blur overlays and spring physics transitions.

---

## 4. Screen-by-Screen Blueprint

### 1. Dashboard
- **Hero Banner**: Subtle mesh gradient greeting card with user avatar, contextual date & greeting ("Good morning, Ahmed"), and prominent action buttons ("Request Leave", "Request Mission").
- **KPI Cards**: 4 responsive metric tiles:
  - Total Employees, Today's Attendance Rate, Pending Leave Requests, Active Missions.
  - Tonal icon containers with dual-tone Lucide icons.
  - Material 3 percentage trend pill (`+4.2% from last month` with emerald/amber tint).
- **Interactive Timesheet / Weekly Attendance**: Modern calendar widget with pill-based event chips, clear weekend indicators, and interactive day cards.
- **Recent Requests Table**: Upgraded table container with soft row hover highlights, status pills, and action menus.

### 2. Attendance Management
- Stat counters (Present, Late, Remote, On Leave) with color-coded tonal indicators.
- Quick punch-in / check-in card with live clock and animated status indicator.
- Biometric & attendance logs data table with date range picker, search filter, export buttons, and pagination.

### 3. Employee Directory
- View switcher: Modern Grid view & Fluent List view.
- Employee cards: Curved header banner, centered avatar with status indicator dot, position badge, department chip, and quick contact action buttons (email, phone, profile).
- Modal / drawer profile overview with smooth tab navigation.

### 4. Leaves & Missions Management
- Leave balance overview cards with visual linear/circular progress bars (Annual, Sick, Casual, Maternity/Paternity).
- Leave & Mission request modals with intuitive date pickers, reason inputs, and instant duration calculator.
- Request history table with filter drawer and instant status updates.

### 5. Payroll Management
- Recharts salary distribution with modernized Executive Indigo color scheme.
- Payroll summary tiles (Gross Payroll, Total Deductions, Net Payout, Employees Processed).
- Detailed payslip viewer and export tools.

### 6. Profile & Settings
- Cover banner with customizable avatar uploader.
- Tabbed interface (Personal Information, Employment Details, Financial, Documents).
- High-contrast toggle, language switcher (English / Arabic RTL), and notification preferences.

---

## 5. Verification & Quality Gates
- **Automated Tests**: Vitest unit test suite (81+ tests) passing with 0 regressions.
- **TypeScript**: `tsc --noEmit` clean with 0 type errors.
- **Accessibility**: Axe-core WCAG 2.2 AAA audit (`npm run check:a11y`) clean.
- **Responsiveness**: All 7 viewports verified (`npm run check:responsive`).
- **Visual & Quality**: Prepush script (`npm run prepush`) fully green.
