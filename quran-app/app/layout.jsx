import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import { AudioProvider } from '@/context/AudioContext';
import AudioPlayer from '@/components/AudioPlayer';
import Header from '@/components/Header';

const sfPro = Inter({
  subsets: ['latin'],
  variable: '--font-sf',
  display: 'swap',
});

export const metadata = {
  title: 'Quran – The Noble Recitation',
  description: 'A beautiful, modern Quran reading experience with translations and audio recitation.',
  keywords: 'Quran, Islam, Arabic, recitation, translation',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Scheherazade+New:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${sfPro.variable} font-sf antialiased`}>
        <AudioProvider>
          <div className="min-h-screen bg-gradient-main relative overflow-x-hidden">
            {/* Ambient orbs */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
              <div className="orb orb-1" />
              <div className="orb orb-2" />
              <div className="orb orb-3" />
            </div>
            <Header />
            <main className="relative z-10 pb-32">
              {children}
            </main>
            <AudioPlayer />
          </div>
        </AudioProvider>
      </body>
    </html>
  );
}
