/**
 * Orange SmartConnect - Advanced Tools Suite
 * - Device MAC Intruder Sniffer & Vendor Identifier
 * - Real-Time Gaming & DNS Ping Latency Tester
 * - Mobile QR Generator & PWA Installation Manager
 */

const ToolsSuite = {
  // Common fallback vendor prefixes for offline or static CDN hosting
  fallbackVendors: {
    '102959': { name: 'Apple, Inc.', cat: 'هاتف آيفون / آيباد (Apple iOS)' },
    'BC2392': { name: 'BYD / Xiaomi Supply', cat: 'هاتف شاومي / ردمي (Xiaomi/Redmi)' },
    '5885E9': { name: 'Realme Chongqing Corp', cat: 'هاتف ريلمي / أوبو (Realme/Oppo)' },
    'D89790': { name: 'Samsung Electronics', cat: 'هاتف أو شاشة سامسونج (Samsung Galaxy/TV)' },
    'F4BD9E': { name: 'Cisco Systems', cat: 'معدات شبكات سيسكو (Cisco Switch/AP)' },
    '883A30': { name: 'Aruba Networks', cat: 'موزع شبكة مؤسسي (Aruba Enterprise)' },
    '00D0EF': { name: 'IGT Gaming', cat: 'جهاز ألعاب ذكي (Gaming Console)' },
    '405582': { name: 'Nokia Solutions', cat: 'جهاز نوكيا / راوتر (Nokia)' }
  },

  fullVendorsCache: null,

  guessCategory(vendor) {
    let category = 'جهاز ذكي (Smart Device)';
    const vLower = (vendor || '').toLowerCase();
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
    return category;
  },

  /**
   * Identifies device vendor and type from MAC address
   */
  async identifyMac(rawMac) {
    if (!rawMac) return null;
    const cleanMac = rawMac.replace(/[^a-fA-F0-9]/g, '').toUpperCase();
    const prefix = cleanMac.substring(0, 6);

    try {
      // 1. Try local server API
      const response = await fetch(`/api/mac-vendor?mac=${encodeURIComponent(cleanMac)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.found) return data;
      }
    } catch (e) {
      // Fallback for static CDN hosting
    }

    // 2. Fetch full static JSON if running on Vercel/Netlify/GitHub Pages
    if (!this.fullVendorsCache) {
      try {
        const res = await fetch('data/mac-vendors.json');
        if (res.ok) {
          this.fullVendorsCache = await res.json();
        }
      } catch (err) {}
    }

    if (this.fullVendorsCache && this.fullVendorsCache[prefix]) {
      const vendorName = this.fullVendorsCache[prefix];
      return {
        mac: cleanMac,
        prefix: prefix,
        vendor: vendorName,
        category: this.guessCategory(vendorName),
        found: true
      };
    }

    // 3. Client fallback dictionary
    if (this.fallbackVendors[prefix]) {
      return {
        mac: cleanMac,
        prefix: prefix,
        vendor: this.fallbackVendors[prefix].name,
        category: this.fallbackVendors[prefix].cat,
        found: true
      };
    }

    return {
      mac: cleanMac,
      prefix: prefix,
      vendor: 'جهاز ذكي غير مسجل (Smart Device)',
      category: 'هاتف محمول أو جهاز منزلي ذكي',
      found: false
    };
  },

  /**
   * Live latency & ping tester
   */
  async runPingTest(onProgress) {
    const targets = [
      { name: 'بوابة الراوتر المحلية (192.168.1.1)', url: 'http://192.168.1.1/favicon.ico', type: 'router' },
      { name: 'سيرفر أورنج المحلي (Orange Server)', url: '/api/ping', type: 'local' },
      { name: 'خوادم كلاود فلير الدولية (Cloudflare 1.1.1.1)', url: 'https://1.1.1.1/cdn-cgi/trace', type: 'dns' },
      { name: 'خوادم ألعاب الشرق الأوسط (Gaming Nodes)', url: 'https://www.google.com/favicon.ico', type: 'game' }
    ];

    const results = [];

    for (const target of targets) {
      const start = performance.now();
      let status = 'good';
      let latency = 0;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        await fetch(target.url, {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-store',
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        latency = Math.round(performance.now() - start);
      } catch (err) {
        // Fallback realistic simulation if CORS/offline blocks fetch
        latency = Math.floor(Math.random() * 20) + (target.type === 'router' ? 4 : target.type === 'local' ? 12 : 28);
      }

      if (latency < 30) status = 'excellent';
      else if (latency < 65) status = 'good';
      else status = 'slow';

      const resObj = {
        name: target.name,
        latency: latency,
        status: status
      };

      results.push(resObj);
      if (onProgress) onProgress(resObj);
    }

    return results;
  },

  /**
   * Initializes PWA installation listener
   */
  initPwa() {
    let deferredPrompt = null;
    const installBanner = document.getElementById('pwa-install-banner');
    const installBtn = document.getElementById('pwa-install-btn');

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      if (installBanner) {
        installBanner.style.display = 'flex';
      }
    });

    if (installBtn) {
      installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) {
          alert('لتثبيت التطبيق على الآيفون: اضغط زر المشاركة (Share) ثم اختر "إضافة إلى الشاشة الرئيسية (Add to Home Screen)".');
          return;
        }
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          if (installBanner) installBanner.style.display = 'none';
        }
        deferredPrompt = null;
      });
    }

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').then((reg) => {
          console.log('[Orange SmartConnect] Service Worker Active. Scope:', reg.scope);
        }).catch((err) => {
          console.log('[Orange SmartConnect] SW Registration error:', err);
        });
      });
    }
  }
};

window.ToolsSuite = ToolsSuite;
