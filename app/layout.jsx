import './globals.css';
import { Manrope } from 'next/font/google';
import Script from 'next/script';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700']
});

export const metadata = {
  metadataBase: new URL('https://www.vittesh.com'),
  title: {
    default: 'Vittesh | Product Designer',
    template: '%s | Vittesh Sinha'
  },
  description:
    'Vittesh Sinha is a product designer focused on building calm, trustworthy systems that solve complex problems.',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png'
  },
  openGraph: {
    siteName: 'Vittesh Sinha',
    type: 'website',
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        {children}
        <Script src="/assets/js/cursor.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
