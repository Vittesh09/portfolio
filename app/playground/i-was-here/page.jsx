import IWasHereClient from './i-was-here-client';

export const metadata = {
  title: 'I was here',
  description: 'What’s your mood today? Stamp the board, add your name, and leave today’s date.',
  alternates: {
    canonical: '/playground/i-was-here/'
  },
  openGraph: {
    title: 'I was here — Playground',
    description: 'What’s your mood today? Stamp the board, add your name, and leave today’s date.',
    type: 'website',
    url: 'https://www.vittesh.com/playground/i-was-here/',
    images: ['https://www.vittesh.com/assets/images/image2.png']
  },
  twitter: {
    title: 'I was here — Playground',
    description: 'What’s your mood today? Stamp the board, add your name, and leave today’s date.',
    images: ['https://www.vittesh.com/assets/images/image2.png']
  }
};

export default function IWasHerePage() {
  return (
    <div className="playground-page">
      <div className="cursor-dot"></div>
      <div className="cursor-ring"></div>
      <div className="playground-content">
        <div className="playground-wrap">
          <IWasHereClient />
        </div>
      </div>
    </div>
  );
}
