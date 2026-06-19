const fs = require('fs');
const path = require('path');

const headerPath = path.join(__dirname, 'src/app/components/Header.tsx');
let headerContent = fs.readFileSync(headerPath, 'utf8');

headerContent = headerContent.replace(
  '<div className="hidden sm:block">\n          <AccessibilityPanel settings={accessibility} />\n        </div>',
  '<div>\n          <AccessibilityPanel settings={accessibility} />\n        </div>'
);

headerContent = headerContent.replace(
  `            {/* Bottom Actions (Settings/Logout) */}
            <div className="border-t border-border pt-4 mt-auto space-y-2">
              <div className="px-3">
                <AccessibilityPanel settings={accessibility} />
              </div>
              
              {onLogout && (`,
  `            {/* Bottom Actions (Settings/Logout) */}
            <div className="border-t border-border pt-4 mt-auto space-y-2">
              {onLogout && (`
);

fs.writeFileSync(headerPath, headerContent);
console.log('Header updated.');
