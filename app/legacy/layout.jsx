import '../globals.css';
import { Manrope } from 'next/font/google';
import Script from 'next/script';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700']
});

export const metadata = {
  title: {
    default: 'Vittesh | Product Designer',
    template: '%s | Vittesh Sinha'
  },
  robots: { index: false, follow: true }
};

export default function LegacyLayout({ children }) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
              try {
                if (localStorage.getItem('home-theme') !== 'light') {
                  document.documentElement.classList.add('site-dark');
                  document.documentElement.style.colorScheme = 'dark';
                }
              } catch (e) {}
            `
        }}
      />
      <div className={manrope.className}>{children}</div>
      <Script
        id="anim-once"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
              try {
                const key = 'vh_animate_once';
                if (localStorage.getItem(key)) {
                  document.documentElement.classList.add('no-animate');
                } else {
                  localStorage.setItem(key, '1');
                }
              } catch (e) {}
            `
        }}
      />
      <Script src="/assets/js/cursor.js" strategy="afterInteractive" />
    </>
  );
}
