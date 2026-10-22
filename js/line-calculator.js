/**
 * Orange SmartConnect - VDSL & ADSL Line Quality Diagnostic Engine
 * Official Orange Egypt Line Performance Engine
 */

const LineCalculator = {
  /**
   * Evaluates line metrics based on Downstream Attenuation and Downstream SNR Margin
   * @param {number} attenuation - Downstream line attenuation in dB
   * @param {number} snr - Downstream SNR margin in dB
   * @param {number} currentSync - Optional current sync speed in Mbps
   */
  evaluateLine(attenuation, snr, currentSync = 0) {
    const att = parseFloat(attenuation);
    const s = parseFloat(snr);

    if (isNaN(att) || isNaN(s)) {
      return {
        valid: false,
        message: 'يرجى إدخال قيم صحيحة للتشويش (SNR) والوهن (Attenuation)'
      };
    }

    // 1. Distance Estimation: Copper attenuation approx 13.8 dB / km for VDSL 0.4mm wire
    const estimatedDistanceMeters = Math.round((att / 13.8) * 1000);

    // 2. Maximum Theoretical Download Speed (VDSL Profile 17a typical Egyptian Telecom MSAN)
    let maxSpeedMbps = 0;
    if (att <= 8) {
      maxSpeedMbps = 100;
    } else if (att <= 12) {
      maxSpeedMbps = 85;
    } else if (att <= 16) {
      maxSpeedMbps = 70;
    } else if (att <= 20) {
      maxSpeedMbps = 55;
    } else if (att <= 25) {
      maxSpeedMbps = 40;
    } else if (att <= 30) {
      maxSpeedMbps = 28;
    } else if (att <= 38) {
      maxSpeedMbps = 18;
    } else {
      maxSpeedMbps = 10;
    }

    // 3. Line Stability Rating based on SNR Margin
    let stabilityStatus = '';
    let stabilityClass = '';
    let stabilityScore = 0; // 0 - 100

    if (s >= 18) {
      stabilityStatus = 'خط فائق الاستقرار وخالي من أي تشويش (ممتاز جداً)';
      stabilityClass = 'status-excellent';
      stabilityScore = 98;
    } else if (s >= 12) {
      stabilityStatus = 'خط مستقر وثابت بدرجة عالية (جيد جداً)';
      stabilityClass = 'status-good';
      stabilityScore = 85;
    } else if (s >= 8) {
      stabilityStatus = 'خط مقبول، قد يحدث انقطاع طفيف في أوقات الذروة';
      stabilityClass = 'status-fair';
      stabilityScore = 65;
    } else if (s >= 6) {
      stabilityStatus = 'خط حرج ومعرض للتقطيع المتكرر عند السرعات العالية';
      stabilityClass = 'status-critical';
      stabilityScore = 40;
    } else {
      stabilityStatus = 'خط سيء جداً وبه تشويش خطير يمنع ثبات خدمة الإنترنت';
      stabilityClass = 'status-bad';
      stabilityScore = 20;
    }

    // 4. Distance Assessment
    let distanceLabel = '';
    if (estimatedDistanceMeters < 500) {
      distanceLabel = `أنت قريب جداً من كابينة الفايبر MSAN (~${estimatedDistanceMeters} متر)`;
    } else if (estimatedDistanceMeters < 1200) {
      distanceLabel = `مسافة متوسطة وطبيعية من الكابينة (~${estimatedDistanceMeters} متر)`;
    } else {
      distanceLabel = `مسافة بعيدة نسبياً عن السنترال أو الكابينة (~${estimatedDistanceMeters} متر)`;
    }

    // 5. Recommended Orange Package
    let recommendedTier = '';
    if (maxSpeedMbps >= 70) {
      recommendedTier = 'باقة أورانج VDSL سرعة 70 إلى 100 ميجا (خطك يدعمها بكل كفاءة)';
    } else if (maxSpeedMbps >= 30) {
      recommendedTier = 'باقة أورانج VDSL سرعة 30 ميجا (الأنسب لخطك لأعلى ثبات)';
    } else {
      recommendedTier = 'باقة أورانج الاقتصادية 16 ميجا (لتجنب التقطيع على المسافات البعيدة)';
    }

    // 6. Actionable Advice
    const tips = [];
    if (s < 10) {
      tips.push('تأكد من تركيب سلك التليفون مباشرة في مدخل LINE في السبليتر الأصلي.');
      tips.push('تجنب أي لحامات أو عقد في سلك التليفون، ويفضل سلك السويدي النحاسي المصمت.');
      tips.push('ابعد سلك الراوتر عن كابلات الكهرباء ومحولات الأجهزة المنزلية.');
    } else {
      tips.push('سلك التليفون بحالة ممتازة وخطك مؤهل لأعلى سرعات أورانج.');
      tips.push('استمتع بألعاب الأونلاين والبث المباشر 4K بدون دروب فريم.');
    }

    return {
      valid: true,
      attenuation: att,
      snr: s,
      estimatedDistanceMeters,
      distanceLabel,
      maxSpeedMbps,
      stabilityScore,
      stabilityStatus,
      stabilityClass,
      recommendedTier,
      tips
    };
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = LineCalculator;
}
