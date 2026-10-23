const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = process.env.PORT || 3000;

// Preload MAC Vendors in memory for lightning-fast lookup
let macVendors = {};
try {
  const dataPath = path.join(__dirname, 'data', 'mac-vendors.json');
  if (fs.existsSync(dataPath)) {
    macVendors = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log(`[Orange SmartConnect] Loaded ${Object.keys(macVendors).length} MAC vendors for device identification.`);
  }
} catch (e) {
  console.warn('[Orange SmartConnect] Warning: Could not preload mac-vendors.json', e.message);
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.zip': 'application/zip',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname;

  // CORS headers for all requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API 1: MAC Vendor Lookup
  if (pathname === '/api/mac-vendor') {
    const rawMac = (urlObj.searchParams.get('mac') || '').replace(/[^a-fA-F0-9]/g, '').toUpperCase();
    const prefix6 = rawMac.substring(0, 6);
    const vendor = macVendors[prefix6] || 'Unknown Device / جهاز غير معروف';
    
    // Guess category
    let category = 'جهاز ذكي (Smart Device)';
    const vLower = vendor.toLowerCase();
    if (vLower.includes('apple')) category = 'هاتف آيفون / آيباد / ماك (Apple iPhone/iPad/Mac)';
    else if (vLower.includes('samsung')) category = 'هاتف أو شاشة سامسونج (Samsung Galaxy/Smart TV)';
    else if (vLower.includes('xiaomi')) category = 'هاتف شاومي / ردمي / بوكو (Xiaomi/Redmi)';
    else if (vLower.includes('sony') || vLower.includes('playstation')) category = 'جهاز ألعاب بلايستيشن (Sony PlayStation)';
    else if (vLower.includes('microsoft') || vLower.includes('xbox')) category = 'كمبيوتر أو إكس بوكس (Microsoft/Xbox)';
    else if (vLower.includes('huawei') || vLower.includes('honor')) category = 'هاتف هواوي / هونر (Huawei/Honor)';
    else if (vLower.includes('oppo') || vLower.includes('realme') || vLower.includes('oneplus')) category = 'هاتف أوبو / ريلمي (Oppo/Realme/OnePlus)';
    else if (vLower.includes('tp-link') || vLower.includes('d-link') || vLower.includes('netgear') || vLower.includes('tenda')) category = 'راوتر أو مقوي شبكة (Access Point / Extender)';
    else if (vLower.includes('intel') || vLower.includes('dell') || vLower.includes('hp') || vLower.includes('lenovo') || vLower.includes('asus') || vLower.includes('acer')) category = 'كمبيوتر محمول / مكتبي (Laptop / PC)';
    else if (vLower.includes('lg')) category = 'شاشة أو جهاز ذكي إل جي (LG Smart Device)';
    else if (vLower.includes('amazon')) category = 'جهاز أمازون / أليكسا / كيندل (Amazon Alexa/Fire TV)';

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      mac: rawMac,
      prefix: prefix6,
      vendor: vendor,
      category: category,
      found: !!macVendors[prefix6]
    }));
    return;
  }

  // API 2: Lightweight Ping Test endpoint
  if (pathname === '/api/ping') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', timestamp: Date.now() }));
    return;
  }

  // Serve Static Files
  let reqPath = decodeURI(pathname);
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const filePath = path.join(__dirname, reqPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('500 Internal Server Error: ' + err.code);
      }
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
      });
      res.end(content);
    }
  });
});

// Find Local IP addresses
function getLocalIps() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  for (let name of Object.keys(interfaces)) {
    for (let iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips;
}

server.listen(PORT, '0.0.0.0', () => {
  const localIps = getLocalIps();
  console.log(`\n======================================================`);
  console.log(`  ORANGE SMARTCONNECT - SELF SETUP PLATFORM`);
  console.log(`  Orange Egypt - Official Self-Setup Platform`);
  console.log(`  Localhost: http://localhost:${PORT}`);
  localIps.forEach(ip => {
    console.log(`  Mobile / LAN URL: http://${ip}:${PORT}`);
  });
  console.log(`======================================================\n`);
});
