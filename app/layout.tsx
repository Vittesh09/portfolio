import type { ReactNode } from 'react';

export const metadata = {
  metadataBase: new URL('https://vittesh.com'),
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png'
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-build="20261025c">
      <body>{children}</body>
    </html>
  );
}
