import type { ReactNode } from 'react';

export const metadata = {
  metadataBase: new URL('https://www.vittesh.com'),
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png'
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
