/**
 * Orange SmartConnect - Router In-Page Floating Assistant (Content Script)
 * Automatically injects when customer visits 192.168.1.1
 * Official Orange Egypt Router In-Page Assistant
 */

(function () {
  // Prevent duplicate injections
  if (window.__orange_assistant_injected) return;
  window.__orange_assistant_injected = true;

  console.log("%c[Orange SmartConnect]%c In-Page Assistant loaded on router gateway!", "color: #FF7900; font-weight: bold; font-size: 14px;", "color: #00D26A; font-size: 13px;");

  // Load saved state if any (for multi-step login -> WAN transition)
  const savedConfig = JSON.parse(localStorage.getItem('__orange_auto_config') || '{}');

  // Create Floating Launcher & Widget
  const host = document.createElement('div');
  host.id = 'orange-smartconnect-root';
  host.style.cssText = 'all: initial; position: fixed; z-index: 2147483647; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Cairo", sans-serif; direction: rtl;';
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.textContent = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    /* Floating Pill Button */
    .floating-pill {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: linear-gradient(135deg, #FF7900 0%, #D95F00 100%);
      color: #fff;
      padding: 12px 22px;
      border-radius: 9999px;
      box-shadow: 0 8px 30px rgba(255, 121, 0, 0.5), 0 4px 12px rgba(0,0,0,0.4);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 15px;
      font-weight: bold;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      border: 2px solid rgba(255, 255, 255, 0.4);
      animation: pulseGlow 2.5s infinite;
    }
    
    @keyframes pulseGlow {
      0%, 100% { transform: scale(1); box-shadow: 0 8px 30px rgba(255, 121, 0, 0.5); }
      50% { transform: scale(1.04); box-shadow: 0 10px 40px rgba(255, 121, 0, 0.8); }
    }

    .floating-pill:hover {
      transform: translateY(-3px) scale(1.05);
    }

    .pill-logo {
      width: 26px;
      height: 26px;
      background: #000;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FF7900;
      font-weight: 900;
      font-size: 15px;
    }

    /* Modal Dialog */
    .assistant-modal {
      position: fixed;
      bottom: 84px;
      right: 24px;
      width: 380px;
      max-width: calc(100vw - 48px);
      background: #11141B;
      border: 2px solid #FF7900;
      border-radius: 18px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.8), 0 0 35px rgba(255, 121, 0, 0.3);
      color: #fff;
      overflow: hidden;
      display: none;
      flex-direction: column;
      animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .assistant-modal.open {
      display: flex;
    }

    .modal-header {
      background: #191E28;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .modal-title {
      font-size: 16px;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 8px;
      color: #fff;
    }

    .modal-title span.hl { color: #FF7900; }

    .btn-close {
      background: rgba(255, 255, 255, 0.08);
      border: none;
      color: #aaa;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .btn-close:hover { background: #FF7900; color: #fff; }

    .modal-body {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      max-height: 75vh;
      overflow-y: auto;
    }

    .guide-banner {
      background: rgba(255, 121, 0, 0.1);
      border: 1px dashed rgba(255, 121, 0, 0.4);
      padding: 10px 14px;
      border-radius: 10px;
      font-size: 13px;
      color: #E2E8F0;
      line-height: 1.5;
    }

    .field-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .field-group label {
      font-size: 13px;
      font-weight: bold;
      color: #CBD5E1;
    }

    .field-group input {
      background: #090B0F;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 8px;
      padding: 10px 12px;
      color: #fff;
      font-size: 14px;
      direction: ltr;
      text-align: right;
      transition: all 0.2s;
    }

    .field-group input:focus {
      outline: none;
      border-color: #FF7900;
      box-shadow: 0 0 10px rgba(255, 121, 0, 0.4);
    }

    .btn-action-auto {
      background: linear-gradient(135deg, #FF7900 0%, #D95F00 100%);
      color: #fff;
      border: none;
      border-radius: 10px;
      padding: 14px;
      font-size: 15px;
      font-weight: 800;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-shadow: 0 6px 20px rgba(255, 121, 0, 0.4);
      transition: all 0.2s;
      margin-top: 6px;
    }

    .btn-action-auto:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 121, 0, 0.6);
    }

    .status-alert {
      padding: 12px;
      border-radius: 8px;
      font-size: 13px;
      line-height: 1.5;
      display: none;
    }
    .status-alert.success {
      background: rgba(0, 210, 106, 0.15);
      border: 1px solid #00D26A;
      color: #A7F3D0;
      display: block;
    }
    .status-alert.error {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid #EF4444;
      color: #FCA5A5;
      display: block;
    }

    .modal-footer {
      background: #141822;
      padding: 10px 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      font-size: 11px;
      color: #94A3B8;
      text-align: center;
    }
  `;

  shadow.appendChild(style);

  // Widget HTML
  const widgetHtml = document.createElement('div');
  widgetHtml.innerHTML = `
    <!-- Launcher Pill -->
    <div class="floating-pill" id="btn-toggle">
      <div class="pill-logo">🍊</div>
      <span>مساعد أورانج للتفعيل الذاتي</span>
    </div>

    <!-- Assistant Modal -->
    <div class="assistant-modal" id="modal-box">
      <div class="modal-header">
        <div class="modal-title">
          <span>🍊 Orange</span>
          <span class="hl">SmartConnect</span>
        </div>
        <button class="btn-close" id="btn-close">✕</button>
      </div>

      <div class="modal-body">
        <div class="guide-banner">
          مرحباً بك! اكتب رقم التليفون الأرضي وباسورد رسالة أورانج واضغط <strong>تفعيل الآن</strong>، وسنقوم ببرمجة الراوتر وتشغيل الخدمة تلقائياً!
        </div>

        <div class="field-group">
          <label>رقم التليفون الأرضي / اسم المستخدم:</label>
          <input type="text" id="auto-username" placeholder="مثال: 033014556 أو 02xxxxxxxx" value="${savedConfig.username || ''}" />
          <div style="font-size:11px; color:#FF9433; margin-top:3px;">💡 اكتب الرقم الأرضي فقط بدون @Orange لأن الراوتر يضيفها تلقائياً</div>
        </div>

        <div class="field-group">
          <label>كلمة مرور الخدمة (من رسالة أورانج SMS):</label>
          <input type="text" id="auto-password" placeholder="اكتب كلمة المرور في الرسالة" value="${savedConfig.password || ''}" />
        </div>

        <div class="field-group">
          <label>اسم شبكة الواي فاي الجديدة (SSID):</label>
          <input type="text" id="auto-wifi-ssid" value="${savedConfig.wifiSsid || 'Orange_Home_WiFi'}" />
        </div>

        <div class="field-group">
          <label>باسورد الواي فاي الجديد:</label>
          <input type="text" id="auto-wifi-pass" value="${savedConfig.wifiPass || 'Orange#2026'}" />
        </div>

        <button class="btn-action-auto" id="btn-run-auto">
          <span>🚀</span> فعّل وبرمج الراوتر الآن تلقائياً
        </button>

        <div class="status-alert" id="status-box"></div>
      </div>

      <div class="modal-footer">
        Orange Egypt Digital Self-Care System | بوابة التفعيل الموحدة
      </div>
    </div>
  `;

  shadow.appendChild(widgetHtml);

  // Toggle Modal Logic
  const pillBtn = shadow.getElementById('btn-toggle');
  const closeBtn = shadow.getElementById('btn-close');
  const modalBox = shadow.getElementById('modal-box');
  const runBtn = shadow.getElementById('btn-run-auto');
  const statusBox = shadow.getElementById('status-box');

  pillBtn.addEventListener('click', () => {
    modalBox.classList.toggle('open');
  });

  closeBtn.addEventListener('click', () => {
    modalBox.classList.remove('open');
  });

  // Open automatically on first visit
  setTimeout(() => {
    modalBox.classList.add('open');
  }, 1000);

  // Trigger DOM events helper
  function fireEvents(el) {
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.dispatchEvent(new Event('blur', { bubbles: true }));
  }

  // Automation Engine Execution
  runBtn.addEventListener('click', () => {
    let rawUser = shadow.getElementById('auto-username').value.trim();
    const cleanUser = rawUser.split('@')[0].trim();
    const password = shadow.getElementById('auto-password').value.trim();
    const wifiSsid = shadow.getElementById('auto-wifi-ssid').value.trim();
    const wifiPass = shadow.getElementById('auto-wifi-pass').value.trim();

    if (!cleanUser || !password) {
      statusBox.className = 'status-alert error';
      statusBox.innerHTML = '⚠️ يرجى كتابة رقم التليفون الأرضي وكلمة المرور من رسالة أورانج أولاً!';
      return;
    }

    // Persist in localStorage in case of page refresh/redirect
    localStorage.setItem('__orange_auto_config', JSON.stringify({
      username: cleanUser, password, wifiSsid, wifiPass, autoRun: true
    }));

    statusBox.className = 'status-alert success';
    statusBox.innerHTML = '⏳ جاري فحص صفحة الراوتر وتعبئة البيانات تلقائياً...';

    executeRouterFilling(cleanUser, password, wifiSsid, wifiPass);
  });

  function executeRouterFilling(username, password, wifiSsid, wifiPass) {
    let filledFields = 0;

    // 1. Check if on Login screen
    const isZteLogin = document.querySelector('#Frm_Username') || document.querySelector('.emFont.loginTitle') || document.body.innerText.includes('ZTE');
    const loginUser = document.querySelector('#LoginId, #Frm_Username, #pc-login-username, input[name="username"]');
    const loginPass = document.querySelector('#Password, #Frm_Password, #pc-login-password, input[name="password"]');
    const loginSubmit = document.querySelector('#btnLogin, #btnSubmit, #pc-login-btn, input[value="Login"]');

    if (loginUser && loginPass && loginSubmit) {
      // In ZTE (H188A, H168N) default user is 'user', in Huawei it is 'admin'
      const targetUser = isZteLogin ? 'user' : 'admin';
      loginUser.value = targetUser;
      fireEvents(loginUser);

      if (!loginPass.value) {
        statusBox.className = 'status-alert success';
        statusBox.innerHTML = `🔑 تم وضع اسم المستخدم (<strong>${targetUser}</strong>) تلقائياً! اكتب باسورد ظهر الراوتر في خانة Password ثم اضغط Login، وسيكمل المساعد التفعيل فور الدخول.`;
        return;
      }
    }

    // 2. Intelligent Auto-Navigation to WAN Settings if not currently on WAN form
    const zteMainInternet = document.querySelector('#mainNavigator #internet, #mainNavigator #mmInternet, a[title*="Internet"]');
    const zteWanContainer = document.getElementById('Internet_container');
    if (zteMainInternet && !zteWanContainer && !document.querySelector('input[type="password"]')) {
      statusBox.className = 'status-alert success';
      statusBox.innerHTML = '🧭 جاري فتح صفحة إعدادات الإنترنت (WAN) في راوتر ZTE تلقائياً...';
      zteMainInternet.click();
      setTimeout(() => {
        const zteWanSide = document.querySelector('#commLeft a[title*="WAN"], #commLeft .selectClass2Menu');
        if (zteWanSide) zteWanSide.click();
        setTimeout(() => executeRouterFilling(username, password, wifiSsid, wifiPass), 1000);
      }, 800);
      return;
    }

    // 3. Fill WAN / PPPoE Credentials with ZTE H188A Intelligent DOM Discovery
    let wanUser = null;
    let wanPass = null;

    // Find WAN password element
    const allPassInputs = [...document.querySelectorAll('input[type="password"]')].filter(el => el.offsetParent !== null && !el.disabled);
    wanPass = allPassInputs.find(el => el.id !== 'Password' && el.id !== 'pc-login-password') || allPassInputs[0];

    // Find matching username in same table / row / container (ZTE H188A pattern)
    if (wanPass) {
      const container = wanPass.closest('table, form, #Internet_container, .content, tbody') || wanPass.parentElement.parentElement.parentElement;
      if (container) {
        const textInputs = [...container.querySelectorAll('input[type="text"], input:not([type])')].filter(el => el.offsetParent !== null && !el.disabled && !el.readOnly);
        wanUser = textInputs.find(el => el.id.toLowerCase().includes('user') || el.name.toLowerCase().includes('user')) || textInputs[0];
      }
    }

    // Fallbacks
    if (!wanUser) {
      wanUser = document.querySelector('input[name="username"], #username, #UserName, #Frm_Username, #pppoe-username, #WAN_Username, input[id*="user" i]');
    }
    if (!wanPass) {
      wanPass = document.querySelector('input[name="password"], #password, #Password, #Frm_Password, #pppoe-password, #WAN_Password, input[id*="pass" i]');
    }

    if (wanUser && username) {
      wanUser.value = username;
      fireEvents(wanUser);
      filledFields++;
    }

    if (wanPass && password) {
      wanPass.value = password;
      fireEvents(wanPass);
      filledFields++;
    }

    // 4. Fill Wi-Fi Settings if present
    if (wifiSsid) {
      const wifiSsidInputs = ['#INPUT_SSID2', '#Frm_ESSID', '#ssid-input', 'input[name*="ssid" i]', 'input[id*="SSID" i]'];
      for (let sel of wifiSsidInputs) {
        let el = document.querySelector(sel);
        if (el && el.offsetParent !== null) {
          el.value = wifiSsid;
          fireEvents(el);
          filledFields++;
          break;
        }
      }
    }

    if (wifiPass) {
      const wifiPassInputs = ['#WpaPskKey', '#Frm_KeyPassphrase', '#KeyPassphrase', '#wpa-key', 'input[name*="wpa" i]', 'input[id*="key" i]'];
      for (let sel of wifiPassInputs) {
        let el = document.querySelector(sel);
        if (el && el.offsetParent !== null) {
          el.value = wifiPass;
          fireEvents(el);
          filledFields++;
          break;
        }
      }
    }

    // 5. Submit / Apply
    const applyBtn = document.querySelector('input[value="Apply"], input[value="حفظ"], #Btn_Apply, #applyBtn, #save-btn, button.Apply, input[type="button"][value="Apply"]');
    if (applyBtn && filledFields > 0) {
      setTimeout(() => {
        applyBtn.click();
      }, 600);
      statusBox.className = 'status-alert success';
      statusBox.innerHTML = '🎉 تم تعبئة رقم تليفون أورانج (' + username + ') والضغط على Apply تلقائياً! ستعمل لمبة الإنترنت خلال ثوانٍ قليلة.';
    } else if (filledFields > 0) {
      statusBox.className = 'status-alert success';
      statusBox.innerHTML = '✅ تم ملء رقم التليفون والباسورد بنجاح! اضغط فقط على زر (Apply / Save / حفظ) بالأسفل.';
    } else {
      statusBox.className = 'status-alert error';
      statusBox.innerHTML = 'ℹ️ لم نجد خانات WAN في هذه الصفحة الحالية. يرجى الضغط على كلمة (Internet) في القائمة، وسيقوم المساعد بتعبئتها فوراً!';
    }
  }

  // Auto-run if pending configuration from previous step
  if (savedConfig.autoRun && savedConfig.username && savedConfig.password) {
    setTimeout(() => {
      executeRouterFilling(savedConfig.username, savedConfig.password, savedConfig.wifiSsid, savedConfig.wifiPass);
    }, 1500);
  }
})();
