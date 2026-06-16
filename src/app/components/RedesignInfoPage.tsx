import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Accessibility,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  GitBranch,
  Layers,
  LayoutDashboard,
  MousePointerClick,
  Rocket,
  Shield,
  Smartphone,
  Sparkles,
  Target,
  Users,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

const oldSystemScreens = [
  {
    src: asset('old-system/add-employee.png'),
    title: 'Dense employee forms',
    desc: 'Long two-column forms made scanning difficult and increased the chance of missed required fields.',
    icon: Layers,
  },
  {
    src: asset('old-system/find-employees.png'),
    title: 'Search-heavy flows',
    desc: 'Employees and HR teams had to search and move through several screens before taking action.',
    icon: Users,
  },
  {
    src: asset('old-system/search-vacations.png'),
    title: 'Vacation split across pages',
    desc: 'Submitting or tracking leave required separate search and export screens.',
    icon: Calendar,
  },
  {
    src: asset('old-system/mission-form.png'),
    title: 'Mission submission friction',
    desc: 'A mission request required multiple fields and disconnected approval context.',
    icon: Rocket,
  },
  {
    src: asset('old-system/mission-approver.png'),
    title: 'Approver setup complexity',
    desc: 'Approver management depended on manual lookup and form-heavy setup.',
    icon: Shield,
  },
  {
    src: asset('old-system/approval-list.png'),
    title: 'Unclear support messaging',
    desc: 'Critical notes were visually loud but not structured for quick comprehension.',
    icon: BookOpen,
  },
];

const afterHighlights = [
  { label: 'Submit vacation faster', icon: Calendar },
  { label: 'Upload sick leave notes in context', icon: BookOpen },
  { label: 'Review approvals with readable statuses', icon: Eye },
  { label: 'Use the same pattern on mobile', icon: Smartphone },
];

const redesignNotes = [
  {
    category: 'Accessibility',
    icon: Accessibility,
    accent: 'border-l-accent bg-accent/5',
    items: [
      'AAA accessibility panel: high contrast, large targets, text scale, dyslexia font, focus highlights',
      'Pre-login accessibility configuration from the login screen',
    ],
  },
  {
    category: 'Navigation & interaction',
    icon: MousePointerClick,
    accent: 'border-l-primary bg-primary/5',
    items: [
      'Standardized navigation affordances across tabs, links, and buttons',
      'Pointer cursor on interactive elements; responsive alignment polish',
      'Sidebar selected-state contrast and normalized item text sizing',
    ],
  },
  {
    category: 'Profiles & modals',
    icon: LayoutDashboard,
    accent: 'border-l-chart-3 bg-chart-3/5',
    items: [
      'Profile edit modals load the clicked row; privacy-safe demo data',
      'Modal stepper visibility and mobile dashboard header refinements',
      'Dashboard calendar breakpoint tuning',
    ],
  },
  {
    category: 'Case study & content',
    icon: Sparkles,
    accent: 'border-l-[#047857] bg-[#E7F6EF]/60',
    items: [
      'Login case study page with legacy screenshots and before/after narrative',
      'Knowledge base management site added alongside the HR prototype',
      'README refresh with updated project scope',
    ],
  },
  {
    category: 'Deployment',
    icon: GitBranch,
    accent: 'border-l-muted-foreground bg-muted/40',
    items: [
      'Vercel and GitHub Pages deployment with automated main-branch workflow',
      'Relative base paths and smart routing for cross-host compatibility',
      '.nojekyll fix so GitHub Pages serves all static assets correctly',
    ],
  },
];

const LegacyScreenshot: React.FC<{
  src: string;
  title: string;
  desc: string;
  icon: React.ElementType;
  variant?: 'default' | 'featured';
}> = ({ src, title, desc, icon: Icon, variant = 'default' }) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <article
      className={cn(
        'group overflow-hidden rounded-[var(--radius-card)] border bg-card shadow-[var(--elevation-sm)] transition-shadow hover:shadow-[var(--elevation-md)]',
        variant === 'featured' ? 'border-accent/30 sm:col-span-2' : 'border-border'
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/50">
        {!loaded && !failed && (
          <div className="absolute inset-0 animate-pulse bg-muted" aria-hidden="true" />
        )}
        {failed ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
            <Icon className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
            <p className="text-[var(--text-xs)] text-muted-foreground">Screenshot unavailable</p>
          </div>
        ) : (
          <img
            src={src}
            alt={`Legacy HR system: ${title}`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            className={cn(
              'h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]',
              loaded ? 'opacity-100' : 'opacity-0'
            )}
          />
        )}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-border/80 bg-card/90 px-2.5 py-1 text-[var(--text-xs)] font-[var(--font-weight-semibold)] shadow-sm backdrop-blur">
          <Icon className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
          Legacy
        </div>
      </div>
      <div className="space-y-1.5 p-4">
        <h3 className="text-[var(--text-sm)] font-[var(--font-weight-semibold)]">{title}</h3>
        <p className="text-[var(--text-xs)] leading-5 text-muted-foreground">{desc}</p>
      </div>
    </article>
  );
};

