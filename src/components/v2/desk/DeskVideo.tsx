'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { youtubeId } from '@/src/config/v2/publishing';

type Video = { label: string; url: string; duration: string };
type Cover = { src: string; alt: string; fit?: 'contain' };

/** How long each cover image stays up before crossfading to the next. */
const COVER_MS = 3800;

/**
 * Click-to-play YouTube frame. Only the cover images load with the page; the player
 * (about 1 MB of YouTube scripts) loads when someone presses play. The covers
 * crossfade in turn until then. A session split into parts gets a part switcher
 * above one shared frame.
 */
export function DeskVideo({
  title,
  videos,
  covers
}: {
  title: string;
  videos: Video[];
  covers: Cover[];
}) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [cover, setCover] = useState(0);
  const current = videos[index];
  const id = current ? youtubeId(current.url) : null;

  useEffect(() => {
    if (playing || covers.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      setCover((c) => (c + 1) % covers.length);
    }, COVER_MS);
    return () => window.clearInterval(timer);
  }, [playing, covers.length]);

  if (!current || !id) return null;

  const name = videos.length > 1 ? `${title}, ${current.label}` : title;

  return (
    <div className="desk-video">
      {videos.length > 1 ? (
        <div className="desk-video-parts" role="tablist" aria-label="Recording parts">
          {videos.map((video, i) => (
            <button
              key={video.url}
              type="button"
              role="tab"
              aria-selected={i === index}
              className="desk-video-part"
              // Once playing, switching parts loads the next part's player straight away.
              onClick={() => setIndex(i)}
            >
              <span>{video.label}</span>
              <span className="desk-video-part-time">{video.duration}</span>
            </button>
          ))}
        </div>
      ) : null}
      <div className="desk-video-frame">
        {playing ? (
          <iframe
            key={id}
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className="desk-video-poster"
            onClick={() => setPlaying(true)}
            aria-label={`Play ${name}`}
          >
            {covers.map((c, i) => (
              <span
                key={c.src}
                className="desk-video-cover"
                data-fit={c.fit}
                data-on={i === cover ? 'true' : undefined}
              >
                {c.fit === 'contain' ? (
                  // Soft, blurred copy fills the sides around a portrait image.
                  <Image className="desk-video-cover-fill" src={c.src} alt="" fill sizes="40rem" />
                ) : null}
                <Image
                  className="desk-video-cover-img"
                  src={c.src}
                  alt={c.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 40rem"
                  priority={i === 0}
                />
              </span>
            ))}
            <span className="desk-video-play" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" focusable="false">
                <path fill="currentColor" d="M8 5.5v13l10.5-6.5z" />
              </svg>
            </span>
            <span className="desk-video-badge">
              {current.label} · {current.duration}
            </span>
            {covers.length > 1 ? (
              <span className="desk-video-dots" aria-hidden="true">
                {covers.map((c, i) => (
                  <span key={c.src} data-on={i === cover ? 'true' : undefined} />
                ))}
              </span>
            ) : null}
          </button>
        )}
      </div>
    </div>
  );
}
