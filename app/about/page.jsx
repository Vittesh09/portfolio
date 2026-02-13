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
            <div className="about-top">
              <h1>About me</h1>
              <a href="/" className="about-back">← Back</a>
            </div>

            <div className="about-layout">
              <div className="about-image">
                <img src="/assets/images/profile.png" alt="Vittesh Sinha" width="631" height="698" />
              </div>

              <div className="about-text">
                <p>
                  I’m a product designer focused on building systems that feel calm,
                  trustworthy, and intentional — especially when the problems are
                  complex or high-stakes.
                </p>
                <p>
                  Over the years, I’ve worked across automotive, consumer tech,
                  operations platforms, and enterprise software, helping teams turn
                  ambiguity into clear, usable products.
                </p>
                <p>
                  I care deeply about structure, constraints, and invisible details —
                  the kind users don’t notice, but would feel immediately if they were
                  missing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
