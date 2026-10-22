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

    const usernameClean = (this.currentConfig.username || '').split('@')[0].trim();
    const usernameVal = usernameClean;
    const passwordVal = this.currentConfig.password || '';
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
          <button class="sim-copy-all-btn" onclick="copyTextToClipboard('${this.currentStepIndex === 0 ? (router.defaultUsername || 'user') : (this.currentStepIndex === 1 ? (usernameVal || 'user') : wifiSsidVal)}')">
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
          }, containerId)}
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

  renderScreenContent(screenType, data, containerId) {
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

      // 4. ZTE Authentic Wizard Screens (ZXHN H188A V2.0.1P2_EGO & VDSL)
      case 'zte_h188a_login':
      case 'zte_modern_login':
      case 'zte_classic_login':
        return `
          <div class="zte-h188a-shell">
            <div class="zte-h188a-topbar">
              <span class="zte-orange-logo-box">orange</span>
            </div>
            <div class="zte-h188a-nav">
              <span class="active">Home</span>
              <span>Internet</span>
              <span>Local Network</span>
              <span>Management & Diagnosis</span>
            </div>
            <div class="zte-h188a-canvas">
              <div class="zte-wizard-modal" style="max-width:440px;">
                <div class="zte-wizard-header">
                  <span class="zte-step-title">ZTE ZXHN H188A - User Login</span>
                  <button class="zte-close-btn" title="Close">✕</button>
                </div>
                <div class="zte-wizard-body" style="padding:28px 24px;">
                  <div class="zte-field-row">
                    <span class="zte-field-label">Username:</span>
                    <div class="zte-field-ctrl">
                      <input type="text" class="zte-input" value="${router.defaultUsername || 'user'}" style="width:180px; font-weight:700;" readonly />
                      <span class="zte-input-suffix" style="font-size:11px;">ثابت</span>
                    </div>
                  </div>
                  <div class="zte-field-row">
                    <span class="zte-field-label">Password:</span>
                    <div class="zte-field-ctrl">
                      <input type="password" id="sim-zte-login-pass" class="zte-input" value="••••••••" placeholder="مطبوع في ملصق الظهر" style="width:180px;" readonly />
                      <button class="zte-copy-pill" onclick="copyTextToClipboard('${router.defaultUsername || 'user'}')">نسخ user</button>
                    </div>
                  </div>
                  <div style="font-size:11px; color:#FF9433; margin-top:2px; direction:rtl; text-align:right;">
                    💡 اسم المستخدم: <strong>${router.defaultUsername || 'user'}</strong> والباسورد مطبوع على ملصق ظهر الراوتر
                  </div>
                  <div class="zte-wizard-footer-actions" style="justify-content:center; margin-top:14px;">
                    <button class="zte-btn-orange" style="width:100%; height:32px; font-size:13px;" onclick="RouterSimulator.nextStep('${containerId}')">
                      Login / تسجيل الدخول وفتح معالج الإعدادات →
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="zte-h188a-copyright">©2008-2021 ZTE Corporation. All rights reserved | H188A V2.0.1P2_EGO</div>
          </div>
        `;

      case 'zte_h188a_step1':
      case 'zte_modern_wan':
      case 'zte_classic_wan':
        return `
          <div class="zte-h188a-shell">
            <div class="zte-h188a-topbar">
              <span class="zte-orange-logo-box">orange</span>
            </div>
            <div class="zte-h188a-nav">
              <span>Home</span>
              <span class="active">Internet</span>
              <span>Local Network</span>
              <span>Management & Diagnosis</span>
            </div>
            <div class="zte-h188a-canvas">
              <div class="zte-wizard-modal">
                <div class="zte-wizard-header">
                  <span class="zte-step-title">STEP1 - PPP Configuration</span>
                  <button class="zte-close-btn" title="Close" onclick="showToast('معالج الإعداد السريع لراوتر أورانج H188A')">✕</button>
                </div>
                <div class="zte-wizard-body">
                  <div class="zte-field-row">
                    <span class="zte-field-label">DSL Transfer Mode</span>
                    <div class="zte-field-ctrl">
                      <select class="zte-select" style="width:140px;">
                        <option selected>ATM</option>
                        <option>PTM</option>
                      </select>
                    </div>
                  </div>
                  <div class="zte-field-row">
                    <span class="zte-field-label">VPI/VCI</span>
                    <div class="zte-field-ctrl" style="gap:4px;">
                      <input type="text" value="0" class="zte-input" style="width:42px; text-align:center;" readonly />
                      <span style="color:#6B7280; font-weight:bold;">/</span>
                      <input type="text" value="35" class="zte-input" style="width:42px; text-align:center;" readonly />
                    </div>
                  </div>
                  <div class="zte-field-row">
                    <span class="zte-field-label">Username</span>
                    <div class="zte-field-ctrl">
                      <input type="text" id="sim-zte-ppp-user" class="zte-input" value="${usernameVal}" placeholder="رقم التليفون الأرضي" style="width:160px;" readonly />
                      <span class="zte-input-suffix">@orange</span>
                      ${usernameVal ? `<button class="zte-copy-pill" onclick="copyTextToClipboard('${usernameVal}')">نسخ 📋</button>` : ''}
                    </div>
                  </div>
                  <div class="zte-field-row">
                    <span class="zte-field-label">Password</span>
                    <div class="zte-field-ctrl">
                      <input type="password" id="sim-zte-ppp-pass" class="zte-input" value="${passwordVal}" placeholder="كلمة المرور في SMS" style="width:160px;" readonly />
                      ${passwordVal ? `<button class="zte-copy-pill" onclick="copyTextToClipboard('${passwordVal}')">نسخ 📋</button>` : ''}
                      <button class="zte-peek-pill" onclick="toggleSimPass('sim-zte-ppp-pass')">👁️</button>
                    </div>
                  </div>
                  <div class="zte-wizard-footer-actions">
                    <button class="zte-btn-orange-outline" onclick="RouterSimulator.nextStep('${containerId}')">Skip</button>
                    <button class="zte-btn-orange" onclick="RouterSimulator.nextStep('${containerId}')">Next</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="zte-h188a-copyright">©2008-2021 ZTE Corporation. All rights reserved | H188A V2.0.1P2_EGO</div>
          </div>
        `;

      case 'zte_h188a_step2':
        return `
          <div class="zte-h188a-shell">
            <div class="zte-h188a-topbar">
              <span class="zte-orange-logo-box">orange</span>
            </div>
            <div class="zte-h188a-nav">
              <span>Home</span>
              <span>Internet</span>
              <span class="active">Local Network</span>
              <span>Management & Diagnosis</span>
            </div>
            <div class="zte-h188a-canvas">
              <div class="zte-wizard-modal">
                <div class="zte-wizard-header">
                  <span class="zte-step-title">STEP2 - WiFi(2.4G) Configuration</span>
                  <button class="zte-close-btn" title="Close">✕</button>
                </div>
                <div class="zte-wizard-body">
                  <div class="zte-field-row">
                    <span class="zte-field-label">WLAN On/Off</span>
                    <div class="zte-field-ctrl">
                      <label class="zte-radio"><input type="radio" name="sim_wlan24" checked /> On</label>
                      <label class="zte-radio" style="margin-left:14px;"><input type="radio" name="sim_wlan24" /> Off</label>
                    </div>
                  </div>
                  <div class="zte-field-row">
                    <span class="zte-field-label">SSID Name</span>
                    <div class="zte-field-ctrl">
                      <span class="zte-input-prefix">Orange-</span>
                      <input type="text" class="zte-input" value="${wifiSsidVal.replace(/^Orange[-_]/i, '')}" style="width:170px;" readonly />
                      <button class="zte-copy-pill" onclick="copyTextToClipboard('${wifiSsidVal}')">نسخ 📋</button>
                    </div>
                  </div>
                  <div class="zte-field-row">
                    <span class="zte-field-label">Encryption Type</span>
                    <div class="zte-field-ctrl">
                      <select class="zte-select" style="width:200px;">
                        <option selected>WPA/WPA2-PSK-TKIP/AES</option>
                        <option>WPA2-PSK</option>
                      </select>
                    </div>
                  </div>
                  <div class="zte-field-row">
                    <span class="zte-field-label">WPA Passphrase</span>
                    <div class="zte-field-ctrl">
                      <input type="password" id="sim-zte-pass24" class="zte-input" value="${wifiPassVal}" style="width:170px;" readonly />
                      <button class="zte-copy-pill" onclick="copyTextToClipboard('${wifiPassVal}')">نسخ 📋</button>
                    </div>
                  </div>
                  <div class="zte-field-row">
                    <span class="zte-field-label"></span>
                    <div class="zte-field-ctrl">
                      <label class="zte-checkbox">
                        <input type="checkbox" onchange="toggleSimPass('sim-zte-pass24')" /> show password
                      </label>
                    </div>
                  </div>
                  <div class="zte-wizard-footer-actions">
                    <button class="zte-btn-orange" onclick="RouterSimulator.prevStep('${containerId}')">Back</button>
                    <button class="zte-btn-orange-outline" onclick="RouterSimulator.nextStep('${containerId}')">Skip</button>
                    <button class="zte-btn-orange" onclick="RouterSimulator.nextStep('${containerId}')">Next</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="zte-h188a-copyright">©2008-2021 ZTE Corporation. All rights reserved | H188A V2.0.1P2_EGO</div>
          </div>
        `;

      case 'zte_h188a_step3':
      case 'zte_modern_wifi':
      case 'zte_classic_wifi':
      default:
        return `
          <div class="zte-h188a-shell">
            <div class="zte-h188a-topbar">
              <span class="zte-orange-logo-box">orange</span>
            </div>
            <div class="zte-h188a-nav">
              <span>Home</span>
              <span>Internet</span>
              <span class="active">Local Network</span>
              <span>Management & Diagnosis</span>
            </div>
            <div class="zte-h188a-canvas">
              <div class="zte-wizard-modal">
                <div class="zte-wizard-header">
                  <span class="zte-step-title">STEP3 - WiFi(5G) Configuration</span>
                  <button class="zte-close-btn" title="Close">✕</button>
                </div>
                <div class="zte-wizard-body">
                  <div class="zte-field-row">
                    <span class="zte-field-label">WLAN On/Off</span>
                    <div class="zte-field-ctrl">
                      <label class="zte-radio"><input type="radio" name="sim_wlan5g" checked /> On</label>
                      <label class="zte-radio" style="margin-left:14px;"><input type="radio" name="sim_wlan5g" /> Off</label>
                    </div>
                  </div>
                  <div class="zte-field-row">
                    <span class="zte-field-label">SSID Name</span>
                    <div class="zte-field-ctrl">
                      <span class="zte-input-prefix">Orange-</span>
                      <input type="text" class="zte-input" value="${wifiSsidVal.replace(/^Orange[-_]/i, '')}${wifiSsidVal.toLowerCase().includes('5g') ? '' : '-5G'}" style="width:170px;" readonly />
                      <button class="zte-copy-pill" onclick="copyTextToClipboard('${wifiSsidVal}-5G')">نسخ 📋</button>
                    </div>
                  </div>
                  <div class="zte-field-row">
                    <span class="zte-field-label">Encryption Type</span>
                    <div class="zte-field-ctrl">
                      <select class="zte-select" style="width:200px;">
                        <option selected>WPA/WPA2-PSK-TKIP/AES</option>
                        <option>WPA2-PSK</option>
                      </select>
                    </div>
                  </div>
                  <div class="zte-field-row">
                    <span class="zte-field-label">WPA Passphrase</span>
                    <div class="zte-field-ctrl">
                      <input type="password" id="sim-zte-pass5g" class="zte-input" value="${wifiPassVal}" style="width:170px;" readonly />
                      <button class="zte-copy-pill" onclick="copyTextToClipboard('${wifiPassVal}')">نسخ 📋</button>
                    </div>
                  </div>
                  <div class="zte-field-row">
                    <span class="zte-field-label"></span>
                    <div class="zte-field-ctrl">
                      <label class="zte-checkbox">
                        <input type="checkbox" onchange="toggleSimPass('sim-zte-pass5g')" /> show password
                      </label>
                    </div>
                  </div>
                  <div class="zte-wizard-footer-actions">
                    <button class="zte-btn-orange" onclick="RouterSimulator.prevStep('${containerId}')">Back</button>
                    <button class="zte-btn-orange-outline" onclick="RouterSimulator.handleZteFinish(this)">Skip</button>
                    <button class="zte-btn-orange" onclick="RouterSimulator.handleZteFinish(this)">Next / Save</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="zte-h188a-copyright">©2008-2021 ZTE Corporation. All rights reserved | H188A V2.0.1P2_EGO</div>
          </div>
        `;
    }
  },

  handleZteFinish(btn) {
    if (!btn) return;
    const origText = btn.innerHTML;
    btn.innerHTML = 'Saving... ⏳';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = '✅ Saved Successfully!';
      btn.style.background = '#00D26A';
      btn.style.borderColor = '#00D26A';
      if (typeof showToast === 'function') {
        showToast('🎉 تهانينا! تم حفظ إعدادات راوتر ZTE H188A ولمبة الإنترنت زرقاء ثابتة 🔵');
      }
      setTimeout(() => {
        btn.innerHTML = origText;
        btn.disabled = false;
        btn.style.background = '';
        btn.style.borderColor = '';
      }, 5000);
    }, 1200);
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
