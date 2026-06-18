import React, { useState } from 'react';
import { Eye, EyeOff, Info, KeyRound, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AccessibilityPanel, AccessibilitySettings } from './AccessibilityPanel';
import { RedesignInfoPage } from './RedesignInfoPage';

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
    return <RedesignInfoPage onBack={() => setShowInfoPage(false)} />;
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
                fontSize: '26px',
                fontWeight: 700,
                letterSpacing: '0.04em',
              }}
              className="text-primary mb-1"
            >
              HR Tool
            </div>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-weight-normal)',
              }}
              className="text-muted-foreground mb-5"
            >
              Workforce management, simplified.
            </p>
            <button
              type="button"
              onClick={() => setShowInfoPage(true)}
              className="inline-flex items-center gap-2 rounded-[var(--radius-button)] border border-border bg-card px-3 py-1.5 text-[var(--text-sm)] font-[var(--font-weight-medium)] text-primary shadow-[var(--elevation-sm)] transition-colors hover:bg-muted"
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
              <div
                className="rounded-[var(--radius-card)] border-2 border-dashed border-[#C2410C]/40 bg-[#FFF8EE] p-4 space-y-3"
                role="region"
                aria-labelledby="demo-access-heading"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius)] bg-[#FDECC8]">
                    <KeyRound className="h-4 w-4 text-[#C2410C]" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <h2
                      id="demo-access-heading"
                      className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-[#7C2D12]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Demo access
                    </h2>
                    <p
                      className="text-[var(--text-xs)] leading-5 text-[#9A3412]/90"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      This is a prototype for reviewers. No account or password is required — continue with sample employee data.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleQuickLogin}
                  aria-label="Continue to the HR tool demo with sample data"
                  className={cn(
                    'relative flex h-10 w-full items-center justify-center gap-2 overflow-hidden rounded-[var(--radius-button)] border-2 border-[#C2410C] bg-[#FFF4DE] text-[#7C2D12] shadow-sm transition-all hover:bg-[#FDECC8] group'
                  )}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" aria-hidden="true" />
                  <Zap className="h-4 w-4 transition-transform group-hover:scale-110" aria-hidden="true" />
                  <span>Continue to demo</span>
                </button>

                <p
                  className="flex items-center justify-center gap-1.5 text-[var(--text-xs)] text-[#9A3412]/80"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>Privacy-safe sample data only</span>
                </p>
              </div>
            )}
          </form>


        </div>

        {/* Bottom Footer */}
        <div className="text-center mt-4">
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-weight-normal)',
            }}
            className="text-white/70 drop-shadow-lg"
          >
            All rights reserved. Ahmed Mahdy's redesign.
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
