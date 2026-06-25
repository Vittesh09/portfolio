'use client';

import { useEffect, useRef, useState } from 'react';

export default function HomeClient() {
  const heroName = 'Vittesh Sinha';
  const scrambleChars = 'SHNAHITESHVIiesihinaivvtechsshs';
  const [menuOpen, setMenuOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showCopyHint, setShowCopyHint] = useState(false);
  const [displayName, setDisplayName] = useState(heroName);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const audioRef = useRef(null);
  const menuAudioRef = useRef(null);
  const menuPanelRef = useRef(null);
  const menuBtnRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
        if (menuBtnRef.current) menuBtnRef.current.focus();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);


  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(event) {
      if (!menuPanelRef.current || !menuBtnRef.current) return;
      const panel = menuPanelRef.current;
      const button = menuBtnRef.current;
      if (panel.contains(event.target) || button.contains(event.target)) return;
      setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    const savedThemeIsDark = window.localStorage.getItem('home-theme') !== 'light';
    document.documentElement.classList.toggle('site-dark', savedThemeIsDark);
    document.documentElement.style.colorScheme = savedThemeIsDark ? 'dark' : 'light';
    setIsDarkMode(savedThemeIsDark);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setDisplayName(heroName);
      return;
    }

    let frame = 0;
    const totalFrames = heroName.length + 10;
    const interval = window.setInterval(() => {
      const nextName = heroName
        .split('')
        .map((character, index) => {
          if (character === ' ') return ' ';
          if (index < frame) return heroName[index];
          return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        })
        .join('');

      setDisplayName(nextName);
      frame += 1;

      if (frame > totalFrames) {
        window.clearInterval(interval);
        setDisplayName(heroName);
      }
    }, 55);

    return () => window.clearInterval(interval);
  }, [heroName]);

  const copyEmail = async () => {
    setShowToast(true);
    window.clearTimeout(window.__toastTimeout);
    window.__toastTimeout = window.setTimeout(() => {
      setShowToast(false);
    }, 1400);

    if (audioRef.current) {
      audioRef.current.volume = 0.2;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    } else {
      const fallbackAudio = new Audio('/assets/copyemail.mp3');
      fallbackAudio.volume = 0.2;
      fallbackAudio.play().catch(() => {});
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText('hello@vittesh.com');
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = 'hello@vittesh.com';
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
    } catch {
      // best-effort copy; toast already shown
    }
  };

  const toggleTheme = () => {
    const nextTheme = !isDarkMode;
    window.localStorage.setItem('home-theme', nextTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('site-dark', nextTheme);
    document.documentElement.style.colorScheme = nextTheme ? 'dark' : 'light';
    setIsDarkMode(nextTheme);
  };

  return (
    <>
      <div className={`home-page ${isDarkMode ? 'dark' : ''}`}>
        <audio ref={audioRef} src="/assets/copyemail.mp3" preload="none" />
        <audio ref={menuAudioRef} src="/assets/menu-click.wav" preload="none" />
        <div className="cursor"></div>
        <div className="cursor-follower"></div>
        <div id="toast" className={`toast ${showToast ? 'show' : ''}`}>
          Email id copied
        </div>
        <div className="page">
          <div className="mobile-landing">
            <div className="mobile-first-screen">
              <div className="wrap">
            <div className="layout">
              <div className="content">
                <div className="title-row">
                  <h1 className="home-hero" style={{ position: 'relative' }}>
                    {displayName}
                  </h1>

                  <div className="menu-actions">
                    <button
                      className="theme-toggle"
                      type="button"
                      aria-pressed={isDarkMode}
                      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
                      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
                      onClick={toggleTheme}
                    >
                      {isDarkMode ? (
                        <svg
                          className="theme-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeLinecap="round"
                          aria-hidden="true"
                        >
                          <circle cx="12" cy="12" r="4" />
                          <path d="M12 2v1.5M12 20.5V22M4.22 4.22l1.06 1.06M18.72 18.72l1.06 1.06M2 12h1.5M20.5 12H22M4.22 19.78l1.06-1.06M18.72 5.28l1.06-1.06" />
                        </svg>
                      ) : (
                        <svg
                          className="theme-icon theme-icon-moon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="0.85"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M20 14.5A7.5 7.5 0 0 1 9.5 4 6 6 0 1 0 20 14.5Z" />
                        </svg>
                      )}
                    </button>

                    <div className="menu">
                      <button
                        id="menuBtn"
                        className={`menu-button hamburger ${menuOpen ? 'active' : ''}`}
                        type="button"
                        aria-expanded={menuOpen ? 'true' : 'false'}
                        aria-controls="menuPanel"
                        aria-label="Open menu"
                        onClick={() => {
                          if (menuAudioRef.current) {
                            menuAudioRef.current.volume = 0.3;
                            menuAudioRef.current.currentTime = 0;
                            menuAudioRef.current.play().catch(() => {});
                          }
                          setMenuOpen((prev) => !prev);
                        }}
                        ref={menuBtnRef}
                      >
                        <span></span>
                        <span></span>
                        <span></span>
                      </button>

                      <div
                        id="menuPanel"
                        className={`menu-panel ${menuOpen ? 'show' : ''}`}
                        ref={menuPanelRef}
                      >
                        <a href="/about/">About</a>
                        <a href="/playground/">Playground</a>
                        <a href="/work/">Work</a>

                        <div className="resume-row">
                          <a
                            href="/assets/resume/Vittesh_Sinha_Resume.pdf"
                            download
                            className="resume-link"
                          >
                            Resume
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="20px"
                              viewBox="0 -960 960 960"
                              width="20px"
                              fill="currentColor"
                              className="download-icon"
                            >
                              <path d="M480-336 288-528l51-51 105 105v-342h72v342l105-105 51 51-192 192ZM263.72-192Q234-192 213-213.15T192-264v-72h72v72h432v-72h72v72q0 29.7-21.16 50.85Q725.68-192 695.96-192H263.72Z" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="meta home-fade fade-up delay-1">
                  Product Designer • Currently @{' '}
                  <a href="https://www.nagarro.com" target="_blank" rel="noopener noreferrer">
                    Nagarro
                  </a>
                </div>

                <div className="statement-group home-fade fade-up delay-2">
                  <p className="statement">
                    I design software that <strong>builds trust</strong>,{' '}
                    <strong>solves hard problems</strong>, and brings{' '}
                    <strong>clarity</strong> through thoughtful systems.
                  </p>
                  <p className="muted">
                    The best design is barely noticed. I try to make things feel that way.
                  </p>
                </div>

                <div className="section home-fade fade-up delay-3">
                  <div className="section-title">Previous Experiences</div>
                  <div className="work-list">
                    <div className="work-item">
                      <div>
                        Simple Energy
                        <div className="role-title">UX Designer</div>
                      </div>
                      <span>feb 2022 - nov 2023</span>
                    </div>
                    <div className="work-item">
                      <div>
                        Cultfit
                        <div className="role-title">Operation and Experience Design</div>
                      </div>
                      <span>oct 2018 - jan 2022</span>
                    </div>
                  </div>
                </div>

                <div className="contact home-fade fade-up delay-4">
                  <span className="email-wrap">
                    <button
                      type="button"
                      className="email-copy"
                      onClick={copyEmail}
                      onMouseEnter={() => setShowCopyHint(true)}
                      onMouseLeave={() => setShowCopyHint(false)}
                      onFocus={() => setShowCopyHint(true)}
                      onBlur={() => setShowCopyHint(false)}
                    >
                      hello@vittesh.com
                    </button>
                    <span className={`copy-hint ${showCopyHint ? 'show' : ''}`}>copy</span>
                  </span>
                  &nbsp;·&nbsp;
                  <a
                    href="https://www.behance.net/vitteshsinha"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Behance
                  </a>
                  &nbsp;·&nbsp;
                  <a
                    href="https://www.linkedin.com/in/vitteshsinha/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>

          <nav className="mobile-pill-menu" aria-label="Primary">
            <a href="/about/">About</a>
            <a href="/playground/">Playground</a>
            <a href="/work/">Work</a>
            <a href="/assets/resume/Vittesh_Sinha_Resume.pdf" download>
              Resume
            </a>
          </nav>
          </div>

          <div className="footer">
            <p>˗ˏˋ ꒰ 🧡 ꒱ ˎˊ˗</p>
            © 2026 Vittesh Sinha
          </div>
          </div>
        </div>
      </div>
    </>
  );
}
