const fs = require('fs');
const path = require('path');

// 1. Fix AccessibilityPanel.tsx
const a11yPath = path.join(__dirname, 'src/app/components/AccessibilityPanel.tsx');
let a11yContent = fs.readFileSync(a11yPath, 'utf8');

a11yContent = a11yContent.replace(
  'className="w-full sm:w-80 p-5 rounded-none sm:rounded-[var(--radius-card)] border-0 sm:border border-border bg-card shadow-[var(--elevation-lg)]"',
  'className="w-[calc(100vw-2rem)] max-w-xs sm:w-80 p-5 rounded-none sm:rounded-[var(--radius-card)] border-0 sm:border border-border bg-card shadow-[var(--elevation-lg)]"'
);
fs.writeFileSync(a11yPath, a11yContent);

// 2. Fix Header.tsx
const headerPath = path.join(__dirname, 'src/app/components/Header.tsx');
let headerContent = fs.readFileSync(headerPath, 'utf8');

// Remove state
headerContent = headerContent.replace(
  'export const Header: React.FC<HeaderProps> = ({ currentUser, accessibility, onOpenCommandPalette, onOpenShortcuts, activeTab, setActiveTab, onLogout }) => {\n  const [isMenuOpen, setIsMenuOpen] = React.useState(false);',
  'export const Header: React.FC<HeaderProps> = ({ currentUser, accessibility, onOpenCommandPalette, onOpenShortcuts, activeTab, setActiveTab, onLogout }) => {'
);

// Restore SheetTrigger
const oldSheet = `<button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="group lg:hidden flex items-center justify-center w-11 h-11 border border-border bg-card shadow-sm rounded-[var(--radius-button)] hover:bg-muted text-foreground transition-all duration-300 cursor-pointer relative overflow-hidden z-[70]"
            aria-label="Toggle navigation menu"
            data-state={isMenuOpen ? "open" : "closed"}
          >
            <Menu className="w-5 h-5 transition-all duration-300 absolute group-data-[state=open]:rotate-90 group-data-[state=open]:scale-50 group-data-[state=open]:opacity-0" />
            <X className="w-5 h-5 transition-all duration-300 absolute -rotate-90 scale-50 opacity-0 group-data-[state=open]:rotate-0 group-data-[state=open]:scale-100 group-data-[state=open]:opacity-100" />
          </button>
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen} modal={false}>`;

const newSheet = `<Sheet modal={false}>
          <SheetTrigger asChild>
            <button
              className="group lg:hidden flex items-center justify-center w-11 h-11 border border-border bg-card shadow-sm rounded-[var(--radius-button)] hover:bg-muted text-foreground transition-all duration-300 cursor-pointer relative overflow-hidden z-[70]"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5 transition-all duration-300 absolute group-data-[state=open]:rotate-90 group-data-[state=open]:scale-50 group-data-[state=open]:opacity-0" />
              <X className="w-5 h-5 transition-all duration-300 absolute -rotate-90 scale-50 opacity-0 group-data-[state=open]:rotate-0 group-data-[state=open]:scale-100 group-data-[state=open]:opacity-100" />
            </button>
          </SheetTrigger>`;

headerContent = headerContent.replace(oldSheet, newSheet);

// Hide keyboard shortcuts on mobile
headerContent = headerContent.replace(
  '<button\n          onClick={onOpenShortcuts}\n          className="flex w-9 h-9 items-center justify-center rounded-md border border-border bg-muted/50 text-muted-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"',
  '<button\n          onClick={onOpenShortcuts}\n          className="hidden lg:flex w-9 h-9 items-center justify-center rounded-md border border-border bg-muted/50 text-muted-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"'
);

fs.writeFileSync(headerPath, headerContent);
console.log('Fixed accessibility and header.');
