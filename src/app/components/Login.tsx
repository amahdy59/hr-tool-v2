import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, Eye, EyeOff, Info, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AccessibilityPanel, AccessibilitySettings } from './AccessibilityPanel';

interface LoginProps {
  onLogin: (email: string) => void;
  accessibility: AccessibilitySettings;
}

export const Login: React.FC<LoginProps> = ({ onLogin, accessibility }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showInfoPage, setShowInfoPage] = useState(false);
  const showTempLogin = true;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate a small delay for better UX
    setTimeout(() => {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!emailRegex.test(username)) {
        setError('Please enter a valid email address');
        setIsLoading(false);
      } else if (password === '123456') {
        onLogin(username);
      } else {
        setError('Invalid password');
        setIsLoading(false);
      }
    }, 600);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate a small delay for better UX
    setTimeout(() => {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (emailRegex.test(resetEmail)) {
        setResetSuccess(true);
        setIsLoading(false);
      } else {
        setError('Please enter a valid email address');
        setIsLoading(false);
      }
    }, 600);
  };

  const handleQuickLogin = () => {
    onLogin('amahdy59@gmail.com');
  };

  if (showInfoPage) {
    return <InfoPage onBack={() => setShowInfoPage(false)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Floating Accessibility settings for pre-login accessibility configuration */}
      <div className="absolute top-4 right-4 z-50">
        <AccessibilityPanel settings={accessibility} />
      </div>
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab]">
        {/* Animated overlay gradients */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        </div>
        
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
        
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
      </div>

      {/* Floating shapes for visual interest */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-float" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-white/10 rounded-full animate-float animation-delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-white/15 rounded-full animate-float animation-delay-2000" />
        <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-white/20 rounded-full animate-float animation-delay-3000" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-card/95 backdrop-blur-sm rounded-[var(--radius-card)] shadow-[var(--elevation-lg)] p-8 border border-border/50">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '32px',
                fontWeight: 700,
              }}
              className="text-primary mb-2"
            >
              AM
            </div>
            <h1
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'var(--section-heading-size)',
                fontWeight: 'var(--section-heading-weight)',
              }}
              className="text-foreground mb-1"
            >
              Login
            </h1>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
              }}
              className="text-muted-foreground"
            >
              Welcome to AM Technologies HR Tool
            </p>
            <button
              type="button"
              onClick={() => setShowInfoPage(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-[var(--radius-button)] border border-border bg-card px-3 py-2 text-[var(--text-sm)] font-[var(--font-weight-medium)] text-primary shadow-[var(--elevation-sm)] transition-colors hover:bg-muted"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <Info className="w-4 h-4" />
              About this redesign
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div
                className="rounded-[var(--radius)] border border-[#B91C1C] bg-[#FDECEC] p-3 text-center text-[#7F1D1D]"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
              >
                {error}
              </div>
            )}

            {/* Username Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="username"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
                className="text-foreground block"
              >
                Username
              </label>
              <input
                id="username"
                type="email"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                placeholder="Enter your email"
                required
                className={cn(
                  'w-full h-10 px-3 border rounded-[var(--radius-input)] bg-input-background text-foreground outline-none transition-all',
                  error ? 'border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/50' : 'border-border focus:ring-2 focus:ring-ring/50 focus:border-ring'
                )}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-normal)',
                }}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
                className="text-foreground block"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your password"
                  required
                  className={cn(
                    'w-full h-10 px-3 pr-10 border rounded-[var(--radius-input)] bg-input-background text-foreground outline-none transition-all',
                    error ? 'border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/50' : 'border-border focus:ring-2 focus:ring-ring/50 focus:border-ring'
                  )}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-normal)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
                />
                <label
                  htmlFor="rememberMe"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-normal)',
                  }}
                  className="text-foreground cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <button
                type="button"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
                className="text-primary hover:underline"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                'w-full h-10 rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white transition-colors shadow-sm',
                isLoading && 'opacity-70 cursor-not-allowed'
              )}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semibold)',
              }}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>

            {showTempLogin && (
              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-[var(--text-xs)]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <span className="px-2 bg-card text-muted-foreground uppercase tracking-wide">Temporary Access</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleQuickLogin}
                  aria-label="Enter the HR tool with temporary test access"
                  className={cn(
                    'w-full h-10 rounded-[var(--radius-button)] bg-[#FFF4DE] hover:bg-[#FDECC8] text-[#7C2D12] border-2 border-[#C2410C] transition-all shadow-sm flex items-center justify-center gap-2 group relative overflow-hidden'
                  )}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" />
                  <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Enter without credentials</span>
                </button>
                
                <div className="flex items-center justify-center gap-1.5 text-[var(--text-xs)] text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <span className="inline-block w-2 h-2 bg-[#C2410C] rounded-full animate-pulse" />
                  <span>Temporary testing access</span>
                </div>
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-border text-center">
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-weight-normal)',
              }}
              className="text-muted-foreground"
            >
              Need help? Contact{' '}
              <a
                href="mailto:support@amtechnologies.com"
                className="text-primary hover:underline font-[var(--font-weight-medium)]"
              >
                support@amtechnologies.com
              </a>
            </p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="text-center mt-6">
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-weight-normal)',
            }}
            className="text-white/90 drop-shadow-lg"
          >
            &copy; 2026 AM Technologies. All rights reserved.
          </p>
        </div>
      </div>

      {/* Forgot Password Form */}
      {showForgotPassword && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-card/95 backdrop-blur-sm rounded-[var(--radius-card)] shadow-[var(--elevation-lg)] p-8 border border-border/50 w-full max-w-md mx-4">
            <h2
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'var(--section-heading-size)',
                fontWeight: 'var(--section-heading-weight)',
              }}
              className="text-foreground mb-4"
            >
              Reset Password
            </h2>
            <form onSubmit={handleForgotPassword} className="space-y-5">
              {/* Error Message */}
              {error && (
                <div
                  className="rounded-[var(--radius)] border border-[#B91C1C] bg-[#FDECEC] p-3 text-center text-[#7F1D1D]"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                  }}
                >
                  {error}
                </div>
              )}

              {/* Reset Email Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="resetEmail"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                  }}
                  className="text-foreground block"
                >
                  Email
                </label>
                <input
                  id="resetEmail"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => {
                    setResetEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your email"
                  required
                  className={cn(
                    'w-full h-10 px-3 border rounded-[var(--radius-input)] bg-input-background text-foreground outline-none transition-all',
                    error ? 'border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/50' : 'border-border focus:ring-2 focus:ring-ring/50 focus:border-ring'
                  )}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-normal)',
                  }}
                />
              </div>

              {/* Reset Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  'w-full h-10 rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white transition-colors shadow-sm',
                  isLoading && 'opacity-70 cursor-not-allowed'
                )}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                }}
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>

            {/* Success Message */}
            {resetSuccess && (
              <div
                className="mt-4 rounded-[var(--radius)] border border-[#047857] bg-[#E7F6EF] p-3 text-center text-[#064E3B]"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
              >
                A password reset link has been sent to your email.
              </div>
            )}

            {/* Back to Login */}
            <div className="mt-4 text-center">
              <button
                type="button"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
                className="text-primary hover:underline"
                onClick={() => setShowForgotPassword(false)}
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const oldSystemScreens = [
  {
    src: '/old-system/add-employee.png',
    title: 'Dense employee forms',
    desc: 'Long two-column forms made scanning difficult and increased the chance of missed required fields.',
  },
  {
    src: '/old-system/find-employees.png',
    title: 'Search-heavy flows',
    desc: 'Employees and HR teams had to search and move through several screens before taking action.',
  },
  {
    src: '/old-system/search-vacations.png',
    title: 'Vacation requests split across pages',
    desc: 'Submitting or tracking leave required separate search and export screens.',
  },
  {
    src: '/old-system/mission-form.png',
    title: 'Mission submission friction',
    desc: 'A mission request required multiple fields and disconnected approval context.',
  },
  {
    src: '/old-system/mission-approver.png',
    title: 'Approver setup complexity',
    desc: 'Approver management depended on manual lookup and form-heavy setup.',
  },
  {
    src: '/old-system/approval-list.png',
    title: 'Unclear support messaging',
    desc: 'Critical notes were visually loud but not structured for quick comprehension.',
  },
];

