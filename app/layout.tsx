import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const euclidCircularB = localFont({
  src: [
    { path: '../public/fonts/EuclidCircularB-Light.otf', weight: '300', style: 'normal' },
    { path: '../public/fonts/EuclidCircularB-Regular.otf', weight: '400', style: 'normal' },
    { path: '../public/fonts/EuclidCircularB-Medium.otf', weight: '500', style: 'normal' },
    { path: '../public/fonts/EuclidCircularB-Semibold.otf', weight: '600', style: 'normal' },
    { path: '../public/fonts/EuclidCircularB-Bold.otf', weight: '700', style: 'normal' },
  ],
  variable: '--font-euclid',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ACKO Chat Design System',
  description: 'Design system for ACKO conversational insurance UI — 17 unified widget components across Health, Motor & Life LOBs.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={euclidCircularB.variable}>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
