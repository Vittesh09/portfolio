export const metadata = {
  title: 'About',
  description:
    'About Vittesh Sinha, a product designer focused on calm, trustworthy systems for complex and high-stakes problems.',
  alternates: {
    canonical: '/about/'
  },
  openGraph: {
    title: 'About — Vittesh Sinha',
    description: 'Product designer focused on building calm, trustworthy, and intentional systems.',
    type: 'website',
    url: 'https://www.vittesh.com/about/',
    images: ['https://www.vittesh.com/assets/images/profile.png']
  },
  twitter: {
    title: 'About — Vittesh Sinha',
    description: 'Product designer focused on building calm, trustworthy, and intentional systems.',
    images: ['https://www.vittesh.com/assets/images/profile.png']
  }
};

export default function AboutPage() {
  return (
    <>
      <div className="about-page">
        <div className="cursor-dot"></div>
        <div className="cursor-ring"></div>

        <div className="about-content">
          <div className="about-wrap">
            <div className="about-mobile">
              <div className="about-mobile-intro">
                <span>Hello, I am</span>
                <span className="about-mobile-arrow" aria-hidden="true">
                  <img src="/assets/images/Arrow.svg" alt="" />
                </span>
                <span>Vittesh Sinha</span>
              </div>
            </div>

            <div className="about-desktop">
              <div className="about-desktop-frame">
                <div className="about-desktop-intro-wrap fade-up">
                  <div className="about-desktop-intro">
                    <span>Hello, I am</span>
                    <span className="about-mobile-arrow" aria-hidden="true">
                      <img src="/assets/images/Arrow.svg" alt="" />
                    </span>
                    <span>Vittesh Sinha</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="about-body-shared">
              <div className="about-desktop-photo">
                <img
                  className="about-photo fade-image"
                  src="/assets/images/about.png"
                  alt="Vittesh Sinha"
                  width="1293"
                  height="1293"
                />
              </div>
              <div className="about-text-stack fade-up delay-1">
                <div className="about-text-shared">
                  <p>
                    I’m a product designer focused on building systems that feel calm,
                    trustworthy, and intentional.
                  </p>
                  <p>
                    Over the years, I’ve worked across automotive, consumer tech,
                    operations platforms, and enterprise software, helping teams turn
                    ambiguity into clear, usable products. I care deeply about structure,
                    constraints, and invisible details the kind users don’t notice, but
                    would feel immediately if they were missing.
                  </p>
                  <p>
                    You can find more of my work on{' '}
                    <a href="https://www.behance.net/vitteshsinha" target="_blank" rel="noopener noreferrer">
                      Behance
                    </a>{' '}
                    and connect with me on{' '}
                    <a href="https://www.linkedin.com/in/vitteshsinha/" target="_blank" rel="noopener noreferrer">
                      LinkedIn
                    </a>.
                  </p>
                </div>
                <a href="/" className="coming-button">Go back</a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
