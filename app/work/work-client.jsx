'use client';

import { useEffect } from 'react';

export default function WorkClient() {
  return (
    <>
      <div className="work-page">
        <div className="cursor-dot"></div>
        <div className="cursor-ring"></div>

        <div className="work-content">
          <div className="work-coming">
            <img
              className="coming-logo"
              src="/favicon.png"
              alt="Vittesh logo"
              width="100"
              height="100"
            />
            <h2 className="coming-title">Coming soon</h2>
            <p className="coming-note">This page is being built, Thanks for your patience</p>
            <div className="coming-actions">
              <a className="coming-button" href="/">Go back</a>
              <a
                className="coming-button coming-button-behance"
                href="https://www.behance.net/vitteshsinha"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="coming-button-label">Behance</span>
                <span className="coming-button-icon" aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
