/**
 * Orange SmartConnect - Main Controller Application
 * Orchestrates customer journey, reactive state, UI transitions, and tool integrations
 * Official Orange Egypt Digital Self-Care System
 */

const App = {
  currentStep: 1,
  selectedRouterId: 'orange-h188a',
  currentCategory: 'all',
  setupMode: 'auto', // 'auto', 'sim', or 'code'

  config: {
    username: '',
    password: '',
    wifiSsid: 'Orange_Home_WiFi',
    wifiPass: 'Orange#2026'
  },

  qrCodeInstance: null,

  init() {
    this.renderRouterCards();
    this.selectRouter(this.selectedRouterId);
    this.syncConfig();
    this.calculateLine();
    this.updateWifiQr();
    if (window.ToolsSuite) window.ToolsSuite.initPwa();

    console.log("%c[Orange SmartConnect]%c Ready! Official Orange Egypt Digital Care Engine active.", "color: #FF7900; font-weight: bold;", "color: #00D26A;");
  },

  /**
   * Step Navigation
   */
  goToStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > 5) return;
    this.currentStep = stepNumber;

    // 1. Update step views
    document.querySelectorAll('.step-view').forEach((view, index) => {
      view.classList.toggle('active', index + 1 === stepNumber);
    });

    // 2. Update step tracker items (desktop & mobile)
    document.querySelectorAll('.step-item').forEach((item, index) => {
      const idx = index + 1;
      item.classList.remove('active', 'completed');
      if (idx === stepNumber) {
        item.classList.add('active');
      } else if (idx < stepNumber) {
        item.classList.add('completed');
      }
    });

    document.querySelectorAll('.mobile-nav-item').forEach((item, index) => {
      item.classList.toggle('active', index + 1 === stepNumber);
    });

    // 3. Special actions when entering specific steps
    if (stepNumber === 4) {
      this.refreshSimulator();
      this.refreshAutoFillCode();
    } else if (stepNumber === 5) {
      this.updateWifiQr();
      this.calculateLine();
    }

    // Smooth scroll to top of view
    window.scrollTo({ top: 120, behavior: 'smooth' });
  },

  /**
   * Step 1: DSL Status Checker
   */
  checkDslStatus(status) {
    const dslLed = document.getElementById('live-dsl-led');
    const feedback = document.getElementById('dsl-feedback');
    const dslButtons = document.querySelectorAll('.dsl-btn');

    dslButtons.forEach(btn => btn.classList.remove('active'));

    if (status === 'solid') {
      if (dslLed) {
        dslLed.className = 'led-bulb green-on';
      }
      feedback.className = 'dsl-feedback-panel ready visible';
      feedback.innerHTML = '<strong>ممتاز جداً! 🎉</strong> لمبة DSL ثابتة باللون الأخضر تعني أن كابل التليفون سليم وإشارة السنترال واصلة بكفاءة. اضغط "التالي" لاختيار نوع الراوتر والبدء فوراً.';
    } else if (status === 'blinking') {
      if (dslLed) {
        dslLed.className = 'led-bulb blinking';
      }
      feedback.className = 'dsl-feedback-panel trouble visible';
      feedback.innerHTML = '<strong>الراوتر يحاول المزامنة (Blinking)... ⏳</strong> انتظر دقيقة واحدة حتى تثبت اللمبة. إذا استمرت في الوميض لأكثر من 5 دقائق، تأكد من توصيل سلك التليفون في منفذ LINE بالسبليتر وعدم وجود لحامات ضعيفة بالسلك.';
    } else {
      if (dslLed) {
        dslLed.className = 'led-bulb off';
      }
      feedback.className = 'dsl-feedback-panel trouble visible';
      feedback.innerHTML = '<strong>تنبيه: لا توجد حرارة (DSL مطفية)! ⚠️</strong> تأكد من وضع فيشة الكهرباء، وفحص سلك التليفون في الحائط. إذا كان الخط جديداً، قد يكون الفني في السنترال لم يقم بتوصيل السلك في كابينة MSAN بعد.';
    }
  },

  /**
   * Step 2: Router Cards Rendering & Filtering
   */
  renderRouterCards() {
    const grid = document.getElementById('routers-grid');
    if (!grid) return;

    let filtered = ROUTER_DATABASE.routers;
    if (this.currentCategory !== 'all') {
      filtered = filtered.filter(r => r.category === this.currentCategory);
    }

    grid.innerHTML = filtered.map(router => `
      <div class="router-card ${router.id === this.selectedRouterId ? 'selected' : ''} ${router.popular || router.featured ? 'featured-glow-card' : ''}" data-router-id="${router.id}" onclick="App.selectRouter('${router.id}')">
        ${router.badge ? `<span class="router-badge-top">${router.badge}</span>` : ''}
        <div class="router-thumb-wrap">
          <div class="router-cyber-frame"></div>
          <img src="${router.image}" alt="${router.nameAr}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
          <div class="router-svg-fallback" style="display:none; width:100%; height:100%; align-items:center; justify-content:center; background:linear-gradient(135deg, #0e121a, #161c28); flex-direction:column; gap:8px;">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <rect x="8" y="24" width="48" height="24" rx="6" fill="#1B2232" stroke="#FF7900" stroke-width="2"/>
              <rect x="14" y="28" width="6" height="6" rx="2" fill="#FF7900"/>
              <circle cx="28" cy="36" r="2.5" fill="#00D26A"/>
              <circle cx="36" cy="36" r="2.5" fill="#00D26A"/>
              <circle cx="44" cy="36" r="2.5" fill="#00D26A"/>
              <line x1="16" y1="24" x2="16" y2="12" stroke="#8E99AB" stroke-width="2.5" stroke-linecap="round"/>
              <line x1="48" y1="24" x2="48" y2="12" stroke="#8E99AB" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
            <span style="font-size:0.78rem; font-weight:700; color:#FF7900;">${router.nameAr}</span>
          </div>
        </div>
        <div class="router-card-body">
          <h4 class="router-card-title">${router.nameAr}</h4>
          <div class="router-specs-mini">
            <span>🏷️ ${router.manufacturer}</span>
            <span>🌐 ${router.gatewayIp}</span>
          </div>
          <div class="router-select-btn">
            ${router.id === this.selectedRouterId ? '✓ الموديل المختار' : 'اختيار هذا الراوتر'}
          </div>
        </div>
      </div>
    `).join('');
  },

  filterRouters(category, btnElement) {
    this.currentCategory = category;
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');
    this.renderRouterCards();
  },

  selectRouter(routerId) {
    this.selectedRouterId = routerId;
    const router = ROUTER_DATABASE.routers.find(r => r.id === routerId);
    if (!router) return;

    // Update Step 3 Display
    const ipEl = document.getElementById('display-gateway-ip');
    if (ipEl) ipEl.textContent = router.gatewayIp;

    const passNoteEl = document.getElementById('router-sticker-pass');
    if (passNoteEl) passNoteEl.textContent = router.passwordNote;

    const userNoteEl = document.getElementById('router-sticker-user');
    if (userNoteEl) userNoteEl.textContent = router.defaultUsername || 'admin';

    const showcaseImg = document.getElementById('step3-router-img');
    if (showcaseImg) showcaseImg.src = router.image;

    const showcaseName = document.getElementById('step3-router-name');
    if (showcaseName) showcaseName.textContent = router.nameAr;

    const showcaseBadge = document.getElementById('step3-router-badge');
    if (showcaseBadge) showcaseBadge.textContent = router.badge || 'الموديل المختار';

    this.renderRouterCards();
    this.refreshSimulator();
    this.refreshAutoFillCode();
  },

  /**
   * Step 4: Configuration & Input Syncing
   */
  syncConfig() {
    let rawUser = (document.getElementById('input-orange-user')?.value || '').trim();
    const rawPass = (document.getElementById('input-orange-pass')?.value || '').trim();
    const wifiSsid = (document.getElementById('input-wifi-ssid')?.value || '').trim();
    const wifiPass = (document.getElementById('input-wifi-pass')?.value || '').trim();

    // In Orange Egypt, username is clean landline e.g. 02xxxxxxxx without @orange or .eg
    const cleanLandline = rawUser.split('@')[0].trim();

    this.config = {
      username: cleanLandline,
      password: rawPass,
      wifiSsid: wifiSsid || 'Orange_Home_WiFi',
      wifiPass: wifiPass || 'Orange#2026'
    };

    // Update Mobile Fast-Track values in Step 4
    const mUserEl = document.getElementById('mobile-copy-user-val');
    if (mUserEl) mUserEl.textContent = cleanLandline || '—';

    const mPassEl = document.getElementById('mobile-copy-pass-val');
    if (mPassEl) mPassEl.textContent = rawPass ? (rawPass.length > 3 ? '•••••••• (' + rawPass.substring(0, 2) + '...)' : '••••') : 'اكتب الباسورد بالصندوق';

    // Update Bookmarklet Hero credential labels in Step 4
    const bkmkUser = document.getElementById('bkmk-cred-user');
    if (bkmkUser) bkmkUser.textContent = cleanLandline || '—';

    const bkmkPass = document.getElementById('bkmk-cred-pass');
    if (bkmkPass) bkmkPass.textContent = rawPass ? (rawPass.length > 3 ? '•••••••• (' + rawPass.substring(0, 2) + '...)' : '••••') : 'اكتب الباسورد بالخطوة السابقة';

    // Update QR labels in Step 5
    const qrSsid = document.getElementById('qr-display-ssid');
    if (qrSsid) qrSsid.textContent = this.config.wifiSsid;

    // Update Bookmarklet URI link
    const bookmarkletEl = document.getElementById('bookmarklet-link');
    if (bookmarkletEl) {
      bookmarkletEl.href = ScriptGenerator.generateBookmarklet(this.config);
    }

    this.refreshSimulator();
    this.refreshAutoFillCode();
  },

  copyCleanUser() {
    const clean = (this.config.username || '').split('@')[0].trim();
    if (!clean) {
      showToast('اكتب رقم التليفون الأرضي أولاً بالخانة ⚠️');
      return;
    }
    copyTextToClipboard(clean);
    showToast(`تم نسخ رقم التليفون الأرضي: ${clean} 📋`);
  },

  copyWanPass() {
    if (!this.config.password) {
      showToast('اكتب كلمة مرور رسالة أورانج أولاً بالخانة ⚠️');
      return;
    }
    copyTextToClipboard(this.config.password);
    showToast('تم نسخ كلمة مرور أورانج بنجاح! 🔑');
  },

  toggleInputPass(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
      input.type = input.type === 'password' ? 'text' : 'password';
    }
  },

  generateStrongPass() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let pass = 'Orange#';
    for (let i = 0; i < 6; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const input = document.getElementById('input-wifi-pass');
    if (input) {
      input.value = pass;
      this.syncConfig();
      showToast('تم توليد كلمة سر واي فاي قوية ومميزة! 🔒');
    }
  },

  switchSetupMode(mode) {
    this.setupMode = mode;
    const autoTab = document.getElementById('mode-tab-auto');
    const simTab = document.getElementById('mode-tab-sim');
    const codeTab = document.getElementById('mode-tab-code');
    const autoBox = document.getElementById('auto-mode-container');
    const simBox = document.getElementById('sim-mode-container');
    const codeBox = document.getElementById('code-mode-container');

    [autoTab, simTab, codeTab].forEach(t => t && t.classList.remove('active'));
    [autoBox, simBox, codeBox].forEach(b => b && (b.style.display = 'none'));

    if (mode === 'auto') {
      if (autoTab) autoTab.classList.add('active');
      if (autoBox) autoBox.style.display = 'block';
      const bEl = document.getElementById('bookmarklet-link');
      if (bEl) bEl.href = ScriptGenerator.generateBookmarklet(this.config);
    } else if (mode === 'sim') {
      if (simTab) simTab.classList.add('active');
      if (simBox) simBox.style.display = 'block';
      this.refreshSimulator();
    } else {
      if (codeTab) codeTab.classList.add('active');
      if (codeBox) codeBox.style.display = 'block';
      this.refreshAutoFillCode();
    }
  },

  copyBookmarkletCode(btnEl) {
    const code = ScriptGenerator.generateBookmarklet(this.config);
    copyTextToClipboard(code);
    
    // Provide tactile visual feedback on button
    const targetBtn = btnEl || document.getElementById('btn-copy-bkmk');
    if (targetBtn) {
      const origHtml = targetBtn.innerHTML;
      targetBtn.innerHTML = '<span>✅</span> تم نسخ كود البوكماركليت بنجاح!';
      targetBtn.style.background = '#00D26A';
      targetBtn.style.color = '#000';
      targetBtn.style.borderColor = '#00D26A';
      setTimeout(() => {
        targetBtn.innerHTML = origHtml;
        targetBtn.style.background = '';
        targetBtn.style.color = '';
        targetBtn.style.borderColor = '';
      }, 3500);
    }
    
    showToast('تم نسخ كود التفعيل السريع بنجاح! جاهز للاستخدام في متصفحك 🚀');
  },

  switchDeviceGuide(deviceType) {
    const tabs = document.querySelectorAll('.bkmk-device-tab-btn');
    const panels = document.querySelectorAll('.bkmk-guide-panel');

    tabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.device === deviceType);
    });

    panels.forEach(panel => {
      panel.classList.toggle('active', panel.id === `guide-panel-${deviceType}`);
    });
  },

  testBookmarkletOnSimulator() {
    this.switchSetupMode('sim');
    showToast('جاري تشغيل تجربة البوكماركليت التفاعلية داخل المحاكي... 🧪');

    const router = ROUTER_DATABASE.routers.find(r => r.id === this.selectedRouterId) || ROUTER_DATABASE.routers[0];
    const wanStepIdx = router.simulator.steps.findIndex(s => s.screen && s.screen.includes('wan'));
    if (wanStepIdx !== -1) {
      RouterSimulator.setStep(wanStepIdx, 'simulator-viewport');
    }

    setTimeout(() => {
      const code = ScriptGenerator.generateBookmarklet(this.config);
      try {
        const cleanJs = code.replace(/^javascript:/, '');
        // Run safe evaluation in sandbox context
        const testRunner = new Function(cleanJs);
        testRunner();
      } catch (e) {
        console.warn('[Orange SmartConnect] Simulator Bookmarklet test:', e);
      }
    }, 700);
  },

  refreshSimulator() {
    const router = ROUTER_DATABASE.routers.find(r => r.id === this.selectedRouterId) || ROUTER_DATABASE.routers[0];
    RouterSimulator.init(router, this.config, 'simulator-viewport');
  },

  refreshAutoFillCode() {
    const codeBox = document.getElementById('code-display');
    if (!codeBox) return;
    const script = ScriptGenerator.generateAutoFillScript(this.selectedRouterId, this.config);
    codeBox.textContent = script;
  },

  copyAutoFillScript() {
    const script = ScriptGenerator.generateAutoFillScript(this.selectedRouterId, this.config);
    copyTextToClipboard(script);
    showToast('تم نسخ كود التفعيل السحري بنجاح! الصقه في الـ Console لصفحة الراوتر ⚡');
  },

  /**
   * Step 5: Super Tools (Line Calculator, QR Code, DNS)
   */
  calculateLine() {
    const snr = document.getElementById('diag-snr')?.value || 16.5;
    const att = document.getElementById('diag-att')?.value || 12.0;

    const res = LineCalculator.evaluateLine(att, snr);
    if (!res.valid) return;

    const scoreText = document.getElementById('diag-score-text');
    const scoreFill = document.getElementById('diag-score-fill');
    const summary = document.getElementById('diag-summary-text');

    if (scoreText) scoreText.textContent = `${res.stabilityScore}% (${res.stabilityStatus.split('(')[1]?.replace(')', '') || 'جيد'})`;
    if (scoreFill) scoreFill.style.width = `${res.stabilityScore}%`;
    if (summary) {
      summary.innerHTML = `
        📍 بعد الكابينة التقريبي: <strong>حوالي ${res.estimatedDistanceMeters} متر</strong><br/>
        🚀 أقصى سرعة يتحملها سلكك بدون تقطيع: <strong>${res.maxSpeedMbps} ميجابايت/ثانية</strong><br/>
        📦 ${res.recommendedTier}
      `;
    }
  },

  updateWifiQr() {
    const holder = document.getElementById('qr-code-holder');
    if (!holder || typeof QRCode === 'undefined') return;

    holder.innerHTML = '';
    const qrString = ScriptGenerator.generateWifiQrString(this.config.wifiSsid, this.config.wifiPass);

    try {
      this.qrCodeInstance = new QRCode(holder, {
        text: qrString,
        width: 140,
        height: 140,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });
    } catch (e) {
      console.warn('QR Code generation error:', e);
    }
  },

  copyDnsScript() {
    const script = ScriptGenerator.generateDnsScript('1.1.1.3', '1.0.0.3');
    copyTextToClipboard(script);
    showToast('تم نسخ كود الـ DNS العائلي النظيف بنجاح! 🛡️');
  },

  copySpeedGuide(speed) {
    let msg = '';
    if (speed === '5Mbps') msg = 'لتحديد 5 ميجا: اختر من صفحة WLAN وضع 802.11b Only';
    else if (speed === '10Mbps') msg = 'لتحديد 10 ميجا: اختر وضع 802.11b/g وخفض القناة لـ 20MHz';
    else msg = 'لتحديد 15 ميجا: اختر وضع 802.11b/g مع Modulation 18Mbps';

    copyTextToClipboard(msg);
    showToast('تم نسخ إرشاد تحديد السرعة (' + speed + ') لترشيد الباقة! ⚡');
  },

  /**
   * Mobile Testing QR Modal
   */
  mobileQrInstance: null,
  showMobileModal() {
    const modal = document.getElementById('mobile-qr-modal');
    if (!modal) return;
    modal.classList.add('open');

    const holder = document.getElementById('mobile-qr-holder');
    const urlDisplay = document.getElementById('mobile-url-display');
    
    // Choose optimal URL (LAN IP if on localhost, otherwise window.location.href)
    let targetUrl = window.location.href;
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      targetUrl = 'http://192.168.1.107:3000';
    }

    if (urlDisplay) {
      urlDisplay.value = targetUrl;
    }

    if (holder && typeof QRCode !== 'undefined') {
      holder.innerHTML = '';
      try {
        this.mobileQrInstance = new QRCode(holder, {
          text: targetUrl,
          width: 180,
          height: 180,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.M
        });
      } catch (e) {
        console.warn('Mobile QR error:', e);
      }
    }
  },

  closeMobileModal() {
    const modal = document.getElementById('mobile-qr-modal');
    if (modal) modal.classList.remove('open');
  },

  copyMobileUrl() {
    const urlDisplay = document.getElementById('mobile-url-display');
    if (urlDisplay) {
      copyTextToClipboard(urlDisplay.value);
      showToast('تم نسخ رابط الموبايل! افتحه في متصفح هاتفك 📲');
    }
  },

  /**
   * Advanced Tools: MAC Vendor Identification
   */
  currentInspectedMac: '',
  async searchMacVendor() {
    const input = document.getElementById('mac-input');
    const resBox = document.getElementById('mac-result-box');
    if (!input || !resBox) return;

    const val = input.value.trim();
    if (!val) {
      showToast('يرجى كتابة عنوان الماك (MAC Address) للبحث ⚠️');
      return;
    }

    resBox.style.display = 'block';
    resBox.innerHTML = '<div style="color:var(--orange-primary);text-align:center;">🔍 جاري الفحص في قاعدة بيانات 29,228 شركة مصنعة...</div>';

    const info = await ToolsSuite.identifyMac(val);
    this.currentInspectedMac = info.mac;

    resBox.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span style="font-weight:700; color:#fff;">🏢 الشركة المصنعة:</span>
        <strong style="color:var(--orange-primary);">${info.vendor}</strong>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <span style="font-weight:700; color:#fff;">📱 نوع الجهاز المحتمل:</span>
        <span style="color:#00D26A; font-weight:700;">${info.category}</span>
      </div>
      <div style="font-size:0.82rem; color:var(--text-muted); margin-bottom:14px;">
        الماك المكتشف: <code style="color:#fff;">${info.mac.match(/.{1,2}/g)?.join(':') || info.mac}</code>
      </div>
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn-primary" style="padding:8px 16px; font-size:0.85rem;" onclick="App.blockCurrentMac()">
          🚫 نسخ كود حظر هذا الجهاز من الراوتر
        </button>
      </div>
    `;
  },

  setMacPreset(mac) {
    const input = document.getElementById('mac-input');
    if (input) {
      input.value = mac;
      this.searchMacVendor();
    }
  },

  blockCurrentMac() {
    if (!this.currentInspectedMac) return;
    const script = ScriptGenerator.generateMacBlockScript(this.currentInspectedMac);
    copyTextToClipboard(script);
    showToast('تم نسخ كود حظر الجهاز! الصقه في كونسول صفحة الراوتر لطرد الجهاز فوراً 🚫');
  },

  /**
   * Router Reboot Script
   */
  rebootCurrentRouter(model) {
    const targetModel = model || this.selectedRouterId;
    const script = ScriptGenerator.generateRebootScript(targetModel);
    copyTextToClipboard(script);
    showToast('تم نسخ كود إعادة تشغيل الراوتر! الصقه في كونسول 192.168.1.1 ليُعاد تشغيله تلقائياً 🔄');
  },

  /**
   * Wi-Fi Eco & Bandwidth Mode
   */
  applyEcoMode() {
    const script = ScriptGenerator.generateEcoModeScript();
    copyTextToClipboard(script);
    showToast('تم نسخ كود وضع التوفير فائق الاستقرار (20MHz) لحماية باقة أورنج ⚡');
  },

  /**
   * Live Gaming & DNS Ping Test
   */
  isPinging: false,
  async runGamingPingTest() {
    if (this.isPinging) return;
    this.isPinging = true;

    const btn = document.getElementById('ping-test-btn');
    if (btn) btn.innerHTML = '⏳ جاري القياس الفوري...';

    const grid = document.getElementById('ping-results-grid');
    if (grid) grid.innerHTML = '';

    await ToolsSuite.runPingTest((res) => {
      if (grid) {
        const item = document.createElement('div');
        item.className = 'ping-item';
        item.innerHTML = `
          <span>${res.name}</span>
          <span class="ping-latency-badge ${res.status}">${res.latency} ms</span>
        `;
        grid.appendChild(item);
      }
    });

    if (btn) btn.innerHTML = '⚡ إعادة اختبار البنج';
    this.isPinging = false;
    showToast('اكتمل اختبار البنج وسرعة الاستجابة بنجاح! 🎮');
  }
};

/**
 * Universal Clipboard Copier with Visual Feedback
 */
function copyTextToClipboard(text) {
  if (!text) return;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`تم نسخ: "${text.length > 25 ? text.substring(0, 25) + '...' : text}" 📋`);
    }).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  ta.remove();
  showToast(`تم نسخ: "${text.length > 25 ? text.substring(0, 25) + '...' : text}" 📋`);
}

/**
 * Global Toast Notification
 */
let toastTimeout = null;
function showToast(message) {
  const toast = document.getElementById('app-toast');
  if (!toast) return;

  toast.innerHTML = `<span>🍊</span> <span>${message}</span>`;
  toast.classList.add('visible');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('visible');
  }, 4000);
}

// Bootstrap when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
