import WorkClient from './work-client';

export const metadata = {
  title: 'Selected Works',
  description: 'Selected work by Vittesh Sinha across enterprise, AI, and consumer product design.',
  alternates: {
    canonical: '/work/'
  },
  openGraph: {
    title: 'Selected Works — Vittesh Sinha',
    description: 'A selection of product and experience design projects.',
    type: 'website',
    url: 'https://www.vittesh.com/work/',
    images: ['https://www.vittesh.com/assets/images/image2.png']
  },
  twitter: {
    title: 'Selected Works — Vittesh Sinha',
    description: 'A selection of product and experience design projects.',
    images: ['https://www.vittesh.com/assets/images/image2.png']
  }
};

export default function WorkPage() {
  return <WorkClient />;
}
