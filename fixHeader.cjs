const fs = require('fs');
const path = require('path');

const headerPath = path.join(__dirname, 'src/app/components/Header.tsx');
let headerContent = fs.readFileSync(headerPath, 'utf8');

// Add state for menu
if (!headerContent.includes('const [isMenuOpen, setIsMenuOpen]')) {
  headerContent = headerContent.replace(
    'export const Header: React.FC<HeaderProps> = ({ currentUser, accessibility, onOpenCommandPalette, onOpenShortcuts, activeTab, setActiveTab, onLogout }) => {',
    'export const Header: React.FC<HeaderProps> = ({ currentUser, accessibility, onOpenCommandPalette, onOpenShortcuts, activeTab, setActiveTab, onLogout }) => {\n  const [isMenuOpen, setIsMenuOpen] = React.useState(false);'
  );
}

// Modify the Sheet and hamburger button
const oldSheet = `<Sheet>
          <SheetTrigger asChild>
            <button
              className="group lg:hidden flex items-center justify-center w-11 h-11 border border-border bg-card shadow-sm rounded-[var(--radius-button)] hover:bg-muted text-foreground transition-all duration-300 cursor-pointer relative overflow-hidden"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5 transition-all duration-300 absolute group-data-[state=open]:rotate-90 group-data-[state=open]:scale-50 group-data-[state=open]:opacity-0" />
              <X className="w-5 h-5 transition-all duration-300 absolute -rotate-90 scale-50 opacity-0 group-data-[state=open]:rotate-0 group-data-[state=open]:scale-100 group-data-[state=open]:opacity-100" />
            </button>
          </SheetTrigger>`;

const newSheet = `
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="group lg:hidden flex items-center justify-center w-11 h-11 border border-border bg-card shadow-sm rounded-[var(--radius-button)] hover:bg-muted text-foreground transition-all duration-300 cursor-pointer relative overflow-hidden z-[70]"
            aria-label="Toggle navigation menu"
            data-state={isMenuOpen ? "open" : "closed"}
          >
            <Menu className="w-5 h-5 transition-all duration-300 absolute group-data-[state=open]:rotate-90 group-data-[state=open]:scale-50 group-data-[state=open]:opacity-0" />
            <X className="w-5 h-5 transition-all duration-300 absolute -rotate-90 scale-50 opacity-0 group-data-[state=open]:rotate-0 group-data-[state=open]:scale-100 group-data-[state=open]:opacity-100" />
          </button>
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen} modal={false}>`;

headerContent = headerContent.replace(oldSheet, newSheet);

// Also change the bottom of the Sheet to remove the duplicate AccessibilityPanel inside the sheet since it will be in the top toolbar.
const oldSheetBottom = `            {/* Bottom Actions (Settings/Logout) */}
            <div className="border-t border-border pt-4 mt-auto space-y-2">
              <div className="px-3">
                <AccessibilityPanel settings={accessibility} />
              </div>
              
              {onLogout && (`;

const newSheetBottom = `            {/* Bottom Actions (Settings/Logout) */}
            <div className="border-t border-border pt-4 mt-auto space-y-2">
              {onLogout && (`;

headerContent = headerContent.replace(oldSheetBottom, newSheetBottom);

// Make the top toolbar icons visible on mobile
headerContent = headerContent.replace(
  'className="hidden lg:flex w-9 h-9 items-center justify-center rounded-md border border-border bg-muted/50 text-muted-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"',
  'className="flex w-9 h-9 items-center justify-center rounded-md border border-border bg-muted/50 text-muted-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"'
);

headerContent = headerContent.replace(
  '<div className="hidden sm:block">\n          <AccessibilityPanel settings={accessibility} />\n        </div>',
  '<div>\n          <AccessibilityPanel settings={accessibility} />\n        </div>'
);

fs.writeFileSync(headerPath, headerContent);
console.log('Header updated.');
