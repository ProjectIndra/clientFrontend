const fs = require('fs');
const path = require('path');

// Configuration: Folders to scan and file extensions to look for
const SCAN_DIRS = ['./src'];
const FILE_EXTENSIONS = ['.jsx', '.tsx', '.js', '.ts', '.html'];

// Regex patterns: 
// 1. Matches hex codes inside arbitrary brackets like bg-[#ffffff]
// 2. Matches common Tailwind color names like text-red-500, bg-lime-200
const HEX_REGEX = /#([A-Fa-f0-9]{3,6})/g;
const TW_COLOR_REGEX = /(?:bg|text|border|ring|fill|stroke)-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone)-\d{2,3}/g;

function scanFiles(dir) {
	const files = fs.readdirSync(dir);

	files.forEach(file => {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory()) {
			scanFiles(filePath);
		} else if (FILE_EXTENSIONS.includes(path.extname(filePath))) {
			const content = fs.readFileSync(filePath, 'utf8');
			const lines = content.split('\n');

			lines.forEach((line, index) => {
				const hexMatches = line.match(HEX_REGEX) || [];
				const twMatches = line.match(TW_COLOR_REGEX) || [];
				const allMatches = [...new Set([...hexMatches, ...twMatches])];

				if (allMatches.length > 0) {
					console.log(`File: ${filePath} | Line: ${index + 1}`);
					console.log(`   Colors: ${allMatches.join(', ')}`);
					console.log('---');
				}
			});
		}
	});
}

console.log('--- Color Extraction Report ---');
SCAN_DIRS.forEach(dir => {
	if (fs.existsSync(dir)) scanFiles(dir);
});