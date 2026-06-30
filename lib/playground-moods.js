const LOCAL_KEY = 'vh-playground-mood-stamps';
const TABLE = 'mood_stamps';
export const RETENTION_MS = 7 * 24 * 60 * 60 * 1000;
export const MAX_BOARD_STAMPS = 120;
export const POLL_MS = 45000;

const VALID_MOOD_IDS = new Set([
  'happy',
  'calm',
  'tired',
  'hyped',
  'meh',
  'sad',
  'inspired',
  'grumpy'
]);

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function formatStampDate(date = new Date()) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function sanitizeName(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 32);
}

function isValidUuid(value) {
  return typeof value === 'string' && UUID_RE.test(value);
}

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url, key };
}

export function isSharedBoardEnabled() {
  return Boolean(getSupabaseConfig());
}

function retentionCutoffIso() {
  return new Date(Date.now() - RETENTION_MS).toISOString();
}

function normalizeStamp(entry) {
  if (!entry?.stampId || !VALID_MOOD_IDS.has(entry.stampId)) return null;
  if (!isValidUuid(entry.id)) return null;

  const createdAtMs = Date.parse(entry.createdAt || entry.created_at || '');
  const createdAt = Number.isFinite(createdAtMs)
    ? new Date(createdAtMs).toISOString()
    : new Date().toISOString();

  const x = Number(entry.x);
  const y = Number(entry.y);
  const rotation = Number(entry.rotation);

  return {
    id: entry.id,
    stampId: entry.stampId,
    x: Number.isFinite(x) ? Math.min(Math.max(x, 0), 100) : 0,
    y: Number.isFinite(y) ? Math.min(Math.max(y, 0), 100) : 0,
    rotation: Number.isFinite(rotation) ? Math.min(Math.max(rotation, -180), 180) : 0,
    name: sanitizeName(entry.name),
    createdAt,
    date: formatStampDate(new Date(createdAt))
  };
}

function pruneStamps(stamps) {
  const cutoff = Date.now() - RETENTION_MS;

  return stamps
    .map(normalizeStamp)
    .filter(Boolean)
    .filter((entry) => Date.parse(entry.createdAt) >= cutoff)
    .slice(0, MAX_BOARD_STAMPS);
}

function readLocalStamps() {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? pruneStamps(parsed) : [];
  } catch {
    return [];
  }
}

function writeLocalStamps(stamps) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LOCAL_KEY, JSON.stringify(pruneStamps(stamps)));
}

function rowToStamp(row) {
  return normalizeStamp({
    id: row.id,
    stampId: row.stamp_id,
    x: row.x,
    y: row.y,
    rotation: row.rotation,
    name: row.name,
    createdAt: row.created_at
  });
}

function stampToRow(stamp) {
  return {
    id: stamp.id,
    stamp_id: stamp.stampId,
    x: stamp.x,
    y: stamp.y,
    rotation: stamp.rotation,
    name: stamp.name || ''
  };
}

async function supabaseRequest(path, options = {}) {
  const config = getSupabaseConfig();
  if (!config) throw new Error('Supabase is not configured');

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      'Content-Type': 'application/json',
      Prefer: options.prefer || 'return=representation',
      ...options.headers
    }
  });

  if (!response.ok) {
    throw new Error(`Supabase request failed (${response.status})`);
  }

  if (response.status === 204) return null;

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export async function fetchMoodStamps() {
  if (!isSharedBoardEnabled()) {
    return readLocalStamps();
  }

  const cutoff = retentionCutoffIso();
  const rows = await supabaseRequest(
    `${TABLE}?select=id,stamp_id,x,y,rotation,name,created_at&created_at=gte.${encodeURIComponent(cutoff)}&order=created_at.asc&limit=${MAX_BOARD_STAMPS}`
  );

  return Array.isArray(rows) ? pruneStamps(rows.map(rowToStamp)) : [];
}

export async function createMoodStamp(stamp) {
  const normalized = normalizeStamp({
    ...stamp,
    name: sanitizeName(stamp.name)
  });
  if (!normalized) throw new Error('Invalid mood stamp');

  if (!isSharedBoardEnabled()) {
    const next = pruneStamps([...readLocalStamps(), normalized]);
    writeLocalStamps(next);
    return normalized;
  }

  const rows = await supabaseRequest(TABLE, {
    method: 'POST',
    body: JSON.stringify(stampToRow(normalized))
  });

  return rowToStamp(Array.isArray(rows) ? rows[0] : rows);
}

export async function updateMoodStamp(stamp) {
  const normalized = normalizeStamp({
    ...stamp,
    name: sanitizeName(stamp.name)
  });
  if (!normalized) throw new Error('Invalid mood stamp');

  if (isSharedBoardEnabled()) {
    return normalized;
  }

  const next = pruneStamps(
    readLocalStamps().map((entry) => (entry.id === normalized.id ? normalized : entry))
  );
  writeLocalStamps(next);
  return normalized;
}

export async function deleteMoodStamp(id) {
  if (!id || isSharedBoardEnabled()) return;

  writeLocalStamps(readLocalStamps().filter((entry) => entry.id !== id));
}

export async function deleteAllMoodStamps() {
  if (isSharedBoardEnabled()) return;

  writeLocalStamps([]);
}

export function loadLocalMoodStamps() {
  return readLocalStamps();
}
