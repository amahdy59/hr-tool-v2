# HR Tool V2

HR Tool V2 is a React + Vite implementation of a modern HR management interface based on the “HR System Development” Figma design system. It focuses on reusable components and clean, data-centric layouts for HR workflows.

Original Figma project: [Figma Link](https://www.figma.com/design/Z8lVZssRryEplcmvDfDnnQ/HR-System-Development)

---

## 🏗️ Codebase Restructuring & Performance Optimizations

To keep the repository clean, maintainable, and highly performant, the following architectural restructuring and optimizations have been implemented:

### 1. File Structure Cleanup & Organization
- **Workspace Root Declutter**:
  - Moved all utility and developer helper scripts (`*.cjs`, `*.js`, `*.json`) from the workspace root into a dedicated `/scripts` directory.
  - Deleted temporary and obsolete data files (`clean_extracted.json`, `extracted_texts.json`).
  - Completely deleted the unused static `knowledge-base-management-site` directory.
- **Centralized Documentation**:
  - Created a root-level `/docs` directory to house specification sheets, requirements, guidelines (`Guidelines.md`), and historical design resumes, removing them from source directory clutter (`src/imports` and `guidelines/` have been removed).

```
HR Tool/
├── dist/                     # Production compiled build
├── docs/                     # Specifications and architectural guides
├── public/                   # Static public assets
├── scripts/                  # Utility and translation developer scripts
├── src/
│   ├── app/
│   │   ├── components/       # High-performance, code-split components
│   │   │   ├── ui/           # Shared shadcn theme wrappers & primitives
│   │   │   └── figma/        # Figma asset wrappers & fallbacks
│   │   └── App.tsx           # Application shell & lazy-loaded tab router
│   ├── lib/
│   │   ├── services/         # Decoupled database connection/service layers
│   │   └── useArabic...      # Arabic DOM translator and RTL engine
│   ├── styles/               # Semantic styling sheets (theme.css, index.css)
│   └── main.tsx              # React entry mount point
└── supabase/                 # Relational migrations and local seeding data
```

### 2. High-Performance Bundle Optimizations (Vite & Rollup)
- **Lazy Loading & Dynamic Imports**: 
  - Converted static tab imports in `App.tsx` into dynamic `React.lazy()` chunks. Tabs like *Attendance*, *Employee Management*, *Leaves*, *Missions*, *Roles*, and *Profile* are compiled into individual, asynchronous code chunks.
  - This reduced the initial JS bundle size from **689.19 kB** to **274.43 kB** (a **~60% reduction** in initial bundle download size).
- **Rollup Manual Chunk Splitting**:
  - Configured Rollup to extract major dependencies (React core, Radix UI primitives, Recharts/D3 charts, and PDF/Excel export helpers) into dedicated vendor bundles to maximize browser caching efficiency.

### 3. Clean Code & Strict Type Safety
- Addressed all outstanding TypeScript compilation errors:
  - Resolving name parameter parsing (`employee.name`) for bilingual string-object interfaces.
  - Standardized type checks for image parameters in leave and mission request schemas.
  - Integrated missing component parameters for proper state pass-throughs.
- Clean compilation checked via `npm run typecheck` and successful bundling with `npm run build`.

### 4. Accessibility & UI/UX Standards (WCAG 2.2 AAA)
- **Skip-To-Content Navigation**: Dynamic skip-link at the absolute top of the page layout enables quick keyboard tab-navigation to the main dashboard.
- **Bilingual (English/Arabic) RTL Mirroring**: Full RTL layout mirroring (including icons, pagination, progress bars, and navigation flows) triggered dynamically via `useArabicDomTranslation` logic.
- **Tone and State Consistency**: Curated harmonious themes (neutral elevation cues, accessible contrast tokens, explicit focus states, and mobile touch target scaling).

---

## 🗄️ Database Architecture (Supabase / PostgreSQL)

To transition this application from static mockups to a live, production-grade application, we propose the following relational database schema designed for performance, constraints, and scalability.

```sql
-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. DEPARTMENTS
create table if not exists public.departments (
    id uuid primary key default gen_random_uuid(),
    name text unique not null,
    dept_code text unique not null,
    created_at timestamptz default now()
);

-- 2. JOB TITLES
create table if not exists public.job_titles (
    id uuid primary key default gen_random_uuid(),
    title text unique not null,
    created_at timestamptz default now()
);

-- 3. EMPLOYEES (Linked with Supabase Auth users)
create table if not exists public.employees (
    id uuid primary key references auth.users(id) on delete cascade,
    employee_number text unique not null,
    first_name text not null,
    last_name text not null,
    email text unique not null,
    phone text,
    gender text check (gender in ('Male', 'Female')),
    department_id uuid references public.departments(id) on delete set null,
    job_title_id uuid references public.job_titles(id) on delete set null,
    contract_type text check (contract_type in ('Full-Time', 'Part-Time', 'Contractor', 'Intern', 'Freelance')),
    hire_date date not null default current_date,
    activity_type text check (activity_type in ('Direct', 'InDirect')),
    is_manager boolean not null default false,
    img_url text,
    role text check (role in ('Admin', 'Manager', 'Employee')) default 'Employee',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 4. LEAVES / VACATIONS
create table if not exists public.leaves (
    id uuid primary key default gen_random_uuid(),
    employee_id uuid references public.employees(id) on delete cascade not null,
    leave_type text not null,
    start_date date not null,
    end_date date not null,
    days_count integer not null,
    reason text,
    status text check (status in ('Pending', 'Approved', 'Rejected')) default 'Pending',
    approved_by uuid references public.employees(id) on delete set null,
    created_at timestamptz default now(),
    constraint check_dates check (start_date <= end_date)
);

-- 5. MISSIONS
create table if not exists public.missions (
    id uuid primary key default gen_random_uuid(),
    employee_id uuid references public.employees(id) on delete cascade not null,
    title text not null,
    start_date date not null,
    end_date date not null,
    duration_days integer not null,
    destination text not null,
    reason text,
    status text check (status in ('Pending', 'Approved', 'Rejected')) default 'Pending',
    approved_by uuid references public.employees(id) on delete set null,
    created_at timestamptz default now(),
    constraint check_dates check (start_date <= end_date)
);

-- 6. ATTENDANCE
create table if not exists public.attendance (
    id uuid primary key default gen_random_uuid(),
    employee_id uuid references public.employees(id) on delete cascade not null,
    date date not null default current_date,
    clock_in time,
    clock_out time,
    status text check (status in ('Present', 'Absent', 'Late', 'On Leave')) not null,
    notes text,
    created_at timestamptz default now(),
    unique (employee_id, date)
);

-- 7. PAYROLL
create table if not exists public.payroll (
    id uuid primary key default gen_random_uuid(),
    employee_id uuid references public.employees(id) on delete cascade not null,
    month date not null, -- First day of the payroll month (e.g. '2026-06-01')
    basic_salary numeric(12, 2) not null check (basic_salary >= 0),
    allowances numeric(12, 2) not null default 0.00 check (allowances >= 0),
    deductions numeric(12, 2) not null default 0.00 check (deductions >= 0),
    bonuses numeric(12, 2) not null default 0.00 check (bonuses >= 0),
    net_salary numeric(12, 2) not null generated always as (basic_salary + allowances + bonuses - deductions) stored,
    payment_status text check (payment_status in ('Paid', 'Pending')) default 'Pending',
    created_at timestamptz default now(),
    unique (employee_id, month)
);

-- 8. ACTIVITY LOG
create table if not exists public.activity_log (
    id uuid primary key default gen_random_uuid(),
    admin_id uuid references public.employees(id) on delete set null,
    action text not null,
    date timestamptz not null default now(),
    affected_employee_number text,
    details jsonb
);

-- Enable RLS on all tables
alter table public.departments enable row level security;
alter table public.job_titles enable row level security;
alter table public.employees enable row level security;
alter table public.leaves enable row level security;
alter table public.missions enable row level security;
alter table public.attendance enable row level security;
alter table public.payroll enable row level security;
alter table public.activity_log enable row level security;

-- 9. AUTH SIGN-UP PROFILE TRIGGER
-- Automatically copies new users from Supabase Auth to public.employees table
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.employees (
    id, 
    employee_number, 
    first_name, 
    last_name, 
    email, 
    role, 
    hire_date,
    contract_type,
    activity_type
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'employee_number', substring(new.id::text from 1 for 8)),
    coalesce(new.raw_user_meta_data->>'first_name', 'New'),
    coalesce(new.raw_user_meta_data->>'last_name', 'Employee'),
    new.email,
    'Employee',
    current_date,
    'Full-Time',
    'Direct'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

---

## 👥 Employee Attributes & Sample Data

Each employee in the system contains key attributes crucial for operations, UI filters, payroll calculations, and accessibility configurations.

### Employee Table Attributes Definition:
- **ID (UUID)**: Ties directly to Supabase Authentication (`auth.users`).
- **Employee Number (Text)**: A unique identifier prefix for administrative actions (e.g., `12345`).
- **First Name & Last Name (Text)**: Localized dynamically in Arabic and English.
- **Email & Phone (Text)**: Direct contact detail constraints.
- **Gender (Text)**: Male / Female.
- **Department ID (UUID)**: Linked department for operational division hierarchy.
- **Job Title ID (UUID)**: Standardized corporate job title.
- **Contract Type (Text)**: Full-Time, Part-Time, Contractor, Intern, or Freelance.
- **Hire Date (Date)**: Official hiring date to compute vacation balances.
- **Activity Type (Text)**: Direct / InDirect classification for cost-allocation and labor categorization.
- **Is Manager (Boolean)**: Grants approval privileges for leave and mission requests.
- **Role (Text)**: `Admin`, `Manager`, or `Employee` level of authorization.
- **Img URL (Text)**: Reference to public avatar images stored in Supabase Storage.

### Standardized Mock Database Seed:

| Employee ID | Name | Employee No | Department | Job Title | Contract Type | Hire Date | Role | Activity Type |
|---|---|---|---|---|---|---|---|---|
| `e1` | Aleksander Garcia | 12345 | Marketing | Senior Solutions Architect | Freelance | 2023-04-15 | Employee | Direct |
| `e2` | Tanvi Lumari | 54321 | Sales | Global Operations Manager | Permanent | 2022-01-10 | Manager | Direct |
| `e3` | Jack Gray | 98765 | Software | Senior Project Manager | Permanent | 2021-08-22 | Employee | Direct |
| `e4` | Saad Jawahir | 24680 | SCADA | Senior Cybersecurity Specialist | Contract | 2023-11-01 | Employee | InDirect |
| `e5` | Imani Adimbola | 24252 | Oil & Gas | Director of Supply Chain Optimization | Permanent | 2020-03-14 | Manager | Direct |
| `e6` | Ahmed Mahdy | 30111 | IT | Senior UX Designer & Data Analyst | Permanent | 2023-01-15 | Admin | Direct |
| `e7` | Sarah Connor | 40222 | Engineering | Lead DevOps Engineer | Permanent | 2024-05-10 | Employee | Direct |
| `e8` | Tarek Abdelaziz | 50333 | HR | HR Operations Manager | Permanent | 2022-09-01 | Manager | Direct |
| `e9` | Fatima El-Sayed | 60444 | Finance | Senior Financial Controller | Permanent | 2023-02-28 | Employee | Direct |
| `e10` | John Doe | 70555 | Software | Frontend Intern | Intern | 2026-06-01 | Employee | InDirect |

---

## 🔒 Cybersecurity & Maintainability Guidelines

To safeguard user data and ensure the codebase remains maintainable, we establish the following 10 recommendations:

### Cybersecurity
1. **Enforce Row Level Security (RLS)**: Enable RLS on all Supabase tables. Only grant authenticated users read/write permissions matching their specific identity (`auth.uid()`) or role.
2. **Protect the Service Role Secret Key**: Never expose the Supabase `service_role` key on the client or in code checkins. Use only the `anon` key, which respects RLS.
3. **Database Input Constraints & Type Safety**: Leverage strong schema declarations, strict PostgreSQL datatypes, and CHECK constraints to prevent SQL injection and dirty data.
4. **Implement Short-Lived JWT Tokens**: Keep user tokens short-lived (e.g. 1 hour lifespans) and implement secure token refresh mechanics to prevent sessions from hijack.
5. **Secure Storage Buckets Policies**: Define explicit security policies for the Supabase Storage buckets containing employee avatar images or administrative file attachments.

### Maintainability
6. **Version Control Database Migrations**: Use the Supabase CLI to create, version-control, and deploy database migrations (`supabase migration new`) instead of manual cloud-console edits.
7. **Dynamic Frontend Types Generation**: Run the Supabase compiler generator tool `supabase gen types typescript` to instantly synchronize frontend interfaces with database schema layouts.
8. **Automated Monitoring & Error Capture**: Set up Sentry or Datadog error monitoring on the web client, and actively monitor PostgreSQL server logs for database-side query failures.
9. **Layered Database Service Layer**: Wrap Supabase API calls inside decoupled service files (such as `src/lib/services/employee.ts`) rather than writing raw database queries inside React components.
10. **Establish Seeding Routines**: Keep a robust `seed.sql` script updated inside the codebase to allow developers to rapidly rebuild the DB environment locally.
