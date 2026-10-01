export type HapticPreset = 'light' | 'medium' | 'success';

const SWITCH_ID = 'v2-ios-haptic-switch';

export function isIosDevice() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return true;
  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
}

function canVibrate() {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
}

/** iOS Safari has no Vibration API. Clicking a native switch emits a system tap. */
function ensureIosSwitch() {
  if (typeof document === 'undefined' || !isIosDevice()) return null;
  const existing = document.getElementById(SWITCH_ID);
  if (existing instanceof HTMLInputElement) return existing;

  const input = document.createElement('input');
  input.type = 'checkbox';
  input.id = SWITCH_ID;
  input.setAttribute('switch', '');
  input.tabIndex = -1;
  input.setAttribute('aria-hidden', 'true');
  input.style.cssText =
    'position:fixed;left:0;top:0;width:48px;height:28px;margin:0;opacity:0.02;z-index:-1;border:0;pointer-events:none;';
  document.body.appendChild(input);
  return input;
}

function tapIosSwitch(times: number, gapMs: number) {
  const input = ensureIosSwitch();
  if (!input) return;
  const click = () => input.click();
  click();
  for (let i = 1; i < times; i += 1) {
    window.setTimeout(click, gapMs * i);
  }
}

function vibrate(pattern: number | number[]) {
  if (!canVibrate()) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    // Desktop and unsupported browsers expose nothing useful here.
  }
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ensureIosSwitch(), { once: true });
  } else {
    ensureIosSwitch();
  }
}

export function triggerHaptic(preset: HapticPreset) {
  if (isIosDevice()) {
    if (preset === 'light') tapIosSwitch(1, 0);
    else if (preset === 'medium') tapIosSwitch(2, 30);
    else tapIosSwitch(2, 90);
    return;
  }

  if (preset === 'light') vibrate(20);
  else if (preset === 'medium') vibrate(50);
  else vibrate([40, 50, 40]);
}
