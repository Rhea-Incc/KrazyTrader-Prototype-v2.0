const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { spawn } = require('node:child_process');

const projectRoot = path.resolve(__dirname, '..');
const templatePath = path.join(projectRoot, 'server', 'templates', 'live-qr.html');
const expoPort = Number(process.env.EXPO_PORT || 8081);
const qrPort = Number(process.env.EXPO_QR_PORT || 5001);

if (!Number.isInteger(expoPort) || expoPort < 1 || expoPort > 65535) {
  throw new Error('EXPO_PORT must be a valid TCP port.');
}
if (!Number.isInteger(qrPort) || qrPort < 1 || qrPort > 65535) {
  throw new Error('EXPO_QR_PORT must be a valid TCP port.');
}

let expoUrl = null;
let stopping = false;

function isLocalHost(hostUri) {
  let hostname;
  try {
    hostname = new URL(`http://${hostUri.replace(/^exp:\/\//, '')}`).hostname
      .replace(/^\[|\]$/g, '')
      .toLowerCase();
  } catch {
    return true;
  }

  if (hostname === 'localhost' || hostname.endsWith('.localhost') || hostname === '::1') {
    return true;
  }
  if (hostname.includes(':')) return /^(fc|fd|fe80)/.test(hostname);

  const octets = hostname.split('.').map(Number);
  if (octets.length !== 4 || octets.some((octet) => !Number.isInteger(octet) || octet < 0 || octet > 255)) {
    return false;
  }

  return (
    octets[0] === 0 ||
    octets[0] === 10 ||
    octets[0] === 127 ||
    (octets[0] === 169 && octets[1] === 254) ||
    (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) ||
    (octets[0] === 192 && octets[1] === 168)
  );
}

const expo = spawn(
  'pnpm',
  ['exec', 'expo', 'start', '--tunnel', 'ngrok', '--port', String(expoPort)],
  {
    cwd: projectRoot,
    env: process.env,
    stdio: 'inherit',
  },
);

async function updateExpoUrl() {
  try {
    const response = await fetch(`http://127.0.0.1:${expoPort}/manifest`, {
      headers: { 'expo-platform': 'android' },
      signal: AbortSignal.timeout(2000),
    });
    if (response.ok) {
      const manifest = await response.json();
      const hostUri = manifest.extra?.expoClient?.hostUri || manifest.extra?.expoGo?.debuggerHost;
      if (typeof hostUri === 'string' && !isLocalHost(hostUri)) {
        const nextUrl = hostUri.startsWith('exp://') ? hostUri : `exp://${hostUri}`;
        if (nextUrl !== expoUrl) {
          expoUrl = nextUrl;
          console.log(`Android preview QR is ready for ${expoUrl}`);
        }
      }
    }
  } catch {
  } finally {
    if (!stopping) setTimeout(updateExpoUrl, 1500);
  }
}

const server = http.createServer((request, response) => {
  const pathname = new URL(request.url || '/', 'http://localhost').pathname;

  if (request.method !== 'GET') {
    response.writeHead(405, { Allow: 'GET' });
    response.end();
    return;
  }

  if (pathname === '/status') {
    response.writeHead(200, {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json; charset=utf-8',
    });
    response.end(JSON.stringify({ expoUrl, ready: Boolean(expoUrl) }));
    return;
  }

  if (pathname !== '/') {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  response.writeHead(200, {
    'Cache-Control': 'no-store',
    'Content-Type': 'text/html; charset=utf-8',
  });
  response.end(fs.readFileSync(templatePath));
});

function stop(signal) {
  if (stopping) return;
  stopping = true;
  if (!expo.killed) expo.kill(signal);
  if (server.listening) server.close();
}

server.on('error', (error) => {
  console.error(`QR page server failed: ${error.message}`);
  process.exitCode = 1;
  stop('SIGTERM');
});

expo.on('error', (error) => {
  console.error(`Could not start Expo: ${error.message}`);
  process.exitCode = 1;
  stop('SIGTERM');
});

expo.on('exit', (code) => {
  const wasStopping = stopping;
  stopping = true;
  if (server.listening) server.close();
  if (!wasStopping) process.exitCode = code || 1;
});

process.on('SIGINT', () => stop('SIGINT'));
process.on('SIGTERM', () => stop('SIGTERM'));

server.listen(qrPort, '0.0.0.0', () => {
  console.log(`Live Android QR page: http://localhost:${qrPort}`);
  console.log('Waiting for Expo to establish its tunnel...');
  void updateExpoUrl();
});