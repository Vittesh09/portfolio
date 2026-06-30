import Link from 'next/link';

const TOOLS = [
  {
    href: '/playground/i-was-here/',
    title: 'I was here',
    description: 'Stamp your mood, add your name, and leave today’s date on the board.'
  },
  {
    href: 'https://clipthat.lovable.app/',
    title: 'ClipThat',
    description: 'AI gaming clip editor — find and trim your best gameplay moments.',
    external: true
  }
];

export const metadata = {
  title: 'Playground',
  description: 'Small experiments and toys — explore the playground by Vittesh Sinha.',
  alternates: {
    canonical: '/playground/'
  },
  openGraph: {
    title: 'Playground — Vittesh Sinha',
    description: 'Small experiments and toys to poke at.',
    type: 'website',
    url: 'https://www.vittesh.com/playground/',
    images: ['https://www.vittesh.com/assets/images/image2.png']
  },
  twitter: {
    title: 'Playground — Vittesh Sinha',
    description: 'Small experiments and toys to poke at.',
    images: ['https://www.vittesh.com/assets/images/image2.png']
  }
};

export default function PlaygroundPage() {
  return (
    <div className="playground-page">
      <div className="cursor-dot"></div>
      <div className="cursor-ring"></div>
      <div className="playground-content">
        <div className="playground-wrap">
          <div className="playground-index">
            <div className="playground-index-header fade-up">
              <p className="playground-index-eyebrow">
                <Link href="/" className="playground-eyebrow-back" aria-label="Go back home">
                  <span className="playground-eyebrow-arrow" aria-hidden="true">
                    <img src="/assets/images/Arrow.svg" alt="" />
                  </span>
                  Playground
                </Link>
              </p>
              <h1 className="playground-index-title">Small experiments</h1>
              <p className="playground-index-note">
                Tiny tools to poke at. Pick one, play for a minute, leave something behind.
              </p>
            </div>

            <ul className="playground-tool-list fade-up delay-1">
              {TOOLS.map((tool) => {
                const cardClassName = tool.external
                  ? 'playground-tool-card playground-tool-card-external'
                  : 'playground-tool-card';

                const cardContent = (
                  <>
                    <span className="playground-tool-title">{tool.title}</span>
                    <span className="playground-tool-desc">{tool.description}</span>
                    <span className="playground-tool-arrow" aria-hidden="true">
                      {tool.external ? (
                        <span className="playground-tool-external-icon">↗</span>
                      ) : (
                        '→'
                      )}
                    </span>
                  </>
                );

                return (
                  <li key={tool.href}>
                    {tool.external ? (
                      <a
                        href={tool.href}
                        className={cardClassName}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${tool.title} (opens in new tab)`}
                      >
                        {cardContent}
                      </a>
                    ) : (
                      <Link href={tool.href} className={cardClassName}>
                        {cardContent}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
