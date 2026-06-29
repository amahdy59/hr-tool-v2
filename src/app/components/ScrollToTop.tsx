import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ScrollToTopProps {
  scrollContainerRef: React.RefObject<HTMLElement>;
}

export const ScrollToTop: React.FC<ScrollToTopProps> = ({ scrollContainerRef }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const { i18n } = useTranslation();

  const isArabic = i18n.resolvedLanguage === 'ar' || i18n.language.startsWith('ar');

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const toggleVisibility = () => {
      setIsVisible(scrollContainer.scrollTop > 300);
    };

    toggleVisibility();
    scrollContainer.addEventListener('scroll', toggleVisibility, { passive: true });

    return () => {
      scrollContainer.removeEventListener('scroll', toggleVisibility);
    };
  }, [scrollContainerRef]);

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <nav
      aria-label={isArabic ? "العودة إلى الأعلى" : "Back to top"}
      className={`fixed bottom-24 z-50 transition-all duration-300 transform end-5 rtl:end-12 sm:bottom-8 sm:end-8 sm:rtl:end-16 ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
      }`}
    >
      <button
        onClick={scrollToTop}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className="group w-12 h-12 rounded-full bg-primary/20 backdrop-blur-md hover:bg-primary/30 border-2 border-primary/40 hover:border-primary/60 text-primary flex items-center justify-center shadow-[var(--elevation-lg)] transition-all duration-300 cursor-pointer hover:scale-110 focus-visible:ring-4 focus-visible:ring-primary/50 focus-visible:outline-none"
        aria-label={isArabic ? "العودة إلى الأعلى" : "Scroll to top"}
        style={{
          fontFamily: isArabic ? "'Cairo', sans-serif" : "'Inter', sans-serif",
        }}
      >
        <ArrowUp className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-1 group-focus-visible:-translate-y-1" strokeWidth={2.5} />
      </button>
      
      {/* Tooltip */}
      {showTooltip && (
        <div 
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-foreground text-background text-[var(--text-xs)] font-[var(--font-weight-medium)] rounded-[var(--radius-sm)] shadow-[var(--elevation-md)] whitespace-nowrap animate-fadeIn z-50"
          style={{
            fontFamily: isArabic ? "'Cairo', sans-serif" : "'Inter', sans-serif",
          }}
        >
          {isArabic ? "العودة إلى الأعلى" : "Back to top"}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground" />
        </div>
      )}
    </nav>
  );
};
