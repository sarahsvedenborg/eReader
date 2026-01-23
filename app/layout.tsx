import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'eReader - Kindle-like Reading Experience',
  description: 'A mobile-first reading app for public domain books',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