const InfoPage: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="min-h-screen bg-background text-foreground">
    <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-[var(--radius-button)] border border-border bg-card px-3 py-2 text-[var(--text-sm)] font-[var(--font-weight-medium)] text-foreground transition-colors hover:bg-muted"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </button>
        <span className="text-[var(--text-xs)] font-[var(--font-weight-semibold)] uppercase tracking-[0.08em] text-muted-foreground">
          HR tool case study
        </span>
      </div>
    </header>

    <main className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-5">
          <p className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] uppercase tracking-[0.08em] text-accent">
            Employee self-service redesign
          </p>
          <h1
            className="text-foreground"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 'clamp(2rem, 6vw, 4.25rem)',
              fontWeight: 'var(--font-weight-semibold)',
              lineHeight: 1.05,
            }}
          >
            Making leave, mission, and document workflows easier to complete.
          </h1>
          <p className="max-w-3xl text-[var(--text-base)] leading-7 text-muted-foreground">
            This demo is a privacy-safe version of a real HR workflow redesign. It shows how employee requests can move from scattered legacy screens into a clearer, accessible, responsive experience that works for employees, managers, and HR teams.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {['Fewer steps to submit', 'Clearer request status', 'Reusable across organizations'].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-[var(--radius-card)] border border-border bg-card p-3 shadow-[var(--elevation-sm)]">
                <CheckCircle className="h-4 w-4 shrink-0 text-accent" />
                <span className="text-[var(--text-sm)] font-[var(--font-weight-medium)]">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[var(--radius-card)] border border-border bg-card p-4 shadow-[var(--elevation-lg)]">
          <div className="rounded-[var(--radius)] bg-muted/40 p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[var(--text-xs)] font-[var(--font-weight-semibold)] uppercase tracking-[0.08em] text-muted-foreground">Current design</p>
                <h2 className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]">Request Mission</h2>
              </div>
              <span className="rounded-full border border-[#047857] bg-[#E7F6EF] px-3 py-1 text-[var(--text-xs)] font-[var(--font-weight-semibold)] text-[#064E3B]">Accessible</span>
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
              <button className="h-10 rounded-[var(--radius-button)] bg-accent text-accent-foreground text-[var(--text-sm)] font-[var(--font-weight-semibold)]">
                Submit Mission
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ['Audience', 'Employees submitting leave, sick notes, missions, and documents. HR and managers reviewing requests and records.'],
          ['Contribution', 'UX analysis, workflow simplification, accessible UI direction, responsive interaction patterns, and privacy-safe prototype adaptation.'],
          ['Outcome', 'A clearer self-service experience that reduces navigation, improves status visibility, and can be adapted for other organizations.'],
        ].map(([title, body]) => (
          <article key={title} className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--elevation-sm)]">
            <h2 className="text-[var(--text-base)] font-[var(--font-weight-semibold)]">{title}</h2>
            <p className="mt-2 text-[var(--text-sm)] leading-6 text-muted-foreground">{body}</p>
          </article>
        ))}
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] uppercase tracking-[0.08em] text-accent">Before</p>
          <h2 className="text-[var(--text-xl)] font-[var(--font-weight-semibold)]">Old system pain points</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {oldSystemScreens.map((screen) => (
            <article key={screen.src} className="overflow-hidden rounded-[var(--radius-card)] border border-border bg-card shadow-[var(--elevation-sm)]">
              <img src={screen.src} alt={screen.title} className="aspect-[4/3] w-full object-cover object-top" />
              <div className="space-y-1 p-4">
                <h3 className="text-[var(--text-sm)] font-[var(--font-weight-semibold)]">{screen.title}</h3>
                <p className="text-[var(--text-xs)] leading-5 text-muted-foreground">{screen.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--elevation-sm)]">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] uppercase tracking-[0.08em] text-accent">After</p>
            <h2 className="mt-2 text-[var(--text-xl)] font-[var(--font-weight-semibold)]">A focused, privacy-safe version of the real workflow</h2>
            <p className="mt-3 text-[var(--text-sm)] leading-6 text-muted-foreground">
              The new design groups related tasks, keeps request actions close to the employee context, uses readable status badges, supports document upload testing, and makes mobile layouts a first-class experience.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {['Submit vacation faster', 'Upload sick leave notes in context', 'Review approvals with readable statuses', 'Use the same pattern on mobile'].map((item) => (
              <div key={item} className="rounded-[var(--radius-input)] border border-border bg-muted/30 p-4">
                <CheckCircle className="mb-2 h-5 w-5 text-accent" />
                <p className="text-[var(--text-sm)] font-[var(--font-weight-semibold)]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  </div>
);
