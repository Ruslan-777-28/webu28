import type {Metadata} from 'next';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'LECTOR',
  description: 'LECTOR - Екосистема обміну живою енергією, сенсами та знаннями.',
};

/**
 * Fundamental Root Layout.
 * Contains only the HTML/Body shell, fonts, and global CSS.
 * Is NOT dependent on Firebase runtime, making standalone routes (like /gate) safe.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className={inter.variable}>
      <head>
      </head>
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  );
}
