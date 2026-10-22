/**
 * Orange SmartConnect - Router Database & Specification
 * Official Orange Egypt Router Knowledge Base & Diagnostics
 */

const ROUTER_DATABASE = {
  routers: [
    {
      id: 'orange-dg8045',
      name: 'Orange VDSL Gateway (Huawei DG8045)',
      nameAr: 'راوتر أورانج الأسود VDSL (هواوي DG8045)',
      category: 'orange-official',
      popular: true,
      badge: 'الأكثر انتشاراً في الفروع',
      image: '/assets/images/orange_dg8045.jpg',
      manufacturer: 'Huawei',
      gatewayIp: '192.168.1.1',
      defaultUsername: 'admin',
      passwordNote: 'مطبوع في ملصق ظهر الراوتر (حروف كبيرة وصغيرة)',
      wanPage: 'http://192.168.1.1/html/bbsp/wan/wan.asp',
      quickSetupUrl: 'http://192.168.1.1/index.asp',
      wifiPage: 'http://192.168.1.1/html/amp/wlanbasic/WlanBasic.asp?2G',
      lineStatsPage: 'http://192.168.1.1/html/status/dslinfo.asp',
      indicators: [
        { name: 'Power', labelAr: 'الكهرباء', color: 'green', descAr: 'ثابتة خضراء تعني أن محول الكهرباء سليم' },
        { name: 'DSL', labelAr: 'كابل الخط', color: 'green', descAr: 'ثابتة خضراء = حرارة السنترال واصلة بنجاح' },
        { name: 'Internet', labelAr: 'الإنترنت', color: 'green', descAr: 'تنور أخضر بعد إدخال اليوزر والباسورد بنجاح' },
        { name: 'WLAN', labelAr: 'الواي فاي', color: 'green', descAr: 'خضراء = شبكة الواي فاي تبث بنجاح' }
      ],
      selectors: {
        login: { user: '#LoginId', pass: '#Password', submit: '#btnLogin' },
        wan: { user: 'input[name="username"]', pass: 'input[name="password"]', submit: 'input[value="Apply"]' },
        wifi: { ssid: '#INPUT_SSID2', pass: '#WpaPskKey', hide: '#Broadcast' }
      },
      simulator: {
        steps: [
          {
            titleAr: 'تسجيل الدخول للراوتر',
            hintAr: 'اكتب admin في اسم المستخدم، والباسورد من ملصق ظهر الراوتر',
            activeField: 'login_pass',
            screenType: 'huawei_login'
          },
          {
            titleAr: 'معالج ضبط خدمة أورانج (Quick Setup)',
            hintAr: 'الصق اسم المستخدم والباسورد المرسل في رسالة SMS من أورانج',
            activeField: 'wan_credentials',
            screenType: 'huawei_wan'
          },
          {
            titleAr: 'تسمية شبكة الواي فاي والباسورد',
            hintAr: 'اختر اسم شبكة واضح وكلمة سر قوية لحماية باقتك',
            activeField: 'wifi_settings',
            screenType: 'huawei_wifi'
          }
        ]
      }
    },
    {
      id: 'orange-h188a',
      name: 'Orange Wi-Fi 6 Gateway (ZTE ZXHN H188A)',
      nameAr: 'راوتر أورانج واي فاي 6 الحديث (ZTE H188A)',
      category: 'orange-official',
      popular: true,
      badge: 'الجيل السادس الأحدث',
      image: '/assets/images/orange_h188a.jpg',
      manufacturer: 'ZTE',
      gatewayIp: '192.168.1.1',
      defaultUsername: 'user',
      passwordNote: 'مطبوع في ملصق ظهر الراوتر (اسم المستخدم: user بحروف صغيرة)',
      wanPage: 'http://192.168.1.1/#internet',
      quickSetupUrl: 'http://192.168.1.1/#wizard',
      wifiPage: 'http://192.168.1.1/#localnet',
      lineStatsPage: 'http://192.168.1.1/#dslinfo',
      indicators: [
        { name: 'Power', labelAr: 'الكهرباء', color: 'cyan', descAr: 'ثابت أزرق/أبيض عند اكتمال الإقلاع' },
        { name: 'Broadband', labelAr: 'كابل الخط', color: 'cyan', descAr: 'ثابت = الخط النحاسي أو الفايبر متصل' },
        { name: 'Internet', labelAr: 'الإنترنت', color: 'cyan', descAr: 'يتحول لأزرق عند تفعيل حساب أورانج' },
        { name: 'Wi-Fi 6', labelAr: 'واي فاي 6', color: 'cyan', descAr: 'يبث بترددين 2.4GHz و 5GHz فائقين' }
      ],
      selectors: {
        login: { user: '#Frm_Username', pass: '#Frm_Password', submit: '#btnLogin' },
        wan: { user: '#Username', pass: '#Password', submit: '#applyBtn' },
        wifi: { ssid: '#WLANSSIDConf_inst0_SSIDName', pass: '#KeyPassphrase', hide: '#SSIDHide' }
      },
      simulator: {
        steps: [
          {
            titleAr: 'دخول راوتر ZTE H188A الحديث',
            hintAr: 'اكتب user في اسم المستخدم والباسورد المطبوع على ملصق ظهر الراوتر',
            activeField: 'login_pass',
            screenType: 'zte_h188a_login'
          },
          {
            titleAr: 'STEP 1: إعدادات PPP / تفعيل الإنترنت',
            hintAr: 'اختر ATM ثم اكتب رقم التليفون الأرضي الصافي (الراوتر يضيف @orange تلقائياً) وباسورد رسالة SMS',
            activeField: 'wan_credentials',
            screenType: 'zte_h188a_step1'
          },
          {
            titleAr: 'STEP 2: ضبط واي فاي 2.4G Configuration',
            hintAr: 'تسمية شبكة التردد 2.4GHz وباسورد الحماية وخاصية إظهار كلمة المرور',
            activeField: 'wifi_settings_24',
            screenType: 'zte_h188a_step2'
          },
          {
            titleAr: 'STEP 3: ضبط واي فاي 5G Configuration',
            hintAr: 'تسمية شبكة التردد فائق السرعة 5GHz وباسورد الحماية وحفظ الإعدادات',
            activeField: 'wifi_settings_5g',
            screenType: 'zte_h188a_step3'
          }
        ]
      }
    },
    {
      id: 'orange-h168n',
      name: 'Orange VDSL Gateway (ZTE ZXHN H168N)',
      nameAr: 'راوتر أورانج VDSL كلاسيك (ZTE H168N)',
      category: 'orange-official',
      popular: false,
      badge: 'راوتر الفروع الكلاسيكي',
      image: '/assets/images/orange_dg8045.jpg',
      manufacturer: 'ZTE',
      gatewayIp: '192.168.1.1',
      defaultUsername: 'user',
      passwordNote: 'مطبوع في ملصق ظهر الراوتر (اسم المستخدم: user في الموديلات الحديثة أو admin في القديمة)',
      wanPage: 'http://192.168.1.1/getpage.gch?pid=1002&nextpage=IPv46_net_wan_conf_t.gch',
      quickSetupUrl: 'http://192.168.1.1/getpage.gch?pid=1002&nextpage=wizard_net_ipv46_t.gch',
      wifiPage: 'http://192.168.1.1/getpage.gch?pid=1002&nextpage=net_wlan_essid_t.gch',
      lineStatsPage: 'http://192.168.1.1/getpage.gch?pid=1002&nextpage=status_dsl_info_t.gch',
      indicators: [
        { name: 'Power', labelAr: 'الكهرباء', color: 'green', descAr: 'خضراء ثابتة' },
        { name: 'DSL', labelAr: 'إشارة الخط', color: 'green', descAr: 'ثابتة = تم استلام إشارة الـ VDSL' },
        { name: 'Internet', labelAr: 'الإنترنت', color: 'green', descAr: 'تومض عند تبادل البيانات' },
        { name: 'WLAN', labelAr: 'الواي فاي', color: 'green', descAr: 'مفعلة' }
      ],
      selectors: {
        login: { user: '#Frm_Username', pass: '#Frm_Password', submit: '#btnLogin' },
        wan: { user: '#Frm_Username', pass: '#Frm_Password', submit: '#Btn_Apply' },
        wifi: { ssid: '#Frm_ESSID', pass: '#Frm_KeyPassphrase', hide: '#Frm_BeaconType' }
      },
      simulator: {
        steps: [
          {
            titleAr: 'تسجيل دخول راوتر ZTE H168N',
            hintAr: 'اليوزر user أو admin والباسورد من ظهر الراوتر',
            activeField: 'login_pass',
            screenType: 'zte_classic_login'
          },
          {
            titleAr: 'إعدادات WAN / PPPoE',
            hintAr: 'إدخال يوزر وباسورد رسالة أورانج',
            activeField: 'wan_credentials',
            screenType: 'zte_classic_wan'
          },
          {
            titleAr: 'إعدادات شبكة WLAN',
            hintAr: 'تغيير اسم الشبكة وكلمة المرور',
            activeField: 'wifi_settings',
            screenType: 'zte_classic_wifi'
          }
        ]
      }
    },
    {
      id: 'orange-vn020',
      name: 'Orange TP-Link VDSL (VN020-F3)',
      nameAr: 'راوتر أورانج تي بي لينك (TP-Link VN020-F3)',
      category: 'orange-official',
      popular: false,
      badge: 'موديل TP-Link بهوائيين',
      image: '/assets/images/orange_dg8045.jpg',
      manufacturer: 'TP-Link',
      gatewayIp: '192.168.1.1',
      defaultUsername: 'admin',
      passwordNote: 'اليوزر والباسورد admin افتراضياً أو المطبوع بالظهر',
      wanPage: 'http://192.168.1.1/',
      quickSetupUrl: 'http://192.168.1.1/#quicksetup',
      wifiPage: 'http://192.168.1.1/#wireless',
      lineStatsPage: 'http://192.168.1.1/#status',
      indicators: [
        { name: 'Power', labelAr: 'الكهرباء', color: 'green', descAr: 'إضاءة خضراء مستمرة' },
        { name: 'DSL', labelAr: 'خط الهاتف', color: 'green', descAr: 'ثابتة تعني أن الكابل سليم والحرارة موجودة' },
        { name: 'Internet', labelAr: 'الإنترنت', color: 'green', descAr: 'علامة الكرة الأرضية خضراء' },
        { name: 'Wi-Fi', labelAr: 'الواي فاي', color: 'green', descAr: 'رمز الموجات مضيء' }
      ],
      selectors: {
        login: { user: '#pc-login-username', pass: '#pc-login-password', submit: '#pc-login-btn' },
        wan: { user: '#pppoe-username', pass: '#pppoe-password', submit: '#save-btn' },
        wifi: { ssid: '#ssid-input', pass: '#wpa-key', hide: '#hide-ssid' }
      },
      simulator: {
        steps: [
          {
            titleAr: 'دخول راوتر TP-Link',
            hintAr: 'اكتب كلمة المرور admin أو المنشأة حديثاً',
            activeField: 'login_pass',
            screenType: 'tplink_login'
          },
          {
            titleAr: 'معالج الإعداد السريع Quick Setup',
            hintAr: 'اختر PPPoE واكتب بيانات رسالة أورانج',
            activeField: 'wan_credentials',
            screenType: 'tplink_wan'
          },
          {
            titleAr: 'ضبط اسم وباسورد الواي فاي',
            hintAr: 'اكتب اسم شبكتك والباسورد الجديد',
            activeField: 'wifi_settings',
            screenType: 'tplink_wifi'
          }
        ]
      }
    },
    {
      id: 'converted-we-dg8045',
      name: 'Converted WE / TeData Router (Huawei DG8045)',
      nameAr: 'راوتر وي القديم محول لأورانج (هواوي DG8045)',
      category: 'converted',
      popular: true,
      badge: 'تحويل خط من وي إلى أورانج',
      image: '/assets/images/orange_dg8045.jpg',
      manufacturer: 'Huawei',
      gatewayIp: '192.168.1.1',
      defaultUsername: 'admin',
      passwordNote: 'الباسورد المطبوع على ظهر راوتر وي القديم',
      wanPage: 'http://192.168.1.1/html/bbsp/wan/wan.asp',
      quickSetupUrl: 'http://192.168.1.1/index.asp',
      wifiPage: 'http://192.168.1.1/html/amp/wlanbasic/WlanBasic.asp?2G',
      lineStatsPage: 'http://192.168.1.1/html/status/dslinfo.asp',
      indicators: [
        { name: 'Power', labelAr: 'الكهرباء', color: 'green', descAr: 'ثابت' },
        { name: 'DSL', labelAr: 'الخط النحاسي', color: 'green', descAr: 'ثابت = ربط كابينة أورانج بالسنترال' },
        { name: 'Internet', labelAr: 'الإنترنت', color: 'green', descAr: 'يتحول لأخضر فور تغيير يوزر وباسورد وي إلى أورانج' }
      ],
      selectors: {
        login: { user: '#LoginId', pass: '#Password', submit: '#btnLogin' },
        wan: { user: 'input[name="username"]', pass: 'input[name="password"]', submit: 'input[value="Apply"]' },
        wifi: { ssid: '#INPUT_SSID2', pass: '#WpaPskKey', hide: '#Broadcast' }
      },
      simulator: {
        steps: [
          {
            titleAr: 'دخول راوتر وي بحسابه القديم',
            hintAr: 'اكتب admin وباسورد ظهر راوتر وي',
            activeField: 'login_pass',
            screenType: 'huawei_login'
          },
          {
            titleAr: 'مسح بيانات وي وإدخال حساب أورانج',
            hintAr: 'امسح @tedata.net.eg واكتب رقم خط أورانج متبوعاً بـ @orange.eg وباسورد رسالة أورانج',
            activeField: 'wan_credentials',
            screenType: 'huawei_wan'
          },
          {
            titleAr: 'حفظ وتأكيد تشغيل الخدمة',
            hintAr: 'اضغط Apply وستتحول لمبة الإنترنت لخضراء خلال 30 ثانية',
            activeField: 'wifi_settings',
            screenType: 'huawei_wifi'
          }
        ]
      }
    },
    {
      id: 'converted-vodafone-dg8045',
      name: 'Converted Vodafone Router (Huawei DG8045 / VDSL)',
      nameAr: 'راوتر فودافون القديم محول لأورانج (VDSL)',
      category: 'converted',
      popular: false,
      badge: 'تحويل خط من فودافون لأورانج',
      image: '/assets/images/orange_dg8045.jpg',
      manufacturer: 'Huawei',
      gatewayIp: '192.168.1.1',
      defaultUsername: 'vodafone',
      passwordNote: 'اليوزر vodafone والباسورد vodafone أو على الظهر',
      wanPage: 'http://192.168.1.1/html/bbsp/wan/wan.asp',
      quickSetupUrl: 'http://192.168.1.1/index.asp',
      wifiPage: 'http://192.168.1.1/html/amp/wlanbasic/WlanBasic.asp?2G',
      lineStatsPage: 'http://192.168.1.1/html/status/dslinfo.asp',
      indicators: [
        { name: 'Power', labelAr: 'الكهرباء', color: 'green', descAr: 'ثابتة' },
        { name: 'DSL', labelAr: 'الخط', color: 'green', descAr: 'ثابتة' },
        { name: 'Internet', labelAr: 'الإنترنت', color: 'green', descAr: 'خضراء' }
      ],
      selectors: {
        login: { user: '#LoginId', pass: '#Password', submit: '#btnLogin' },
        wan: { user: 'input[name="username"]', pass: 'input[name="password"]', submit: 'input[value="Apply"]' },
        wifi: { ssid: '#INPUT_SSID2', pass: '#WpaPskKey', hide: '#Broadcast' }
      },
      simulator: {
        steps: [
          {
            titleAr: 'تسجيل الدخول لراوتر فودافون',
            hintAr: 'جرب vodafone / vodafone أو admin',
            activeField: 'login_pass',
            screenType: 'huawei_login'
          },
          {
            titleAr: 'استبدال اشتراك فودافون ببيانات أورانج',
            hintAr: 'اكتب اسم مستخدم وكلمة مرور أورانج المستلمة في SMS',
            activeField: 'wan_credentials',
            screenType: 'huawei_wan'
          },
          {
            titleAr: 'تأكيد التفعيل',
            hintAr: 'اضغط حفظ ومبروك انتقالك لشبكة أورانج',
            activeField: 'wifi_settings',
            screenType: 'huawei_wifi'
          }
        ]
      }
    }
  ],

  dnsProfiles: [
    {
      id: 'family-clean',
      nameAr: 'حماية الأسرة والأطفال (حجب المواقع الإباحية والضارة)',
      nameEn: 'Clean Family Protection (Blocks Adult & Malicious Sites)',
      primaryDns: '1.1.1.3',
      secondaryDns: '1.0.0.3',
      provider: 'Cloudflare 1.1.1.3 for Families',
      badge: 'موصى به عائلياً'
    },
    {
      id: 'adguard-family',
      nameAr: 'حماية إعلانية + عائلية مشددة',
      nameEn: 'AdGuard Family Protection',
      primaryDns: '94.140.14.15',
      secondaryDns: '94.140.15.16',
      provider: 'AdGuard Family DNS',
      badge: 'مانع إعلانات وإباحي'
    },
    {
      id: 'gaming-performance',
      nameAr: 'أقصى سرعة واستجابة للألعاب (بنج أقل)',
      nameEn: 'Ultra-low Ping Gaming DNS',
      primaryDns: '1.1.1.1',
      secondaryDns: '8.8.8.8',
      provider: 'Cloudflare & Google Ultra DNS',
      badge: 'للجيمنج والألعاب'
    }
  ],

  speedThrottleOptions: [
    { speed: '5Mbps', labelAr: 'تحديد 5 ميجا (توفير فائق للباقة)', mode: '802.11b only' },
    { speed: '10Mbps', labelAr: 'تحديد 10 ميجا (تصفح وفيديوهات HD متزنة)', mode: '802.11b/g (54Mbps ceiling)' },
    { speed: '15Mbps', labelAr: 'تحديد 15 ميجا (مثالي لـ 4 أجهزة)', mode: '802.11b/g/n limited' },
    { speed: 'unlimited', labelAr: 'السرعة الكاملة لخطك (بدون تحديد)', mode: '802.11b/g/n mixed (Max VDSL)' }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ROUTER_DATABASE;
}