interface RedesignInfoPageProps {
  onBack: () => void;
}

export const RedesignInfoPage: React.FC<RedesignInfoPageProps> = ({ onBack }) => (
  <div className="min-h-screen bg-background text-foreground">
    <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-[var(--radius-button)] border border-border bg-card px-3 py-2 text-[var(--text-sm)] font-[var(--font-weight-medium)] text-foreground transition-colors hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to login
        </button>
        <span className="inline-flex items-center gap-1.5 text-[var(--text-xs)] font-[var(--font-weight-semibold)] uppercase tracking-[0.08em] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
          HR tool case study
        </span>
      </div>
    </header>

    <main className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:px-6 lg:space-y-16 lg:py-12 lg:px-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[var(--radius-card)] border border-border bg-gradient-to-br from-primary/10 via-card to-accent/10 p-6 shadow-[var(--elevation-lg)] sm:p-10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
        <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-5">
            <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[var(--text-xs)] font-[var(--font-weight-semibold)] uppercase tracking-[0.08em] text-accent">
              <Target className="h-3.5 w-3.5" aria-hidden="true" />
              Employee self-service redesign
            </p>
            <h1
              className="text-foreground"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'clamp(2rem, 6vw, 3.75rem)',
                fontWeight: 'var(--font-weight-semibold)',
                lineHeight: 1.08,
              }}
            >
              Leave, mission, and document workflows — redesigned for clarity.
            </h1>
            <p className="max-w-2xl text-[var(--text-base)] leading-7 text-muted-foreground">
              A privacy-safe demo of a real HR workflow upgrade. Legacy scattered screens become a clearer, accessible, responsive experience for employees, managers, and HR teams.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Fewer steps', icon: Zap },
                { label: 'Clear status', icon: Eye },
                { label: 'Reusable pattern', icon: Layers },
              ].map(({ label, icon: Icon }) => (
                <div
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-[var(--text-sm)] font-[var(--font-weight-medium)] shadow-[var(--elevation-sm)]"
                >
                  <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[var(--radius-card)] border border-border/80 bg-card/90 p-4 shadow-[var(--elevation-md)] backdrop-blur">
            <div className="rounded-[var(--radius)] bg-muted/40 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[var(--text-xs)] font-[var(--font-weight-semibold)] uppercase tracking-[0.08em] text-muted-foreground">
                    Current design
                  </p>
                  <h2 className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]">Request Mission</h2>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-[#047857] bg-[#E7F6EF] px-3 py-1 text-[var(--text-xs)] font-[var(--font-weight-semibold)] text-[#064E3B]">
                  <Accessibility className="h-3 w-3" aria-hidden="true" />
                  AAA ready
                </span>
              </div>
              <div className="grid gap-3">
                <div className="rounded-[var(--radius-input)] border border-border bg-card p-3">
                  <p className="text-[var(--text-xs)] text-muted-foreground">Mission Type</p>
                  <p className="text-[var(--text-sm)] font-[var(--font-weight-semibold)]">Work From Home</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[var(--radius-input)] border border-border bg-card p-3">
                    <p className="text-[var(--text-xs)] text-muted-foreground">From</p>
                    <p className="text-[var(--text-sm)] font-[var(--font-weight-semibold)]">Today</p>
                  </div>
                  <div className="rounded-[var(--radius-input)] border border-border bg-card p-3">
                    <p className="text-[var(--text-xs)] text-muted-foreground">To</p>
                    <p className="text-[var(--text-sm)] font-[var(--font-weight-semibold)]">Tomorrow</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-[var(--radius-button)] bg-accent text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-accent-foreground"
                >
                  Submit Mission
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Context cards — varied styling */}
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--elevation-sm)]">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-accent/15">
            <Users className="h-5 w-5 text-accent" aria-hidden="true" />
          </div>
          <h2 className="text-[var(--text-base)] font-[var(--font-weight-semibold)]">Audience</h2>
          <p className="mt-2 text-[var(--text-sm)] leading-6 text-muted-foreground">
            Employees submitting leave, sick notes, missions, and documents — plus HR and managers reviewing requests.
          </p>
        </article>
        <article className="rounded-[var(--radius-card)] border-2 border-dashed border-primary/30 bg-primary/5 p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
            <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <h2 className="text-[var(--text-base)] font-[var(--font-weight-semibold)]">Contribution</h2>
          <p className="mt-2 text-[var(--text-sm)] leading-6 text-muted-foreground">
            UX analysis, workflow simplification, accessible UI direction, responsive patterns, and privacy-safe prototype adaptation.
          </p>
        </article>
        <article className="rounded-[var(--radius-card)] border border-border bg-gradient-to-br from-card to-muted/30 p-5 shadow-[var(--elevation-sm)]">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[var(--radius)] border border-[#047857]/30 bg-[#E7F6EF]">
            <CheckCircle2 className="h-5 w-5 text-[#047857]" aria-hidden="true" />
          </div>
          <h2 className="text-[var(--text-base)] font-[var(--font-weight-semibold)]">Outcome</h2>
          <p className="mt-2 text-[var(--text-sm)] leading-6 text-muted-foreground">
            Less navigation, clearer status visibility, and a pattern adaptable to other organizations.
          </p>
        </article>
      </section>

      {/* Before */}
      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-[var(--text-sm)] font-[var(--font-weight-semibold)] uppercase tracking-[0.08em] text-accent">
              <Clock className="h-4 w-4" aria-hidden="true" />
              Before
            </p>
            <h2 className="mt-1 text-[var(--text-xl)] font-[var(--font-weight-semibold)]">Old system pain points</h2>
          </div>
          <p className="hidden max-w-xs text-right text-[var(--text-xs)] text-muted-foreground sm:block">
            Real legacy screenshots from the previous HR tool
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {oldSystemScreens.map((screen, index) => (
            <LegacyScreenshot
              key={screen.src}
              {...screen}
              variant={index === 0 ? 'featured' : 'default'}
            />
          ))}
        </div>
      </section>

      {/* After */}
      <section className="overflow-hidden rounded-[var(--radius-card)] border border-border shadow-[var(--elevation-sm)]">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
          <div className="border-b border-border bg-gradient-to-br from-accent/10 to-transparent p-6 lg:border-b-0 lg:border-r">
            <p className="inline-flex items-center gap-2 text-[var(--text-sm)] font-[var(--font-weight-semibold)] uppercase tracking-[0.08em] text-accent">
              <Rocket className="h-4 w-4" aria-hidden="true" />
              After
            </p>
            <h2 className="mt-2 text-[var(--text-xl)] font-[var(--font-weight-semibold)]">
              A focused, privacy-safe version of the real workflow
            </h2>
            <p className="mt-3 text-[var(--text-sm)] leading-6 text-muted-foreground">
              Related tasks are grouped, request actions stay near employee context, status badges are readable, document upload is testable, and mobile layouts are first-class.
            </p>
          </div>
          <div className="grid gap-3 p-6 sm:grid-cols-2">
            {afterHighlights.map(({ label, icon: Icon }, i) => (
              <div
                key={label}
                className={cn(
                  'rounded-[var(--radius-input)] p-4',
                  i % 2 === 0
                    ? 'border border-border bg-card'
                    : 'border border-transparent bg-muted/40'
                )}
              >
                <Icon className="mb-2 h-5 w-5 text-accent" aria-hidden="true" />
                <p className="text-[var(--text-sm)] font-[var(--font-weight-semibold)]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Redesign notes */}
      <section className="space-y-5">
        <div>
          <p className="inline-flex items-center gap-2 text-[var(--text-sm)] font-[var(--font-weight-semibold)] uppercase tracking-[0.08em] text-accent">
            <GitBranch className="h-4 w-4" aria-hidden="true" />
            Redesign notes
          </p>
          <h2 className="mt-1 text-[var(--text-xl)] font-[var(--font-weight-semibold)]">Recent updates</h2>
          <p className="mt-2 max-w-2xl text-[var(--text-sm)] text-muted-foreground">
            Concise summary of the latest improvements across accessibility, interaction polish, and deployment.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {redesignNotes.map(({ category, icon: Icon, accent, items }) => (
            <article
              key={category}
              className={cn('rounded-[var(--radius-card)] border border-border border-l-4 p-5', accent)}
            >
              <div className="mb-3 flex items-center gap-2">
                <Icon className="h-4 w-4 shrink-0 text-foreground" aria-hidden="true" />
                <h3 className="text-[var(--text-sm)] font-[var(--font-weight-semibold)]">{category}</h3>
              </div>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item} className="flex gap-2 text-[var(--text-xs)] leading-5 text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-[var(--radius-card)] border border-primary/20 bg-primary/5 p-6 text-center sm:p-8">
        <h2 className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]">Ready to explore the demo?</h2>
        <p className="mx-auto mt-2 max-w-lg text-[var(--text-sm)] text-muted-foreground">
          Use demo access on the login screen to enter without credentials and walk through the redesigned flows.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-5 inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-primary px-5 py-2.5 text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to login
        </button>
      </section>
    </main>
  </div>
);
