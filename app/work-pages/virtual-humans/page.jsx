export const metadata = {
  title: 'Virtual Humans Experience',
  description:
    'Case study: Virtual Humans Experience Design — immersive VR city exploration with emotional analytics.',
  alternates: {
    canonical: '/work-pages/virtual-humans/'
  },
  openGraph: {
    title: 'Virtual Humans Experience — Vittesh Sinha',
    description: 'Immersive VR experience with emotional analytics and an insights platform.',
    type: 'article',
    url: 'https://www.vittesh.com/work-pages/virtual-humans/',
    images: ['https://www.vittesh.com/assets/images/image2.png']
  },
  twitter: {
    title: 'Virtual Humans Experience — Vittesh Sinha',
    description: 'Immersive VR experience with emotional analytics and an insights platform.',
    images: ['https://www.vittesh.com/assets/images/image2.png']
  }
};

export default function VirtualHumansPage() {
  return (
    <>
      <div className="vh-page">
        <div className="vh-wrap">
          <div className="vh-top">
            <a href="/work/" className="vh-back">← Back to work</a>
            <h1>Virtual Humans Experience Design</h1>
            <div className="vh-subtitle">AR/VR · Emotional Analytics · Experience Design</div>
          </div>

          <div className="vh-meta">
            <div>
              <strong>Industry</strong>
              Urban Planning · Construction
            </div>
            <div>
              <strong>Platforms</strong>
              VR Headset · Web Dashboard
            </div>
            <div>
              <strong>Role</strong>
              Sole UX Designer
            </div>
          </div>

          <section className="vh-section">
            <h2>Context</h2>
            <p>
              A future city was being planned using advanced technology and
              human-centered innovation. The challenge was enabling people to
              experience this city before it existed and understand how they
              emotionally responded to it.
            </p>
          </section>

          <section className="vh-section">
            <h2>The problem</h2>
            <ul className="vh-list">
              <li>Traditional surveys failed to capture authentic emotional response</li>
              <li>Urban planners needed insights beyond opinions and preferences</li>
              <li>Biometric data was complex and hard to interpret</li>
            </ul>
          </section>

          <section className="vh-section">
            <h2>The goal</h2>
            <ul className="vh-list">
              <li>Create an immersive VR experience of a future city</li>
              <li>Capture authentic emotional and cognitive responses</li>
              <li>Translate raw biometric data into usable insights</li>
            </ul>
          </section>

          <div className="vh-divider"></div>

          <section className="vh-section">
            <h2>The solution</h2>
            <div className="vh-two-col">
              <p>
                Citizens explored a realistic VR city with environmental transitions
                such as sunrise, sunset, and spatial changes. Emotional data was
                captured passively through EEG devices without interrupting the
                experience.
              </p>
              <p>
                A centralized analytics platform aggregated this data and presented
                it through a clear dashboard that allowed planners to compare
                locations, sessions, and emotional patterns.
              </p>
            </div>
          </section>

          <section className="vh-section">
            <h2>Designing for authenticity</h2>
            <ul className="vh-list">
              <li>Passive EEG capture to avoid breaking immersion</li>
              <li>Baseline emotional diagnostics before the experience</li>
              <li>Minimal prompts aligned with natural transitions</li>
            </ul>
          </section>

          <section className="vh-section">
            <h2>Insights platform</h2>
            <p>
              The dashboard translated complex EEG signals into aggregated emotional
              insights, enabling planners to understand engagement, mood, and
              cognitive response without needing domain expertise.
            </p>
          </section>

          <div className="vh-divider"></div>

          <section className="vh-section">
            <h2>Outcome</h2>
            <ul className="vh-list">
              <li>Citizens experienced an unbuilt city immersively</li>
              <li>Emotional and cognitive data was captured at scale</li>
              <li>Planners gained actionable insight beyond traditional feedback</li>
            </ul>
          </section>

          <section className="vh-section">
            <h2>Reflection</h2>
            <p className="vh-closing">
              This project demonstrated how emotional analytics can complement
              traditional planning tools. By measuring how people feel, not just
              what they say, teams can design cities that are not only functional,
              but emotionally resonant and human-centered.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
