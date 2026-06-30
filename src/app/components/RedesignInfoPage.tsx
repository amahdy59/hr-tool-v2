import React, { useId, useState } from 'react';
import {
  Accessibility,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Database,
  Eye,
  Globe2,
  Layers,
  Rocket,
  Shield,
  Smartphone,
  Sparkles,
  Target,
  Terminal,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AccessibilityPanel, type AccessibilitySettings } from './AccessibilityPanel';

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

const comparisons = [
  {
    id: 'employees',
    label: 'Employee Management',
    before: {
      src: asset('old-system/add-employee.png'),
      caption: 'Dense forms with limited visual hierarchy',
    },
    after: {
      src: asset('new-system/employee-profile.png'),
      caption: 'Scannable profile data with clear status patterns',
    },
  },
  {
    id: 'vacations',
    label: 'Leave Requests',
    before: {
      src: asset('old-system/search-vacations.png'),
      caption: 'Leave details scattered across separate screens',
    },
    after: {
      src: asset('images/transform-leave.png'),
      caption: 'Focused request flow with validation and status context',
    },
  },
  {
    id: 'missions',
    label: 'Missions & Approvals',
    before: {
      src: asset('old-system/mission-form.png'),
      caption: 'Disconnected form and approval experience',
    },
    after: {
      src: asset('images/transform-mission.png'),
      caption: 'Inline review flow with clear approve and decline actions',
    },
  },
];

const outcomes = [
  { icon: Zap, label: 'Fewer steps', desc: 'Common HR tasks stay on one focused path.' },
  { icon: Eye, label: 'Clear status', desc: 'Requests, employees, and approvals use readable states.' },
  { icon: Accessibility, label: 'AAA-ready access', desc: 'Contrast, focus, target size, and motion are product requirements.' },
  { icon: Smartphone, label: 'Responsive workflows', desc: 'Tables, filters, cards, and forms stay usable on smaller screens.' },
];

const improvements = [
  { label: 'Bilingual translation quality', detail: 'Arabic mode preserves fully translated Arabic content and only repairs mixed Arabic/English fragments when an English token remains.' },
  { label: 'RTL interaction design', detail: 'Logical spacing, mirrored layouts, and language-aware pagination arrows keep Arabic navigation predictable.' },
  { label: 'Accessible controls', detail: 'Forms, tabs, filters, and pagination expose labels, focus states, and 44px minimum targets.' },
  { label: 'Profile and request workflows', detail: 'Contextual edit modals, privacy-safe demo data, and clear request states reduce ambiguity for employees and managers.' },
  { label: 'Supabase backend planning', detail: 'Relational PostgreSQL schemas cover departments, jobs, employees, leaves, attendance, payroll, and audit-ready workflows.' },
  { label: 'Security posture', detail: 'Row Level Security, protected secrets, short-lived JWT validation, and storage policies are documented before production rollout.' },
  { label: 'Maintainability blueprint', detail: 'Version-controlled migrations, generated TypeScript database types, and layered data services keep the system easier to change.' },
];

const proofPoints = [
  { icon: Globe2, value: '2 languages', label: 'English and Arabic switching with RTL mirroring' },
  { icon: BadgeCheck, value: 'WCAG-led', label: 'Contrast, focus, and touch target rules baked into shared components' },
  { icon: Database, value: 'HRIS schema', label: 'Employees, titles, departments, requests, attendance, and payroll' },
];

const ScreenshotCard: React.FC<{
  src: string;
  caption: string;
  label: 'Before' | 'After';
}> = ({ src, caption, label }) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const isAfter = label === 'After';

  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          'inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
          isAfter ? 'bg-[#E7F6EF] text-[#064E3B]' : 'bg-muted text-muted-foreground'
        )}
      >
        {isAfter ? (
          <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
        ) : (
          <Clock className="h-3 w-3" aria-hidden="true" />
        )}
        {label}
      </div>
      <div
        className={cn(
          'relative aspect-[16/10] w-full overflow-hidden rounded-[var(--radius-card)] border bg-card',
          isAfter ? 'border-[#047857]/30 shadow-md' : 'border-border'
        )}
      >
        {!loaded && !failed && (
          <div className="absolute inset-0 z-10 animate-pulse bg-muted" aria-hidden="true" />
        )}
        {failed ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted/50 p-6 text-center">
            <Layers className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
            <p className="text-xs text-muted-foreground">Screenshot unavailable</p>
          </div>
        ) : (
          <img
            src={src}
            alt={`${label}: ${caption}`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            className={cn(
              'absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-300',
              loaded ? 'opacity-100' : 'opacity-0'
            )}
          />
        )}
      </div>
      <p className="text-xs leading-5 text-muted-foreground">{caption}</p>
    </div>
  );
};

