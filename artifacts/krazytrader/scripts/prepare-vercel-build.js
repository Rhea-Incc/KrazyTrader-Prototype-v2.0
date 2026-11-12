const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const outputDir = path.join(projectRoot, 'dist');
const qrPage = path.join(projectRoot, 'server', 'templates', 'live-qr.html');
const apkOutput = path.join(outputDir, 'downloads', 'KrazyTrader.apk');

async function prepareVercelOutput() {
  if (!fs.existsSync(path.join(outputDir, 'index.html'))) {
    throw new Error('Expo web export is missing. Run expo export before preparing the Vercel output.');
  }

  const apkUrl = (process.env.EXPO_ANDROID_APK_URL || '').trim();
  const expoGoUrl = (process.env.EXPO_GO_URL || '').trim();
  if (apkUrl) {
    try {
      if (new URL(apkUrl).protocol !== 'https:') throw new Error();
    } catch {
      throw new Error('EXPO_ANDROID_APK_URL must be a valid HTTPS URL.');
    }
  }
  if (expoGoUrl) {
    try {
      const protocol = new URL(expoGoUrl).protocol;
      if (protocol !== 'exp:' && protocol !== 'exps:') throw new Error();
    } catch {
      throw new Error('EXPO_GO_URL must be a valid exp:// or exps:// URL.');
    }
  }

  fs.rmSync(apkOutput, { force: true });

  const runtimeConfig = JSON.stringify({ hosted: true, apkDownloadUrl: apkUrl, expoGoUrl })
    .replaceAll('<', '\\u003c')
    .replaceAll('>', '\\u003e')
    .replaceAll('&', '\\u0026');
  const html = fs.readFileSync(qrPage, 'utf8').replace(
    '</head>',
    `<script>window.KRAZYTRADER_QR_CONFIG=${runtimeConfig};</script>\n</head>`,
  );

  fs.writeFileSync(path.join(outputDir, 'index.html'), html);
  fs.writeFileSync(path.join(outputDir, 'qr.html'), html);
  fs.writeFileSync(path.join(outputDir, 'welcome.html'), html);
  fs.writeFileSync(path.join(outputDir, 'web.html'), html);
  console.log(`Added the Vercel QR utility${apkUrl ? ' with an external APK link' : ' without an APK'}${expoGoUrl ? ' and Expo Go URL' : ''}.`);
}

prepareVercelOutput().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
