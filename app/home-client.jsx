'use client';

import { useEffect, useRef, useState } from 'react';

export default function HomeClient() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showCopyHint, setShowCopyHint] = useState(false);
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

  return (
    <>
      <div className="home-page">
        <audio ref={audioRef} src="/assets/copyemail.mp3" preload="auto" />
        <audio ref={menuAudioRef} src="/assets/menu-click.wav" preload="auto" />
        <div className="cursor"></div>
        <div className="cursor-follower"></div>
        <div id="toast" className={`toast ${showToast ? 'show' : ''}`}>
          Email id copied
        </div>

        <div className="page">
          <div className="wrap">
            <div className="layout">
              <div className="content">
                <div className="title-row">
                  <h1 style={{ position: 'relative' }}>
                    <span style={{ position: 'relative', display: 'inline-block' }}>
                      V
                      <img
                        src="/assets/images/sticker.png"
                        alt=""
                        className="sticker-v"
                        width="76"
                        height="76"
                      />
                    </span>
                    ittesh Sinha
                  </h1>

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
                            fill="#111"
                            className="download-icon"
                          >
                            <path d="M480-336 288-528l51-51 105 105v-342h72v342l105-105 51 51-192 192ZM263.72-192Q234-192 213-213.15T192-264v-72h72v72h432v-72h72v72q0 29.7-21.16 50.85Q725.68-192 695.96-192H263.72Z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="meta">
                  Product Designer • Currently @{' '}
                  <a href="https://www.nagarro.com" target="_blank" rel="noopener noreferrer">
                    Nagarro
                  </a>
                </div>

                <div className="statement-group">
                  <p className="statement">
                    I design software that <strong>builds trust</strong>,{' '}
                    <strong>solves hard problems</strong>, and brings{' '}
                    <strong>clarity</strong> through thoughtful systems.
                  </p>
                  <p className="muted">
                    The best design is barely noticed. I try to make things feel that way.
                  </p>
                </div>

                <div className="section">
                  <div className="section-title">Previous work</div>
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

                <div className="contact">
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

              <div className="image-wrap" style={{ height: 520 }}>
                <img
                  src="/assets/images/image2.png"
                  alt="Portrait of Vittesh"
                  width="1293"
                  height="1293"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>

          <div className="footer">
            <p>˗ˏˋ ꒰ 🧡 ꒱ ˎˊ˗</p>
            © 2026 Vittesh Sinha
          </div>
        </div>
      </div>
    </>
  );
}
