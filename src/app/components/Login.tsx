import React, { useState } from 'react';
import { Eye, EyeOff, Info, KeyRound, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AccessibilityPanel, AccessibilitySettings } from './AccessibilityPanel';
import { RedesignInfoPage } from './RedesignInfoPage';
import { useTranslation } from 'react-i18next';

interface LoginProps {
  onLogin: (email: string) => void;
  accessibility: AccessibilitySettings;
}

export const Login: React.FC<LoginProps> = ({ onLogin, accessibility }) => {
  const { t } = useTranslation();
  const loginHeadingId = React.useId();
  const usernameId = React.useId();
  const passwordId = React.useId();
  const rememberMeId = React.useId();
  const loginErrorId = React.useId();
  const usernameHintId = React.useId();
  const passwordHintId = React.useId();
  const resetEmailId = React.useId();
  const resetErrorId = React.useId();
  const resetHintId = React.useId();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [errorField, setErrorField] = useState<'username' | 'password' | 'resetEmail' | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showInfoPage, setShowInfoPage] = useState(false);
  const showTempLogin = true;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setErrorField('');
    setIsLoading(true);

    // Simulate a small delay for better UX
    setTimeout(() => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!emailRegex.test(username)) {
        setError(t('login.errors.invalidWorkEmail'));
        setErrorField('username');
        setIsLoading(false);
      } else if (password === '123456') {
        onLogin(username);
      } else {
        setError(t('login.errors.incorrectPassword'));
        setErrorField('password');
        setIsLoading(false);
      }
    }, 600);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setErrorField('');
    setIsLoading(true);

    // Simulate a small delay for better UX
    setTimeout(() => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (emailRegex.test(resetEmail)) {
        setResetSuccess(true);
        setIsLoading(false);
      } else {
        setError(t('login.errors.invalidResetEmail'));
        setErrorField('resetEmail');
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
    <div className="min-h-[100dvh] flex items-center justify-center relative overflow-hidden bg-background">
      {/* Animated Gradient Background */}
      <div className="hidden sm:block absolute inset-0 bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab]">
        {/* Animated overlay gradients */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -start-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute top-0 -end-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 start-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
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
      <div className="hidden sm:block absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 start-1/4 w-2 h-2 bg-white/20 rounded-full animate-float" />
        <div className="absolute top-1/3 end-1/4 w-3 h-3 bg-white/10 rounded-full animate-float animation-delay-1000" />
        <div className="absolute bottom-1/4 start-1/3 w-2 h-2 bg-white/15 rounded-full animate-float animation-delay-2000" />
        <div className="absolute top-2/3 end-1/3 w-2 h-2 bg-white/20 rounded-full animate-float animation-delay-3000" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full h-[100dvh] sm:h-auto sm:max-w-md sm:mx-4 flex flex-col justify-center max-sm:w-full bg-card sm:bg-transparent">
        <div className="bg-card sm:bg-card/95 sm:backdrop-blur-sm sm:shadow-[var(--elevation-lg)] h-full sm:h-auto w-full flex flex-col justify-center p-6 sm:p-8 rounded-none border-0 sm:rounded-[var(--radius-card)] sm:border border-border/50">
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
              {t('login.appName')}
            </div>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-weight-normal)',
              }}
              className="text-muted-foreground mb-5"
            >
              {t('login.tagline')}
            </p>
            <div className="grid grid-cols-[auto_auto] items-stretch justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowInfoPage(true)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[var(--radius-button)] border border-border bg-card px-4 text-[var(--text-sm)] font-[var(--font-weight-medium)] text-primary shadow-[var(--elevation-sm)] transition-colors hover:bg-muted"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <Info className="w-4 h-4" />
                {t('login.aboutRedesign')}
              </button>
              <div className="inline-flex h-11 items-stretch">
                <AccessibilityPanel settings={accessibility} />
              </div>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5" aria-labelledby={loginHeadingId} noValidate>
            <h1 id={loginHeadingId} className="sr-only">{t('login.signInHeading')}</h1>
            {/* Error Message */}
            {error && (
              <div
                id={loginErrorId}
                role="alert"
                aria-live="assertive"
                className="rounded-[var(--radius)] border-2 border-[#B91C1C] bg-[#FDECEC] p-3 text-start text-[#7F1D1D]"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
              >
                <p>{error}</p>
                {errorField && errorField !== 'resetEmail' && (
                  <a
                    href={`#${errorField === 'username' ? usernameId : passwordId}`}
                    className="mt-2 inline-flex min-h-11 items-center text-[#7F1D1D] underline"
                  >
                    {t('login.errors.goToField', {
                      field: errorField === 'username' ? t('login.errors.emailField') : t('login.errors.passwordField'),
                    })}
                  </a>
                )}
              </div>
            )}

            {/* Username Field */}
            <div className="space-y-1">
              <label
                htmlFor={usernameId}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
                className="text-foreground block"
              >
                {t('login.email')}
              </label>
              <input
                id={usernameId}
                type="email"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                  setErrorField('');
                }}
                placeholder={t('login.emailPlaceholder')}
                required
                aria-required="true"
                aria-invalid={errorField === 'username'}
                aria-describedby={[usernameHintId, errorField === 'username' ? loginErrorId : undefined].filter(Boolean).join(' ') || undefined}
                autoComplete="email"
                inputMode="email"
                className={cn(
                  'w-full min-h-[44px] px-3 border rounded-[var(--radius-input)] bg-input-background text-foreground outline-none transition-all',
                  errorField === 'username' ? 'border-destructive focus:border-destructive focus:ring-4 focus:ring-destructive/30' : 'border-border focus:ring-4 focus:ring-ring/40 focus:border-ring'
                )}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-normal)',
                }}
              />
              <p id={usernameHintId} className="text-[var(--text-xs)] text-muted-foreground">
                {t('login.emailHint')}
              </p>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label
                htmlFor={passwordId}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
                className="text-foreground block"
              >
                {t('login.password')}
              </label>
              <div className="relative">
                <input
                  id={passwordId}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                    setErrorField('');
                  }}
                  placeholder={t('login.passwordPlaceholder')}
                  required
                  aria-required="true"
                  aria-invalid={errorField === 'password'}
                  aria-describedby={[passwordHintId, errorField === 'password' ? loginErrorId : undefined].filter(Boolean).join(' ') || undefined}
                  autoComplete="current-password"
                  className={cn(
                    'w-full min-h-[44px] px-3 pe-12 border rounded-[var(--radius-input)] bg-input-background text-foreground outline-none transition-all',
                    errorField === 'password' ? 'border-destructive focus:border-destructive focus:ring-4 focus:ring-destructive/30' : 'border-border focus:ring-4 focus:ring-ring/40 focus:border-ring'
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
                  aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
                  className="absolute end-1 top-1/2 min-h-11 min-w-11 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p id={passwordHintId} className="text-[var(--text-xs)] text-muted-foreground">
                {t('login.passwordHint')}
              </p>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={rememberMeId}
                  className="h-5 w-5 rounded border-border accent-primary cursor-pointer"
                />
                <label
                  htmlFor={rememberMeId}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-normal)',
                  }}
                  className="text-foreground cursor-pointer"
                >
                  {t('login.rememberMe')}
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
                onClick={() => {
                  setError('');
                  setErrorField('');
                  setResetSuccess(false);
                  setShowForgotPassword(true);
                }}
              >
                {t('login.forgotPassword')}
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                'w-full min-h-[44px] rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white transition-colors shadow-sm',
                isLoading && 'opacity-70 cursor-not-allowed'
              )}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semibold)',
              }}
            >
              {isLoading ? t('login.signingIn') : t('login.signIn')}
            </button>

            {showTempLogin && (
              <div
                className="rounded-[var(--radius-card)] border-2 border-dashed border-[#C2410C]/60 bg-[#FFF8EE] p-4 flex flex-col items-center justify-center gap-3 dark:border-[#FACC15] dark:bg-[#2A1B07]"
                role="region"
                aria-labelledby="demo-access-heading"
              >
                <div className="flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-[#C2410C] dark:text-[#FACC15]" aria-hidden="true" />
                  <h2
                    id="demo-access-heading"
                    className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-[#7C2D12] dark:text-[#FEF3C7]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {t('login.demoAccess')}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={handleQuickLogin}
                  aria-label={t('login.continueToDemo')}
                  className={cn(
                    'relative flex min-h-[44px] w-full items-center justify-center gap-2 overflow-hidden rounded-[var(--radius-button)] border-2 border-[#C2410C] bg-[#FFF4DE] text-[#7C2D12] shadow-sm transition-all hover:bg-[#FDECC8] group dark:border-[#FACC15] dark:bg-[#3A2608] dark:text-[#FEF3C7] dark:hover:bg-[#4A310A]'
                  )}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                  }}
                >
                  <Zap className="h-4 w-4 transition-transform group-hover:scale-110" aria-hidden="true" />
                  <span>{t('login.quickLogin')}</span>
                </button>
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
            {t('login.footer')}
          </p>
        </div>
      </div>

      {/* Forgot Password Form */}
      {showForgotPassword && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card/95 backdrop-blur-sm shadow-[var(--elevation-lg)] border border-border/50 w-full h-full sm:h-auto sm:max-w-md sm:mx-4 p-6 sm:p-8 rounded-none sm:rounded-[var(--radius-card)] border-0 sm:border flex flex-col justify-center">
            <h2
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'var(--section-heading-size)',
                fontWeight: 'var(--section-heading-weight)',
              }}
              className="text-foreground mb-4"
            >
              {t('login.resetPassword')}
            </h2>
            <form onSubmit={handleForgotPassword} className="space-y-5" noValidate>
              {/* Error Message */}
              {error && (
                <div
                  id={resetErrorId}
                  role="alert"
                  aria-live="assertive"
                  className="rounded-[var(--radius)] border-2 border-[#B91C1C] bg-[#FDECEC] p-3 text-start text-[#7F1D1D]"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                  }}
                >
                  <p>{error}</p>
                  <a href={`#${resetEmailId}`} className="mt-2 inline-flex min-h-11 items-center text-[#7F1D1D] underline">
                    {t('login.errors.goToField', { field: t('login.errors.emailField') })}
                  </a>
                </div>
              )}

              {/* Reset Email Field */}
              <div className="space-y-1">
                <label
                  htmlFor={resetEmailId}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                  }}
                  className="text-foreground block"
                >
                  {t('login.email')}
                </label>
                <input
                  id={resetEmailId}
                  type="email"
                  value={resetEmail}
                  onChange={(e) => {
                    setResetEmail(e.target.value);
                    setError('');
                    setErrorField('');
                  }}
                  placeholder={t('login.resetEmailPlaceholder')}
                  required
                  aria-required="true"
                  aria-invalid={errorField === 'resetEmail'}
                  aria-describedby={[resetHintId, errorField === 'resetEmail' ? resetErrorId : undefined].filter(Boolean).join(' ') || undefined}
                  autoComplete="email"
                  inputMode="email"
                  className={cn(
                    'w-full min-h-[44px] px-3 border rounded-[var(--radius-input)] bg-input-background text-foreground outline-none transition-all',
                    errorField === 'resetEmail' ? 'border-destructive focus:border-destructive focus:ring-4 focus:ring-destructive/30' : 'border-border focus:ring-4 focus:ring-ring/40 focus:border-ring'
                  )}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-normal)',
                  }}
                />
                <p id={resetHintId} className="text-[var(--text-xs)] text-muted-foreground">
                  {t('login.resetEmailHint')}
                </p>
              </div>

              {/* Reset Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  'w-full min-h-[44px] rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white transition-colors shadow-sm',
                  isLoading && 'opacity-70 cursor-not-allowed'
                )}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                }}
              >
                {isLoading ? t('login.resetPasswordLoading') : t('login.resetPassword')}
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
                {t('login.resetSuccess')}
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
                onClick={() => {
                  setError('');
                  setErrorField('');
                  setShowForgotPassword(false);
                }}
              >
                {t('login.backToLogin')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
