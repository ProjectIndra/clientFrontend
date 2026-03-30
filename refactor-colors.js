const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const replacements = [
  // Text colors
  { regex: /text-gray-(800|900)(\s|'|"|`)/g, replacement: 'text-palette-textPrimary$2' },
  { regex: /text-\[\#0D0D0D\](\s|'|"|`)/g, replacement: 'text-palette-text0d$1' },
  { regex: /text-gray-(600|700)(\s|'|"|`)/g, replacement: 'text-palette-textSecondary$2' },
  { regex: /text-gray-(400|500)(\s|'|"|`)/g, replacement: 'text-palette-textMuted$2' },
  { regex: /text-\[\#0a1d39\](\s|'|"|`)/g, replacement: 'text-palette-brand0a$1' },

  // Background colors
  { regex: /bg-white(\s|'|"|`)/g, replacement: 'bg-palette-surface$1' },
  { regex: /bg-gray-50(\s|'|"|`)/g, replacement: 'bg-palette-wrapper$1' },
  { regex: /bg-\[\#F6F9FC\](\s|'|"|`)/g, replacement: 'bg-palette-bgf6$1' },
  { regex: /bg-\[\#f8f7fe\](\s|'|"|`)/g, replacement: 'bg-palette-bgf8$1' },
  { regex: /bg-\[\#0D0D0D\](\s|'|"|`)/g, replacement: 'bg-palette-bg0d$1' },
  { regex: /bg-\[\#0a1d39\](\s|'|"|`)/g, replacement: 'bg-palette-brand0a$1' },
  { regex: /bg-\[\#f9f9f9\](\s|'|"|`)/g, replacement: 'bg-palette-wrapper$1' },
  { regex: /bg-gray-(100|200|300)(\s|'|"|`)/g, replacement: 'bg-palette-surfaceMuted$2' },

  // Border colors
  { regex: /border-gray-(100|200|300)(\s|'|"|`)/g, replacement: 'border-palette-border$2' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      replacements.forEach(({ regex, replacement }) => {
        content = content.replace(regex, replacement);
      });

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory(directoryPath);
console.log('Done refactoring colors!');
