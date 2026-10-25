/** In-app browsers (X/Twitter, Instagram, Facebook) that break fixed chrome. */
export function isEmbeddedBrowser() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  if (/Twitter|TwitterAndroid|\bX\/\d/i.test(ua)) return true;
  if (/FBAN|FBAV|Instagram|Line\/|TikTok|Snapchat/i.test(ua)) return true;
  if (typeof document !== 'undefined' && /t\.co\/|x\.com\//i.test(document.referrer)) return true;
  return false;
}
