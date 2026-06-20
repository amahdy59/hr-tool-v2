import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Accessibility,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  Layers,
  Rocket,
  Smartphone,
  Sparkles,
  Target,
  Users,
  Zap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

// --- DATA ---

const comparisons = [
  {
    id: 'employees',
    label: 'Employee Management',
    before: {
      src: asset('old-system/add-employee.png'),
      caption: 'Dense forms, no hierarchy',
    },
    after: {
      src: asset('new-system/employee-profile.png'),
      caption: 'Scannable table, clear status badges',
    },
  },
  {
    id: 'vacations',
    label: 'Leave Requests',
    before: {
      src: asset('old-system/search-vacations.png'),
      caption: 'Scattered across multiple screens',
    },
    after: {
      src: asset('images/transform-leave.png'),
      caption: 'One-screen submission with status',
    },
  },
  {
    id: 'missions',
    label: 'Missions & Approvals',
    before: {
      src: asset('old-system/mission-form.png'),
      caption: 'Cluttered form, disconnected approval',
    },
    after: {
      src: asset('images/transform-mission.png'),
      caption: 'Card-based flow, inline approve/reject',
    },
  },
];

const outcomes = [
  { icon: Zap, label: 'Fewer steps', desc: 'Key actions in one screen' },
  { icon: Eye, label: 'Clear status', desc: 'Readable badges everywhere' },
  { icon: Accessibility, label: 'AAA accessible', desc: 'High-contrast, large targets' },
  { icon: Smartphone, label: 'Mobile-first', desc: 'Works on any device' },
];

const improvements = [
  { label: 'Accessibility', detail: 'High contrast, large targets, dyslexia font, focus highlights' },
  { label: 'Navigation', detail: 'Consistent affordances across tabs, links, and buttons' },
  { label: 'Profiles & Modals', detail: 'Contextual edit modals, privacy-safe demo data' },
  { label: 'Deployment', detail: 'Vercel + GitHub Pages with automated CI/CD' },
];

// --- COMPONENTS ---

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
          isAfter
            ? 'bg-[#E7F6EF] text-[#064E3B]'
            : 'bg-muted text-muted-foreground'
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
          'relative overflow-hidden rounded-[var(--radius-card)] border',
          isAfter ? 'border-[#047857]/30 shadow-md' : 'border-border'
        )}
      >
        {!loaded && !failed && (
          <div
            className="aspect-[16/10] w-full animate-pulse bg-muted"
            aria-hidden="true"
          />
        )}
        {failed ? (
          <div className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-2 bg-muted/50 p-6 text-center">
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
              'aspect-[16/10] w-full object-cover object-top transition-opacity duration-300',
              loaded ? 'opacity-100' : 'opacity-0'
            )}
          />
        )}
      </div>
      <p className="text-xs text-muted-foreground">{caption}</p>
    </div>
  );
};

interface RedesignInfoPageProps {
  onBack: () => void;
}

export const RedesignInfoPage: React.FC<RedesignInfoPageProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-[var(--radius-button)] border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Back to login"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Back to login</span>
          </button>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            HR Tool Case Study
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-12 px-4 py-8 sm:px-6 lg:space-y-16 lg:py-12">

        {/* ── HERO ── */}
        <section aria-labelledby="hero-heading">
          <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-border bg-gradient-to-br from-primary/10 via-card to-accent/10 px-6 py-10 shadow-[var(--elevation-lg)] sm:px-10 sm:py-14">
            {/* decorative blobs */}
            <div className="pointer-events-none absolute -end-16 -top-16 h-64 w-64 rounded-full bg-accent/15 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-10 -start-10 h-48 w-48 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />

            <div className="relative space-y-5 max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent">
                <Target className="h-3.5 w-3.5" aria-hidden="true" />
                Employee self-service redesign
              </p>
              <h1
                id="hero-heading"
                className="font-semibold text-foreground leading-tight"
                style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}
              >
                Leave, mission &amp; document workflows —{' '}
                <span className="text-accent">redesigned for clarity.</span>
              </h1>
              <p className="max-w-xl text-base leading-7 text-muted-foreground">
                A privacy-safe demo of a real HR upgrade. Scattered legacy screens become an accessible, responsive experience for employees, managers, and HR teams.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: 'Fewer steps', icon: Zap },
                  { label: 'Clear status', icon: Eye },
                  { label: 'AAA accessible', icon: Accessibility },
                  { label: 'Fully responsive', icon: Smartphone },
                ].map(({ label, icon: Icon }) => (
                  <div
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-sm font-medium shadow-[var(--elevation-sm)]"
                  >
                    <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
                    {label}
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <p className="text-sm text-muted-foreground"><strong className="text-foreground">Audience:</strong> Employees, managers &amp; HR teams</p>
                </div>
                <div className="hidden h-4 w-px bg-border sm:block" aria-hidden="true" />
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E7F6EF]">
                    <CheckCircle2 className="h-4 w-4 text-[#047857]" aria-hidden="true" />
                  </div>
                  <p className="text-sm text-muted-foreground"><strong className="text-foreground">Result:</strong> Less navigation, clearer statuses</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── BEFORE / AFTER ── */}
        <section aria-labelledby="comparison-heading">
          <div className="mb-6 space-y-2">
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-accent">
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
              Before &amp; After
            </p>
            <h2 id="comparison-heading" className="text-2xl font-semibold">
              See the transformation
            </h2>
          </div>

          {/* Tab nav */}
          <div
            role="tablist"
            aria-label="Comparison screens"
            className="mb-6 flex gap-2 overflow-x-auto pb-1"
          >
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

          {/* Mobile navigation */}
          <div className="mt-4 flex items-center justify-between sm:hidden">
            <button
              type="button"
              onClick={() => setActiveTab((p) => Math.max(0, p - 1))}
              disabled={activeTab === 0}
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-button)] border border-border px-3 py-2 text-sm font-medium disabled:opacity-40"
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
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-button)] border border-border px-3 py-2 text-sm font-medium disabled:opacity-40"
              aria-label="Next comparison"
            >
              Next
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </section>

        {/* ── OUTCOMES ── */}
        <section aria-labelledby="outcomes-heading">
          <div className="mb-6 space-y-2">
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-accent">
              <Rocket className="h-4 w-4" aria-hidden="true" />
              Outcomes
            </p>
            <h2 id="outcomes-heading" className="text-2xl font-semibold">
              What changed for users
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {outcomes.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--elevation-sm)] transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-accent/10">
                  <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-semibold">{label}</h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── IMPROVEMENTS ── */}
        <section aria-labelledby="improvements-heading">
          <div className="mb-6 space-y-2">
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-accent">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Redesign Notes
            </p>
            <h2 id="improvements-heading" className="text-2xl font-semibold">
              Key improvements
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {improvements.map(({ label, detail }) => (
              <div
                key={label}
                className="flex gap-3 rounded-[var(--radius-card)] border border-border bg-card p-4"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section
          className="rounded-[var(--radius-card)] border border-primary/20 bg-primary/5 px-6 py-10 text-center sm:px-10"
          aria-labelledby="cta-heading"
        >
          <h2 id="cta-heading" className="text-xl font-semibold">
            Ready to explore the demo?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Use the demo access on the login screen to walk through all the redesigned flows — no credentials needed.
          </p>
          <button
            type="button"
            onClick={onBack}
            className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to login
          </button>
        </section>
      </main>
    </div>
  );
};