interface RedesignInfoPageProps {
  onBack: () => void;
  accessibility: AccessibilitySettings;
}

export const RedesignInfoPage: React.FC<RedesignInfoPageProps> = ({ onBack, accessibility }) => {
  const [activeTab, setActiveTab] = useState(0);
  const pageTitleId = useId();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--accent)_18%,transparent),transparent_34%),radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--primary)_20%,transparent),transparent_38%),linear-gradient(180deg,color-mix(in_srgb,var(--background)_92%,white_8%),var(--background))] dark:bg-[radial-gradient(circle_at_top_right,rgba(167,243,208,0.14),transparent_32%),radial-gradient(circle_at_top_left,rgba(167,212,255,0.18),transparent_38%),linear-gradient(180deg,#07101d_0%,#0b1220_48%,#111827_100%)]"
      />

      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-[var(--radius-button)] border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-[var(--elevation-sm)] transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Back to login"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to login</span>
          </button>
          <div className="flex items-center gap-2 sm:gap-3">
            <p className="hidden items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground sm:flex">
              <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              HR Tool Case Study
            </p>
            <AccessibilityPanel settings={accessibility} />
          </div>
        </div>
      </header>

      <main
        aria-labelledby={pageTitleId}
        className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6 lg:space-y-14 lg:py-12"
      >
        <section
          aria-labelledby="hero-heading"
          className="space-y-6 rounded-[calc(var(--radius-card)+12px)] border border-border/70 bg-card/80 p-6 shadow-[var(--elevation-lg)] backdrop-blur sm:p-8 lg:p-10"
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent shadow-sm">
            <Target className="h-3.5 w-3.5" aria-hidden="true" />
            Employee self-service redesign
          </p>
          <div className="max-w-4xl space-y-5">
            <h1
              id="hero-heading"
              className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl lg:text-5xl"
            >
              HR workflows, translation, and controls <span className="text-accent">redesigned for clarity.</span>
            </h1>
            <h2 id={pageTitleId} className="sr-only">
              HR Tool redesign case study
            </h2>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              A privacy-safe case study for modernizing an internal HR tool. The redesign turns scattered legacy screens into a responsive, bilingual experience for employees, managers, and HR teams.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Fewer steps', icon: Zap },
              { label: 'Clear status', icon: Eye },
              { label: 'Arabic-ready', icon: Globe2 },
              { label: 'Accessible controls', icon: Accessibility },
            ].map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-button)] border border-border/80 bg-background/80 px-3 py-2 text-sm font-medium shadow-[var(--elevation-sm)] backdrop-blur"
              >
                <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
                {label}
              </div>
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {proofPoints.map(({ icon: Icon, value, label }) => (
              <div key={value} className="rounded-[var(--radius-card)] border border-border/80 bg-background/80 p-4 shadow-[var(--elevation-sm)] backdrop-blur">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-accent/10">
                  <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                </div>
                <p className="text-sm font-semibold text-foreground">{value}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="comparison-heading">
          <div className="mb-6 space-y-2">
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-accent">
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
              Before &amp; After
            </p>
            <h2 id="comparison-heading" className="text-2xl font-semibold">
              Compare the legacy flow with the redesigned experience
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Each comparison shows how the redesign improves scanability, decision-making, and flow continuity without exposing real employee data.
            </p>
          </div>

          <div role="tablist" aria-label="Comparison screens" className="mb-6 flex gap-2 overflow-x-auto pb-1">
            {comparisons.map((c, i) => (
              <button
                key={c.id}
                role="tab"
                aria-selected={activeTab === i}
                aria-controls={`tabpanel-${c.id}`}
                id={`tab-${c.id}`}
                type="button"
                onClick={() => setActiveTab(i)}
                className={cn(
                  'shrink-0 rounded-[var(--radius-button)] border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  activeTab === i
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {c.label}
              </button>
            ))}
          </div>

          {comparisons.map((c, i) => (
            <div
              key={c.id}
              id={`tabpanel-${c.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${c.id}`}
              hidden={activeTab !== i}
              className="grid gap-4 sm:grid-cols-2"
            >
              <ScreenshotCard src={c.before.src} caption={c.before.caption} label="Before" />
              <ScreenshotCard src={c.after.src} caption={c.after.caption} label="After" />
            </div>
          ))}

          <div className="mt-4 flex items-center justify-between sm:hidden">
            <button
              type="button"
              onClick={() => setActiveTab((p) => Math.max(0, p - 1))}
              disabled={activeTab === 0}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-[var(--radius-button)] border border-border px-3 py-2 text-sm font-medium disabled:opacity-40"
              aria-label="Previous comparison"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Previous
            </button>
            <span className="text-xs text-muted-foreground">
              {activeTab + 1} / {comparisons.length}
            </span>
            <button
              type="button"
              onClick={() => setActiveTab((p) => Math.min(comparisons.length - 1, p + 1))}
              disabled={activeTab === comparisons.length - 1}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-[var(--radius-button)] border border-border px-3 py-2 text-sm font-medium disabled:opacity-40"
              aria-label="Next comparison"
            >
              Next
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </section>

        <section aria-labelledby="outcomes-heading">
          <div className="mb-6 space-y-2">
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-accent">
              <Rocket className="h-4 w-4" aria-hidden="true" />
              Outcomes
            </p>
            <h2 id="outcomes-heading" className="text-2xl font-semibold">
              What changed for users and HR admins
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {outcomes.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="rounded-[var(--radius-card)] border border-border bg-card/90 p-5 shadow-[var(--elevation-sm)] backdrop-blur">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-accent/10">
                  <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-semibold">{label}</h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="improvements-heading">
          <div className="mb-6 space-y-2">
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-accent">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Redesign Notes
            </p>
            <h2 id="improvements-heading" className="text-2xl font-semibold">
              Product decisions behind the interface
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {improvements.map(({ label, detail }) => (
              <div key={label} className="flex gap-3 rounded-[var(--radius-card)] border border-border bg-card/90 p-4 shadow-[var(--elevation-sm)] backdrop-blur">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="database-roadmap-heading" className="space-y-6">
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-accent">
              <Database className="h-4 w-4" aria-hidden="true" />
              Backend &amp; Security Roadmap
            </p>
            <h2 id="database-roadmap-heading" className="text-2xl font-semibold">
              Live Supabase integration and security blueprint
            </h2>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              The UI is backed by an implementation plan for production data, permissions, auditability, and maintainable deployment workflows.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-[var(--radius-card)] border border-border bg-card/90 p-6 shadow-[var(--elevation-sm)] backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-accent/10">
                  <Database className="h-5 w-5 text-accent" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold">Relational database schemas</h3>
              </div>
              <p className="text-xs leading-5 text-muted-foreground">
                Structured around real HRIS relationships: people, roles, titles, departments, leave, missions, attendance, and payroll.
              </p>
              <div className="space-y-2.5 text-xs text-muted-foreground">
                <div className="flex justify-between gap-4 border-b border-border pb-1.5">
                  <span className="font-semibold text-foreground">public.employees</span>
                  <span className="text-end">Auth, roles, contracts</span>
                </div>
                <div className="flex justify-between gap-4 border-b border-border pb-1.5">
                  <span className="font-semibold text-foreground">public.leaves &amp; missions</span>
                  <span className="text-end">Requests with validation</span>
                </div>
                <div className="flex justify-between gap-4 border-b border-border pb-1.5">
                  <span className="font-semibold text-foreground">public.attendance</span>
                  <span className="text-end">Clock in/out by date</span>
                </div>
                <div className="flex justify-between gap-4 border-b border-border pb-1.5">
                  <span className="font-semibold text-foreground">public.payroll</span>
                  <span className="text-end">Net salary calculations</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-accent">
                <Terminal className="h-4 w-4" aria-hidden="true" />
                <span>Full schema definitions are documented in the README</span>
              </div>
            </div>

            <div className="space-y-4 rounded-[var(--radius-card)] border border-border bg-card/90 p-6 shadow-[var(--elevation-sm)] backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-accent/10">
                  <Shield className="h-5 w-5 text-accent" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold">Cybersecurity and maintenance</h3>
              </div>
              <p className="text-xs leading-5 text-muted-foreground">
                Sensitive HR data requires clear boundaries before the product becomes operational.
              </p>
              <ul className="list-inside list-disc space-y-2 text-xs leading-5 text-muted-foreground">
                <li><strong className="text-foreground">Row Level Security (RLS)</strong>: Prevent unauthorized cross-user reads and edits.</li>
                <li><strong className="text-foreground">Credential isolation</strong>: Keep Supabase service_role keys private at all times.</li>
                <li><strong className="text-foreground">Type safety</strong>: Keep generated database types synchronized with migrations.</li>
                <li><strong className="text-foreground">Migrations</strong>: Track schema changes through Git versioning.</li>
              </ul>
              <div className="flex items-center gap-2 text-xs text-accent">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                <span>Follows modern OWASP and Supabase best practices</span>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[calc(var(--radius-card)+8px)] border border-primary/20 bg-card/90 px-6 py-10 text-center shadow-[var(--elevation-lg)] backdrop-blur sm:px-10" aria-labelledby="cta-heading">
          <h2 id="cta-heading" className="text-xl font-semibold">
            Ready to explore the demo?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Use the demo access on the login screen to walk through the redesigned flows with no credentials needed.
          </p>
          <button
            type="button"
            onClick={onBack}
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-button)] bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to login
          </button>
        </section>
      </main>
    </div>
  );
};
