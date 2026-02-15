export const metadata = {
  title: 'Playground',
  description: 'Playground experiments in interaction, animation, and AI systems by Vittesh Sinha.',
  alternates: {
    canonical: '/playground/'
  },
  openGraph: {
    title: 'Playground — Vittesh Sinha',
    description: 'Experiments in interaction, animation, and AI systems.',
    type: 'website',
    url: 'https://www.vittesh.com/playground/',
    images: ['https://www.vittesh.com/assets/images/image2.png']
  },
  twitter: {
    title: 'Playground — Vittesh Sinha',
    description: 'Experiments in interaction, animation, and AI systems.',
    images: ['https://www.vittesh.com/assets/images/image2.png']
  }
};

export default function PlaygroundPage() {
  return (
    <>
      <div className="playground-page">
        <div className="cursor-dot"></div>
        <div className="cursor-ring"></div>

        <div className="playground-content">
          <div className="playground-wrap">
            <div className="playground-coming">
              <img
                className="coming-logo"
                src="/favicon.png"
                alt="Vittesh logo"
                width="100"
                height="100"
              />
              <h2 className="coming-title">Coming soon</h2>
              <p className="coming-note">The page is being built. Thank you for your patience.</p>
              <div className="coming-actions">
                <a className="coming-button" href="/">Go back</a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
