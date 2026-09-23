const VISITOR_ID_KEY = 'vh-site-visitor-id';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url, key };
}

export function isSiteCounterEnabled() {
  return Boolean(getSupabaseConfig());
}

function randomId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();

  const bytes = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  }

  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function getVisitorId() {
  if (typeof window === 'undefined') return null;

  const existing = window.localStorage.getItem(VISITOR_ID_KEY);
  if (existing && UUID_RE.test(existing)) return existing;

  const next = randomId();
  window.localStorage.setItem(VISITOR_ID_KEY, next);
  return next;
}

async function supabaseRpc(functionName, args) {
  const config = getSupabaseConfig();
  if (!config) throw new Error('Supabase is not configured');

  const response = await fetch(`${config.url}/rest/v1/rpc/${functionName}`, {
    method: 'POST',
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(args)
  });

  if (!response.ok) {
    throw new Error(`Supabase RPC failed (${response.status})`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export async function registerSiteVisit() {
  if (!isSiteCounterEnabled()) return null;

  const visitorId = getVisitorId();
  if (!visitorId) return null;

  const count = await supabaseRpc('register_site_visitor', {
    p_visitor_id: visitorId
  });

  return Number.isFinite(Number(count)) ? Number(count) : null;
}
