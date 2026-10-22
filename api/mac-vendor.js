const path = require('path');
const fs = require('fs');

let macVendors = {};
try {
  const dataPath = path.join(process.cwd(), 'data', 'mac-vendors.json');
  if (fs.existsSync(dataPath)) {
    macVendors = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  }
} catch (e) {
  console.warn('[Orange SmartConnect] Warning: Could not preload mac-vendors.json', e.message);
}

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const rawMac = (urlObj.searchParams.get('mac') || '').replace(/[^a-fA-F0-9]/g, '').toUpperCase();
  const prefix6 = rawMac.substring(0, 6);
  const vendor = macVendors[prefix6] || 'Unknown Device / جهاز غير معروف';

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

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.statusCode = 200;
  res.end(JSON.stringify({
    mac: rawMac,
    prefix: prefix6,
    vendor: vendor,
    category: category,
    found: !!macVendors[prefix6]
  }));
};
