import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      const isArabic = typeof document !== 'undefined' && document.documentElement.lang === 'ar';
      
      const title = isArabic ? 'عذرًا! حدث خطأ ما.' : 'Oops! Something went wrong.';
      const desc = isArabic 
        ? 'نأسف، ولكن حدث خطأ غير متوقع أثناء تحميل هذه الصفحة. تم إخطار فريقنا.'
        : "We're sorry, but an unexpected error occurred while loading this page. Our team has been notified.";
      const reloadBtn = isArabic ? 'إعادة تحميل الصفحة' : 'Reload Page';

      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4 text-foreground" role="alert" aria-relevant="all">
          <div className="max-w-md w-full text-center space-y-6 bg-card p-8 rounded-[var(--radius-card)] border border-border shadow-xl">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8" aria-hidden="true" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 style={{ fontFamily: "'Inter', sans-serif" }} className="text-2xl font-bold tracking-tight text-foreground">
                {title}
              </h1>
              <p className="text-muted-foreground text-[var(--text-sm)]">
                {desc}
              </p>
            </div>

            {this.state.error && (
              <div className="bg-muted p-4 rounded-lg text-left overflow-x-auto text-xs font-mono text-muted-foreground border border-border/50" dir="ltr">
                {this.state.error.message}
              </div>
            )}

            <Button 
              onClick={this.handleReload}
              className="w-full flex items-center justify-center gap-2"
              aria-label={reloadBtn}
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              {reloadBtn}
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

