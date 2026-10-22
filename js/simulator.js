/**
 * Orange SmartConnect - Interactive Router Screen Simulator
 * Official Orange Egypt Virtual Router Simulation Engine
 */

const RouterSimulator = {
  currentStepIndex: 0,
  currentRouter: null,
  currentConfig: {
    username: '',
    password: '',
    wifiSsid: 'Orange_Home_WiFi',
    wifiPass: 'Orange#2026'
  },

  init(router, config, containerId) {
    this.currentRouter = router;
    this.currentConfig = { ...this.currentConfig, ...config };
    this.currentStepIndex = 0;
    this.render(containerId);
  },

  updateConfig(config) {
    this.currentConfig = { ...this.currentConfig, ...config };
  },

  nextStep(containerId) {
    if (this.currentRouter && this.currentStepIndex < this.currentRouter.simulator.steps.length - 1) {
      this.currentStepIndex++;
      this.render(containerId);
    }
  },

  prevStep(containerId) {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.render(containerId);
    }
  },

  setStep(index, containerId) {
    this.currentStepIndex = index;
    this.render(containerId);
  },

  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container || !this.currentRouter) return;

    const router = this.currentRouter;
    const steps = router.simulator.steps;
    const currentStep = steps[this.currentStepIndex];

    const usernameVal = this.currentConfig.username || '0233445566@orange.eg';
    const passwordVal = this.currentConfig.password || 'OrangePass123';
    const wifiSsidVal = this.currentConfig.wifiSsid || 'Orange_Home_WiFi';
    const wifiPassVal = this.currentConfig.wifiPass || 'Orange#2026';

    let html = `
      <div class="simulator-wrapper">
        <!-- Simulator Header with Steps -->
        <div class="sim-header">
          <div class="sim-brand-title">
            <span class="sim-dot green"></span>
            <span class="sim-dot yellow"></span>
            <span class="sim-dot red"></span>
            <span class="sim-browser-url">http://${router.gatewayIp}/</span>
            <span class="sim-model-tag">${router.nameAr}</span>
          </div>
          <div class="sim-step-tabs">
            ${steps.map((st, i) => `
              <button class="sim-step-tab ${i === this.currentStepIndex ? 'active' : ''} ${i < this.currentStepIndex ? 'completed' : ''}" onclick="RouterSimulator.setStep(${i}, '${containerId}')">
                <span class="tab-num">${i + 1}</span>
                <span class="tab-text">${st.titleAr}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Instructor Callout Banner -->
        <div class="sim-instruction-bar">
          <div class="instruction-icon">💡</div>
          <div class="instruction-content">
            <strong>الخطوة ${this.currentStepIndex + 1}: ${currentStep.titleAr}</strong>
            <p>${currentStep.hintAr}</p>
          </div>
          <button class="sim-copy-all-btn" onclick="copyTextToClipboard('${this.currentStepIndex === 0 ? 'admin' : (this.currentStepIndex === 1 ? usernameVal : wifiSsidVal)}')">
            <span class="copy-icon">📋</span> نسخ القيمة المطلوبة
          </button>
        </div>

        <!-- Virtual Router Screen Content -->
        <div class="sim-screen-viewport ${currentStep.screenType}">
          ${this.renderScreenContent(currentStep.screenType, {
            router,
            usernameVal,
            passwordVal,
            wifiSsidVal,
            wifiPassVal
          })}
        </div>

        <!-- Simulator Footer Controls -->
        <div class="sim-footer-controls">
          <button class="sim-nav-btn prev" ${this.currentStepIndex === 0 ? 'disabled' : ''} onclick="RouterSimulator.prevStep('${containerId}')">
            ← الخطوة السابقة
          </button>
          <div class="sim-step-dots">
            ${steps.map((_, i) => `<span class="dot ${i === this.currentStepIndex ? 'active' : ''}"></span>`).join('')}
          </div>
          <button class="sim-nav-btn next" ${this.currentStepIndex === steps.length - 1 ? 'disabled' : ''} onclick="RouterSimulator.nextStep('${containerId}')">
            الخطوة التالية →
          </button>
        </div>
      </div>
    `;

    container.innerHTML = html;
  },

  renderScreenContent(screenType, data) {
    const { router, usernameVal, passwordVal, wifiSsidVal, wifiPassVal } = data;

    switch (screenType) {
      // 1. Huawei Login Screen
      case 'huawei_login':
        return `
          <div class="huawei-ui login-screen">
            <div class="hw-topbar">
              <div class="hw-logo">EchoLife Home Gateway</div>
              <div class="hw-model">${router.manufacturer} ${router.name.split('(')[1]?.replace(')', '') || ''}</div>
            </div>
            <div class="hw-login-box">
              <div class="hw-login-title">User Login / تسجيل الدخول</div>
              <div class="hw-form-row">
                <label>Account / اسم المستخدم:</label>
                <div class="hw-input-wrap">
                  <input type="text" value="admin" readonly />
                  <span class="hw-tag fixed">ثابت</span>
                </div>
              </div>
              <div class="hw-form-row active-focus">
                <label>Password / كلمة المرور:</label>
                <div class="hw-input-wrap">
                  <input type="password" value="••••••••" placeholder="من ظهر الراوتر" readonly />
                  <button class="hw-field-copy" onclick="copyTextToClipboard('admin')">نسخ</button>
                </div>
                <div class="hw-field-pointer">
                  <span class="arrow-indicator">👉</span>
                  <span>اكتب الباسورد المطبوع على ملصق ظهر الراوتر هنا</span>
                </div>
              </div>
              <div class="hw-login-action">
                <button class="hw-submit-btn">Login / دخول</button>
              </div>
            </div>
          </div>
        `;

      // 2. Huawei WAN PPPoE Screen
      case 'huawei_wan':
        return `
          <div class="huawei-ui wan-screen">
            <div class="hw-topbar-nav">
              <span class="hw-nav-item">Home</span>
              <span class="hw-nav-item active">Internet (إعدادات الإنترنت)</span>
              <span class="hw-nav-item">Local Network</span>
              <span class="hw-nav-item">Maintain</span>
            </div>
            <div class="hw-main-body">
              <div class="hw-sidebar">
                <div class="hw-side-item active">WAN / PPPoE</div>
                <div class="hw-side-item">Bandwidth</div>
                <div class="hw-side-item">Status</div>
              </div>
              <div class="hw-content-area">
                <div class="hw-section-header">Internet Service Provider (Orange Egypt DSL)</div>
                <div class="hw-callout-info">
                  أدخل اسم المستخدم وكلمة السر المستلمة في رسالة SMS من أورانج:
                </div>
                
                <div class="hw-form-group active-glow">
                  <label>PPPoE Account (اسم مستخدم الخدمة):</label>
                  <div class="hw-copyable-input">
                    <input type="text" value="${usernameVal}" readonly />
                    <button class="hw-btn-copy" onclick="copyTextToClipboard('${usernameVal}')">نسخ القيمة 📋</button>
                  </div>
                  <span class="field-hint">مثال: 02xxxxxxx@orange.eg</span>
                </div>

                <div class="hw-form-group active-glow">
                  <label>PPPoE Password (كلمة مرور الخدمة):</label>
                  <div class="hw-copyable-input">
                    <input type="password" id="sim-wan-pass" value="${passwordVal}" readonly />
                    <button class="hw-btn-copy" onclick="copyTextToClipboard('${passwordVal}')">نسخ الباسورد 📋</button>
                    <button class="hw-btn-peek" onclick="toggleSimPass('sim-wan-pass')">👁️</button>
                  </div>
                  <span class="field-hint">الباسورد الموجود في رسالة أورانج النصية</span>
                </div>

                <div class="hw-apply-bar">
                  <button class="hw-btn-apply pulsed" onclick="RouterSimulator.handleSimApply(this)">
                    Apply / حفظ وتفعيل الخدمة
                  </button>
                  <span class="save-hint">👈 اضغط حفظ هنا لتشغيل لمبة الإنترنت الخضراء!</span>
                </div>
              </div>
            </div>
          </div>
        `;

      // 3. Huawei Wi-Fi Screen
      case 'huawei_wifi':
        return `
          <div class="huawei-ui wifi-screen">
            <div class="hw-topbar-nav">
              <span class="hw-nav-item">Home</span>
              <span class="hw-nav-item">Internet</span>
              <span class="hw-nav-item active">Local Network (الشبكة المحلية)</span>
              <span class="hw-nav-item">Maintain</span>
            </div>
            <div class="hw-main-body">
              <div class="hw-sidebar">
                <div class="hw-side-item active">WLAN Basic (إعدادات الواي فاي)</div>
                <div class="hw-side-item">LAN Configuration</div>
                <div class="hw-side-item">DHCP Server</div>
              </div>
              <div class="hw-content-area">
                <div class="hw-section-header">2.4G & 5G Wireless Network Configuration</div>
                
                <div class="hw-form-group">
                  <label>SSID Name (اسم شبكة الواي فاي الجديدة):</label>
                  <div class="hw-copyable-input">
                    <input type="text" value="${wifiSsidVal}" readonly />
                    <button class="hw-btn-copy" onclick="copyTextToClipboard('${wifiSsidVal}')">نسخ الاسم 📋</button>
                  </div>
                </div>

                <div class="hw-form-group">
                  <label>Security Mode (نوع التشفير):</label>
                  <select disabled><option selected>WPA2-PSK (AES) - الأقوى أماناً</option></select>
                </div>

                <div class="hw-form-group active-glow">
                  <label>WPA PreSharedKey (باسورد الواي فاي الجديد):</label>
                  <div class="hw-copyable-input">
                    <input type="password" id="sim-wifi-pass" value="${wifiPassVal}" readonly />
                    <button class="hw-btn-copy" onclick="copyTextToClipboard('${wifiPassVal}')">نسخ الباسورد 📋</button>
                    <button class="hw-btn-peek" onclick="toggleSimPass('sim-wifi-pass')">👁️</button>
                  </div>
                </div>

                <div class="hw-checkbox-group">
                  <label><input type="checkbox" /> Hide Broadcast (إخفاء شبكة الواي فاي لمزيد من الأمان)</label>
                </div>

                <div class="hw-apply-bar">
                  <button class="hw-btn-apply pulsed">
                    Save / حفظ الإعدادات
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;

      // 4. ZTE Modern Screens (H188A / Wi-Fi 6)
      case 'zte_modern_login':
      case 'zte_classic_login':
        return `
          <div class="zte-ui login-screen">
            <div class="zte-card-login">
              <div class="zte-logo">ZTE Home Gateway</div>
              <h3>${router.nameAr}</h3>
              <div class="zte-input-field">
                <label>اسم المستخدم (Username):</label>
                <input type="text" value="${router.defaultUsername || 'user'}" readonly />
              </div>
              <div class="zte-input-field active-glow">
                <label>كلمة المرور (Password):</label>
                <div class="input-with-action">
                  <input type="password" value="••••••••" placeholder="مطبوع في ملصق الظهر" readonly />
                  <span class="zte-label-badge">من ملصق الظهر</span>
                </div>
              </div>
              <button class="zte-login-btn">تسجيل الدخول / Login</button>
            </div>
          </div>
        `;

      case 'zte_modern_wan':
      case 'zte_classic_wan':
        return `
          <div class="zte-ui wan-screen">
            <div class="zte-top-menu">
              <div class="menu-brand">Orange Internet Gateway</div>
              <div class="menu-tabs">
                <span class="active">Internet (الإنترنت)</span>
                <span>Local Network</span>
                <span>Management</span>
              </div>
            </div>
              <h4>WAN Connection - إعدادات الاتصال بمزود الخدمة (Orange)</h4>
              <div class="zte-row-field active-glow">
                <label>Username (رقم التليفون الأرضي):</label>
                <div class="zte-copy-wrapper" style="display:flex; align-items:center; gap:6px;">
                  <input type="text" value="${usernameVal.split('@')[0] || '033014556'}" readonly />
                  <span style="background:rgba(255,255,255,0.1); padding:8px 12px; border-radius:4px; font-weight:700; color:var(--orange-primary);">@Orange</span>
                  <button class="btn-copy-chip" onclick="copyTextToClipboard('${usernameVal.split('@')[0]}')">نسخ 📋</button>
                </div>
                <span class="field-hint" style="color:#FF9433;">💡 الصق الرقم الأرضي فقط لأن @Orange ثابتة في الراوتر</span>
              </div>
              <div class="zte-row-field active-glow">
                <label>Password (كلمة المرور):</label>
                <div class="zte-copy-wrapper">
                  <input type="password" id="zte-wan-pass" value="${passwordVal}" readonly />
                  <button class="btn-copy-chip" onclick="copyTextToClipboard('${passwordVal}')">نسخ 📋</button>
                  <button class="btn-peek-chip" onclick="toggleSimPass('zte-wan-pass')">👁️</button>
                </div>
              </div>
              <div class="zte-action-row">
                <button class="zte-apply-btn pulsed" onclick="RouterSimulator.handleSimApply(this)">Apply / حفظ ومزامنة</button>
              </div>
            </div>
          </div>
        `;

      case 'zte_modern_wifi':
      case 'zte_classic_wifi':
      default:
        return `
          <div class="zte-ui wifi-screen">
            <div class="zte-inner-form">
              <h4>WLAN Configuration - اسم وباسورد الواي فاي</h4>
              <div class="zte-row-field">
                <label>SSID Name:</label>
                <div class="zte-copy-wrapper">
                  <input type="text" value="${wifiSsidVal}" readonly />
                  <button class="btn-copy-chip" onclick="copyTextToClipboard('${wifiSsidVal}')">نسخ 📋</button>
                </div>
              </div>
              <div class="zte-row-field active-glow">
                <label>WPA Passphrase:</label>
                <div class="zte-copy-wrapper">
                  <input type="password" id="zte-wifi-pass" value="${wifiPassVal}" readonly />
                  <button class="btn-copy-chip" onclick="copyTextToClipboard('${wifiPassVal}')">نسخ 📋</button>
                  <button class="btn-peek-chip" onclick="toggleSimPass('zte-wifi-pass')">👁️</button>
                </div>
              </div>
              <div class="zte-action-row">
                <button class="zte-apply-btn pulsed" onclick="RouterSimulator.handleSimApply(this)">Save / حفظ الإعدادات</button>
              </div>
            </div>
          </div>
        `;
    }
  },

  handleSimApply(btn) {
    if (!btn) return;
    const origText = btn.innerHTML;
    btn.innerHTML = 'جاري المزامنة والحفظ في الراوتر... ⏳';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = '✅ تم الاتصال بنجاح! لمبة الإنترنت خضراء 🟢';
      btn.style.background = '#00D26A';
      btn.style.borderColor = '#00D26A';
      btn.style.color = '#000';
      if (typeof showToast === 'function') {
        showToast('🎉 تهانينا! تم تفعيل خدمة الإنترنت بنجاح على شاشة الراوتر.');
      }
      setTimeout(() => {
        btn.innerHTML = origText;
        btn.disabled = false;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.style.color = '';
      }, 6000);
    }, 1200);
  }
};

function toggleSimPass(id) {
  const el = document.getElementById(id);
  if (el) {
    el.type = el.type === 'password' ? 'text' : 'password';
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = RouterSimulator;
}
