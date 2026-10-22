/**
 * Orange SmartConnect - Router Script & Bookmarklet Generator
 * High-performance browser automation & 1-click router config scripts
 * Official Orange Egypt Digital Self-Care System
 */

const ScriptGenerator = {
  /**
   * Generates a clean, 1-click auto-fill browser script that can be pasted in console
   * or executed via bookmarklet on the router page (192.168.1.1)
   */
  generateAutoFillScript(routerId, config) {
    // In Orange Egypt, username is clean landline e.g. 02xxxxxxxx without @orange or .eg
    const rawUser = (config.username || '').trim();
    const cleanUser = rawUser.split('@')[0].trim();
    const password = (config.password || '').trim();
    const wifiSsid = (config.wifiSsid || '').trim();
    const wifiPass = (config.wifiPass || '').trim();

    return `
(function() {
  console.log("%c[Orange SmartConnect]%c جاري برمجة وتفعيل راوتر أورنج تلقائياً...", "color: #FF7900; font-weight: bold; font-size: 14px;", "color: #fff; font-size: 13px;");

  function triggerEvents(el) {
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.dispatchEvent(new Event('blur', { bubbles: true }));
  }

  function showOrangeToast(msg, isSuccess = true) {
    let oldToast = document.getElementById('orange-smart-toast');
    if (oldToast) oldToast.remove();
    let toast = document.createElement('div');
    toast.id = 'orange-smart-toast';
    toast.style.cssText = 'position:fixed; top:20px; left:50%; transform:translateX(-50%); background:#0f1117; color:#fff; padding:18px 28px; border-radius:12px; z-index:9999999; border:2px solid #FF7900; box-shadow:0 10px 40px rgba(255,121,0,0.5); font-family:sans-serif; text-align:center; font-size:16px; font-weight:bold; transition:all 0.4s ease; direction:rtl;';
    toast.innerHTML = (isSuccess ? '🎉 ' : '⚠️ ') + msg;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 500); }, 7000);
  }

  // Expand collapsed WAN sections or edit buttons
  const expanders = document.querySelectorAll('.accordion-header, a[title*="Modify" i], a[title*="Edit" i], input[value*="Modify" i], input[value*="Edit" i], .modify-btn, .edit-icon, .zte-icon-edit');
  expanders.forEach(el => { try { el.click(); } catch(e) {} });

  let filledCount = 0;
  const userVal = "${cleanUser}";
  const passVal = "${password}";

  // Intelligent ZTE H188A / Huawei WAN Input Discovery
  let targetUser = null;
  let targetPass = null;

  // 1. Find WAN password field
  const allPassInputs = [...document.querySelectorAll('input[type="password"]')].filter(el => el.offsetParent !== null && !el.disabled);
  targetPass = allPassInputs.find(el => el.id !== 'pc-login-password' && el.id !== 'password_login') || allPassInputs[0];

  // 2. Find matching username field in the same container / table (ZTE H188A / H168N pattern)
  if (targetPass) {
    const container = targetPass.closest('table, form, #Internet_container, .content, tbody') || targetPass.parentElement.parentElement.parentElement;
    if (container) {
      const textInputs = [...container.querySelectorAll('input[type="text"], input:not([type])')].filter(el => el.offsetParent !== null && !el.disabled && !el.readOnly);
      targetUser = textInputs.find(el => el.id.toLowerCase().includes('user') || el.name.toLowerCase().includes('user') || el.id.toLowerCase().includes('ppp') || el.name.toLowerCase().includes('ppp')) || textInputs[0];
    }
  }

  // Fallback direct selectors
  if (!targetUser) {
    targetUser = document.querySelector('input[name="username"], #username, #UserName, #Frm_Username, #Frm_PPPUsername, #pppoe-username, #WAN_Username, input[name="Username"], input[id*="user" i]');
  }
  if (!targetPass) {
    targetPass = document.querySelector('input[name="password"], #password, #Password, #Frm_Password, #Frm_PPPPassword, #pppoe-password, #WAN_Password, input[name="Password"], input[id*="pass" i]');
  }

  if (targetUser && userVal) {
    targetUser.value = userVal;
    triggerEvents(targetUser);
    filledCount++;
  }

  if (targetPass && passVal) {
    targetPass.value = passVal;
    triggerEvents(targetPass);
    filledCount++;
  }

  // 3. Fill Wi-Fi Settings if on Wi-Fi page
  ${wifiSsid ? `
  const wifiSsidInputs = ['#INPUT_SSID2', '#Frm_ESSID', '#ssid-input', 'input[name*="ssid" i]', 'input[id*="SSID" i]'];
  for (let sel of wifiSsidInputs) {
    let el = document.querySelector(sel);
    if (el && el.offsetParent !== null) {
      el.value = "${wifiSsid}";
      triggerEvents(el);
      filledCount++;
      break;
    }
  }
  ` : ''}

  ${wifiPass ? `
  const wifiPassSelectors = ['#WpaPskKey', '#Frm_KeyPassphrase', '#KeyPassphrase', '#wpa-key', 'input[name*="wpa" i]', 'input[id*="key" i]'];
  for (let sel of wifiPassSelectors) {
    let el = document.querySelector(sel);
    if (el && el.offsetParent !== null) {
      el.value = "${wifiPass}";
      triggerEvents(el);
      filledCount++;
      break;
    }
  }
  ` : ''}

  if (filledCount > 0) {
    const nextBtn = document.querySelector('input[value="Next"], button.next, input[value="التالي"]');
    const applyBtn = document.querySelector('input[value="Apply"], input[value="حفظ"], #applyBtn, #save-btn, #Btn_Apply, button.Apply, input[type="button"][value="Apply"]');
    const targetBtn = nextBtn || applyBtn;
    if (targetBtn) {
      setTimeout(() => { targetBtn.click(); }, 600);
      showOrangeToast("تم تعبئة رقم خدمة أورانج (" + userVal + ") والضغط على " + (nextBtn ? 'Next' : 'Apply / حفظ') + " تلقائياً! ستعمل الخدمة خلال ثوانٍ. 🎉", true);
    } else {
      showOrangeToast("تم تعبئة بيانات خدمة أورانج بنجاح! راجع الخانات واضغط Apply / حفظ بالأسفل.", true);
    }
  } else {
    showOrangeToast("يرجى التأكد من أنك واقف على صفحة WAN أو إعدادات الإنترنت داخل صفحة الراوتر.", false);
  }
})();
    `.trim();
  },

  /**
   * Generates a draggable Bookmarklet URI that can be stored in browser bookmarks
   * and clicked inside 192.168.1.1 on Mobile Safari, Chrome, and Desktop
   */
  generateBookmarklet(config) {
    const rawUser = (config.username || '').trim();
    const cleanUser = rawUser.split('@')[0].trim();
    const u = encodeURIComponent(cleanUser);
    const p = encodeURIComponent((config.password || '').trim());
    const s = encodeURIComponent((config.wifiSsid || 'Orange_Home_WiFi').trim());
    const w = encodeURIComponent((config.wifiPass || 'Orange#2026').trim());

    return `javascript:(function(){
      var old=document.getElementById('orange-smart-toast');if(old)old.remove();
      function toast(title,msg,isErr,actionHtml){
        var t=document.createElement('div');t.id='orange-smart-toast';
        t.style.cssText='position:fixed;top:18px;left:50%;transform:translateX(-50%);background:rgba(17,20,27,0.97);color:#fff;padding:16px 20px;border-radius:16px;z-index:2147483647;border:2px solid '+(isErr?'#FF3B30':'#FF7900')+';box-shadow:0 14px 45px rgba(255,121,0,0.5);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Cairo,sans-serif;font-size:14px;direction:rtl;text-align:right;line-height:1.6;max-width:92vw;width:440px;box-sizing:border-box;transition:all .3s ease;';
        t.innerHTML='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;"><div style="display:flex;align-items:center;gap:8px;"><span style="font-size:22px;">'+(isErr?'⚠️':'🍊')+'</span><strong style="color:#FF7900;font-size:15px;font-weight:800;">'+title+'</strong></div><span style="cursor:pointer;color:#8E99AB;font-size:18px;font-weight:bold;" onclick="this.parentElement.parentElement.remove()">✕</span></div><div style="color:#E2E8F0;font-size:13.5px;margin-bottom:'+(actionHtml?'10px':'0')+';">'+msg+'</div>'+(actionHtml||'');
        document.body.appendChild(t);
        setTimeout(function(){if(t.parentNode){t.style.opacity='0';t.style.transform='translateX(-50%) translateY(-10px)';setTimeout(function(){t.remove();},400);}},8500);
      }

      var uStr=decodeURIComponent('${u}');
      var pStr=decodeURIComponent('${p}');
      if(!uStr){
        toast('اكتب رقم تليفونك أولاً ⚠️','يرجى كتابة رقم التليفون الأرضي وباسورد الرسالة في أداة أورانج، ثم اضغط تشغيل.',true);
        return;
      }

      function getDocs(){
        var ds=[document];
        try{
          var fms=document.querySelectorAll('iframe,frame');
          for(var i=0;i<fms.length;i++){
            try{
              var cd=fms[i].contentDocument||(fms[i].contentWindow&&fms[i].contentWindow.document);
              if(cd&&ds.indexOf(cd)===-1)ds.push(cd);
            }catch(e){}
          }
        }catch(e){}
        return ds;
      }

      function qry(sel){
        var ds=getDocs();
        for(var i=0;i<ds.length;i++){
          try{
            var el=ds[i].querySelector(sel);
            if(el&&el.offsetParent!==null)return el;
          }catch(e){}
        }
        return null;
      }

      function qryAll(sel){
        var ds=getDocs(),res=[];
        for(var i=0;i<ds.length;i++){
          try{
            var els=ds[i].querySelectorAll(sel);
            for(var j=0;j<els.length;j++){
              if(els[j].offsetParent!==null&&!els[j].disabled)res.push(els[j]);
            }
          }catch(e){}
        }
        return res;
      }

      function robustClick(target){
        if(!target)return;
        var a=(target.tagName==='A')?target:(target.querySelector('a')||target);
        var events=['pointerdown','touchstart','mousedown','pointerup','touchend','mouseup','click'];
        for(var i=0;i<events.length;i++){
          try{
            var evt=new MouseEvent(events[i],{bubbles:true,cancelable:true,view:window});
            a.dispatchEvent(evt);
          }catch(e){}
        }
        try{a.click();}catch(e){}
        if(target!==a){try{target.click();}catch(e){}}
        var oc=a.getAttribute('onclick')||target.getAttribute('onclick');
        if(oc){
          try{new Function(oc).call(a);}catch(e){}
        }
      }

      function fire(el,val){
        if(el&&el.offsetParent!==null){
          el.value=decodeURIComponent(val);
          el.dispatchEvent(new Event('input',{bubbles:true}));
          el.dispatchEvent(new Event('change',{bubbles:true}));
          el.dispatchEvent(new Event('blur',{bubbles:true}));
          return 1;
        }
        return 0;
      }

      function findWanMenu(){
        var zteSel=qry('#smWAN,#sub_Internet_wan,#sub_wan,li[id*="wan" i],a[id*="wan" i],a[title="WAN" i],li[title="WAN" i],a[href*="wan" i],a[onclick*="wan" i],[data-target*="wan" i]');
        if(zteSel)return zteSel;

        var ds=getDocs();
        for(var d=0;d<ds.length;d++){
          var candidates=ds[d].querySelectorAll('a,li,span,div');
          for(var i=0;i<candidates.length;i++){
            var raw=(candidates[i].innerText||candidates[i].textContent||'').trim();
            var t=raw.replace(/\\s+/g,' ').toUpperCase();
            if(t==='WAN'||t==='إعدادات WAN'||t==='WAN CONFIG'||t==='WAN CONFIGURATION'){
              var isDsl=(candidates[i].className||'').toLowerCase().indexOf('dsl')>-1||(candidates[i].id||'').toLowerCase().indexOf('dsl')>-1;
              if(!isDsl)return candidates[i].closest('a,li')||candidates[i];
            }
          }
        }
        return null;
      }

      function findInternetMenu(){
        var sel=qry('#mainNavigator #internet,#mainNavigator #mmInternet,#Internet,#nav_internet,a[title*="Internet" i],a[title*="الإنترنت"],li[title*="Internet" i]');
        if(sel)return sel;
        var ds=getDocs();
        for(var d=0;d<ds.length;d++){
          var candidates=ds[d].querySelectorAll('a,li,span');
          for(var i=0;i<candidates.length;i++){
            var t=(candidates[i].textContent||'').trim().toUpperCase();
            if(t==='INTERNET'||t==='الإنترنت'){
              return candidates[i].closest('a,li')||candidates[i];
            }
          }
        }
        return null;
      }

      var host=location.hostname;
      var isRouterHost=host==='192.168.1.1'||host==='192.168.0.1'||host==='192.168.1.254'||host.indexOf('192.168.')===0;

      /* In-App Simulator Check */
      var simBox=document.getElementById('simulator-viewport');
      if(!isRouterHost&&simBox){
        var simUser=simBox.querySelector('input[type="text"]');
        var simPass=simBox.querySelector('input[type="password"]');
        var simBtn=simBox.querySelector('.zte-btn-orange,.zte-apply-btn,.hw-btn-apply');
        if(simUser&&simPass){
          fire(simUser,'${u}');
          fire(simPass,'${p}');
          if(simBtn){
            simBtn.style.outline='3px solid #00D26A';
            setTimeout(function(){simBtn.click();},500);
          }
          toast('تجربة ناجحة داخل المحاكي! 🎉','تم تعبئة رقم خدمة أورانج ('+uStr+') وباسورد الخدمة في المحاكي بنجاح!',false);
          return;
        }
      }

      /* Non-router site warning */
      if(!isRouterHost&&!document.querySelector('input[type="password"]')){
        toast('تنبيه: افتح صفحة الراوتر أولاً 🌐','يرجى فتح صفحة الراوتر (192.168.1.1) في تبويب مجاور، ثم تشغيل هذا الزر هناك ليقوم بالبرمجة تلقائياً.',true,'<a href="http://192.168.1.1" target="_blank" style="display:inline-block;background:#FF7900;color:#fff;padding:8px 16px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:13px;margin-top:6px;">🚀 فتح 192.168.1.1 الآن</a>');
        return;
      }

      /* Login Screen Detection */
      var loginUser=qry('#LoginId,#Frm_Username,#pc-login-username,input[name="username"],#username_login,#txt_username');
      var loginPass=qry('#Password,#Frm_Password,#pc-login-password,input[name="password"],#password_login,#txt_password');
      var loginBtn=qry('#btnLogin,#btnSubmit,#pc-login-btn,input[value="Login"],input[value="تسجيل الدخول"],button[type="submit"],.zte-login-btn,.hw-submit-btn');

      if(loginUser&&loginPass&&loginBtn){
        var bTxt=(document.body.innerText||'').toUpperCase();
        var isZte=bTxt.indexOf('ZTE')>-1||bTxt.indexOf('ZXHN')>-1||bTxt.indexOf('H188')>-1||bTxt.indexOf('H168')>-1||qry('.loginTitle,#Frm_Username');
        var defUser=isZte?'user':'admin';
        loginUser.value=defUser;
        loginUser.dispatchEvent(new Event('input',{bubbles:true}));
        loginUser.dispatchEvent(new Event('change',{bubbles:true}));
        loginPass.focus();
        toast('تم التعرف على صفحة الدخول! 🔐','تم كتابة اسم المستخدم ('+defUser+') تلقائياً.<br>الآن اكتب <strong>كلمة مرور ظهر الراوتر</strong> في خانة الباسورد ثم اضغط Login.',false);
        return;
      }

      /* WAN & Wizard Auto-Fill Engine */
      var navStep=0;
      function runWanFill(){
        navStep++;
        var filled=0;

        /* Expand collapsed WAN sections or click modify icons */
        var expanders=qryAll('.accordion-header,a[title*="Modify" i],a[title*="Edit" i],input[value*="Modify" i],input[value*="Edit" i],.modify-btn,.edit-icon,.zte-icon-edit,a[onclick*="modify" i],a[onclick*="edit" i]');
        for(var ex=0;ex<expanders.length;ex++){
          try{expanders[ex].click();}catch(e){}
        }

        /* Discover WAN or Wizard inputs */
        var passInputs=qryAll('input[type="password"]');
        var passEl=null;
        if(passInputs.length>0){
          passEl=passInputs.find(function(e){
            var id=(e.id||'').toLowerCase();
            return id!=='pc-login-password'&&id!=='password_login'&&id!=='oldpassword';
          })||passInputs[0];
        }

        var userEl=qry('#Username,#UserName,#Frm_Username,#Frm_PPPUsername,#pppoe-username,#WAN_Username,#wan_username,#txt_username,input[name="Username"],input[name="PPPUsername"],input[name*="user" i]:not(#LoginId):not(#pc-login-username)');

        if(!userEl&&passEl){
          var c=(passEl.closest?passEl.closest('table,form,.form-horizontal,.zte-wizard-modal,#Internet_container,.content,tbody'):null)||(passEl.parentElement&&passEl.parentElement.parentElement&&passEl.parentElement.parentElement.parentElement);
          if(c&&c.querySelectorAll){
            var t=[...c.querySelectorAll('input[type="text"],input:not([type])')].filter(function(e){return e.offsetParent!==null&&!e.disabled&&!e.readOnly;});
            userEl=t.find(function(e){var s=((e.id||'')+(e.name||'')).toLowerCase();return s.indexOf('user')>-1||s.indexOf('acc')>-1||s.indexOf('name')>-1||s.indexOf('ppp')>-1;})||t[0];
          }
        }

        if(userEl||passEl){
          if(fire(userEl,'${u}'))filled++;
          if(fire(passEl,'${p}'))filled++;
          fire(qry('#INPUT_SSID2,#Frm_ESSID,#ssid-input,input[name*="ssid" i]'),'${s}');
          fire(qry('#WpaPskKey,#Frm_KeyPassphrase,#KeyPassphrase,input[name*="wpa" i]'),'${w}');

          var nextBtn=qry('input[value="Next"],button.next,input[value="التالي"]');
          var applyBtn=qry('input[value="Apply"],input[value="حفظ"],#applyBtn,#save-btn,#Btn_Apply,button.Apply,.zte-btn-orange,input[type="button"][value="Apply"]');

          if(filled>0){
            var targetBtn=nextBtn||applyBtn;
            if(targetBtn){
              targetBtn.style.outline='3px solid #00D26A';
              setTimeout(function(){robustClick(targetBtn);},600);
              toast('تمت البرمجة بنجاح! 🎉','تم إدخال رقم الخدمة <strong>('+uStr+')</strong> وكلمة المرور، والضغط على <strong>'+(nextBtn?'Next':'حفظ / Apply')+'</strong> تلقائياً! 🚀',false);
            }else{
              toast('تم تعبئة البيانات بنجاح! ⚡','تم إدخال رقم الخدمة <strong>('+uStr+')</strong> والباسورد.<br>يرجى الضغط على زر Apply / حفظ بالأسفل.',false);
            }
            return;
          }
        }

        /* Switch from Status (DSL Info) to WAN */
        var wanBtn=findWanMenu();
        if(wanBtn){
          toast('جاري فتح إعدادات WAN... ⚡','تم العثور على تبويب WAN، جاري الانتقال إليه فوراً...',false);
          robustClick(wanBtn);
          try{
            var win=wanBtn.ownerDocument.defaultView||window;
            if(typeof win.clickSubMenu==='function')win.clickSubMenu('WAN');
            else if(typeof win.top.clickSubMenu==='function')win.top.clickSubMenu('WAN');
            if(typeof win.changeSubMenu==='function')win.changeSubMenu('WAN');
            else if(typeof win.top.changeSubMenu==='function')win.top.changeSubMenu('WAN');
          }catch(e){}

          if(navStep<4){
            setTimeout(runWanFill,900);
            return;
          }
        }

        /* If neither WAN inputs nor WAN menu is visible, navigate to Internet tab */
        if(navStep===1&&!wanBtn){
          var netMenu=findInternetMenu();
          if(netMenu){
            toast('جاري الانتقال لصفحة الإنترنت... ⏳','جاري فتح تبويب الإنترنت (Internet) تلقائياً...',false);
            robustClick(netMenu);
            setTimeout(runWanFill,900);
            return;
          }
        }

        toast('خطوة أخيرة مطلوبة يدويًا 💡','اضغط بإصبعك على تبويب <strong>WAN</strong> في القائمة باليسار، ثم اضغط على زر البوكماركليت مرة واحدة وسيقوم بملء كل شيء فوراً!',true);
      }

      runWanFill();
    })();`.replace(/\\s+/g, ' ');
  },

  /**
   * Generates a DNS auto-set script for family safety / adblocking
   */
  generateDnsScript(primaryDns, secondaryDns) {
    return `
(function() {
  console.log("%c[Orange SmartConnect] جاري تطبيق حماية الـ DNS النظيف...", "color:#FF7900;font-weight:bold;");
  const pInputs = document.querySelectorAll('input[name*="dns" i], input[id*="dns" i]');
  let primaryApplied = false;
  let secondaryApplied = false;

  pInputs.forEach(input => {
    if (!primaryApplied && (input.id.includes('1') || input.name.includes('1') || input.id.includes('pri') || input.name.includes('pri'))) {
      input.value = "${primaryDns}";
      input.dispatchEvent(new Event('change', { bubbles: true }));
      primaryApplied = true;
    } else if (!secondaryApplied && (input.id.includes('2') || input.name.includes('2') || input.id.includes('sec') || input.name.includes('sec'))) {
      input.value = "${secondaryDns}";
      input.dispatchEvent(new Event('change', { bubbles: true }));
      secondaryApplied = true;
    }
  });

  alert("تم إدخال عناوين الـ DNS لحماية الأسرة:\\nالأساسي: ${primaryDns}\\nالثانوي: ${secondaryDns}\\nاضغط حفظ في الراوتر لتفعيل الحظر.");
})();
    `.trim();
  },

  /**
   * Generates a 1-click safe Router Reboot script
   */
  generateRebootScript(routerId = 'orange-h188a') {
    if (routerId.includes('dg8045')) {
      return `
(function() {
  console.log("%c[Orange SmartConnect] جاري إعادة تشغيل راوتر أورنج هواوي DG8045...", "color:#FF7900;font-weight:bold;");
  try {
    var frame = document.getElementById('contentFrame');
    if (frame && frame.contentWindow) {
      frame.contentWindow.location.href = '/page/management/mngt_restart.shtml';
    } else {
      var btn = document.querySelector('#reboot, input[value*="Restart" i], input[value*="Reboot" i]');
      if (btn) btn.click();
      else location.href = '/page/management/mngt_restart.shtml';
    }
  } catch(e) {
    location.href = '/page/management/mngt_restart.shtml';
  }
  alert('تم إرسال أمر إعادة تشغيل الراوتر! سيعاد تشغيل الجهاز وسحب IP جديد لتسريع الخط خلال 60 ثانية.');
})();
      `.trim();
    }

    // Default ZTE H188A / H168N
    return `
(function() {
  console.log("%c[Orange SmartConnect] جاري إرسال أمر إعادة تشغيل راوتر أورنج ZTE...", "color:#FF7900;font-weight:bold;");
  try {
    var main = document.evaluate("//a[contains(text(),'Management') or contains(text(),'إدارة')]", document, null, XPathResult.ANY_TYPE, null).iterateNext();
    if (main) main.click();
    setTimeout(function() {
      var sub = document.evaluate("//a[contains(text(),'System Management') or contains(text(),'إدارة النظام')]", document, null, XPathResult.ANY_TYPE, null).iterateNext();
      if (sub) sub.click();
      setTimeout(function() {
        var rBtn = document.querySelector('input[value*="Restart" i], input[value*="Reboot" i], #btnRestart, #rebootBtn');
        if (rBtn) {
          rBtn.click();
          setTimeout(function() {
            var ok = document.querySelector('#confirmOK, input[value="OK"]');
            if (ok) ok.click();
          }, 400);
        }
      }, 700);
    }, 700);
  } catch(e) {
    console.error(e);
  }
  alert('تم إرسال أمر إعادة تشغيل الراوتر بنجاح! انتظر 60 ثانية لحين إضاءة لمبة الإنترنت بلون أخضر ثابت.');
})();
    `.trim();
  },

  /**
   * Generates a 1-click MAC Blocker script for intrusive devices
   */
  generateMacBlockScript(mac) {
    const clean = (mac || '').replace(/[^a-fA-F0-9:]/g, '');
    return `
(function() {
  var targetMac = "${clean}";
  console.log("%c[Orange SmartConnect] جاري إضافة الجهاز للحظر: " + targetMac, "color:#FF7900;font-weight:bold;");
  var input = document.querySelector('#Frm_SourceMACAddress, #macAddress, input[name*="mac" i], input[id*="mac" i]');
  if (input && input.offsetParent !== null) {
    input.value = targetMac;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    var addBtn = document.querySelector('#Btn_Add, #addBtn, input[value*="Add" i], input[value*="إضافة"]');
    if (addBtn) addBtn.click();
    alert('تم إدخال الماك (' + targetMac + ') وتطبيق الحظر في الراوتر بنجاح!');
  } else {
    alert('عنوان الماك المطلوب حظره هو: ' + targetMac + '\\nيرجى الانتقال لصفحة Security -> MAC Filter أو Local Network -> WLAN MAC Filter ثم لصق الكود.');
  }
})();
    `.trim();
  },

  /**
   * Generates Wi-Fi Eco & Bandwidth saving script
   */
  generateEcoModeScript() {
    return `
(function() {
  console.log("%c[Orange SmartConnect] جاري ترشيد استهلاك الباقة وتقليل تشويش الواي فاي...", "color:#FF7900;font-weight:bold;");
  // Set Bandwidth to 20MHz to save quota and stabilize signal
  var bwSel = document.querySelector('select[name*="bandwidth" i], select[id*="bandwidth" i], #Frm_Bandwidth');
  if (bwSel) {
    for (var i = 0; i < bwSel.options.length; i++) {
      if (bwSel.options[i].text.includes('20') && !bwSel.options[i].text.includes('40')) {
        bwSel.selectedIndex = i;
        bwSel.dispatchEvent(new Event('change', { bubbles: true }));
        break;
      }
    }
  }
  alert('تم ضبط تردد الواي فاي على 20MHz فائق التوفير لتقليل التشويش وحماية باقة أورنج من النفاد السريع! اضغط Save / Apply للحفظ.');
})();
    `.trim();
  },

  /**
   * Generates Wi-Fi QR Code string formatted according to standard WIFI URI scheme:
   * WIFI:T:WPA;S:MySSID;P:MyPassword;H:false;;
   */
  generateWifiQrString(ssid, password, isHidden = false, encryption = 'WPA') {
    const escapedSsid = (ssid || '').replace(/([\\;,:"])/g, '\\$1');
    const escapedPass = (password || '').replace(/([\\;,:"])/g, '\\$1');
    return `WIFI:T:${encryption};S:${escapedSsid};P:${escapedPass};H:${isHidden ? 'true' : 'false'};;`;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScriptGenerator;
}
