'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  MAX_BOARD_STAMPS,
  POLL_MS,
  createMoodStamp,
  deleteAllMoodStamps,
  deleteMoodStamp,
  fetchMoodStamps,
  isSharedBoardEnabled,
  loadLocalMoodStamps,
  updateMoodStamp
} from '../../../lib/playground-moods';

const MOODS = [
  { id: 'happy', label: 'Happy', emoji: '😊' },
  { id: 'calm', label: 'Calm', emoji: '😌' },
  { id: 'tired', label: 'Tired', emoji: '😴' },
  { id: 'hyped', label: 'Hyped', emoji: '🔥' },
  { id: 'meh', label: 'Meh', emoji: '🫠' },
  { id: 'sad', label: 'Sad', emoji: '😢' },
  { id: 'inspired', label: 'Inspired', emoji: '✨' },
  { id: 'grumpy', label: 'Grumpy', emoji: '😤' }
];

const SHARED_BOARD = isSharedBoardEnabled();

function moodById(id) {
  return MOODS.find((mood) => mood.id === id);
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

function randomRotation() {
  return Math.round(Math.random() * 10 - 5);
}

function formatDisplayDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function mergeRemoteStamps(current, remote, pendingId) {
  if (!pendingId) return remote;
  const pending = current.find((entry) => entry.id === pendingId);
  if (!pending) return remote;
  if (remote.some((entry) => entry.id === pendingId)) return remote;
  return [...remote, pending];
}

export default function IWasHereClient() {
  const boardRef = useRef(null);
  const dragRef = useRef(null);
  const nameInputRef = useRef(null);

  const [placed, setPlaced] = useState([]);
  const [activeMoodId, setActiveMoodId] = useState(MOODS[0].id);
  const [selectedId, setSelectedId] = useState(null);
  const [namingId, setNamingId] = useState(null);
  const [nameInput, setNameInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadBoard() {
      try {
        const stamps = SHARED_BOARD ? await fetchMoodStamps() : loadLocalMoodStamps();
        if (!cancelled) setPlaced(stamps);
      } catch {
        if (!cancelled) {
          setPlaced(loadLocalMoodStamps());
          setError('Could not load the shared board. Showing local stamps only.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadBoard();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!SHARED_BOARD || loading) return undefined;

    let cancelled = false;
    let intervalId = null;

    async function refreshBoard() {
      if (document.hidden || namingId || saving) return;
      setSyncing(true);
      try {
        const remote = await fetchMoodStamps();
        if (!cancelled) {
          setPlaced((current) => mergeRemoteStamps(current, remote, namingId));
          setError('');
        }
      } catch {
        if (!cancelled) setError('Live sync paused. New stamps still save when you place one.');
      } finally {
        if (!cancelled) setSyncing(false);
      }
    }

    function stopPolling() {
      if (!intervalId) return;
      window.clearInterval(intervalId);
      intervalId = null;
    }

    function startPolling() {
      if (intervalId || document.hidden) return;
      refreshBoard();
      intervalId = window.setInterval(refreshBoard, POLL_MS);
    }

    function handleVisibilityChange() {
      if (document.hidden) stopPolling();
      else startPolling();
    }

    startPolling();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelled = true;
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loading, namingId, saving]);

  useEffect(() => {
    if (!namingId) return;
    nameInputRef.current?.focus();
  }, [namingId]);

  function boardPoint(clientX, clientY) {
    const board = boardRef.current;
    if (!board) return { x: 50, y: 50 };
    const rect = board.getBoundingClientRect();
    if (!rect.width || !rect.height) return { x: 50, y: 50 };

    return {
      x: Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 0), 100),
      y: Math.min(Math.max(((clientY - rect.top) / rect.height) * 100, 0), 100)
    };
  }

  function buildStamp(clientX, clientY) {
    const mood = moodById(activeMoodId);
    if (!mood) return null;

    const point = boardPoint(clientX, clientY);
    const createdAt = new Date().toISOString();

    return {
      id: randomId(),
      stampId: mood.id,
      x: point.x,
      y: point.y,
      rotation: randomRotation(),
      name: '',
      date: formatDisplayDate(createdAt),
      createdAt
    };
  }

  async function placeStamp(clientX, clientY) {
    if (placed.length >= MAX_BOARD_STAMPS || namingId || loading || saving) return;

    const item = buildStamp(clientX, clientY);
    if (!item) return;

    setError('');

    if (SHARED_BOARD) {
      setPlaced((prev) => [...prev, item]);
      setSelectedId(item.id);
      setNamingId(item.id);
      setNameInput('');
      return;
    }

    setPlaced((prev) => [...prev, item]);
    setSelectedId(item.id);
    setNamingId(item.id);
    setNameInput('');

    try {
      const saved = await createMoodStamp(item);
      setPlaced((prev) => prev.map((entry) => (entry.id === item.id ? saved : entry)));
      setSelectedId(saved.id);
      setNamingId(saved.id);
    } catch {
      setPlaced((prev) => prev.filter((entry) => entry.id !== item.id));
      setNamingId(null);
      setSelectedId(null);
      setError('Could not save your stamp. Try again in a moment.');
    }
  }

  async function finishNaming(name) {
    if (!namingId || saving) return;

    const currentId = namingId;
    const trimmed = name.trim();
    const nextStamp = placed.find((entry) => entry.id === currentId);
    if (!nextStamp) {
      setNamingId(null);
      setNameInput('');
      return;
    }

    const updated = { ...nextStamp, name: trimmed };
    setNamingId(null);
    setNameInput('');
    setSaving(true);

    if (SHARED_BOARD) {
      setPlaced((prev) => prev.map((entry) => (entry.id === currentId ? updated : entry)));
    } else {
      setPlaced((prev) => prev.map((entry) => (entry.id === currentId ? updated : entry)));
      try {
        const saved = await updateMoodStamp(updated);
        setPlaced((prev) => prev.map((entry) => (entry.id === currentId ? saved : entry)));
      } catch {
        setError('Your stamp is on the board, but the name did not save locally.');
      } finally {
        setSaving(false);
      }
      return;
    }

    try {
      const saved = await createMoodStamp(updated);
      setPlaced((prev) => prev.map((entry) => (entry.id === currentId ? saved : entry)));
      setSelectedId(saved.id);
      setError('');
    } catch {
      setPlaced((prev) => prev.filter((entry) => entry.id !== currentId));
      setSelectedId(null);
      setError('Could not save your stamp. The board may be full or busy — try again soon.');
    } finally {
      setSaving(false);
    }
  }

  function handleBoardClick(event) {
    if (event.target !== boardRef.current || namingId || loading || saving) return;
    placeStamp(event.clientX, event.clientY);
  }

  function startDrag(itemId, event) {
    if (namingId || saving) return;
    event.preventDefault();
    event.stopPropagation();
    setSelectedId(itemId);

    const item = placed.find((entry) => entry.id === itemId);
    if (!item) return;

    const startPoint = boardPoint(event.clientX, event.clientY);
    dragRef.current = {
      itemId,
      offsetX: startPoint.x - item.x,
      offsetY: startPoint.y - item.y,
      pointerId: event.pointerId,
      moved: false
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const point = boardPoint(event.clientX, event.clientY);
    drag.moved = true;
    setPlaced((prev) =>
      prev.map((entry) =>
        entry.id === drag.itemId
          ? { ...entry, x: point.x - drag.offsetX, y: point.y - drag.offsetY }
          : entry
      )
    );
  }

  function endDrag(event) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const { itemId, moved } = drag;
    dragRef.current = null;

    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // pointer may already be released
    }

    if (!moved || SHARED_BOARD) return;

    setPlaced((prev) => {
      const stamp = prev.find((entry) => entry.id === itemId);
      if (stamp) updateMoodStamp(stamp).catch(() => setError('Could not save the new stamp position.'));
      return prev;
    });
  }

  async function removeSelected() {
    if (!selectedId || namingId || SHARED_BOARD) return;
    const id = selectedId;

    setPlaced((prev) => prev.filter((entry) => entry.id !== id));
    setSelectedId(null);

    try {
      await deleteMoodStamp(id);
    } catch {
      setError('Could not remove that stamp.');
      setPlaced(loadLocalMoodStamps());
    }
  }

  async function clearBoard() {
    if (namingId || SHARED_BOARD) return;

    setPlaced([]);
    setSelectedId(null);

    try {
      await deleteAllMoodStamps();
    } catch {
      setError('Could not clear the board.');
      setPlaced(loadLocalMoodStamps());
    }
  }

  const namingMood = namingId ? moodById(placed.find((entry) => entry.id === namingId)?.stampId) : null;

  return (
    <div className="playground-stamps">
      <div className="playground-stamps-header fade-up">
        <p className="playground-stamps-eyebrow">
          <Link href="/playground/" className="playground-eyebrow-back" aria-label="Back to playground">
            <span className="playground-eyebrow-arrow" aria-hidden="true">
              <img src="/assets/images/Arrow.svg" alt="" />
            </span>
            Playground
          </Link>
        </p>
        <h1 className="playground-stamps-title">What&apos;s your mood today?</h1>
        <p className="playground-stamps-note">
          Pick a mood, stamp the board, add your name — and leave a tiny mark with today&apos;s date.
          {SHARED_BOARD
            ? ' Everyone sees the same board. Stamps fade after a week.'
            : ' Stamps stay on this device for a week, then fade away.'}
        </p>
        {SHARED_BOARD ? (
          <p className="playground-stamps-sync" aria-live="polite">
            {saving ? 'Saving stamp…' : syncing ? 'Syncing board…' : 'Shared board live'}
          </p>
        ) : null}
        {error ? <p className="playground-stamps-error">{error}</p> : null}
      </div>

      <div className="playground-stamps-palette fade-up delay-1" role="toolbar" aria-label="Mood picker">
        {MOODS.map((mood) => (
          <button
            key={mood.id}
            type="button"
            className={`playground-stamps-pick playground-mood-pick ${activeMoodId === mood.id ? 'active' : ''}`}
            aria-label={mood.label}
            aria-pressed={activeMoodId === mood.id}
            onClick={() => setActiveMoodId(mood.id)}
            disabled={Boolean(namingId) || saving}
          >
            <span className="playground-mood-pick-emoji" aria-hidden="true">
              {mood.emoji}
            </span>
            <span className="playground-mood-pick-label">{mood.label}</span>
          </button>
        ))}
      </div>

      <div
        ref={boardRef}
        className="playground-stamps-board fade-up delay-2"
        onClick={handleBoardClick}
        role="application"
        aria-label="Mood board. Select a mood, then click to place it."
      >
        {loading ? <p className="playground-stamps-hint">Loading the board…</p> : null}
        {!loading && placed.length === 0 && !namingId ? (
          <p className="playground-stamps-hint">Tap anywhere to stamp your mood</p>
        ) : null}

        {placed.map((item) => {
          const mood = moodById(item.stampId);
          if (!mood) return null;

          return (
            <button
              key={item.id}
              type="button"
              className={`playground-stamps-piece playground-mood-piece ${selectedId === item.id ? 'selected' : ''} ${namingId === item.id ? 'naming' : ''}`}
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`
              }}
              aria-label={`${mood.label} mood${item.name ? ` by ${item.name}` : ''} on ${item.date}`}
              onPointerDown={(event) => startDrag(item.id, event)}
              onPointerMove={moveDrag}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onClick={(event) => event.stopPropagation()}
            >
              <span className="playground-mood-stamp">
                <span className="playground-mood-stamp-emoji" aria-hidden="true">
                  {mood.emoji}
                </span>
                {item.name ? <span className="playground-mood-stamp-name">{item.name}</span> : null}
                <span className="playground-mood-stamp-date">{item.date}</span>
              </span>
            </button>
          );
        })}
      </div>

      {namingId && namingMood ? (
        <div className="playground-mood-modal" role="dialog" aria-modal="true" aria-labelledby="mood-modal-title">
          <div className="playground-mood-modal-card">
            <span className="playground-mood-modal-emoji" aria-hidden="true">
              {namingMood.emoji}
            </span>
            <h2 id="mood-modal-title" className="playground-mood-modal-title">
              Add your name?
            </h2>
            <p className="playground-mood-modal-note">Optional — it&apos;ll show on your stamp with today&apos;s date.</p>
            <input
              ref={nameInputRef}
              type="text"
              className="playground-mood-modal-input"
              value={nameInput}
              onChange={(event) => setNameInput(event.target.value)}
              placeholder="Your name"
              maxLength={32}
              disabled={saving}
              onKeyDown={(event) => {
                if (event.key === 'Enter') finishNaming(nameInput);
                if (event.key === 'Escape') finishNaming('');
              }}
            />
            <div className="playground-mood-modal-actions">
              <button type="button" className="playground-stamps-action" onClick={() => finishNaming('')} disabled={saving}>
                Skip
              </button>
              <button
                type="button"
                className="playground-stamps-action playground-mood-modal-submit"
                onClick={() => finishNaming(nameInput)}
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Stamp it'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="playground-stamps-actions fade-up delay-3">
        {!SHARED_BOARD ? (
          <>
            <button
              type="button"
              className="playground-stamps-action"
              onClick={removeSelected}
              disabled={!selectedId || namingId}
            >
              Remove
            </button>
            <button
              type="button"
              className="playground-stamps-action"
              onClick={clearBoard}
              disabled={placed.length === 0 || namingId || loading}
            >
              Clear board
            </button>
          </>
        ) : null}
        <span className="playground-stamps-count">
          {placed.length}/{MAX_BOARD_STAMPS} stamps
        </span>
      </div>
    </div>
  );
}
