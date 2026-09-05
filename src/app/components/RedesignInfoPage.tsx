import React, { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
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

const ScreenshotCard: React.FC<{
  src: string;
  caption: string;
  label: string;
  variant: 'before' | 'after';
}> = ({ src, caption, label, variant }) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const isAfter = variant === 'after';

  return (
    <div className="group flex flex-col gap-2.5 rounded-[calc(var(--radius-card)+4px)] border border-border/80 bg-card/70 p-3.5 sm:p-4 shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md">
      <div className="flex items-center justify-between gap-2">
        <div
          className={cn(
            'inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-transform duration-200 group-hover:scale-[1.02] motion-reduce:transform-none',
            isAfter
              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
              : 'bg-muted text-muted-foreground border border-border/80'
          )}
        >
          {isAfter ? (
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          ) : (
            <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          )}
          <span>{label}</span>
        </div>
      </div>
      <div
        className={cn(
          'relative aspect-[16/10] w-full overflow-hidden rounded-[var(--radius-card)] border bg-card transition-all duration-300',
          isAfter
            ? 'border-emerald-500/30 shadow-sm group-hover:border-emerald-500/60 group-hover:shadow-md'
            : 'border-border/80 group-hover:border-border'
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
              'absolute inset-0 h-full w-full object-cover object-top transition-all duration-500 group-hover:scale-[1.02] motion-reduce:transform-none',
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
  onExploreDemo?: () => void;
  accessibility: AccessibilitySettings;
}

export const RedesignInfoPage: React.FC<RedesignInfoPageProps> = ({
  onBack,
  onExploreDemo,
  accessibility,
}) => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const pageTitleId = useId();
  const isArabic = (i18n.resolvedLanguage || i18n.language).startsWith('ar');
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;
  const ForwardIcon = isArabic ? ArrowLeft : ArrowRight;
  const PreviousIcon = isArabic ? ChevronRight : ChevronLeft;
  const NextIcon = isArabic ? ChevronLeft : ChevronRight;

  const comparisons = [
    {
      id: 'employees',
      label: t('redesign.comparisons.employees.label'),
      before: {
        src: asset('old-system/add-employee.png'),
        caption: t('redesign.comparisons.employees.before'),
      },
      after: {
        src: asset('new-system/employee-profile.png'),
        caption: t('redesign.comparisons.employees.after'),
      },
    },
    {
      id: 'vacations',
      label: t('redesign.comparisons.vacations.label'),
      before: {
        src: asset('old-system/search-vacations.png'),
        caption: t('redesign.comparisons.vacations.before'),
      },
      after: {
        src: asset('images/transform-leave.png'),
        caption: t('redesign.comparisons.vacations.after'),
      },
    },
    {
      id: 'missions',
      label: t('redesign.comparisons.missions.label'),
      before: {
        src: asset('old-system/mission-form.png'),
        caption: t('redesign.comparisons.missions.before'),
      },
      after: {
        src: asset('images/transform-mission.png'),
        caption: t('redesign.comparisons.missions.after'),
      },
    },
  ];

  const outcomes = [
    { icon: Zap, label: t('redesign.outcomes.items.fewerSteps.label'), desc: t('redesign.outcomes.items.fewerSteps.desc') },
    { icon: Eye, label: t('redesign.outcomes.items.clearStatus.label'), desc: t('redesign.outcomes.items.clearStatus.desc') },
    { icon: Accessibility, label: t('redesign.outcomes.items.access.label'), desc: t('redesign.outcomes.items.access.desc') },
    { icon: Smartphone, label: t('redesign.outcomes.items.responsive.label'), desc: t('redesign.outcomes.items.responsive.desc') },
  ];

  const improvements = [
    { label: t('redesign.improvements.items.translationQuality.label'), detail: t('redesign.improvements.items.translationQuality.detail') },
    { label: t('redesign.improvements.items.rtlDesign.label'), detail: t('redesign.improvements.items.rtlDesign.detail') },
    { label: t('redesign.improvements.items.accessibleControls.label'), detail: t('redesign.improvements.items.accessibleControls.detail') },
    { label: t('redesign.improvements.items.workflows.label'), detail: t('redesign.improvements.items.workflows.detail') },
    { label: t('redesign.improvements.items.backendPlanning.label'), detail: t('redesign.improvements.items.backendPlanning.detail') },
    { label: t('redesign.improvements.items.security.label'), detail: t('redesign.improvements.items.security.detail') },
    { label: t('redesign.improvements.items.maintainability.label'), detail: t('redesign.improvements.items.maintainability.detail') },
  ];

  const proofPoints = [
    { icon: Globe2, value: t('redesign.proofPoints.languages.value'), label: t('redesign.proofPoints.languages.label') },
    { icon: BadgeCheck, value: t('redesign.proofPoints.accessibility.value'), label: t('redesign.proofPoints.accessibility.label') },
    { icon: Database, value: t('redesign.proofPoints.schema.value'), label: t('redesign.proofPoints.schema.label') },
  ];

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
            className="inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-[var(--radius-button)] border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-[var(--elevation-sm)] transition-all duration-150 hover:bg-muted active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transform-none cursor-pointer"
            aria-label={t('login.backToLogin')}
          >
            <BackIcon className="h-4 w-4" aria-hidden="true" />
            <span>{t('login.backToLogin')}</span>
          </button>
          <div className="flex items-center gap-2 sm:gap-3">
            {onExploreDemo && (
              <button
                type="button"
                onClick={onExploreDemo}
                className="inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-[var(--radius-button)] bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-150 hover:bg-primary/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transform-none cursor-pointer"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                <span>{t('login.launchDemo')}</span>
              </button>
            )}
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
            {t('redesign.hero.eyebrow')}
          </p>
          <div className="max-w-4xl space-y-5">
            <h1
              id="hero-heading"
              className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl lg:text-5xl"
            >
              {t('redesign.hero.titlePrefix')} <span className="text-accent">{t('redesign.hero.titleAccent')}</span>
            </h1>
            <h2 id={pageTitleId} className="sr-only">
              {t('redesign.hero.screenReaderTitle')}
            </h2>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              {t('redesign.hero.description')}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { label: t('redesign.hero.pills.fewerSteps'), icon: Zap },
              { label: t('redesign.hero.pills.clearStatus'), icon: Eye },
              { label: t('redesign.hero.pills.arabicReady'), icon: Globe2 },
              { label: t('redesign.hero.pills.accessibleControls'), icon: Accessibility },
            ].map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-button)] border border-border/80 bg-background/80 px-3.5 py-2 text-sm font-medium shadow-[var(--elevation-sm)] backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 motion-reduce:transform-none"
              >
                <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
                {label}
              </div>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {proofPoints.map(({ icon: Icon, value, label }) => (
              <div
                key={value}
                className="group rounded-[var(--radius-card)] border border-border/80 bg-background/80 p-5 shadow-[var(--elevation-sm)] backdrop-blur transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md motion-reduce:transform-none"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-accent/10 transition-transform duration-200 group-hover:scale-110 motion-reduce:transform-none">
                  <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                </div>
                <p className="text-base font-bold text-foreground">{value}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="comparison-heading" className="space-y-6">
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-accent">
              <ForwardIcon className="h-4 w-4" aria-hidden="true" />
              {t('redesign.comparison.eyebrow')}
            </p>
            <h2 id="comparison-heading" className="text-2xl font-semibold">
              {t('redesign.comparison.title')}
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              {t('redesign.comparison.description')}
            </p>
          </div>

          <div role="tablist" aria-label={t('redesign.comparison.tablistAriaLabel')} className="flex gap-2 overflow-x-auto pb-1">
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
                  'shrink-0 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-button)] border px-4 py-2 text-sm font-medium transition-all duration-150 active:scale-[0.98] motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer',
                  activeTab === i
                    ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                    : 'border-border bg-card text-muted-foreground hover:border-border/90 hover:bg-muted hover:text-foreground'
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
              className={cn(
                'grid gap-5 sm:grid-cols-2',
                activeTab === i && 'animate-fadeIn'
              )}
            >
              <ScreenshotCard src={c.before.src} caption={c.before.caption} label={t('redesign.comparison.beforeLabel')} variant="before" />
              <ScreenshotCard src={c.after.src} caption={c.after.caption} label={t('redesign.comparison.afterLabel')} variant="after" />
            </div>
          ))}
          <div className="mt-4 flex items-center justify-between sm:hidden">
            <button
              type="button"
              onClick={() => setActiveTab((p) => Math.max(0, p - 1))}
              disabled={activeTab === 0}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-[var(--radius-button)] border border-border px-3 py-2 text-sm font-medium disabled:opacity-40"
              aria-label={t('redesign.comparison.previousAriaLabel')}
            >
              <PreviousIcon className="h-4 w-4" aria-hidden="true" />
              {t('pagination.previousText')}
            </button>
            <span className="text-xs text-muted-foreground">
              {activeTab + 1} / {comparisons.length}
            </span>
            <button
              type="button"
              onClick={() => setActiveTab((p) => Math.min(comparisons.length - 1, p + 1))}
              disabled={activeTab === comparisons.length - 1}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-[var(--radius-button)] border border-border px-3 py-2 text-sm font-medium disabled:opacity-40"
              aria-label={t('redesign.comparison.nextAriaLabel')}
            >
              {t('pagination.nextText')}
              <NextIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </section>

        <section aria-labelledby="outcomes-heading">
          <div className="mb-6 space-y-2">
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-accent">
              <Rocket className="h-4 w-4" aria-hidden="true" />
              {t('redesign.outcomes.eyebrow')}
            </p>
            <h2 id="outcomes-heading" className="text-2xl font-semibold">
              {t('redesign.outcomes.title')}
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {outcomes.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="group rounded-[var(--radius-card)] border border-border bg-card/90 p-5 shadow-[var(--elevation-sm)] backdrop-blur transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md motion-reduce:transform-none"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-accent/10 transition-transform duration-200 group-hover:scale-110 motion-reduce:transform-none">
                  <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">{label}</h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="improvements-heading">
          <div className="mb-6 space-y-2">
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-accent">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {t('redesign.improvements.eyebrow')}
            </p>
            <h2 id="improvements-heading" className="text-2xl font-semibold">
              {t('redesign.improvements.title')}
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {improvements.map(({ label, detail }) => (
              <div
                key={label}
                className="flex gap-3 rounded-[var(--radius-card)] border border-border bg-card/90 p-4 shadow-[var(--elevation-sm)] backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm motion-reduce:transform-none"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{label}</p>
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
              {t('redesign.roadmap.eyebrow')}
            </p>
            <h2 id="database-roadmap-heading" className="text-2xl font-semibold">
              {t('redesign.roadmap.title')}
            </h2>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              {t('redesign.roadmap.description')}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-[var(--radius-card)] border border-border bg-card/90 p-6 shadow-[var(--elevation-sm)] backdrop-blur transition-all duration-200 hover:border-primary/30 hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-accent/10">
                  <Database className="h-5 w-5 text-accent" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold">{t('redesign.roadmap.database.title')}</h3>
              </div>
              <p className="text-xs leading-5 text-muted-foreground">
                {t('redesign.roadmap.database.description')}
              </p>
              <div className="space-y-2.5 text-xs text-muted-foreground">
                <div className="flex justify-between gap-4 border-b border-border pb-1.5 transition-colors hover:text-foreground">
                  <span className="font-semibold text-foreground">public.employees</span>
                  <span className="text-end">{t('redesign.roadmap.database.rows.employees')}</span>
                </div>
                <div className="flex justify-between gap-4 border-b border-border pb-1.5 transition-colors hover:text-foreground">
                  <span className="font-semibold text-foreground">public.leaves &amp; missions</span>
                  <span className="text-end">{t('redesign.roadmap.database.rows.requests')}</span>
                </div>
                <div className="flex justify-between gap-4 border-b border-border pb-1.5 transition-colors hover:text-foreground">
                  <span className="font-semibold text-foreground">public.attendance</span>
                  <span className="text-end">{t('redesign.roadmap.database.rows.attendance')}</span>
                </div>
                <div className="flex justify-between gap-4 border-b border-border pb-1.5 transition-colors hover:text-foreground">
                  <span className="font-semibold text-foreground">public.payroll</span>
                  <span className="text-end">{t('redesign.roadmap.database.rows.payroll')}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-accent">
                <Terminal className="h-4 w-4" aria-hidden="true" />
                <span>{t('redesign.roadmap.database.footnote')}</span>
              </div>
            </div>

            <div className="space-y-4 rounded-[var(--radius-card)] border border-border bg-card/90 p-6 shadow-[var(--elevation-sm)] backdrop-blur transition-all duration-200 hover:border-primary/30 hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-accent/10">
                  <Shield className="h-5 w-5 text-accent" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold">{t('redesign.roadmap.security.title')}</h3>
              </div>
              <p className="text-xs leading-5 text-muted-foreground">
                {t('redesign.roadmap.security.description')}
              </p>
              <ul className="list-inside list-disc space-y-2 text-xs leading-5 text-muted-foreground">
                <li><strong className="text-foreground">{t('redesign.roadmap.security.items.rls.label')}</strong>: {t('redesign.roadmap.security.items.rls.detail')}</li>
                <li><strong className="text-foreground">{t('redesign.roadmap.security.items.credentials.label')}</strong>: {t('redesign.roadmap.security.items.credentials.detail')}</li>
                <li><strong className="text-foreground">{t('redesign.roadmap.security.items.typeSafety.label')}</strong>: {t('redesign.roadmap.security.items.typeSafety.detail')}</li>
                <li><strong className="text-foreground">{t('redesign.roadmap.security.items.migrations.label')}</strong>: {t('redesign.roadmap.security.items.migrations.detail')}</li>
              </ul>
              <div className="flex items-center gap-2 text-xs text-accent">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                <span>{t('redesign.roadmap.security.footnote')}</span>
              </div>
            </div>
          </div>
        </section>

        <section
          className="rounded-[calc(var(--radius-card)+8px)] border border-primary/25 bg-gradient-to-b from-card to-card/70 px-6 py-10 text-center shadow-[var(--elevation-lg)] backdrop-blur sm:px-10"
          aria-labelledby="cta-heading"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <Sparkles className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 id="cta-heading" className="text-2xl font-bold tracking-tight">
            {t('redesign.cta.title')}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            {t('redesign.cta.description')}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {onExploreDemo && (
              <button
                type="button"
                onClick={onExploreDemo}
                className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-button)] bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-150 hover:bg-primary/90 hover:shadow-lg active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transform-none cursor-pointer"
              >
                <Zap className="h-4 w-4" aria-hidden="true" />
                <span>{t('login.launchDemo')}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onBack}
              className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-button)] border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition-all duration-150 hover:bg-muted active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transform-none cursor-pointer"
            >
              <BackIcon className="h-4 w-4" aria-hidden="true" />
              <span>{t('login.backToLogin')}</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
