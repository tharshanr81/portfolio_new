import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Tharshan R | Full-Stack Developer & Software Architect',
  description:
    'Portfolio of Tharshan R — B.Tech (Honours) AI & Data Science graduate, building scalable full-stack web applications, AI decision intelligence systems, and resilient digital architectures.',
  keywords: [
    'Tharshan R',
    'Full-Stack Developer',
    'Next.js',
    'React',
    'TypeScript',
    'Python',
    'AI & Data Science',
    'Software Engineer',
    'Portfolio',
  ],
  authors: [{ name: 'Tharshan R', url: 'https://github.com/tharshanr81' }],
  creator: 'Tharshan R',
  openGraph: {
    title: 'Tharshan R | Full-Stack Developer & Software Architect',
    description:
      'High-performance full-stack web apps, AI decision intelligence systems, and modern digital products.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Tharshan R Portfolio',
  },
  icons: {
    icon: '/circle-t.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.variable} font-sans min-h-screen bg-canvas text-primary transition-colors duration-300`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
