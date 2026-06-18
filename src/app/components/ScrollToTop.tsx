import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

interface ScrollToTopProps {
  scrollContainerRef: React.RefObject<HTMLElement>;
}

export const ScrollToTop: React.FC<ScrollToTopProps> = ({ scrollContainerRef }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

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
    <>
      {isVisible && (
        <div className="fixed bottom-8 end-8 z-50">
          <button
            onClick={scrollToTop}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="w-12 h-12 rounded-full bg-primary/20 backdrop-blur-md hover:bg-primary/30 border-2 border-primary/40 hover:border-primary/60 text-primary flex items-center justify-center shadow-[var(--elevation-lg)] transition-all duration-300 cursor-pointer hover:scale-110"
            aria-label="Scroll to top"
            style={{
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
          </button>
          
          {/* Tooltip */}
          {showTooltip && (
            <div 
              className="absolute bottom-full end-0 mb-2 px-3 py-1.5 bg-foreground text-background text-[var(--text-xs)] font-[var(--font-weight-medium)] rounded-[var(--radius-sm)] shadow-[var(--elevation-md)] whitespace-nowrap animate-fadeIn"
              style={{
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Back to top
              <div className="absolute top-full end-4 w-0 h-0 border-s-4 border-e-4 border-t-4 border-transparent border-t-foreground" />
            </div>
          )}
        </div>
      )}
    </>
  );
};
