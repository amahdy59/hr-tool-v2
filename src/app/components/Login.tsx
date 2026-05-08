import React, { useState } from 'react';
import { Eye, EyeOff, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoginProps {
  onLogin: (email: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
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
    onLogin('ahmed.mahdy@advansys-is.com');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
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
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div
                className="p-3 rounded-[var(--radius)] bg-destructive/10 border border-destructive/30 text-destructive text-center"
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
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
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
                />
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-normal)',
                  }}
                  className="text-foreground"
                >
                  Remember me
                </span>
              </label>
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
                    'w-full h-10 rounded-[var(--radius-button)] bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-700 dark:text-yellow-400 border-2 border-yellow-500/50 transition-all shadow-sm flex items-center justify-center gap-2 group relative overflow-hidden'
                  )}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/10 to-yellow-500/0 animate-shimmer" />
                  <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Enter without credentials</span>
                </button>
                
                <div className="flex items-center justify-center gap-1.5 text-[var(--text-xs)] text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
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
                  className="p-3 rounded-[var(--radius)] bg-destructive/10 border border-destructive/30 text-destructive text-center"
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
                className="p-3 rounded-[var(--radius)] bg-success/10 border border-success/30 text-success text-center mt-4"
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
