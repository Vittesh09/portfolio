import HomeClient from './home-client';

export const metadata = {
  title: 'Vittesh | Product Designer',
  description:
    'Vittesh Sinha is a product designer focused on building calm, trustworthy systems that solve complex problems.',
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'Vittesh Sinha — Product Designer',
    description:
      'Designing software that builds trust, solves hard problems, and brings clarity through thoughtful systems.',
    type: 'website',
    url: 'https://www.vittesh.com/',
    images: ['https://www.vittesh.com/assets/images/image2.png']
  },
  twitter: {
    title: 'Vittesh Sinha — Product Designer',
    description:
      'Designing software that builds trust, solves hard problems, and brings clarity through thoughtful systems.',
    images: ['https://www.vittesh.com/assets/images/image2.png']
  }
};

export default function HomePage() {
  return <HomeClient />;
}
