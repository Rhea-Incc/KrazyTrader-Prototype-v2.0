const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const outputDir = path.join(projectRoot, 'dist');
const qrPage = path.join(projectRoot, 'server', 'templates', 'live-qr.html');

if (!fs.existsSync(path.join(outputDir, 'index.html'))) {
  throw new Error('Expo web export is missing. Run expo export before preparing the Vercel output.');
}

fs.copyFileSync(qrPage, path.join(outputDir, 'qr.html'));
console.log('Added the live Expo QR utility to the Vercel web export.');
